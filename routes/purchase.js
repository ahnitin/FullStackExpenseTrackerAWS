const express = require("express");
const router = express.Router();
const purchaseController = require("../controller/purchase")
const userAuthentication = require("../middlware/auth");

router.get("/premium",userAuthentication.authenticate,purchaseController.purchasePremium);
router.post("/update",userAuthentication.authenticate,purchaseController.updateTransactionStatus)


module.exports = router;