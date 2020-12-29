const api = require('../api.js');
const util = require('./appointmentUtil.js');
const moment = require("moment");
const requestPromise = require('request-promise-native');
module.exports = {


    async CheckInIntent() {
        console.log("appointment: appointmentState");


        //Get patient name for input
        const patientName = this.$inputs.person ? this.$inputs.person.value : this.$inputs.name.value;


        //Call API
        const appointmentList = await api.getAppointments()

        //No appointments today
        if (appointmentList.length === 0) {
            this.ask(`Hi ${patientName}, you don't have an appointment today.`)
        }

        //Look up appointment
        const numberOfAppointments = util.findPatientAppointmentToday(appointmentList, patientName)
   
        //If two people have the same name 
        if (numberOfAppointments.length > 1) {
            
            //Save appointment list in session 
            this.$session.$data.appointmentList = appointmentList

            //Set the follow up state
            this.followUpState(this.getState() + '.additionalInfo')
                .ask(`Hi ${patientName}, what time is the appointment?`);


        } 
        //No Appointment Today found
        else if (numberOfAppointments.length <= 0) {
            this.ask(`Sorry, I didn't find an appointment today for ${patientName}. You can try saying the name again`);
          
        } 
        //Found the Appointment
        else if (numberOfAppointments.length == 1){
            //Lookup the appointment 
            const patientAppointmentsInfo = numberOfAppointments[0];
            console.log(patientAppointmentsInfo)
            if (patientAppointmentsInfo) {
                const patientTiming = util.isPatientEarlyOnTimeLate(patientAppointmentsInfo)
                console.log(patientTiming)
                switch (patientTiming) {
                    case "early":
                        const appointmentTime = moment(patientAppointmentsInfo.scheduled_time).format("LT")
                        this.ask(`Hey ${patientName}. You are a bit early for your appointment. Please comeback 15 minutes before ${appointmentTime}`);
                        break;
                    case "onTime":
                        const sentEmail = await api.sendCheckInEmail(patientAppointmentsInfo.id,
                            patientAppointmentsInfo.doctor,
                            patientAppointmentsInfo.patient,
                            patientAppointmentsInfo.scheduled_time,);
                        console.log("sentEmail:" +sentEmail)

                        this.ask(`Hey ${patientName}, please have a seat and check your email to confirm the check in.`);
                        break;
                    case "late":
                        this.ask(`Hey ${patientName}, sorry, you are late for your appointment!`);
                        break;
                    default:
                        console.log("switch error")
                }


            }else{
                this.tell(`Sorry an error: 2 has occurred`);
            }
            
            
        }else{

            this.tell(`Sorry an error: 1 has occurred`);
        }
    },

    AdditionalInfoState:{

        //TODO
        async AppointmentTimeIntent() {
            console.log("appointment.AdditionalInfoState: AppointmentTimeIntent");
            
            //Get patient name for input
            const time = this.$inputs.time ? this.$inputs.time.value : this.$inputs.time.value;
            
            
            
        }
        
    }
}