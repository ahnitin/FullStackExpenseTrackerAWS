const Sequelize = require("sequelize");
const sequelize = require("../connection/database");
const User = sequelize.define("user",{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false,
    },
    username:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    email:{
        type:Sequelize.STRING,
        unique:true,
        allowNull:false,
    },
    password:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    totalExpense:{
        type:Sequelize.INTEGER,
    },
    ispremium:{
        type:Sequelize.BOOLEAN,
    }

})
module.exports = User;