// security={['TRADE','USER_DATA','USER_STREAM','MARKET_DATA']:['KS','KS','K','K']}

const axios=require('axios')
const qs=require('qs')
require('dotenv').config({path:__dirname+'/config/.env'})
const base=process.env.TESTNET_FX_BASE_URL
class binanceEndpoint {
constructor() {}



//ACCOUNT_ENDPOINTS-USER_DATA(key+sig)

//----------------------------------------------
async accountInformation(data, k, s) {
 let requestdata = {
 method: 'GET',
 url: base + "/fapi/v2/account" + "?" + data + "&signature=" + s,
 headers: {
 "X-MBX-APIKEY": k
 }};
 console.log(requestdata.url)
 try{

   const result = await axios(requestdata);
  //  console.log('-----------')
   return result;
  }catch(e){return e.response}
}

//----------------------------------------------
async getPositionMode(data, k, s) {
 let requestdata = {
 method: 'GET',
 url: base + "/fapi/v1/positionSide/dual" + "?" + data + "&signature=" + s,
 headers: {
 "X-MBX-APIKEY": k
 }};
 console.log(requestdata.url)
 try{

   let result = await axios(requestdata);
   return result;
  }catch(e){return e.response}
 }

 //----------------------------------------------
async changePositionMode(data, k, s) {
 let requestdata = {
 method: 'POST',
 url: base + "/fapi/v1/positionSide/dual" + "?" + data + "&signature=" + s,
 headers: {
 "X-MBX-APIKEY": k
 }};
 console.log(requestdata.url)
 try{
  
   const result = await axios(requestdata);
   return result;
  }catch(e){return e.response}
 }
 //----------------------------------------------
 async changeInitialLeverage(data, k, s) {
  let requestdata = {
  method: 'POST',
  url: base + "/fapi/v1/leverage" + "?" + data + "&signature=" + s,
  headers: {
  "X-MBX-APIKEY": k
  }};
  console.log(requestdata.url)
  try{
  
    const result = await axios(requestdata);
    return result;
  }catch(e){return e.response}
  }
  
