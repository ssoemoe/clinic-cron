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
    return this.toIntent('HelloWorldIntent');
  },

  HelloWorldIntent() {
    this.ask("Welcome to the Chron Clinic! To check-in, please tell me your name");
  },

  async MyNameIsIntent() {
    console.log("app: appointmentState");
    await this.toStateIntent("appointmentState", "CheckInIntent");
  },

});

 
module.exports = { app };
