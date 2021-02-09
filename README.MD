<p align="center">
    <img src="./assets/clinic-attendant-icon-round.png" width="200" hieght="300">
    <br>
    <img src="https://github.com/ssoemoe/clinic-cron/workflows/Clinic%20Cron%20Build/badge.svg" width="200" hieght="300">
</p>

# [Attention Please] We won Engineers Choice award!
Please see the details here: https://devpost.com/software/clinic-attendant  

# Clinic Attendant

Clinic Attendant is a contact-less virtual check-in app powered with Amazon Alexa and Google Assistant for clinics/doctors and patients using DrChrono APIs.
(A hackathon project for DrChron hackathon on DevPost)

## Running the API app

First, configure the app with environtment variables.  
`REDIRECT_URI`  
`CLIENT_ID`  
`CLIENT_SECRETS`  
`REFRESH_TOKEN`

Then, run the command:  

```
cd svc-cron  
npm install  
npm run start-dev
```


## Running the voice application 

```
cd voice-end
npm install
jovo run --port 4000
```


## AUTHORS

**[SHANE MOE](https://github.com/ssoemoe)**  
**[JOSH LOPEZ](https://github.com/sinapples)**
