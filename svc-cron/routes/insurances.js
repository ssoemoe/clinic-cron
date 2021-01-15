var axios = require('axios');
var express = require('express');
var router = express.Router();
var utility = require('../utility');

router.get("/", async (req, res, next) => {
    try {
        const access_token = await utility.refreshToken();
        const config = { headers: { Authorization: `Bearer ${access_token}` } };
        const response = await axios.get(`https://app.drchrono.com/api/insurances?payer_type=emdeon`, config);
        res.status(200).json(response['data']['results']);
    }
    catch (error) {
        console.log(error);
        res.status(400).send(error.toString());
    }
});

router.post("/", async (req, res, next) => {
    try {
        const access_token = await utility.refreshToken();
        const config = { headers: { Authorization: `Bearer ${access_token}` } };
        await utility.notifyDoctor(286076, req.body.title, req.body.text, access_token);
        res.status(200).json('success');
    }
    catch (error) {
        console.log(error);
        res.status(400).send(error.toString());
    }
});

module.exports = router;