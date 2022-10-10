const crypto=require('crypto')

exports.genSig=async function(secret,payload){
const signature=crypto.createHmac('sha256',secret).update(payload).digest('hex')
return signature
}