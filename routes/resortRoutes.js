const express = require('express');
const resortController = require('./../controllers/resortController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup, resortController.createResort);

router.use(authController.protect);
router.get('/mine', resortController.getResort);
router
    .route('/:id')
    .get(resortController.getResort)
    .patch(resortController.upateResort)
    .delete(resortController.deleteResort);

router
    .route('/')
    .get(authController.restrictTo('admin'), resortController.getAllResorts);
module.exports = router;
