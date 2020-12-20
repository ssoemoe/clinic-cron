var express = require('express');
var axios = require('axios');
var router = express.Router();

/* retrieves the code and setup the access_token and refresh_token */
router.get('/', (req, res, next) => {
  const code = req.query.code;
  const url = `https://drchrono.com/o/authorize`;
  if (!code) {
    return res.status(404).json({ "status": "Code is not in the query GET parameter!" });
  }
  axios.post(url, {
    'code': code,
    'grant_type': 'authorization_code',
    'redirect_uri': process.env.REDIRECT_URI,
    'client_id': process.env.CLIENT_ID,
    'client_secret': process.env.CLIENT_SECRETS,
  }).then((response) => {
    res.status(201).json({
      "Success": {
        "access_token": response['access_token'],
        "refresh_token": response['refresh_token'],
        "expiration_seconds": response['expires_in']
      }
    });
  }).catch((error) => {
    res.status(404).json({ "Failed": error.message });
  });
});

module.exports = router;
