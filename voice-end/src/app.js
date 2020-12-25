'use strict';

const { App } = require('jovo-framework');
const { Alexa } = require('jovo-platform-alexa');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const app = new App();

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
  LAUNCH() {
    return this.toIntent('HelloWorldIntent');
  },

  HelloWorldIntent() {
    this.ask("Welcome to the Chron Clinic! To check-in, please tell me your name");
  },

  MyNameIsIntent() {

    //Get patient name for input
    const patientName  = this.$inputs.person ? this.$inputs.person.value : this.$inputs.name.value;


    //API call to get all appointments for the week
    const appointments = ["josh", "shane", "susan"]

    //check if there are more than one patient. Returns true if there are 2 Josh
    if(this.doesPatientShareName(patientName, patientName)){
      //Save Name state
      
      this.ask('What is the name of the doctor you are seeing today?');

    }

    //If the patient has an appointment for this week
    else if(patientName == "josh" || patientName == "shane" ) {
      

      //Get patient's info from the list of appointments
      const patientAppointmentsInfo = {}

      //If the appointment is today
      if(patientName == "josh" ){

        //if patient is on time
        this.ask('Hey ' + patientName + ', please have a seat!');
        
        
        
        //if patient is on late



        //if patient is on early



      } else{
        this.ask('Hey ' + patientName + ', sorry, you are late for your appointment!');

      }

    




    }else {

      this.ask( `Sorry, ${patientName }, I could not find your name. Can you say it again`);
    }



  },


  doesPatientShareName(){
    return false;
  }
});

module.exports = { app };
