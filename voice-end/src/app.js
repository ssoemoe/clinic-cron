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
    console.log("Hello");//DEBUG
    return this.toIntent('Welcome');
  },

  async Welcome() {
    //get appointment data
    api.getAppointments().then(response => { console.log(response); this.$app.$data.appointmentData = response });

    const welcomeMsg = ["Welcome to the clinic!",
      "Welcome to our clinic!",
      `${util.greetingTime()}! Welcome to the clinic!`,
      "Hello! Welcome to our helpful clinic!",
      "Hey! Welcome to the clinic",
    ]
    const infoMsg = ["I am a doctor's smart assistant and I will help you check-in your appointment. It is a pleasure to meet you.",
      "I am a virtual assistant built for helping patients with appointment check-ins. It is nice to meet you.",
      "I am a virtual receptionist specialized in helping people check-in with their appointments. It is good to meet you today.",
    ]
    const firstNameMgs = [
      "Can you please give me your first name to start the appointment check-in?",
      "Would you kindly tell me your first name for the appointment check-in?",
      "Let's start the check-in. What is your first name?",
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
