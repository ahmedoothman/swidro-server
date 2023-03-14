const express = require('express');

const staffController = require('./../controllers/staffController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.use(
    authController,
    authController.restrictTo('owner', 'manager', 'admin')
);
router.post('/addStaff', staffController.addStaff);
router.get('/allStaff/:id', staffController.getAllStaff);
router
    .route('/:id')
    .get(staffController.getStaff)
    .patch(staffController.updateStaff)
    .delete(staffController.deleteStaff);

module.exports = router;
