const WS = require("ws");
const path = require("path");
const listen_key =
  "";
require("dotenv").config({ path: path.join(__dirname, "../config/.env") });
const BASE = process.env.TESTNET_FX_WEBSOCKET_BASE_URL;
const FxWallet=require("../models/fxWallet");
const FxOpenOrder = require("../models/fxOpenOrder");
const FxTrade = require("../models/fxTrade");
const PositionLog = require("../models/positionLog");
const Wallet=require('../models/wallet')
const email = "ankit@nextazy.com";


let marketPrice=[]
let marketPriceWs=async function(){
const ws=new WS(BASE+'/ws/btcusdt@markPrice@1s')
console.log('marketPrice stream started',Date.now())
ws.on('message',async function(data){
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
        // console.log(data)
        await FxWallet.updateOne(
          { email: email, "balance.asset": data.a.B[0].a },
          {
            $set: {
              "balance.$.walletBalance": data.a.B[0].wb,
              "balance.$.crossWalletBalance": data.a.B[0].cw,
            },
          }
        );
      }
      if (data && data.e == "ORDER_TRADE_UPDATE") {
        console.log("new order created");
        // console.log(data)
        let payload = { email: email, ...data.o }//this is payload data

        if(data.o.X!=='NEW'||data.o.X!=='PARTIALLY_FILLED'){
         await new PositionLog(payload).save()
        }


        if(data.o.X=='FILLED'){
         await FxOpenOrder.findOneAndDelete({email:email,i:data.o.i})
         let tradePresent=await FxTrade.findOne({email:email,symbol:data.o.s,positionSide:data.o.ps})
         if(tradePresent){
          if(tradePresent.side==data.o.S){
           let trade=tradePresent
           tradePresent.executedQty=(parseFloat(trade.executedQty)+parseFloat(data.o.z)).toString()
           // tradePresent.avgPrice=(((parseFloat(trade.avgPrice)*parseFloat(trade.executedQty))+(parseFloat(data.o.ap)*parseFloat(data.o.z)))/(parseFloat(trade.executedQty)+parseFloat(data.o.z))).toString()
           await tradePresent.save()
          }else{
           //now trade side is opposite so subtract
           let tradeQty=parseFloat(tradePresent.executedQty)
           let dataQty=parseFloat(data.o.z)
           if(tradeQty>dataQty){
            tradePresent.executedQty=(tradeQty-dataQty).toString()
            await tradePresent.save()
           }else if(tradeQty==dataQty){
            await FxTrade.findOneAndDelete({email:email,orderId:tradePresent.orderId})
           }else{
            tradePresent.executedQty=(dataQty-tradeQty).toString()
            tradePresent.side=data.o.S
            await tradePresent.save()
           }

          }

         }
         else{await new FxTrade({
          email:email,
 clientOrderId:data.o.c,
 executedQty:data.o.z,
 orderId:data.o.i,
 avgPrice:data.o.ap,
 origQty:data.o.q,
 price:data.o.p,
 reduceOnly:data.o.R,
 side:data.o.S,
 positionSide:data.o.ps,
 status:data.o.X,
 stopPrice:data.o.sp,
 closePosition:data.o.cp,
 symbol:data.o.s,
 timeInForce:data.o.f,
 type:data.o.o,
 updateTime:data.T,
         }).save()}
        }



        else if(data.o.X=='NEW'){
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
