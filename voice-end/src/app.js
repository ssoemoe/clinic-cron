'use strict';
const moment = require("moment");
const { App } = require('jovo-framework');
const { Alexa } = require('jovo-platform-alexa');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { FileDb } = require('jovo-db-filedb');
const requestPromise = require('request-promise-native');
const util = require('./controller/states/appointmentUtil.js');
const api = require('./controller/api.js');
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
    return this.toIntent('Welcome');
  },

  async Welcome() {
    //get appointment data
    api.getAppointments().then(response => { console.log(response); this.$app.$data.appointmentData = response });

    const welcomeMsg = ["Welcome to the Clinic Attendant!",
      `${util.greetingTime()}! Welcome to the Clinic Attendant!`,
      "Hello! Welcome to the Clinic Attendant!"
    ]
    const infoMsg = ["I am a doctor's smart assistant.",
      "I an AI assistant built for doctors.",
      "I an AI receptionist built for doctors.",
    ]
    const firstNameMgs = [
      "To check-in, please tell me your first name?",
      "To check-in, what is your first name?",
    ]

    this.$speech.addText(welcomeMsg).addText(infoMsg).addText(firstNameMgs)
    this.showSimpleCard("Welcome to Clinic Attendant", "What is your first name")
    this.ask(this.$speech);
  },


  async FirstNameIntent() {
    console.log("app: appointmentState");
    await this.toStateIntent("appointmentState", "FirstName");
  },
  async LastNameIntent() {
    console.log("app: appointmentState");
    await this.toStateIntent("appointmentState", "LastName");
  },
  async MyNameIsIntent() {
    console.log("app: appointmentState");
    await this.toStateIntent("appointmentState", "Name");
  },
 
  Help() {

    this.ask("Sorry, I didn't get that, please tell me your first name");
  },

  Unhandled() {
    return this.toIntent('Help');
  },

});


module.exports = { app };
