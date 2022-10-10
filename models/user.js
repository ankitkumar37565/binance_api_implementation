const mongoose=require('mongoose')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')
const userSchema=mongoose.Schema({
 name:String,
 email:{
  type:String,
  required:true,
  unique:true,
  validate:{validator:function(e){let reg=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;return reg.test(e)},message:'email type is invalid'}
 },
password:{
 type:String,
 required:true,
 minlength:8,
 validate:{validator:function(p){let reg=/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W)(?=.{8,})/; return reg.test(p)},message:'password type is invalid please use at least 1 digit,smallcase,uppercase,specialchar'}
},
apiKey:{
 type:String,
 required:true
},
apiSecret:{
 type:String,
 required:true
}
})
userSchema.methods.generateAuthToken=async function(_id){
const token=await jwt.sign({_id:_id.toString(),exp:Date.now()+(1000*60*60*24*10)},'secret')
return token
}
userSchema.pre('save',async function(next){
 const user=this
 if(user.isModified('password')){
  user.password=await bcrypt.hash(this.password,10)
 }
 next()
})
const user=mongoose.model('user',userSchema)
module.exports=user