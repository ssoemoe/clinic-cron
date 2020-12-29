const moment = require("moment");
const onTimeOffset = 15;
module.exports = {

    findPatientAppointmentToday:  (appointmentData, patientName) => {

       return ( module.exports.getAppointmentsToday(appointmentData).filter((element)=>{
        if ((element.first_name && element.last_name && (element.first_name.toLowerCase() === patientName.toLowerCase() || element.last_name.toLowerCase() === patientName.toLowerCase()))) {
                return true
            }else {
                return false
            } 
        })) 
        

    },

    getAppointmentsToday(appointmentData){
        return ( appointmentData.filter((element)=>{
           return moment(moment(element.scheduled_time).format("YYYY-MM-DD")).isSame(moment().format("YYYY-MM-DD"))
        })) 

    },


    findAppointment: (appointmentList, patientName) => {

        for (let i = 0; i < appointmentList.length; i++) {
            const element = appointmentList[i];

            if ((element.first_name && element.last_name && (element.first_name.toLowerCase() === patientName.toLowerCase() || element.last_name.toLowerCase() === patientName.toLowerCase()))) {
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
    }


}