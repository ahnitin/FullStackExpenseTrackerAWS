const express = require("express");
const env = require("dotenv");
const cors = require("cors");
const path = require("path");
const app = express();
env.config();

const sequelize = require("./connection/database");
const User = require("./models/user");
const Expense = require("./models/expense");
const Order = require("./models/order");
const ForgetPassword = require("./models/forgotpassword");
const DownloadFiles = require("./models/downloadfiles");

const userRoutes = require("./routes/user");
const expenseRoutes = require("./routes/expense");
const purchaseRoutes = require("./routes/purchase");
const passwordRoutes = require("./routes/resetPassword");
const premiumRoutes = require("./routes/premiumFeature");

app.use(express.urlencoded({extended:false}));
app.use(cors());
app.use(express.json());

app.use(express.static("public"));
app.use(userRoutes);
app.use(expenseRoutes);
app.use("/purchase",purchaseRoutes);
app.use("/password",passwordRoutes);
app.use(premiumRoutes);
app.use("/",(req,res)=>{
    console.log(req.url)
    res.sendFile(path.join(__dirname,`public`,"signup.html"));
})
User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order)
Order.belongsTo(User);

User.hasMany(ForgetPassword);
ForgetPassword.belongsTo(User);

User.hasMany(DownloadFiles);
DownloadFiles.belongsTo(User);

async function main()
{
    try {
        await sequelize.sync()
        console.log("database connection done")
        app.listen(process.env.PORT || 3000);
        console.log("running on port 3000");
    } catch (error) {
        console.log("error not connected")
    }
}
main();
