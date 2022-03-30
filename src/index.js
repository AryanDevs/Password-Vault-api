const express=require('express')
const app=express()
const userrouter=require('./Routers/user')
const passrouter=require('./Routers/passes')
const PORT=process.env.PORT
app.use(express.json())
app.use(userrouter)
app.use(passrouter)


app.listen(PORT,()=>{
    console.log(`The server is running on port ${PORT}`)
})
