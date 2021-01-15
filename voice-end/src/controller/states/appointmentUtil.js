const moment = require("moment");
const onTimeOffset = 15;
module.exports = {

    findPatientAppointmentToday: (appointmentData, patientName) => {

        return (module.exports.getAppointmentsToday(appointmentData).filter((element) => {
            if (module.exports.compareNames({ firstName: element.first_name, lastName: element.last_name },
                { firstName: patientName.firstName, lastName: patientName.lastName })) {
                return true
            } else {
                return false
            }
        }))


    },

    getAppointmentsToday(appointmentData) {
        return (appointmentData.filter((element) => {
            return moment(moment(element.scheduled_time).format("YYYY-MM-DD")).isSame(moment().format("YYYY-MM-DD"))
        }))

    },


    findAppointment: (appointmentList, patientName) => {

        for (let i = 0; i < appointmentList.length; i++) {
            const element = appointmentList[i];

            if (module.exports.compareNames({ firstName: element.first_name, lastName: element.last_name },
                { firstName: patientName.firstName, lastName: patientName.lastName })) {
                return element
            }
        }
        return null;



    },
    isPatientEarlyOnTimeLate: (appointmentInfo) => {
        if (!appointmentInfo.scheduled_time) {
            return "error no scheduled_time found";
        }

        const appointmentTime = appointmentInfo.scheduled_time
        const early = moment(appointmentTime).subtract(onTimeOffset, "m");
        const late = moment(appointmentTime).add(onTimeOffset, "m");
        const currentTime = moment();


        if (currentTime.isAfter(late)) {
            return "late"
        } else if (currentTime.isBefore(early)) {
            return "early";
        } else if (currentTime.isSameOrBefore(late) && currentTime.isSameOrAfter(early)) {
            return "onTime";
        } else {
            return "error cannot find time frame";
        }
    },

    compareNames(apt, user) {
        // console.log(apt.lastName + "  " + user.lastName)
        if (
            (parseName(apt.lastName) == parseName(user.lastName)) && (parseName(apt.firstName) == parseName(user.firstName)) ||
            (parseName(apt.lastName) == parseName(user.firstName)) && (parseName(apt.firstName) == parseName(user.lastName))
        ) {
            return true;
        }
        return false;

    },


    findAppointmentByNameDate: (appointmentList, patientName, dateTime) => {

        const time = moment(dateTime).format("LT");

        for (let i = 0; i < appointmentList.length; i++) {
            const element = appointmentList[i];
            const elementTime = moment(element.scheduled_time).format("LT");
            const isSameName = module.exports.compareNames({ firstName: element.first_name, lastName: element.last_name },
                { firstName: patientName.firstName, lastName: patientName.lastName });

            if (isSameName && time === elementTime) {
                return element
            }
        }
        return null;



    },
    greetingTime() {
        const hour = moment().format("H");
        let timeOfDay = "Evening";
        if (6 <= hour && hour < 12) timeOfDay = "Morning";
        else if (12 <= hour && hour < 18) timeOfDay = "Afternoon";

        return `Good ${timeOfDay}`;
    },



}


function parseName(name) {
    if (name) {
        return name.trim().toLowerCase()
    }
    return "null"
}