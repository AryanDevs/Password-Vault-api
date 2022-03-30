const mongoose=require('mongoose')
const validator=require('validator')
const jwt=require('jsonwebtoken')

const bcrypt = require('bcryptjs')
const userschema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
        
    },
    email:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isEmail(value))
            {
                throw new Error('Email not valid')
            }
        },
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength:7,
        validate(value){
            if(value.includes('password'))
            {
                throw new Error('invalid password')
            }
        }
    },
    tokens:[{type:String,required:true}]
})

userschema.virtual('passes',{
    localField:'_id',
    foreignField:'owner',
    ref:'Pass'
})

userschema.methods.giveAccess=async function(){
    const user=this
    const tk= jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET,{expiresIn:'7 days'})
    await User.findOneAndUpdate({_id:user._id},{$push:{tokens:tk}})
}
userschema.methods.toJSON=function(){
    const user=this
    const userObj=user.toObject()

    delete userObj.password
    delete userObj._id
    

    return userObj
}

userschema.statics.findByCredential=async function(email,password){
    
        const user=await User.findOne({email:email})
        if(!user)
        {
            throw new Error('Invalid email or password')
        }
        const check=await bcrypt.compare(password,user.password)
        if(!check)
        {
            throw new Error('Invalid email or password')
        }
        return user
    
}

const User=mongoose.model('User',userschema)

module.exports=User