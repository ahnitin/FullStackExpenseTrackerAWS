const User = require("../models/user");
const sequelize = require("../connection/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
exports.generateAccessToken = (id,username,ispremium) =>{
    return jwt.sign({id,username,ispremium},process.env.SECRET_KEY)
}

exports.postSignup = async(req,res)=>{
    const t =await sequelize.transaction();
    try {
        let username = req.body.username;
        let email = req.body.email;
        let password = req.body.password;
        console.log("working1")
        let saltrounds = 10;
        const hash = await bcrypt.hash(password,saltrounds);
        console.log(hash,"wkds pp tukta")
        await User.create({
            username,
            email,
            password:hash
        },{
            transaction:t
        })
        await t.commit();
        res.status(201)
        .json({
            success:true,
            message:"User Created Successfully",
        })

    } catch (error) {
        await t.rollback();
        res.status(500)
        .json({
            success:false,
            error: "User Already Exists"
        })
    }
}
exports.postLogin = async(req,res)=>{
    const t =await sequelize.transaction();
    try {
        let email = req.body.email;
        let password = req.body.password;
        let user = await User.findOne(
            {
                where:
                {
                    email
                },
                transaction:t
            });
        if(!user)
        {
            return res.status(404).json({
                error:"User Not found",
            })
        }
        let valid = await bcrypt.compare(password,user.password)
        if(!valid)
        {
            return res.status(401).json({
                error:"Incorrect Password"
            })
        }
        else
        {
            await t.commit();
            return res.status(201).json({
                message:"Logged In Successfully",
                token: exports.generateAccessToken(user.id,user.username,user.ispremium)
            })
        }
    } catch (error) {
        await t.rollback();
        res.status(500)
        .json({
            success:false,
            error: "Something Went Wrong!"
        })
    }
}