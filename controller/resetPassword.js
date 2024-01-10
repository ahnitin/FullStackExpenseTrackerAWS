require('dotenv').config();
const User = require("../models/user");
const Sib = require("sib-api-v3-sdk");
const uuid = require("uuid");
const bcrypt = require("bcrypt")
const Forgotpassword = require("../models/forgotpassword");
const client = Sib.ApiClient.instance;
const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.SIB_API_KEY;
const path = require("path")


exports.ForgetPassword = async (req, res, next) => {
    try{
    const email = req.body.email;
    console.log(email);

    const user = await User.findOne({ where: {email} });

    if (user) {

        const id = uuid.v4();
        await user.createForgotpassword({id, active:true})
        const apiInstance = new Sib.TransactionalEmailsApi();
        console.log("working")
            const sendEmail = await apiInstance.sendTransacEmail({
                sender : {"email": "nitinahuja240@gmail.com"},
                to: [{"email": req.body.email}],
                subject: "Reset Your Expense Tracker Password",
                textContent:"Expense Tracker will help to cover your day-to-day expenses.",
                htmlContent: `<a href="http://184.73.55.18:3000/password/resetpassword/${id}">Reset password</a>`,
            })
    }
}
    catch (error) {
        console.log(error)
    }
};

exports.resetPassword = async(req,res,next)=>{
    try {
        const id  = req.params.id;
        console.log(id);
        let forgotpasswordrequest = Forgotpassword.findOne({where:{id, active:true}})
        if(forgotpasswordrequest)
        {
            console.log(forgotpasswordrequest.active,"here is active")
            Forgotpassword.update({active:false},{where:{id}});
            res.status(200).send(`  <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>

                                    <form action="/password/updatepassword/${id}" method="post">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required>
                                        <input name='resetpasswordid' type='hidden' value='${id}'>
                                        <button>reset password</button>
                                    </form>`
                                )
        res.end();

        }
        
    } catch (error) {
        console.log(error);
    }
    
}

exports.updatePassword = async(req,res,next)=>{

    try {
        const newpassword = req.body.newpassword;
        const resetpasswordid =  req.body.resetpasswordid;
        console.log(newpassword,resetpasswordid);

        let resetpasswordrequest = await Forgotpassword.findByPk(resetpasswordid);
        let user = User.findOne({where:{id:resetpasswordrequest.userId}})
        if(user)
        {
            const saltrounds = 10;
            bcrypt.genSalt(saltrounds,(err,salt)=>{
                if(err)
                {
                    console.log(err);
                    throw new Error(err);
                }
                bcrypt.hash(newpassword,salt,(err,hash)=>{
                    if(err)
                    {
                        console.log(err);
                        throw new Error(err)
                    }
                    User.update({password:hash},{where:{id:resetpasswordrequest.userId}}).then(()=>{
                        //res.sendStatus(201).json({message:'Successful Update new Password'})
                    })
                    res.status(200).send(`<h1>Password Changed Successfully </h1> 
                    <a href="../../login.html">login</a>
                    `)
                })
            })
        }
        else{
            res.send(404).json({error:"No user Exists",success:false})
        }

    } catch (error) {
        console.log(error)
        return res.status(403).json({ error, success: false } )
    }
}

