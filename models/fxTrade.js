const mongoose=require('mongoose')
const fxTradeSchema=({
 email:{type:String},
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
const FxTrade=mongoose.model('FxTrade',fxTradeSchema)
module.exports=FxTrade
