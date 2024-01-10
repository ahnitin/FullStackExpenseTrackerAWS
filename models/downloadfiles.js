const Sequelize = require("sequelize");
const sequelize = require("../connection/database");
const DownloadFiles = sequelize.define("downloadfiles",{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false,
    },
    url:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    Date:{
        type:Sequelize.STRING,
        allowNull:false,
    }
})

module.exports = DownloadFiles;