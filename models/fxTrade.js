const mongoose=require('mongoose')
const fxTradeSchema=({
 email:{type:String},//
 symbol:{type:String},//s
 clientOrderId:{type:String},//c
 side:{type:String},//S
 type:{type:String},//o
 timeInForce:{type:String},//f
 origQty:{type:String},//q
 originalPrice:{type:String},//p
 avgPrice:{type:String},//ap
 stopPrice:{type:String},//sp
 executionType:{type:String},//x
 orderStatus:{type:String},//X
 orderId:{type:Number},//i
 executedQty:{type:String},//z
 commissionAsset:{type:String},//N
 commission:{type:String},//n
 tradeTime:{type:Number},//T
 tradeId:{type:Number},//t
 makerSide:{type:Boolean},//m
 reduceOnly:{type:Boolean},//R
 stopPriceWorkingType:{type:String},//wt
 originalOrderType:{type:String},//ot
 positionSide:{type:String},//ps
 closeAll:{type:Boolean},//cp
 activatePrice:{type:String},//AP
 callbackRate:{type:String},//cr
 realizedProfit:{type:String}//rp
})
const FxTrade=mongoose.model('FxTrade',fxTradeSchema)
module.exports=FxTrade
