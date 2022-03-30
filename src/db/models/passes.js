const mongoose=require('mongoose')
const passschema=new mongoose.Schema({
    Account:{
        type:String,
        required:true,
        trim:true,
        lowercase:true
    },
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }

})

const Pass=mongoose.model('Pass',passschema)
module.exports=Pass