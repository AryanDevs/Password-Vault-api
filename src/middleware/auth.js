const jwt=require('jsonwebtoken')
const User = require('../db/models/user')

const auth=async(req,res,next)=>{
    try{
    const tk=req.headers['authorization'].split(' ')[1]
    

    const payload=await jwt.verify(tk,process.env.JWT_SECRET)
    

    const id=payload._id
    const user=await User.findOne({_id:id,tokens:tk})
    if(!user){
        throw new Error()
    }

    req.user=user
    req.token=tk
    next()
}catch(err){
    res.status(400).send({Error:"Please Authenticate"})
}
}



module.exports=auth