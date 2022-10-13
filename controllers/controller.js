const binance_endpoint=require('../binance_endpoint')
const BE=new binance_endpoint()
const crypto=require('../utils/crypto')
const User=require('../models/user')
const fxTrade=require('../models/fxTrade')
const FxWallet=require('../models/fxWallet')
const Wallet=require('../models/wallet')
const bcrypt=require('bcrypt')
const qs=require('qs')
const WS=require('ws')
const path=require('path')
require('dotenv').config({path:path.join(__dirname,'../config/.env')})
const BASE=process.env.TESTNET_FX_WEBSOCKET_BASE_URL

//fx market ticker

let fxCoinData=[]

let fxTickerStart=async function(){
 const ws=new WS(BASE+'/ws/!ticker@arr')
 console.log('Fx Market Ticker Stream Strarted',Date.now())
 ws.on('message',async function(data){
  let coinData=JSON.parse(data)
  fxCoinData=coinData
 })
 ws.on('error',async function(e){
  console.log('Fx Market Ticker Stream Error',Date.now())
  console.log(e)
 })
 ws.on('disconnect',async function(){
  console.log('Fx Market Ticker Stream Error',Date.now())
 })
 ws.on('close',async function(){
  console.log('Fx Market Ticker Stream Closed',Date.now())
  fxTickerStart()
 })
}
fxTickerStart();

//individual ticker

let currentPrice=[]
let currentPriceWs=async function(){
const ws=new WS(BASE+'/ws/btcusdt'+'@ticker')
console.log('individual ticker stream started',Date.now())
ws.on('message',async function(data){
 let parsedData=JSON.parse(data)
 currentPrice=parsedData
})
ws.on('error',async function(e){
console.log('error in individual ticker stream\n',e)
})
ws.on('disconnected',async function(){
 console.log('individual ticker stream disconnected')
})
ws.on('close',async function(){
 console.log('individual ticker stream closed')
 currentPriceWs()
})
}
currentPriceWs()


//user controllers
exports.register=async function(req,res){
 let user=new User(req.body)
 user.apiKey=req.body.apiKey
 user.apiSecret=req.body.apiSecret
 await user.save()
 let wallet=new Wallet({email:req.body.email})
 await wallet.save()
 let fxWallet=new FxWallet({email:req.body.email})
 await fxWallet.save()
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
console.log('------------------------------------')
if(result.status==200 && result.data){
let wallet=await Wallet.findOne({email:req.user.email})
// if(!wallet){await new Wallet({email:req.user.email}).save()}
let keys=Object.keys(result.data)
keys=keys.filter((k)=>{
 if(k!='positions' && k!='assets')
{return k}
})
keys.forEach((key)=>{
 wallet[key]=result.data[key]
})
let assets=result.data.assets
assets=assets.filter((v)=>{
 if(parseFloat(v.walletBalance)>0){return v}
})
wallet.assets=assets
let positions=result.data.positions
positions=positions.filter((position)=>{
 if(parseFloat(position.positionAmt)>0){
  return position
 }
})
wallet.positions=positions
await wallet.save()
return res.status(result.status).send(result.data)
}}
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
exports.getAccountBalanceDb=async function(req,res){
// await accountInformation(req,res)
let wallet=await Wallet.findOne({email:req.user.email})
// var result={}
// await wallet.assets.forEach((v)=>{
// result[v.asset]=v.walletBalance
// })
return res.status(200).send({success:true,message:'account balance fetched successfully',data:wallet})
}
exports.openPosition=async function(req,res){
await accountInformation(req,res)
let wallet=await Wallet.findOne({email:req.user.email})
result=wallet.positions
return res.status(200).send({success:true,message:'all open positions fetched',data:result})
}
exports.tradeHistory=async function(req,res){
let trade=await Trade.find({}).sort({updateTime:-1})
return res.status(200).send({success:true,message:'Trade History Fetched',data:trade})
}
exports.getFxAccountBalanceDb=async function(req,res){
 let fxWallet=await FxWallet.findOne({email:req.user.email})
 return res.status(200).send({success:true,message:'fxAccount Balance Fetched',data:fxWallet})
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
//check if opposite side trade avail in db if yes then 
//
if(result.status==200 && result.data){
 let trade=await fxTrade.findOne({email:req.user.email,symbol:req.body.symbol})
 if(trade){
  console.log('------------------------------------')
  let oppositeTradeSide=(req.body.side=='BUY')?'SELL':'BUY'
  if(trade.side==oppositeTradeSide){
   if(trade.origQty<result.data.origQty){
    trade.side=result.data.side
    trade.origQty=(parseFloat(result.data.origQty)-parseFloat(trade.origQty)).toString()
    await trade.save()
   }
   else if(trade.origQty>result.data.origQty){
    trade.origQty=(parseFloat(trade.origQty)-parseFloat(result.data.origQty)).toString()
    await trade.save()
   }
   else{await fxTrade.findOneAndDelete({clientOrderId:trade.clientOrderId})}
  }
  else{
   trade.origQty=(parseFloat(trade.origQty)+parseFloat(result.data.origQty)).toString()
   await trade.save()
  }
 }
 else{
 let trade=new fxTrade({email:req.user.email,...result.data})
 await trade.save()
}
return res.status(result.status).send(result.data)
}
return res.status(200).send({success:false,message:'Order failed'})
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
exports.postListenKey=async function(req,res){
let key=req.user.apiKey
let result=await BE.startUserDataStream(key)
process.env.LISTEN_KEY=result.data.listenKey
console.log('listen key--->',process.env.LISTEN_KEY)
return res.status(result.status).send(result.data)
}
exports.putListenKey=async function(req,res){
 let key=req.user.apiKey
 let result=await BE.keepAliveUserDataStream(key)
 return res.status(result.status).send(result.data)
}
exports.deleteListenKey=async function(req,res){
 let key=req.user.apiKey
 let result=await BE.closeUserDataStream(key)
 return res.status(result.status).send(result.data)
}