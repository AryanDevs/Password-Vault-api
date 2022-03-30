const express=require('express')
const User=require('../db/models/user')
const Pass=require('../db/models/passes')
const auth=require('../middleware/auth')
const bcrypt=require('bcryptjs')
const userupdate = require('../middleware/userupdate')
const sendmail=require('../utils/email')
require('../db/mongoose')
const router=new express.Router()

router.get('/testuser',(req,res)=>{
    res.send('User is working fine')
})

router.post('/register',async(req,res,next)=>{
    try{
    const user=new User(req.body)
    await user.save();
    const pass=new Pass({Account:"Password Vault",username:user.email,password:user.password,owner:user._id.toString()})
    await pass.save()

    await user.giveAccess()
    user.password=await bcrypt.hash(user.password,8)
    await user.save()

    const to=user.email
    const subject='Welcome to Password Vault'
    const text=`Hi ${user.name}! \nA very warm welcome from Password Vault! \nThis is a one stop solution for securely storing all your passwords\nFor your convinence your Password Valut password has already been added securely in your vault. `

     await sendmail(to,subject,text)
    
    res.status(201).send({user})
    
    }catch(e){
        res.status(400).send(e)
    }
})

router.post('/login',async(req,res)=>{
    if(!req.body.email||!req.body.password){
        return res.status(400).send("Please enter credentials")
    }
    try {
        const user=await User.findByCredential(req.body.email,req.body.password)
        await user.giveAccess()
        const l=user.tokens.length
        res.status(200).send({user:user})
    } catch (e) {
        res.status(400).send(e)
    }
})



router.get('/viewpasses',auth,async(req,res)=>{
   try {
       const user=req.user
       await user.populate('passes')
       res.send({'My passwords':user.passes})
   } catch (error) {
       res.status(500).send()
   }
})

router.patch('/update',auth,userupdate,async(req,res)=>{
    try{
    const allowedUpdates=['name','email','password']
    const userupdates=Object.keys(req.body)
    const valid=userupdates.every((update)=>allowedUpdates.includes(update))
    if(!valid){
        throw new Error()
    }
    const user=await User.findByIdAndUpdate(req.user._id,req.body,{new:true,runValidators:true})
    res.status(200).send(user)
    }catch(err){
        res.status(400).send({error:"Invalid upadtes"})
    }
})

router.get('/logout',auth,async(req,res)=>{
    const user=req.user;
    const tk=req.token;
    try {
        const validtokens=user.tokens.filter((token)=>token!==tk)
        user.tokens=validtokens
        await user.save()
        res.status(200).send("Logged Out")
    } catch (error) {
        res.status(500).send()
    }
})

router.get('/logoutall',auth,async(req,res)=>{
    try {
        await User.findByIdAndUpdate(req.user._id,{$unset:{tokens:''}})
        res.status(200).send('Logged out of all devices!')
    } catch (error) {
        res.status(500).send()
    }
})

router.delete('/delete',auth,async(req,res)=>{
    try {
        await User.findByIdAndDelete(req.user._id)
        await Pass.deleteMany({owner:req.user._id})

        const to=req.user.email
        const subject='Thank You for using Password Vault'
        const text=`Hi ${req.user.name}! \nWe just noticed that you deleted your account.\nWe hope you had a fine experience using Password Vault.\nWe would love to have your feedback. `

        await sendmail(to,subject,text)
        res.status(200).send(req.user)
    } catch (error) {
        res.status(500).send()
    }
})

module.exports=router