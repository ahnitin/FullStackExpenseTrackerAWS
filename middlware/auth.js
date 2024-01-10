const User = require("../models/user")
const jwt = require("jsonwebtoken");
exports.authenticate = async(req,res,next)=>{
    try {
        const token = req.header("Authorization");
        const user = jwt.verify(token,process.env.SECRET_KEY);
        if(!user)
        {
            throw new Error("Invalid Token");
        }
        let U = await User.findByPk(user.id)
        req.user = U;
        next();
    } catch (error) {
        res.status(500).json({
            error:"Something WEnt WrOnG"
        })
    }
    
}