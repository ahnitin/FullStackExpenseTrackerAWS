const AWS = require("aws-sdk");

const uploadToS3 = async(stringifyExpense,filename)=>
{
    const BUCKET_NAME = 'expensetracker240';
    let obj ={
        key:process.env.IAM_USER_KEY,
        Secret:process.env.IAM_USER_SECRET,
    }
    console.log(process.env.IAM_USER_KEY,"ye dekho key")
    const IAM_USER_KEY = obj.key;
    const IAM_USER_SECRET = obj.Secret;

    let s3bucket = new AWS.S3({
        accessKeyId:IAM_USER_KEY,
        secretAccessKey:IAM_USER_SECRET,
        Bucket:BUCKET_NAME,
    })
        var params ={
            Bucket: BUCKET_NAME,
            Key: filename,
            Body: stringifyExpense,
            ACL: 'public-read',

        }
        console.log('Stringified Expense:', stringifyExpense);
        console.log('Filename:', filename);
        return new Promise((resolve,reject)=>{
            s3bucket.upload(params,(err,data)=>{
                if(err)
                {
                    reject("something went wrong"+err)
                }
                else{
                    console.log("Success",data);
                    resolve(data.Location)
                }
            })
        })
        
}

module.exports ={
    uploadToS3,
}