const api = require('../api.js');
const util = require('./appointmentUtil.js');
const moment = require("moment");

module.exports = {

    async FirstName() {
        console.log("appointmentState: FirstName");


        //Get patient's first name name for input
        const patientName = this.$inputs.firstName.value;

        //Save first name in state 
        this.$session.$data.firstName = patientName;
        this.$session.$data.lastName ? this.$session.$data.lastName : null

        //To to check in if we have first and last name
        if (this.$session.$data.lastName && this.$session.$data.firstName) {

            return await this.toStateIntent(this.getState(), "CheckInIntent")
        } else {
            this.ask(`Thanks ${patientName}. Can you provide your last name?`);
        }
    },

    async Name() {
        console.log("appointmentState: Name");
        //get input
        const patientName = this.$inputs.name.value;

        //if we don't have a first name
        if (!this.$session.$data.firstName) {

            //save first name
            this.$session.$data.firstName = patientName;

            //check for last name
            if (!this.$session.$data.lastName) {
                this.ask(`Thanks ${patientName}. Can you provide your last name?`);
            } else {
                this.$session.$data.lastName = this.$session.$data.lastName;
                return await this.toStateIntent(this.getState(), "CheckInIntent");
            }


        }
        else if (!this.$session.$data.lastName) {
            this.$session.$data.lastName = patientName;

            //check for first name
            if (!this.$session.$data.firstName) {
                this.ask(`Thanks ${patientName}. Can you provide your first name?`);
            } else {
                //save first name
                this.$session.$data.firstName = this.$session.$data.firstName;
                return await this.toStateIntent(this.getState(), "CheckInIntent");
            }


        }

        // if we have both
        else if (this.$session.$data.lastName && this.$session.$data.firstName) {
            this.$session.$data.firstName = this.$session.$data.firstName;
            this.$session.$data.lastName = this.$session.$data.lastName;
            return await this.toStateIntent(this.getState(), "CheckInIntent");
        }
        //else error
        else {
            this.ask(`Sorry something went wrong`);
        }

    },

    async LastName() {
        console.log("appointmentState: LastName");

        //Get patient's last name name for input
        const patientName = this.$inputs.lastName.value;


        //Save last name in state 
        this.$session.$data.lastName = patientName;
        this.$session.$data.firstName ? this.$session.$data.firstName : null

        //To to check in if we have first and last name
        if (this.$session.$data.lastName && this.$session.$data.firstName) {

            return await this.toStateIntent(this.getState(), "CheckInIntent")
        } else {
            this.ask(`Thanks ${patientName}. Can you provide your first name?`);
        }


    },


    /**
     * Logic for checking in the patient
     */
    async CheckInIntent() {
        console.log(">appointmentState: CheckInIntent");

        //Get patient name for input
        const patientName = { firstName: this.$session.$data.firstName, lastName: this.$session.$data.lastName }

        //Save name in session data
        this.$session.$data.firstName ? this.$session.$data.firstName : null
        this.$session.$data.lastName ? this.$session.$data.lastName : null

        //Call API
        let appointmentList = this.$app.$data.appointmentData;

        //No appointments today
        if ((!appointmentList) || appointmentList.length == 0) {
            this.$speech.addText(`Hi ${patientName.firstName} ${patientName.lastName}, you don't have an appointment today.`)
            return this.ask(this.$speech)
        }

        //Look up appointment
        const numberOfAppointments = util.findPatientAppointmentToday(appointmentList, patientName)
        console.log(patientName);
        console.log(numberOfAppointments.length);

        //If two people have the same name !! Change this to == 1 to test same name case
        if (numberOfAppointments.length == 2) {

            //Set the follow up state
            return this.followUpState(this.getState() + '.AdditionalInfoState')
                .ask(`Thanks, ${patientName.firstName} ${patientName.lastName}, what time is the appointment?`);


        }
        //No Appointment Today found
        else if (numberOfAppointments.length == 0) {

            //Reset name in session data
            this.$session.$data.firstName = null
            this.$session.$data.lastName = null

            return this.tell(`Sorry, I didn't find an appointment today for ${patientName.firstName} ${patientName.lastName}`);


        }
        //Found the Appointment
        else if (numberOfAppointments.length == 1) {
            //Lookup the appointment 
            const patientAppointmentsInfo = numberOfAppointments[0];
            console.log(patientAppointmentsInfo)
            this.$session.$data.patientAppointmentsInfo = patientAppointmentsInfo;

            return await this.toStateIntent(this.getState(), "getCheckInResponse")

        } else {

            return this.tell(`Sorry an error: 1 has occurred`);
        }

    },

    async getCheckInResponse() {
        const patientName = { firstName: this.$session.$data.firstName, lastName: this.$session.$data.lastName }
        const patientAppointmentsInfo = this.$session.$data.patientAppointmentsInfo
        const patientTiming = util.isPatientEarlyOnTimeLate(patientAppointmentsInfo)
        console.log(patientTiming)
        switch (patientTiming) {
            case "early":
                const appointmentTime = moment(patientAppointmentsInfo.scheduled_time).format("LT")
                //TODO do the calculation for what time they should be back
                return this.ask(`Hey ${patientName.firstName} ${patientName.lastName}. You are a bit early for your appointment. Please comeback 15 minutes before ${appointmentTime}`);
                break;
            case "onTime":
                const sentEmail = await api.sendCheckInEmail(patientAppointmentsInfo.id,
                    patientAppointmentsInfo.doctor,
                    patientAppointmentsInfo.patient,
                    patientAppointmentsInfo.scheduled_time);
                console.log("sentEmail:" + sentEmail)

                return this.ask(`Hey ${patientName.firstName} ${patientName.lastName}, please have a seat and check your email to confirm the check in.`);
                break;
            case "late":
                return this.ask(`Hey ${patientName.firstName} ${patientName.lastName}, sorry, you are late for your appointment!`);
                break;
            default:
                console.log("switch error")
                return this.tell(`Sorry an error: 3 has occurred`);
        }
    },

    AdditionalInfoState: {

        async AppointmentTimeIntent() {
            console.log("appointment.AdditionalInfoState: AppointmentTimeIntent");

            //Check for name session data 
            if (!(this.$session.$data.lastName && this.$session.$data.firstName)) {
                if (!this.$session.$data.firstName) {
                    this.$speech.addText("What is your first name?")
                } else {
                    this.$speech.addText("What is your last name?")

                }

                return await this.followUpState("appointmentState", "Name").ask(this.$speech);
            }


            //Save name in session data
            this.$session.$data.firstName ? this.$session.$data.firstName : null
            this.$session.$data.lastName ? this.$session.$data.lastName : null


            //Get time for input
            console.log(this.$inputs.time); //DEBUG
            let timeInput = '';
            if (this.$alexaSkill) {
                const timeComponents = this.$inputs.time.key.split(':');
                let date = new Date();
                date.setHours(Number(timeComponents[0]));
                date.setMinutes(Number(timeComponents[1]));
                timeInput = date.toISOString();
            }
            else {
                timeInput = this.$inputs ? this.$inputs.time.key : "error no time";
            }
            console.log(timeInput); //DEBUG
            this.$session.$data.dateTime = timeInput;

            //Get patient name for input
            const patientName = { firstName: this.$session.$data.firstName, lastName: this.$session.$data.lastName }

            //Call utils
            const appointmentData = util.findAppointmentByNameDate(this.$app.$data.appointmentData, patientName, timeInput)


            this.$session.$data.patientAppointmentsInfo = appointmentData;

            //Check if an appointment is found 
            if (!appointmentData) {
                //Reset name in session data
                this.$session.$data.firstName = null
                this.$session.$data.lastName = null
                this.$speech.addText(`Hi ${patientName.firstName} ${patientName.lastName}, I didn't find an appointment for ${moment(timeInput).format("LT")} today.`)
                return this.tell(this.$speech)

            }


            return await this.toStateIntent(this.getState(), "getCheckInResponse")


        }

    }
}