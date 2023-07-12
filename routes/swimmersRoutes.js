const express = require('express');
const router = express.Router();

// swimmers controller
const swimmersController = require('../controllers/swimmersController');
const authController = require('../controllers/authController');

router.use(authController.protect);
router.get('/getSwimmersToday', swimmersController.getSwimmersByDate);
router.use(authController.restrictTo('admin', 'owner', 'manager'));
router
    .route('/')
    .get(swimmersController.getAllSwimmers)
    .post(swimmersController.createSwimmers);
router
    .route('/:id')
    .patch(swimmersController.updateSwimmers)
    .get(swimmersController.getSwimmers)
    .delete(swimmersController.deleteSwimmers);
module.exports = router;
