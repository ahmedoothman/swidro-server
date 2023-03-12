const express = require('express');

const deviceController = require('./../controllers/deviceController');

const router = express.Router();
router.get('/:id', deviceController.getDeviceStatus);
router.get('/getHelp/:id', deviceController.getHelp);
router.post('/updateStatus', deviceController.updateDeviceStatus);

module.exports = router;
