const express = require('express');
const router = express.Router();

const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController');

// router.post('/signup', authController.signup); // we use signup to create the user and send the email to verify the email
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch('/verifyEmail/:token', authController.verifyEmail);

router.use(authController.protect); //all the comming is protected

router.use(authController.restrictTo('owner', 'manager')); //all the comming is protected to resorts owners and managers

//must use protect for the comming routes for two reasons , 1) to make sure of the user , 2) and put the info in the req as use
router.patch('/updateMyPassword', authController.updatePassword);
router.get('/me', userController.getMe, userController.getUser); // we use getMe to get id form req.user.id and put it in req.user.param
router.patch(
    '/updateMe',
    authController.protect,
    userController.updateMe
); /* upload saves the photo and put the info in the req body */
router.delete('/deleteMe', authController.protect, userController.deleteMe);

module.exports = router;
