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
    const appointment_time = req.query.date ? req.query.date : new Date().toISOString();
    // converts the string to date
    const requestDate = new Date(appointment_time);
    // removes the .000Z extra from the time string
    appointment_time.replace(millisecondsRegex, '');
    // retrieves access_token for DrChrono API calls
    const access_token = await utility.refreshToken();
    // retrieves all appointments in the same day
    const return_appointments = await utility.getAppointments(appointment_time, access_token);
    // filters out the exact appointment
    const appointments = return_appointments.filter(appointment => new Date(appointment['scheduled_time']).getTime() - requestDate.getTime() == 0);
    // return empty array if there is no appointment
    if (appointments.length == 0) return res.status(200).json(appointments);
    // retrieves and inserts the patient's last name to confirm with the patient
    const patient = await utility.getPatientInfo(appointments[0]['patient'], access_token);
    appointments[0]['last_name'] = patient['last_name'];
    return res.status(200).json(appointments);
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
        console.log(notificationResponse);
        if (notificationResponse && notificationResponse['status'] && notificationResponse['status'] == 201)
            return res.status(200).json({ 'checkedIn': notificationResponse['status'] });
    }
    return res.status(200).json({ 'failure': 'Failed to check-in' });
});

/* the endpoint is to let the actual patient deny the check-in and notify the provider for the attention */
router.get('/deny/:appointmentId', async (req, res, next) => {
    const appointment_id = req.params.appointmentId;
    return res.status(200).json({ 'denied': true });
});


module.exports = router;