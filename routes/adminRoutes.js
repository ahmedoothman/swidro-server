/* 
Routes for admin to manage the resorts and users
*/
const express = require('express');
const router = express.Router();

// authController is used to protect the routes
const authController = require('./../controllers/authController');
// Import the controllers so they can be mapped to routes
const resortController = require('./../controllers/resortController');
const userController = require('./../controllers/userController');
const staffController = require('./../controllers/staffController');
const deviceController = require('./../controllers/deviceController');

// specify roles that can access the routes
// admin works for swidro company , owner or manager works for the resort
router.use(authController.protect, authController.restrictTo('admin'));

router.get('/getAllResorts', resortController.getAllResorts);
router.get('/getAllUsers', userController.getAllUsers);

// assign role admin to the user
router.patch('/assignRole', userController.assignRole);
module.exports = router;
