const WS = require("ws");
const path = require("path");
const listen_key =
  "md4uxNlefFBLoze9xp2T6kREwoPy90Z74j83RhhiT2Scd6tBLNQHUWicfzlWW9Cs";
require("dotenv").config({ path: path.join(__dirname, "../config/.env") });
const BASE = process.env.TESTNET_FX_WEBSOCKET_BASE_URL;
const FxWallet=require("../models/fxWallet");
const FxOpenOrder = require("../models/fxOpenOrder");
const FxTrade = require("../models/fxTrade");
const PositionLog = require("../models/positionLog");
const Wallet=require('../models/wallet')
const TradePnl=require('../models/tradePnl')
const User=require('../models/user')
const email = "ankit@nextazy.com";
const controller=require('./controller')

let marketPrice=[]
let marketPriceWs=async function(){
const ws=new WS(BASE+'/ws/btcusdt@markPrice')
console.log('marketPrice stream started',Date.now())
ws.on('message',async function(data){
  // console.log(JSON.parse(data.toString()))
 let parsedData=JSON.parse(data)
 marketPrice=parsedData
//  console.log(marketPrice)
})
ws.on('ping',async function(){
 ws.pong()
})
ws.on('error',async function(e){
console.log('error in marketPrice stream\n',e)
})
ws.on('disconnected',async function(){
 console.log('marketPrice stream disconnected')
})
ws.on('close',async function(){
 console.log('marketPrice stream closed')
 marketPriceWs()
})
}
marketPriceWs()

const fxPayload = async function () {
  try {
    const ws = new WS(BASE + `/ws/${listen_key}`);
    console.log("payload stream listening", Date.now());
    ws.on("message", async function (data) {
      data = await JSON.parse(data);
      if (data && data.e == "ACCOUNT_UPDATE") {
        console.log(
          "balance and position update not include unfilled or cancelled order"
        );
        console.log(data)
       let fxWallet=await FxWallet.findOne({email:email})

      //  data.a.B.foreach((asset)=>{
      //   fxWallet.balance[0]=asset
      //  })
      // fxWallet.balance[0].walletBalance=data.a.B[0].wb
      // fxWallet.balance[0].crosswalletBalance=data.a.B[0].cw
      fxWallet.balance[0]={
        'asset':data.a.B[0].a,
        'walletBalance':data.a.B[0].wb,
        'crossWalletBalance':data.a.B[0].wb
      }
      await fxWallet.save()
      }
      if (data && data.e == "ORDER_TRADE_UPDATE") {
        console.log("new order created");
        console.log(data)
        let payload = { email: email, ...data.o }//this is payload data

        if(data.o.X!=='NEW'||data.o.X!=='PARTIALLY_FILLED'){
         await new PositionLog(payload).save()
        }


        if(data.o.X=='FILLED'){
        let user=await User.findOne({email:email})
        // let req={};req.user=user;let res={}
        let accInfo=await controller.accountInformation(user)
         await FxOpenOrder.findOneAndDelete({email:email,i:data.o.i})
         let tradePresent=await FxTrade.findOne({email:email,symbol:data.o.s,positionSide:data.o.ps})
         if(tradePresent){
          if(tradePresent.side==data.o.S){
           let trade=tradePresent
           tradePresent.executedQty=(parseFloat(trade.executedQty)+parseFloat(data.o.z)).toString()
           // tradePresent.avgPrice=(((parseFloat(trade.avgPrice)*parseFloat(trade.executedQty))+(parseFloat(data.o.ap)*parseFloat(data.o.z)))/(parseFloat(trade.executedQty)+parseFloat(data.o.z))).toString()
           await tradePresent.save()
          }else{
           //now trade side is opposite so pnl will will be created
           let tradeQty=parseFloat(tradePresent.executedQty)
           let dataQty=parseFloat(data.o.z)
           let sellPrice=data.o.S=='SELL'?parseFloat(data.o.ap):parseFloat(tradePresent.avgPrice)
           let buyPrice=data.o.S=='BUY'?parseFloat(data.o.ap):parseFloat(tradePresent.avgPrice)
           if(tradeQty>dataQty){ 
            
            let pnlWc=(dataQty*(sellPrice-buyPrice))
            let pnl=pnlWc-(parseFloat(tradePresent.commission)+parseFloat(data.o.n))
            await new TradePnl({email:email,t:data.o.t,pnlWc:pnlWc,pnl:pnl}).save()
            
            tradePresent.executedQty=(tradeQty-dataQty).toString()
            await tradePresent.save()
           }else if(tradeQty==dataQty){

            let pnlWc=(dataQty*(sellPrice-buyPrice))
            let pnl=pnlWc-(parseFloat(tradePresent.commission)+parseFloat(data.o.n))
            await new TradePnl({email:email,t:data.o.t,pnlWc:pnlWc,pnl:pnl}).save()

            await FxTrade.findOneAndDelete({email:email,orderId:tradePresent.orderId})
           }else{

            let pnlWc=(tradeQty*(sellPrice-buyPrice))
            let pnl=pnlWc-(parseFloat(tradePresent.commission)+parseFloat(data.o.n))
            await new TradePnl({email:email,t:data.o.t,pnlWc:pnlWc,pnl:pnl}).save()

            tradePresent.executedQty=(dataQty-tradeQty).toString()
            tradePresent.side=data.o.S
            await tradePresent.save()
           }

          }

         }
         else{await new FxTrade({
          email:email,
          symbol:data.o.s,
          clientOrderId:data.o.c,
          side:data.o.S,
          type:data.o.o,
          timeInForce:data.o.f,
          origQty:data.o.q,
          originalPrice:data.o.p,
          avgPrice:data.o.ap,
          stopPrice:data.o.sp,
          executionType:data.o.X,
          orderStatus:data.o.X,
          orderId:data.o.i,
          executedQty:data.o.z,
          commissionAsset:data.o.N,
          commission:data.o.n,
          tradeTime:data.o.T,
          tradeId:data.o.t,
          makerSide:data.o.m,
          reduceOnly:data.o.R,
          stopPriceWorkingType:data.o.wt,
          originalOrderType:data.o.ot,
          positionSide:data.o.ps,
          closeAll:data.o.cp,
          activatePrice:data.o.AP,
          callbackRate:data.o.cr,
          realizedProfit:data.o.rp
         }).save()}
        }



        else if(data.o.X=='NEW'){
          let trade=await FxOpenOrder.findOne({email:email,S:data.o.S,ps:data.o.ps,ap:data.o.ap})
          // if(trade){
          //     trade.q=(parseFloat(trade.z)+parseFloat(data.o.z)).toString()
          //     await trade.save()
          // }
          // else{

          //   await new FxOpenOrder(payload).save()
          // }
            await new FxOpenOrder(payload).save()
        }



        else if(data.o.X=='CANCELED'|| data.o.X=='EXPIRED'){
         await deleteOpenOrder(data.o.i)
        }



      }
    });
    ws.on("ping", () => {
      ws.pong();
    });
    ws.on("error", async function (e) {
      console.log("error in payload stream connection\n", e);
    });
    ws.on("disconnected", async function () {
      console.log("payload stream disconnected");
    });
    ws.on("close", async function () {
      console.log("payload stream closed");
    });
  } catch (e) {
    console.log("error in fx payload\n");
  }
};
// fxPayload()
const deleteOpenOrder = async function (i) {
  try {
    await FxOpenOrder.deleteOne({ email: email, i: i });
  } catch (e) {
    console.log("error in deleting open order\n", e);
  }
};

module.exports = fxPayload;
