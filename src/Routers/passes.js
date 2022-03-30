const express=require('express')
const Pass = require('../db/models/passes')
const auth = require('../middleware/auth')
const router=new express.Router()


router.get('/pass/add',auth,async(req,res)=>{
    try {
        const pass=new Pass({...req.body,owner:req.user._id})
        await pass.save()
        res.status(201).send(pass)
    } catch (error) {
        res.status(500).send()
    }
})

router.patch('/pass/update/:id',auth,async(req,res)=>{
    const allowedUpdates=['Account','username','password']
    const userupdates=Object.keys(req.body)
    const valid=userupdates.every((update)=>allowedUpdates.includes(update))
    if(!valid){
        return res.status(400).send("Invalid upadtes")
    }
    try {
        const pass=await Pass.findOneAndUpdate({_id:req.params.id},req.body,{new:true,runValidators:true})
        res.status(200).send(pass)
    } catch (error) {
        res.status(400).send("Update failed")
    }
})

router.delete('/pass/:id',auth,async(req,res)=>{
    try {
        const pass=await Pass.findById(req.params.id)
        if(!pass){
            throw new Error('Password not found')
        }
        await Pass.findByIdAndDelete(req.params.id)
        res.status(200).send(pass)
    } catch (error) {
        res.status(400).send(e)
    }
})
module.exports=router