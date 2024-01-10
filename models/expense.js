const Sequelize = require("sequelize");
const sequelize = require("../connection/database");
const Expense = sequelize.define("expense",{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true,
    },
    category:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    description:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    amount:{
        type:Sequelize.INTEGER,
        allowNull:false,
    },
    date:{
        type:Sequelize.STRING,
        allowNull:false
    }
})
module.exports = Expense;