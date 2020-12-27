const axios = require("axios");
const moment = require("moment");
const requestPromise = require('request-promise-native');

const SERVER_URL = "http://localhost:3000";

//  const instance = axios.create({
//   baseURL: SERVER_URL,

//   withCredentials: true,
// });




module.exports = {


    getAppointments: async () => {

        let date = moment(new Date().setDate(24))


        let dateParam = date.format("YYYY-MM-DD") + "T22:00:00";

        console.log(dateParam);


        const options = {
            uri: `http://localhost:3000/appointments?date=${dateParam}`,
            json: true // Automatically parses the JSON string in the response
        };
        const data = await requestPromise(options);
        console.log(data)

        return data;


    },
    getAppointments3: async () => {

        let date = moment(new Date().setDate(24))


        let dateParam = date.format("YYYY-MM-DD") + "T22:00:00";

        console.log(dateParam);


        return await axios.get(`http://localhost:3000/appointments?date=${dateParam}`).then(function (response) {
            // handle success
            // console.log(response.data);
            return response.data;
        })
            .catch(function (error) {
                // handle error
                console.log("error");
            })




    }
}
