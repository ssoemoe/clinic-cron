const moment = require("moment");
const requestPromise = require('request-promise-native');

const root = "http://localhost:3000"


module.exports = {

    getAppointments: async () => {
        console.log("api: getAppointments")
        let date = moment(new Date().setDate(24))


        let dateParam = date.format("YYYY-MM-DD") + "T22:00:00";

        const options = {
            uri: `${root}/appointments?date=${dateParam}`,
            json: true // Automatically parses the JSON string in the response
        };
        return await requestPromise(options);
       
    }, 

    sendCheckInEmail: async (appointmentId,doctorId,patientId,appointmentTime) => {
        console.log("api: sendCheckInEmail") 

        const options = {
            uri: `${root}/appointments/email/${appointmentId}/${doctorId}/${patientId}/${appointmentTime}`,
            json: true // Automatically parses the JSON string in the response
        };
        return await requestPromise(options);
       
    }, 
}
