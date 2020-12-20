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
  }).then(function (response) {
    console.log(response['access_token']);
    console.log(response['refresh_token']);
    console.log(response);
  })
});

module.exports = router;
