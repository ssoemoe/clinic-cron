// ------------------------------------------------------------------
// APP CONFIGURATION
// ------------------------------------------------------------------

module.exports = {
  logging: false,

  intentMap: {
    'LaunchRequest': 'Welcome',
    'AMAZON.CancelIntent': 'End',
    'AMAZON.FallbackIntent': 'Help',
    'AMAZON.NavigateHomeIntent': 'Welcome',
    'AMAZON.HelpIntent': 'Help',
    'AMAZON.StopIntent': 'End'
  },

  db: {
    FileDb: {
      pathToFile: '../db/db.json',
    },
  },
};
