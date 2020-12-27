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
        const appointmentList = await getAppointments()

        // console.log(appointmentList)
        // console.log(appointmentList[0].first_name)

        //No appointments today
        if (appointmentList.length == 0) {
            this.ask(`Hi ${patientName}, you don't have an appointment today.`)
        }

        //If two people have the same name 
        if (util.findDuplicateNames()) {
            this.ask(`Hi ${patientName}, what is the name of the doctor?`);
        }

        //Lookup the appointment 
        const patientAppointmentsInfo = util.findAppointment(appointmentList, patientName);
        if (patientAppointmentsInfo) {

            const patientTiming = util.isPatientEarlyOnTimeLate()
            switch (patientName) {
                case "early":
                    const appointmentTime = moment(patientAppointmentsInfo.scheduled_time).format("LT")
                    this.ask(`Hey ${patientName}. You are a bit early for your appointment. Please comeback 15 minutes before ${appointmentTime}`);
                    break;
                case "onTime":
                    this.ask(`Hey ${patientName}, please have a seat!`);
                    break;
                case "late":
                    this.ask(`Hey ${patientName}, sorry, you are late for your appointment!`);
                    break;
            }


        }
        this.ask(`Sorry, ${patientName}, I could not find your name. Can you say it again`);




        // this.ask( `Error moo`);




    },

   



    CheckInIntent2() {
        console.log("appointment: appointmentState");


        //Get patient name for input
        const patientName = this.$inputs.person ? this.$inputs.person.value : this.$inputs.name.value;



        //API call to get all appointments for the week
        const appointments = ["josh", "shane", "susan"]

        //check if there are more than one patient. Returns true if there are 2 Josh
        if (this.doesPatientShareName(patientName, patientName)) {
            //Save Name state

            this.ask('What is the name of the doctor you are seeing today?');

        }

        //If the patient has an appointment for this week
        else if (patientName == "josh" || patientName == "shane") {


            //Get patient's info from the list of appointments
            const patientAppointmentsInfo = {}

            //If the appointment is today
            if (patientName == "josh") {

                //if patient is on time
                this.ask('Hey ' + patientName + ', please have a seat!');



                //if patient is on late



                //if patient is on early



            } else {
                this.ask('Hey ' + patientName + ', sorry, you are late for your appointment!');

            }






        } else {

            this.ask(`Sorry, ${patientName}, I could not find your name. Can you say it again`);
        }



    },



}

async function  getAppointments()   {

    date = moment(new Date().setDate(24))
    date.set

    dateParam = date.format("YYYY-MM-DD")+"T22:00:00";

    console.log(dateParam);


    const options = {
        uri: `http://localhost:3000/appointments?date=${dateParam}`,
        json: true // Automatically parses the JSON string in the response
    };
    const data = await requestPromise(options);
   console.log(data)

    return data;


}