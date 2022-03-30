const bcrypt=require('bcryptjs')
const User=require('../db/models/user')

const reg_mid=async function(req,res,next){
    const user=this
    const usp=req.body.password
    const hashedPassword=await bcrypt.hash(usp,8)
    
    await User.findByIdAndUpdate(user._id,{$set:{password:hashedPassword}})
    next()
}

module.exports=reg_mid