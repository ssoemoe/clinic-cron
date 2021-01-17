const moment = require("moment");
const requestPromise = require('request-promise-native');
const root = "https://clinic-attendant.herokuapp.com"
const appointmentsDynamoDb = "https://io8ib2wp18.execute-api.us-east-1.amazonaws.com/production";


module.exports = {

    getAppointments: async () => {
        console.log(" >>api: getAppointments")

        const options = {
            uri: `${appointmentsDynamoDb}?api_key=${process.env.REFRESH_TOKEN}`,
            json: true // Automatically parses the JSON string in the response
        };
        return await requestPromise(options);

    },

    sendCheckInEmail: async (appointmentId, doctorId, patientId, appointmentTime) => {
        console.log(" >>api: sendCheckInEmail")

        const options = {
            uri: `${root}/appointments/email/${appointmentId}/${doctorId}/${patientId}/${appointmentTime}`,
            json: true // Automatically parses the JSON string in the response
        };
        return await requestPromise(options);

    },
}
