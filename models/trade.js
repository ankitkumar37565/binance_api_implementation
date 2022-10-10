const mongoose=require('mongoose')
const orderSchema=mongoose.Schema({
 clientOrderId:{type:String},
 cumQty:{type:String},
 cumQuote:{type:String},
 executedQty:{type:String},
 orderId:{type:Number},
 avgPrice:{type:String},
 origQty:{type:String},
 price:{type:String},
 reduceOnly:{type:Boolean},
 side:{type:String},
 positionSide:{type:String},
 status:{type:String},
 stopPrice:{type:String},
 closePosition:{type:Boolean},
 symbol:{type:String},
 timeInForce:{type:String},
 type:{type:String},
 origType:{type:String},
 activatePrice:{type:String},
 priceRate:{type:String},
 updateTime:{type:Number},
 workingType:{type:String},
 priceProtect:{type:Boolean}
})
const tradeSchema=mongoose.Schema({
 email:{
  type:String,
  required:true,
  unique:true
 },
 trades:[orderSchema],
})
const Trade=mongoose.model('Trade',tradeSchema)
module.exports=Trade