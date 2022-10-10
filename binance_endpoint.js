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
 const result = await axios(requestdata);
 return result;
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
let result = await axios(requestdata);
 return result;
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
 const result = await axios(requestdata);
 return result;
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
  const result = await axios(requestdata);
  return result;
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
  const result = await axios(requestdata);
  return result;
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
const result = await axios(requestdata);
return result;
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
const result = await axios(requestdata);
return result;
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
const result = await axios(requestdata);
return result;
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
  const result = await axios(requestdata);
  return result;
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
    const result = await axios(requestdata);
return result;
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
  const result = await axios(requestdata);
  return result;
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
    const result = await axios(requestdata);
return result;
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
const result = await axios(requestdata);
return result;
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
const result = await axios(requestdata);
return result;
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
const result = await axios(requestdata);
return result;
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
const result = await axios(requestdata);
return result;
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
    const result = await axios(requestdata);
    return result;
  }
  
}
//----------------------------------------------
module.exports=binanceEndpoint