const bcrypt=require('bcryptjs')

const Pass=require('../db/models/passes')

const userupdate=async function(req,res,next){
    if(!req.body.password){
        next()
    }
    try{
    const password=req.body.password
    if(password.length<7||password.includes('password')){
        throw new Error()
    }
    const id=req.user._id
    
    const pass=await Pass.findOneAndUpdate({owner:req.user._id,Account:'password vault'},{$set:{password:password}},{new:true,runValidators:true})
   

    req.body.password=await bcrypt.hash(req.body.password,8)
    
    next()
    }catch(error){
        res.status(400).send({Error:"Please choose a valid password"})
    }

}

module.exports=userupdate