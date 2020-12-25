var fs = require('fs');
var axios = require('axios');

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
    const refreshToken = fs.readFileSync('./config/refresh_token', 'utf-8');
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
    try {
        const response = await axios.get(`https://app.drchrono.com/api/appointments?date=${dateStr}`, config);
        return response['data']['results'];
    }
    catch (error) {
        console.log(error);
        return error;
    }
}

module.exports.getPatientInfo = async (id, access_token) => {
    const config = { headers: { Authorization: `Bearer ${access_token}` } };
    try {
        const response = await axios.get(`https://app.drchrono.com/api/patients/${id}`, config);
        return response['data'];
    }
    catch (error) {
        console.log(error);
        return error;
    }
}

module.exports.checkInAppointment = async (id, access_token) => {
    const config = {
        headers: {
            'Authorization': `Bearer ${access_token}`
        }
    };
    try {
        const response = await axios.patch(`https://app.drchrono.com/api/appointments/${id}`, { status: 'In Room' }, config);
        return response;
    }
    catch (error) {
        return error;
    }
}

module.exports.notifyDoctor = async (doctor_id, title, access_token) => {
    const config = {
        headers: {
            'Authorization': `Bearer ${access_token}`
        }
    };
    try {
        const response = await axios.post(`https://app.drchrono.com/api/messages`, {
            'doctor': doctor_id,
            'title': title,
            'message_notes': [{ 'text': title }]
        }, config);
        return response;
    }
    catch (error) {
        return error;
    }
}