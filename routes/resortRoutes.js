const express = require('express');
const router = express.Router();

const authController = require('./../controllers/authController');
const resortController = require('./../controllers/resortController');

router.post('/signup', authController.signup, resortController.createResort);

router.use(authController.protect);
router.get('/', resortController.getResort);

router
    .route('/:id')
    .patch(resortController.upateResort)
    .delete(resortController.deleteResort);

module.exports = router;
