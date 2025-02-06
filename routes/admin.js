const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const apiMiddleware = require('../middleware/apiMiddleware');


router.post('/addTrain', apiMiddleware.verifyApiKey, adminController.addTrain);
router.put('/update-seats/:trainId', apiMiddleware.verifyApiKey, adminController.updateTrainSeats);

module.exports = router;
