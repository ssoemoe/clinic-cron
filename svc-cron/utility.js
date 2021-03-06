var axios = require('axios');
var fs = require('fs');
var moment = require('moment-timezone');
var nodemailer = require('nodemailer');

module.exports.createDirIfNotExists = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
}

// data must be string
module.exports.saveConfig = (data, dir, fileName) => {
    fs.writeFileSync(`${dir}/${fileName}`, data, (err) => {
        if (err) throw err;
        console.log(`Data is successfully saved in '${dir}/${fileName}'`);
    });
}

module.exports.refreshToken = async () => {
    const refreshToken = process.env.REFRESH_TOKEN;
    if (!refreshToken) throw 'refresh token does not exist!';
    const dataParams = {
        'refresh_token': refreshToken,
        'grant_type': 'refresh_token',
        'client_id': process.env.CLIENT_ID,
        'client_secret': process.env.CLIENT_SECRETS,
    };
    const data = Object.entries(dataParams).map(([key, val]) => `${key}=${encodeURIComponent(val)}`).join('&');
    const config = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } };
    const response = await axios.post('https://drchrono.com/o/token/', data, config);
    return response['data']['access_token'];
}

module.exports.getAppointments = async (dateStr, access_token) => {
    const config = { headers: { Authorization: `Bearer ${access_token}` } };
    // const response = await axios.get(`https://app.drchrono.com/api/appointments?date_range=${dateStr}&page_size=300`, config);
    const response = await axios.get(`https://app.drchrono.com/api/appointments?date=${dateStr}&page_size=150`, config);
    return response['data']['results'];
}

module.exports.getPatientInfo = async (id, access_token) => {
    try {
        const config = { headers: { Authorization: `Bearer ${access_token}` } };
        const response = await axios.get(`https://app.drchrono.com/api/patients/${id}`, config);
        return response['data'];
    }
    catch (err) {
        return { "first_name": "NONE", "last_name": "NONE" }
    }
}

module.exports.updatePatientInfo = async (id, formData, access_token) => {
    const config = {
        headers: {
            'Authorization': `Bearer ${access_token}`,
            ...formData.getHeaders()
        },
    };
    const response = await axios.patch(`https://app.drchrono.com/api/patients/${id}`, formData, config);
    return response;
}

module.exports.createAppointment = async (appointmentInfo, access_token) => {
    const config = {
        headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    try {
        const data = Object.entries(appointmentInfo).map(([key, val]) => `${key}=${encodeURIComponent(val)}`).join('&');
        const response = await axios.post(`https://app.drchrono.com/api/appointments`, data, config);
        return response;
    }
    catch (error) {
        return error;
    }
}

module.exports.checkInAppointment = async (id, access_token) => {
    const config = {
        headers: {
            'Authorization': `Bearer ${access_token}`
        }
    };
    const response = await axios.patch(`https://app.drchrono.com/api/appointments/${id}`, { status: 'In Room' }, config);
    return response;
}

module.exports.notifyDoctor = async (doctor_id, title, text, access_token) => {
    const config = {
        headers: {
            'Authorization': `Bearer ${access_token}`
        }
    };
    const response = await axios.post(`https://app.drchrono.com/api/messages`, {
        'doctor': doctor_id,
        'title': title,
        'message_notes': [{ 'text': text }]
    }, config);
    return response;
};

module.exports.getDoctorInfo = async (id, access_token) => {
    const config = { headers: { Authorization: `Bearer ${access_token}` } };
    const response = await axios.get(`https://app.drchrono.com/api/doctors/${id}`, config);
    return response['data'];
};

module.exports.sendEmail = async (toEmail, subject, content) => {
    return new Promise((resolve, reject) => {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'cliniccron@gmail.com',
                pass: ''
            }
        });
        const mailOptions = {
            from: 'cliniccron@gmail.com', // sender address
            to: toEmail, // list of receivers
            subject: subject, // Subject line
            html: content // plain text body
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log("error is " + error);
                reject(false);
            }
            else {
                resolve(true);
            }
        });
    });
};

module.exports.getCurrentTime = () => {
    return moment(new Date()).tz("America/New_York").format('YYYY-MM-DDTHH:mm:ss');
}

module.exports.formatTime = (date) => {
    return moment(date).tz("America/New_York").format('YYYY-MM-DDTHH:mm:ss');
}