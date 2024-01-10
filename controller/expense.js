const Expense = require("../models/expense");
const sequelize = require("../connection/database");
const User = require("../models/user");
const DownloadFiles = require("../models/downloadfiles");
const S3Services = require("../services/S3services");
const UserServices = require("../services/userservices")

exports.postAddExpense =async(req,res)=>{
    const t = await sequelize.transaction();
    try {
        let amount = req.body.amount;
        let category = req.body.category;
        let description = req.body.description;
        let date = req.body.date;
        let totalExpense = req.user.totalExpense;
        let userId = req.user.id;
        console.log(totalExpense,date,amount)
        if(!totalExpense)
        {
            totalExpense = 0;
        }
        amount = Number.parseInt(amount);
        totalExpense+=amount;
        
        let expense = await Expense.create({
            category,
            description,
            amount,
            date,
            userId,
        },{
            transaction:t
        })
        await User.update({totalExpense},{where:{id:userId},transaction:t});
        await t.commit();
        return res.status(201).json({
            expense,
            message:"Expense Added"
        })

    } catch (error) {
        await t.rollback();
        return res.status(500).json({
            error:"Something Went Wrong"
        })
    }
}
exports.getExpenses = async(req,res)=>{
    try {
        let page = Number.parseInt(req.query.page) || 1;
        let itemPerPage = Number.parseInt(req.query.item) || 4;
        let totalExpenses = await Expense.count({where:{userId:req.user.id}})
        console.log(totalExpenses)
        let expenses = await Expense.findAll({
            where:
            {
                userId:req.user.id,
            },
            offset: (page-1)*itemPerPage,
            limit:itemPerPage
        });
        res.status(201).json({
            expenses:expenses,
            currentPage:page,
            hasPreviousPage: page>1,
            hasNextPage: (page*itemPerPage)<totalExpenses,
            nextPage: page+1,
            previousPage: page-1,
            lastPage:Math.ceil(totalExpenses/itemPerPage),
        })
    } catch (error) {
        return res.status(500).json({
            error:"Something Went Wrong !"
        })
    }
}
exports.deleteExpense = async(req,res)=>{
    let userId = req.user.id;
    let totalExpense = req.user.totalExpense;
    const t = await sequelize.transaction();
    try {
        if(!totalExpense)
        {
            return res.status(404).json({
                error:"Can't Delete the Expense!"
            })
        }
        let id = req.params.id;
        let expense = await Expense.findByPk(id);
        let amount = Number.parseInt(expense.amount);
        totalExpense -= amount;
        await Expense.destroy({where:{id,userId},transaction:t})
        await User.update({totalExpense},{where:{id:userId},transaction:t})
        t.commit();
        res.status(201).json({
            message:"Expense Deleted!"
        })
    } catch (error) {
        await t.rollback();
        return res.status(500).json({
            error:"Something Went Wrong !"
        })
    }
}
exports.downloadExpenses = async(req,res)=>{
    let t = await sequelize.transaction();
    try {
        let userId = req.user.id;
        const expenses = await UserServices.getExpenses(req)
        const expense = await req.user.getExpenses();
        const stringfyExpense = JSON.stringify(expense);
        let currDate = new Date();
        currDate = `${currDate.getFullYear()}_${currDate.toLocaleString('default', { month: 'long' })}_${currDate.getDate()}_${currDate.getHours()}_${currDate.getMinutes()}`
        const filename = `expense${userId}/${currDate}_${req.user.username}.txt`;
        const fileUrl = await S3Services.uploadToS3(stringfyExpense,filename);
        await DownloadFiles.create({
            url:fileUrl,
            Date:currDate,
            userId,
        },{transaction:t})
        t.commit();
        return res.status(201).json({
            fileUrl,
            filename
        })
    } catch (error) {
        t.rollback();
        return res.status(500).json({
            error:"Something Went Wrong !"
        })
    }
}
exports.DownloadedFiles = async(req,res)=>{
    try {
        console.log("woringsdof")
        let userId = req.user.id;
        let files = await DownloadFiles.findAll({where:{
            userId
        }})
        res.status(201).json({
            files
        })
        
    } catch (error) {
        return res.status(500).json({
            error:"Something Went Wrong In while fetching downloaded files !"
        })
    }
}