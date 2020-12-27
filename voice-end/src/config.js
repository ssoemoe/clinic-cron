// ------------------------------------------------------------------
// APP CONFIGURATION
// ------------------------------------------------------------------

module.exports = {
  logging: false,

  intentMap: {
    'AMAZON.StopIntent': 'END',
  },

  db: {
    FileDb: {
      pathToFile: '../db/db.json',
    },
  },
};
