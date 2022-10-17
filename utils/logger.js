const winston=require('winston')
const config={
 format:winston.format.json,
 transports:[
  //write all the error with level error or less to error.log
  new winston.transports.File({filename:'./logs/binance_api_error_log.log',level:'eror'}),
  //write error with level info or less to combined.log
  new winston.transports.File({filename:'./logs/binance_api_log.log',level:'info'})
 ],
 format:winston.format.combine(
  winston.format.label({label:'Binance_api_service'}),
  winston.format.timestamp({format:'MMM:DD:YYYY HH:mm:ss'}),
  winston.format.printf(
   (data)=>{return `${data.level}:${data.label}:${data.timestamp}:${data.message}`}
  )
 )
};
const logger=winston.createLogger(config,{exitOnError:false})
module.exports=logger