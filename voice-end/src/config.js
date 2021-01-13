// ------------------------------------------------------------------
// APP CONFIGURATION
// ------------------------------------------------------------------

module.exports = {
  logging: false,

  intentMap: {
    'LaunchRequest': 'Welcome',
    'AMAZON.StopIntent': 'END',
  },

  db: {
    FileDb: {
      pathToFile: '../db/db.json',
    },
  },
};
