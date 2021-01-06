var express = require('express');
var router = express.Router();
var utility = require('../utility');

router.get('/:patient_id', async (req, res, next) => {
    try {
        const access_token = await utility.refreshToken();
        const patient = await utility.getPatientInfo(req.params.patient_id, access_token);
        return res.status(200).json(patient);
    }
    catch (err) {
        return res.status(400).json({ "fail": err.toString() });
    }
});

router.put('/:patient_id', async (req, res, next) => {
    try {
        const access_token = await utility.refreshToken();
        const response = await utility.updatePatientInfo(req.params.id, req.body, access_token);
        return res.status(200).json(response);
    }
    catch (err) {
        return res.status(400).json({ "fail": err.toString() });
    }
});

module.exports = router;