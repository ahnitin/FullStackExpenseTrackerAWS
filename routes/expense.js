const express = require("express");
const router = express.Router();
const expenseController = require("../controller/expense");
const userAuthentication = require("../middlware/auth");

router.post("/expenses",userAuthentication.authenticate,expenseController.postAddExpense);
router.delete("/expenses/:id",userAuthentication.authenticate,expenseController.deleteExpense)
router.get("/expenses",userAuthentication.authenticate,expenseController.getExpenses)
router.get("/downloadexpenses",userAuthentication.authenticate,expenseController.downloadExpenses);
router.get("/downloadhistory",userAuthentication.authenticate,expenseController.DownloadedFiles)
module.exports = router;