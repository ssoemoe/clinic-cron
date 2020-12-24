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