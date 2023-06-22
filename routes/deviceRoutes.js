const express = require('express');
const router = express.Router();

const deviceController = require('./../controllers/deviceController');
const authController = require('./../controllers/authController');

router.use(authController.protect);
/*
router.get('/status/:id', deviceController.getDeviceStatus);
router.get('/getHelp/:id', deviceController.getHelp);
router.post('/updateStatus', deviceController.updateDeviceStatus);
*/
router.use(authController.restrictTo('admin', 'owner', 'manager'));

router
    .route('/')
    .get(deviceController.getAllDevices)
    .post(deviceController.createDevice);
router
    .route('/:id')
    .patch(deviceController.updateDevice)
    .get(deviceController.getDevice)
    .delete(deviceController.deleteDevice);
module.exports = router;
