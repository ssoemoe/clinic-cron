var FormData = require('form-data');
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

router.patch('/:id', async (req, res, next) => {
    try {
        const access_token = await utility.refreshToken();
        let formData = new FormData();
        for (let key in req.body) {
            if (key.includes('primary_insurance')) {
                for (let insKey in req.body['primary_insurance']) {
                    formData.append(`primary_insurance[${insKey}]`, req.body['primary_insurance'][insKey].toString());
                }
            }
            else {
                formData.append(key, req.body[key]);
            }
        }
        const response = await utility.updatePatientInfo(req.params.id, formData, access_token);
        if (response && response['status'] === 204)
            return res.status(204).json({ "status": 204 });
        else
            return res.status(400).json(response);
    }
    catch (err) {
        console.error("Error for PATCH patients endpoint");
        console.error(err);
        return res.status(400).json({ "fail": err.toString() });
    }
});

module.exports = router;