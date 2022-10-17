const mongoose=require('mongoose')
const tradePnlSchema=mongoose.Schema({
 email:{type:String},
 t:{type:Number},//trade id
 pnlWc:{type:Number},//pnl without comission
 pnl:{type:Number}//pnl for perticular trade
})
const TradePnl=mongoose.model('TradePnl',tradePnlSchema)
module.exports=TradePnl