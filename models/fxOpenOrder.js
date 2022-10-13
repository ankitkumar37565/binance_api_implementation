const mongoose=require('mongoose')
const fxOpenOrderSchema=mongoose.Schema({
 email:String,
 "s":String,                    // Symbol
 "c":String,                    // Client Order Id
 "S":String,                    // Side
 "o":String,                    // Order Type
 "f":String,                    // Time in Force
 "q":String,                    // Original Quantity
 "p":String,                    // Original Price
 "ap":String,                   // Average Price
 "sp":String,                   // Stop Price. Please ignore with TRAILING_STOP_MARKET order
 "x":String,                    // Execution Type
 "X":String,                    // Order Status
 "i":Number,                    // Order Id
 "l":String,                    // Order Last Filled Quantity
 "z":String,                    // Order Filled Accumulated Quantity
 "L":String,                    // Last Filled Price
 "N":String,                    // Commission Asset, will not push if no commission
 "n":String,                    // Commission, will not push if no commission
 "T":Number,                    // Order Trade Time
 "t":Number,                    // Trade Id
 "b":String,                    // Bids Notional
 "a":String,                    // Ask Notional
 "m":Boolean,                   // Is this trade the maker side?
 "R":Boolean,                   // Is this reduce only
 "wt":String,                   // Stop Price Working Type
 "ot":String,                   // Original Order Type
 "ps":String,                   // Position Side
 "cp":Boolean,                  // If Close-All, pushed with conditional order
 "AP":String,                   // Activation Price, only puhed with TRAILING_STOP_MARKET order
 "cr":String,                   // Callback Rate, only puhed with TRAILING_STOP_MARKET order
 "pP":Boolean,                  // ignore
 "si":Number,                   // ignore
 "ss":Number,                   // ignore
 "rp":String,                   // realized profit of the trade
})
const FxOpenOrder=mongoose.model('FxOpenOrder',fxOpenOrderSchema)
module.exports=FxOpenOrder