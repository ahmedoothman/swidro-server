const express = require('express');
const router = express.Router();

// amenities controller
const amenitiesController = require('../controllers/amenitiesController');
const authController = require('../controllers/authController');

router.use(authController.protect);
router.use(authController.restrictTo('admin', 'owner', 'manager'));
router
    .route('/')
    .get(amenitiesController.getAllAmenities)
    .post(amenitiesController.createAmenities);
router
    .route('/:id')
    .patch(amenitiesController.updateAmenities)
    .get(amenitiesController.getAmenities)
    .delete(amenitiesController.deleteAmenities);
module.exports = router;
