const express = require('express');
const router = express.Router();

const deviceController = require('./../controllers/deviceController');

router.get('/:id', deviceController.getDeviceStatus);
router.get('/getHelp/:id', deviceController.getHelp);
router.post('/updateStatus', deviceController.updateDeviceStatus);

module.exports = router;
