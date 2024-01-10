const express = require('express');
const premiumFeatureController = require('../controller/premiumFeature');
const router = express.Router();

router.get('/showLeaderBoard',premiumFeatureController.getUserLeaderBoard);


module.exports = router;