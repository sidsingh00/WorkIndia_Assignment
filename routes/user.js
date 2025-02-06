const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/availability', userController.getSeat);
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/book',  authMiddleware, userController.bookSeat);
router.get('/getAllbookings', authMiddleware, userController.getBookingDetail);

module.exports = router;
