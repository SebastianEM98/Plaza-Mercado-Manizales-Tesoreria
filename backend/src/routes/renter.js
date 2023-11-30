const express = require('express');
const RenterController = require('../controllers/renter');
const validateToken = require('./validate-token');

const router = express.Router();

router.post('/create-renter', validateToken, RenterController.createRenter);
router.get('/renters', validateToken, RenterController.getRenters);
router.get('/renter/:id', validateToken, RenterController.getRenter);
router.put('/renter/:id', validateToken, RenterController.updateRenter);
router.delete('/renter/:id', validateToken, RenterController.deleteRenter);

module.exports = router;