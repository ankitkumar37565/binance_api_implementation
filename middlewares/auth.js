const jwt=require('jsonwebtoken')
const User=require('../models/user')

const auth=async function(req,res,next){
try{let token=req.cookies.user
let decoded=jwt.verify(token,'secret')
let user=await User.findOne({_id:decoded._id})
if(user){
 if(decoded.exp>Date.now()){
  req.user=user;
  return next()
 }
}
return res.status(400).send({success:false,message:'Authentication Failed'})}
catch(e){
 console.log(e)
 return res.status(500).send({success:false,message:'Please Login First'})
}
}
module.exports=auth