const moment = require("moment");
const requestPromise = require('request-promise-native');

// const root = "http://localhost:3000"
const root = "https://clinic-attendant.herokuapp.com"


module.exports = {

    getAppointments: async () => {
        console.log(" >>api: getAppointments")

        const options = {
            uri: `${root}/appointments`,
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
