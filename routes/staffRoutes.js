const express = require('express');
const router = express.Router();

const authController = require('./../controllers/authController');
const staffController = require('./../controllers/staffController');

router.use(
    authController.protect,
    authController.restrictTo('owner', 'manager', 'admin')
);
router.post('/addStaff', staffController.addStaff);
router.get('/allStaff', staffController.getAllStaff);
router
    .route('/:id')
    .get(staffController.getStaff)
    .patch(staffController.updateStaff)
    .delete(staffController.deleteStaff);

module.exports = router;
