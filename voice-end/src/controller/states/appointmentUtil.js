module.exports  =  {

    findDuplicateNames: async (listData) => {


        return true;

    },
    findAppointment:  (appointmentList, patientName) => {

        for(let i = 0; i < appointmentList.length; i++){
            const element = appointmentList[i];
            console.log(appointmentList[i].first_name + " " + patientName)
            if( element.first_name.toLowerCase() === patientName.toLowerCase() || element.last_name.toLowerCase() === patientName.toLowerCase() ){
                console.log("SDFSKDFSDFSDFSDFSDFDSFD")
                return element
            }
        }
        return null;
        
     

    },
    isPatientEarlyOnTimeLate:  (appointmentInfo) => {

        return "onTime"

    
        
     

    },


}