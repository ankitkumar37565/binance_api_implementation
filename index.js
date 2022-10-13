const express=require('express')
const app=express()
const port=process.env.PORT||3021
const router=require('./routers/router')
const cookieParser=require('cookie-parser')
require('dotenv').config({path:__dirname+'/config/.env'})
require('./config/db')
// const fxPayload=require('./controllers/fxPayload')
// fxPayload()

app.use(express.json())
app.use(cookieParser())
app.use(function(err,req,res,next){
 console.log(err);
 return res.status(500).send({success:false,message:'Something Went Wrong Please Check Console'})
})
app.use(router)
app.listen(port,()=>{
 console.log(`app listening on port:${port}`)
})