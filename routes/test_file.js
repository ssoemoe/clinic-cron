var express = require('express');
var router = express.Router();
var utility = require('../utility');

// file vars
const tokenDir = './config';

router.get('/', async (req, res, next) => {
    utility.createDirIfNotExists(tokenDir);
    utility.saveConfig('second', tokenDir, 'test');
    return res.status(200).json({ "success": "data was written!" });
});

module.exports = router;