var axios = require('axios');
var express = require('express');
var router = express.Router();
var utility = require('../utility');

/* Lists today's appointments within an hour of the API request
*  The API will return the appointment at the requested time including patient's last name
* The voice interface will then confirm the last name with the patient and then send the check-in email to patient.
*/
router.get('/', async (req, res, next) => {
    const millisecondsRegex = /\.\d{3}Z/i;
    // if no time provided, we will use the current time.
    const appointment_date = req.query.date ? new Date(req.query.date) : new Date();
    const yesterday = new Date();
    yesterday.setDate(appointment_date.getDate() - 1);
    const dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(appointment_date.getDate() + 2);
    const appointment_time = `${yesterday.toISOString().replace(millisecondsRegex, '')}/${dayAfterTomorrow.toISOString().replace(millisecondsRegex, '')}`;
    console.log(appointment_time);
    // retrieves access_token for DrChrono API calls
    const access_token = await utility.refreshToken();
    // retrieves all appointments in the same day
    const appointments = await utility.getAppointments(appointment_time, access_token);
    console.log(appointments.length);
    // return empty array if there is no appointment
    if (appointments.length == 0) return res.status(200).json(appointments);
    // retrieves and inserts the patient's last name to confirm with the patient
    for (let i = 0; i < appointments.length; i++) {
        const patient = await utility.getPatientInfo(appointments[i]['patient'], access_token);
        appointments[i]['first_name'] = patient['first_name'];
        appointments[i]['last_name'] = patient['last_name'];
    }
    return res.status(200).json(appointments);
});

/* email sending to patient endpoint */
router.get('/email/:appointmentId/:doctorId/:patientId/:appointmentTime', async (req, res, next) => {
    const appointment_id = req.params.appointmentId;
    const doctor_id = req.params.doctorId;
    const patient_id = req.params.patientId;
    const appointment_time = req.params.appointmentTime;
    const appointment_date = new Date(appointment_time);
    const access_token = await utility.refreshToken();
    const patient = await utility.getPatientInfo(patient_id, access_token);
    const doctor = await utility.getDoctorInfo(doctor_id, access_token);
    const url = 'https://clinic-attendant.herokuapp.com/appointments';
    const subject = `Appointment Check-in`;
    let content = `<span style="font-size: 20px">Did you check-in for today appointment with Dr. ${doctor['last_name']} at ${appointment_date.toLocaleTimeString()}?</span><br/>
    <button style="background-color: green;border-radius: 5px;">
        <a style="color: white;text-decoration: none" href="${url}/check-in/${appointment_id}/${doctor_id}/${patient_id}/${appointment_time}">YES, that was me.</a>
    </button>
    <button style="background-color: red;border-radius: 5px;">
        <a style="color: white;text-decoration: none" href="${url}/deny/${appointment_id}/${doctor_id}/${appointment_time}">NO, that was not me.</a>
    </button><br/>`;
    if (!patient['social_security_number']) {
        content = content + `<br/><b>Please click <a href="https://clinic-attendant.herokuapp.com?id=${patient['id']}">here</a> and fill out the new patient form!</b>`;
    }
    try {
        await utility.sendEmail(patient['email'], subject, content);
        return res.status(200).json({ 'status': 'Email sent to patient!' });
    }
    catch (error) {
        return res.status(400).json({ 'status': 'Email was not sent!' });
    }
});

/* the endpoint confirms the patient checked-in and ready in the room */
router.get('/check-in/:appointmentId/:doctorId/:patientId/:appointmentTime', async (req, res, next) => {
    const appointment_id = req.params.appointmentId;
    const doctor_id = req.params.doctorId;
    const patient_id = req.params.patientId;
    const appointment_time = req.params.appointmentTime;
    // retrieves access_token for DrChrono API calls
    const access_token = await utility.refreshToken();
    const response = await utility.checkInAppointment(appointment_id, access_token);
    if (response && response['status'] && response['status'] == 204) {
        const patient = await utility.getPatientInfo(patient_id, access_token);
        const time = new Date(appointment_time).toLocaleTimeString();
        const title = `${patient['first_name']} ${patient['last_name']} for ${time} is in the room now`;
        const notificationResponse = await utility.notifyDoctor(doctor_id, title, access_token);
        if (notificationResponse && notificationResponse['status'] && notificationResponse['status'] == 201)
            return res.status(200).json({ 'checkedIn': notificationResponse['status'] });
    }
    return res.status(400).json({ 'failure': 'Failed to check-in' });
});

/* the endpoint is to let the actual patient deny the check-in and notify the provider for the attention */
router.get('/deny/:appointmentId/:doctorId/:appointmentTime', async (req, res, next) => {
    const appointment_id = req.params.appointmentId;
    const doctor_id = req.params.doctorId;
    const appointment_time = req.params.appointmentTime;
    const time = new Date(appointment_time).toLocaleTimeString();
    const title = `Appointment at ${time} needs attention. The actual patient did not check-in.`;
    // retrieves access_token for DrChrono API calls
    const access_token = await utility.refreshToken();
    const notificationResponse = await utility.notifyDoctor(doctor_id, title, access_token);
    if (notificationResponse && notificationResponse['status'] && notificationResponse['status'] == 201)
        return res.status(200).json({ 'notifiedClinic': notificationResponse['status'] });
    return res.status(400).json({ 'failed': 'Fail to report the problem' });
});

/* This is the endpoint to populate appointments in DrChrono dashboard (for demo) */
router.get('/populate-appointments', async (req, res, next) => {
    const data = {
        doctor: 286076,
        office: 303862,
        duration: 45, // in minutes
        exam_room: 1,
        patient: 0,
        scheduled_time: new Date().toISOString()
    }
    const access_token = await utility.refreshToken();
    const config = { headers: { Authorization: `Bearer ${access_token}` } };
    let response = await axios.get('https://app.drchrono.com/api/patients', config);
    let patients = response['data']['results'];
    let currentDate = new Date();
    let monthString = currentDate.getMonth() + 1 < 10 ? `0${currentDate.getMonth() + 1}` : currentDate.getMonth() + 1;
    let dateString = currentDate.getDate() < 10 ? `0${currentDate.getDate()}` : currentDate.getDate();
    let dummyAppointmentTime = new Date(`${currentDate.getFullYear()}-${monthString}-${dateString}T06:00:00`);
    for (let p of patients) {
        dummyAppointmentTime.setHours(dummyAppointmentTime.getHours() + 1); //add 1 hour period between each appointment start time
        data['patient'] = p['id'];
        data['scheduled_time'] = dummyAppointmentTime.toISOString().replace(/\.\d{3}Z/i, '');
        const response = await utility.createAppointment(data, access_token);
    }
    res.status(200).json(patients);
});


module.exports = router;