  //----------------------------------------------
  async changeMarginType(data, k, s) {
  let requestdata = {
  method: 'POST',
  url: base + "/fapi/v1/marginType" + "?" + data + "&signature=" + s,
  headers: {
  "X-MBX-APIKEY": k
  }};
  console.log(requestdata.url)
  try{

    const result = await axios(requestdata);
    console.log(Object.keys(result))
    return result;
  }
  catch(e){
    // console.log('--------')
    // console.log(Object.keys(e))
    // console.log(Object.keys(e.message))
    // console.log(Object.keys(e.name))
    // console.log(Object.keys(e.code))
    // console.log(Object.keys(e.config))
    // console.log(Object.keys(e.request))
    // console.log(Object.keys(e.response))
    // console.log(Object.keys(e.response.data))
    // console.log(e.response.data)
    // console.log(e.response.status)
    // console.log('---------')
    return e.response
  }
  }


//TRADE_ENDPOINTS-TRADE(key+sig)

//----------------------------------------------
async createOrder(data, k, s) {
let requestdata = {
method: 'POST',
url: base + "/fapi/v1/order" + "?" + data + "&signature=" + s,
headers: {
"X-MBX-APIKEY": k
}};
console.log(requestdata.url)
try{
  
  const result = await axios(requestdata);
  return result;
}catch(e){return e.response}
}
//----------------------------------------------
async queryOrder(data, k, s) {
let requestdata = {
method: 'GET',
url: base + "/fapi/v1/order" + "?" + data + "&signature=" + s,
headers: {
"X-MBX-APIKEY": k
}};
console.log(requestdata.url)
try{
  
  const result = await axios(requestdata);
  return result;
}catch(e){return e.response}
}
//----------------------------------------------

async cancelOrder(data, k, s) {
  let requestdata = {
    method: 'DELETE',
    url: base + "/fapi/v1/order" + "?" + data + "&signature=" + s,
    headers: {
      "X-MBX-APIKEY": k
    }};
console.log(requestdata.url)
try{
  
  const result = await axios(requestdata);
  return result;
}catch(e){return e.response}
}
//----------------------------------------------
async cancelAllOrder(data, k, s) {
  let requestdata = {
    method: 'DELETE',
    url: base + "/fapi/v1/allOpenOrders" + "?" + data + "&signature=" + s,
  headers: {
    "X-MBX-APIKEY": k
  }};
  console.log(requestdata.url)
  try{
  
    const result = await axios(requestdata);
    return result;
  }catch(e){return e.response}
}
//----------------------------------------------

async currentOpenOrder(data, k, s) {
  let requestdata = {
    method: 'GET',
    url: base + "/fapi/v1/openOrder" + "?" + data + "&signature=" + s,
    headers: {
      "X-MBX-APIKEY": k
    }};
    console.log(requestdata.url)
    try{
  
      const result = await axios(requestdata);
      return result;
    }catch(e){return e.response}
}
//----------------------------------------------

async currentAllOpenOrders(data, k, s) {
let requestdata = {
  method: 'GET',
  url: base + "/fapi/v1/openOrders" + "?" + data + "&signature=" + s,
  headers: {
    "X-MBX-APIKEY": k
  }};
  console.log(requestdata.url)
  try{
  
    const result = await axios(requestdata);
    return result;
  }catch(e){return e.response}
}
//----------------------------------------------

async allOrder(data, k, s) {
  let requestdata = {
    method: 'GET',
    url: base + "/fapi/v1/allOrders" + "?" + data + "&signature=" + s,
    headers: {
      "X-MBX-APIKEY": k
    }};
    console.log(requestdata.url)
    try{
  
      const result = await axios(requestdata);
      return result;
    }catch(e){return e.response}
}
//----------------------------------------------

async modifyIsolatedPositionMargin(data, k, s) {
  let requestdata = {
    method: 'POST',
    url: base + "/fapi/v1/positionMargin" + "?" + data + "&signature=" + s,
    headers: {
"X-MBX-APIKEY": k
}};
console.log(requestdata.url)
try{
  
  const result = await axios(requestdata);
  return result;
}catch(e){return e.response}
}
//----------------------------------------------

async currentPositionInformation(data, k, s) {
  let requestdata = {
    method: 'GET',
    url: base + "/fapi/v2/positionRisk" + "?" + data + "&signature=" + s,
    headers: {
"X-MBX-APIKEY": k
}};
console.log(requestdata.url)
try{
  
  const result = await axios(requestdata);
  return result;
}catch(e){return e.response}
}
//----------------------------------------------

async accountTradeList(data, k, s) {
  let requestdata = {
    method: 'GET',
url: base + "/fapi/v1/userTrades" + "?" + data + "&signature=" + s,
headers: {
  "X-MBX-APIKEY": k
}};
console.log(requestdata.url)
try{
  
  const result = await axios(requestdata);
  return result;
}catch(e){return e.response}
}
//----------------------------------------------

async getIncomeHistory(data, k, s) {
  let requestdata = {
    method: 'GET',
url: base + "/fapi/v1/income" + "?" + data + "&signature=" + s,
headers: {
  "X-MBX-APIKEY": k
}};
console.log(requestdata.url)
try{
  
  const result = await axios(requestdata);
  return result;
}catch(e){return e.response}
}
//----------------------------------------------

async userCommissionRate(data, k, s) {
  let requestdata = {
    method: 'GET',
    url: base + "/fapi/v1/commissionRate" + "?" + data + "&signature=" + s,
    headers: {
      "X-MBX-APIKEY": k
    }};
    console.log(requestdata.url)
    try{
  
      const result = await axios(requestdata);
      return result;
    }catch(e){return e.response}
  }
  
  //user stream endpoint
  async startUserDataStream(k) {
    let requestdata = {
      method: 'POST',
      url: base + "/fapi/v1/listenKey",
      headers: {
        "X-MBX-APIKEY": k
      }};
      console.log(requestdata.url)
      try{
  
        const result = await axios(requestdata);
        return result;
      }catch(e){return e.response}
  }
  async keepAliveUserDataStream(k) {
    let requestdata = {
      method: 'PUT',
      url: base + "/fapi/v1/listenKey",
      headers: {
        "X-MBX-APIKEY": k
      }};
      console.log(requestdata.url)
      try{
  
        const result = await axios(requestdata);
        return result;
      }catch(e){return e.response}
    }
    async closeUserDataStream(k) {
      let requestdata = {
        method: 'DELETE',
        url: base + "/fapi/v1/listenKey",
        headers: {
          "X-MBX-APIKEY": k
        }};
        console.log(requestdata.url)
        try{
  
          const result = await axios(requestdata);
          return result;
        }catch(e){return e.response}
      }

  //----------------------------------------------
}

module.exports=binanceEndpoint