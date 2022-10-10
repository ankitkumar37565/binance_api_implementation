const mongoose=require('mongoose')
let mongoURL='mongodb://localhost:27017/binance_api_implementation'
mongoose.connect(mongoURL)
mongoose.connection.on('connected',()=>{
 console.log(`mongodb connected`)
})
mongoose.connection.on('disconnected',()=>{
 console.log(`mongodb disconnected`)
})