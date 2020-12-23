var express = require('express');
var axios = require('axios');
var router = express.Router();
var utility = require('../utility');

// file vars
const tokenDir = 'config';

/* retrieves the code and setup the access_token and refresh_token */
router.get('/', async (req, res, next) => {
  utility.createDirIfNotExists(tokenDir);
  const code = req.query.code;
  const url = `https://drchrono.com/o/token/`;
  const dataParams = {
    'code': code,
    'grant_type': 'authorization_code',
    'redirect_uri': process.env.REDIRECT_URI,
    'client_id': process.env.CLIENT_ID,
    'client_secret': process.env.CLIENT_SECRETS,
  };
  const data = Object.entries(dataParams).map(([key, val]) => `${key}=${encodeURIComponent(val)}`).join('&');
  const config = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } };
  if (!code) {
    return res.status(404).json({ "status": "Code is not in the query GET parameter!" });
  }
  try {
    const response = await axios.post(url, data, config);
    const responseJson = await response.json();
    console.log(responseJson);
    utility.saveConfig(responseJson['data']['access_token'], tokenDir, 'access_token');
    utility.saveConfig(responseJson['data']['refresh_token'], tokenDir, 'refresh_token');
    return res.status(201).json({
      "Success": {
        "access_token": responseJson['data']['access_token'],
        "refresh_token": responseJson['data']['refresh_token'],
        "expiration_seconds": responseJson['data']['expires_in']
      }
    });
  }
  catch (error) {
    console.log(error);
    console.log(data);
    return res.status(400).json({ "Failed": error.message });
  }
});

module.exports = router;
