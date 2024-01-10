const User = require('../models/user');
const Expense = require('../models/expense');
const sequelize = require('../connection/database');

const getUserLeaderBoard = async (req, res) => {
    try{
        console.log("it's running")
        // const leaderboardofusers = await User.findAll({
        //     attributes: ['id', 'username',[sequelize.fn('sum', sequelize.col('expenses.expenseamount')), 'total_cost'] ],
        //     include: [
        //         {
        //             model: Expense,
        //             attributes: []
        //         }
        //     ],
        //     group:['user.id'],
        //     order:[['total_cost', 'DESC']]

        // })

        const leaderboardofusers = await User.findAll({
            attributes:['id','username','totalExpense'],
            group:['id'],
            order:[['totalExpense','DESC']]
        })
       
        res.status(200).json(leaderboardofusers)
    
} catch (err){
    console.log(err)
    res.status(500).json(err)
}
}

module.exports = {
    getUserLeaderBoard
}