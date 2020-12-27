'use strict';
const moment = require("moment");
const { App } = require('jovo-framework');
const { Alexa } = require('jovo-platform-alexa');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');
const requestPromise = require('request-promise-native');
const util = require('./controller/states/appointmentUtil.js');
const axios = require("axios");


// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const app = new App();


const appointmentState = require('./controller/states/appointmentState');


app.use(
  new Alexa(),
  new GoogleAssistant(),
  new JovoDebugger(),
  new FileDb()
);

// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

app.setHandler({
  appointmentState,
  LAUNCH() {
    return this.toIntent('HelloWorldIntent');
  },

  HelloWorldIntent() {
    this.ask("Welcome to the Chron Clinic! To check-in, please tell me your name");
  },

  async MyNameIsIntent() {
    // console.log("app: appointmentState");
    // this.toStateIntent("appointmentState", "CheckInIntent");

    console.log("appointment: appointmentState");


    //Get patient name for input
    const patientName = this.$inputs.person ? this.$inputs.person.value : this.$inputs.name.value;


    //Call API
    const appointmentList = await getAppointments()

    console.log(appointmentList)
    // console.log(appointmentList[0].first_name)

    //No appointments today
    if (appointmentList.length === 0) {
      this.ask(`Hi ${patientName}, you don't have an appointment today.`)
    }

    //If two people have the same name 
    if (util.findDuplicateNames()) {
      this.ask(`Hi ${patientName}, what is the name of the doctor?`);
    }

    //Lookup the appointment 
    const patientAppointmentsInfo = util.findAppointment(appointmentList, patientName);
    if (patientAppointmentsInfo) {
      const patientTiming = util.isPatientEarlyOnTimeLate(patientAppointmentsInfo)
      console.log(patientTiming)
      switch (patientTiming) {
        case "early":
          const appointmentTime = moment(patientAppointmentsInfo.scheduled_time).format("LT")
          this.ask(`Hey ${patientName}. You are a bit early for your appointment. Please comeback 15 minutes before ${appointmentTime}`);
          break;
        case "onTime":
          this.ask(`Hey ${patientName}, please have a seat!`);
          console.log("yes")
          break;
        case "late":
          this.ask(`Hey ${patientName}, sorry, you are late for your appointment!`);
          break;
        default:
          console.log("switch error")
      }


    }else
    {

      this.ask(`Sorry, ${patientName}, I could not find your name. Can you say it again`);
    }




    // this.ask( `Error moo`);




  },


  doesPatientShareName() {
    return false;
  }
});


async function getAppointments() {
  
  let date = moment(new Date().setDate(24))


  let dateParam = date.format("YYYY-MM-DD") + "T22:00:00";

  console.log(dateParam);


  const options = {
      uri: `http://localhost:3000/appointments?date=${dateParam}`,
      json: true // Automatically parses the JSON string in the response
  };
  return await requestPromise(options);
  

  // return data;
    // return JSON.parse('[{"allow_overlapping":false,"appt_is_break":false,"base_recurring_appointment":null,"billing_status":"","billing_provider":null,"billing_notes":[],"cloned_from":null,"color":"#4f81bd","created_at":"2020-12-24T17:20:47","deleted_flag":false,"doctor":286076,"duration":30,"exam_room":1,"first_billed_date":"2020-12-24T22:00:00","icd9_codes":[],"icd10_codes":[],"id":"162915263","ins1_status":"","ins2_status":"","is_walk_in":false,"is_virtual_base":false,"last_billed_date":"2020-12-24T22:00:00","notes":"","office":303862,"patient":91374076,"primary_insurer_payer_id":"","primary_insurer_name":"","primary_insurance_id_number":"","profile":360782,"reason":"New Patient Visit","recurring_appointment":false,"secondary_insurer_payer_id":"","secondary_insurer_name":"","secondary_insurance_id_number":"","scheduled_time":"2020-12-24T22:00:00","status":"In Room","supervising_provider":null,"updated_at":"2020-12-26T00:07:21","first_name":"Uno","last_name":"Uno","doctor_first_name":"Clinic","doctor_last_name":"Cron"}]')

}
module.exports = { app };
