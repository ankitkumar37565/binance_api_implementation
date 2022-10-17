const express=require('express')
const router=express.Router()
const auth=require('../middlewares/auth')
const controller=require('../controllers/controller')
const handle=(fn)=>(req,res,next)=>{
 Promise.resolve(fn(req,res,next)).catch(next)
 }

//user_routes
router.post('/register',handle(controller.register))
router.post('/login',handle(controller.login))
router.get('/logout',auth,handle(controller.logout))

//account_routes
// router.get('/accountInformation',auth,handle(controller.accountInformation))
router.get('/getPositonMode',auth,handle(controller.getPositionMode))
router.post('/changePositionMode',auth,handle(controller.changePositionMode))
router.post('/changeInitialLeverage',auth,handle(controller.changeInitialLeverage))
router.post('/changeMarginType',auth,handle(controller.changeMarginType))
router.get('/openPosition',auth,handle(controller.openPosition))
router.get('/tradeHistory',auth,handle(controller.tradeHistory))
router.get('/getAccountBalanceDb',auth,handle(controller.getAccountBalanceDb))
router.get('/getFxAccountBalanceDb',auth,handle(controller.getFxAccountBalanceDb))
router.get('/getPnl',auth,handle(controller.getPnl))

//trade_routes
router.post('/createOrder',auth,handle(controller.createOrder))
router.get('/queryOrder',auth,handle(controller.queryOrder))
router.delete('/cancelOrder',auth,handle(controller.cancelOrder))
router.delete('/cancelAllOrder',auth,handle(controller.cancelAllOrder))
router.get('/currentOpenOrder',auth,handle(controller.currentOpenOrder))
router.get('/currentAllOpenOrders',auth,handle(controller.currentAllOpenOrders))
router.get('/allOrder',auth,handle(controller.allOrder))
router.post('/modifyIsolatedPositionMargin',auth,handle(controller.modifyIsolatedPositionMargin))
router.get('/currentPositionInformation',auth,handle(controller.currentPositionInformation))
router.get('/accountTradeList',auth,handle(controller.accountTradeList))
//user stream routes
router.post('/postListenKey',auth,handle(controller.postListenKey))
router.put('/putListenKey',auth,handle(controller.putListenKey))
router.delete('/deleteListenKey',auth,handle(controller.deleteListenKey))


module.exports=router