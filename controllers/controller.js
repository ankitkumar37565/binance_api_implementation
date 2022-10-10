const binance_endpoint=require('../binance_endpoint')
const BE=new binance_endpoint()
const crypto=require('../utils/crypto')
const User=require('../models/user')
const Trade=require('../models/trade')
const Wallet=require('../models/wallet')
const bcrypt=require('bcrypt')
const qs=require('qs')

//user controllers
exports.register=async function(req,res){
 let user=new User(req.body)
 user.apiKey=req.body.apiKey
 user.apiSecret=req.body.apiSecret
 await user.save()
 let wallet=new Wallet({email:req.body.email})
 await wallet.save()
 return res.status(200).send({success:true,message:'User Successfully Registered',data:user})
}
exports.login=async function(req,res){
 let user=await User.findOne({email:req.body.email})
 if(user){
  let match=await bcrypt.compare(req.body.password,user.password)
  if(!match){return res.status(200).send({success:false,message:'Password Mismatch'})}
  let token=await user.generateAuthToken(user._id)
  return res.cookie('user',token,{maxAge:1000*60*60*24,httpOnly:false}).status(200).send({success:true,message:'Successfully Logged In',data:user})
 }
 return res.status(200).send({success:false,message:'User Not Found'})
}
exports.logout=async function(req,res){
 res.clearCookie('user')
 res.status(200).send({success:true,message:'Logged Out'})
}

//account controllers
exports.accountInformation=async function(req,res){
let data={}
data.timestamp=Date.now()
data=qs.stringify(data)
let key=req.user.apiKey
let secret=req.user.apiSecret
let sig=await crypto.genSig(secret,data)
let result=await BE.accountInformation(data,key,sig)
// let wallet=await Wallet.findOne({email:req.user.email})
// let keys=Object.keys(result.data)
// keys.forEach((key)=>{
//  wallet.key=result.key
// })
return res.status(result.status).send(result.data)
}
exports.getPositionMode=async function(req,res){
 let data={}
 data.timestamp=Date.now()
 data=qs.stringify(data)
 let key=req.user.apiKey
 let secret=req.user.apiSecret
 let sig=await crypto.genSig(secret,data)
 let result=await BE.getPositionMode(data,key,sig)
return res.status(result.status).send(result.data?result.data:result)
}
exports.changePositionMode=async function(req,res){
let data={dualSidePosition:req.body.dualSidePosition}
data.timestamp=Date.now()
data=qs.stringify(data)
let key=req.user.apiKey
let secret=req.user.apiSecret
let sig=await crypto.genSig(secret,data)
let result=await BE.changePositionMode(data,key,sig)
return res.status(result.status).send(result.data)
}
exports.changeInitialLeverage=async function(req,res){
let data={symbol:req.body.symbol,leverage:req.body.leverage}
data.timestamp=Date.now()
data=qs.stringify(data)
let key=req.user.apiKey
let secret=req.user.apiSecret
let sig=await crypto.genSig(secret,data)
let result=await BE.changeInitialLeverage(data,key,sig)
return res.status(result.status).send(result.data)
}
exports.changeMarginType=async function(req,res){
let data={symbol:req.body.symbol,marginType:req.body.marginType}
data.timestamp=Date.now()
data=qs.stringify(data)
let key=req.user.apiKey
let secret=req.user.apiSecret
let sig=await crypto.genSig(secret,data)
let result=await BE.changeMarginType(data,key,sig)
return res.status(result.status).send(result.data)
}

//trade controllers
exports.createOrder=async function(req,res){
let data=req.body
data.timestamp=Date.now()
data=qs.stringify(data)
let key=req.user.apiKey
let secret=req.user.apiSecret
let sig=await crypto.genSig(secret,data)
let result=await BE.createOrder(data,key,sig)
return res.status(result.status).send(result.data)
}
exports.queryOrder=async function(req,res){
data={symbol:req.body.symbol,orderId:req.body.orderId}
data.timestamp=Date.now()
data=qs.stringify(data)
let key=req.user.apiKey
let secret=req.user.apiSecret
let sig=await crypto.genSig(secret,data)
let result=await BE.queryOrder(data,key,sig)
return res.status(result.status).send(result.data)
}
exports.cancelOrder=async function(req,res){
data={symbol:req.body.symbol,orderId:req.body.orderId}
data.timestamp=Date.now()
data=qs.stringify(data)
let key=req.user.apiKey
let secret=req.user.apiSecret
let sig=await crypto.genSig(secret,data)
let result=await BE.cancelOrder(data,key,sig)
return res.status(result.status).send(result.data)
}
exports.cancelAllOrder=async function(req,res){
 data={symbol:req.body.symbol}
 data.timestamp=Date.now()
 data=qs.stringify(data)
 let key=req.user.apiKey
 let secret=req.user.apiSecret
 let sig=await crypto.genSig(secret,data)
 let result=await BE.cancelAllOrder(data,key,sig)
 return res.status(result.status).send(result.data)
}
exports.currentOpenOrder=async function(req,res){
data={symbol:req.body.symbol,orderId:req.body.orderId}
data.timestamp=Date.now()
data=qs.stringify(data)
let key=req.user.apiKey
let secret=req.user.apiSecret
let sig=await crypto.genSig(secret,data)
let result=await BE.currentOpenOrder(data,key,sig)
return res.status(result.status).send(result.data)
}
exports.currentAllOpenOrders=async function(req,res){
 data={symbol:req.body.symbol}
 data.timestamp=Date.now()
 data=qs.stringify(data)
 let key=req.user.apiKey
 let secret=req.user.apiSecret
 let sig=await crypto.genSig(secret,data)
 let result=await BE.currentAllOpenOrders(data,key,sig)
 return res.status(result.status).send(result.data)
}
exports.allOrder=async function(req,res){
data={symbol:req.body.symbol}
data.timestamp=Date.now()
data=qs.stringify(data)
let key=req.user.apiKey
let secret=req.user.apiSecret
let sig=await crypto.genSig(secret,data)
let result=await BE.allOrder(data,key,sig)
return res.status(result.status).send(result.data)
}
exports.modifyIsolatedPositionMargin=async function(req,res){
data=req.body
data.timestamp=Date.now()
data=qs.stringify(data)
let key=req.user.apiKey
let secret=req.user.apiSecret
let sig=await crypto.genSig(secret,data)
let result=await BE.modifyIsolatedPositionMargin(data,key,sig)
return res.status(result.status).send(result.data)
}
exports.currentPositionInformation=async function(req,res){
 let data={}
 data.timestamp=Date.now()
 data=qs.stringify(data)
 let key=req.user.apiKey
 let secret=req.user.apiSecret
 let sig=await crypto.genSig(secret,data)
 let result=await BE.currentPositionInformation(data,key,sig)
 return res.status(result.status).send(result.data)
}
exports.accountTradeList=async function(req,res){
let data={symbol:req.body.symbol}
data.timestamp=Date.now()
data=qs.stringify(data)
let key=req.user.apiKey
let secret=req.user.apiSecret
let sig=await crypto.genSig(secret,data)
let result=await BE.accountTradeList(data,key,sig)
return res.status(result.status).send(result.data)
}