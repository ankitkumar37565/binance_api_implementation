const mongoose = require("mongoose");
const balanceSchema = mongoose.Schema(
  {
    asset: { type: String },
    walletBalance: { type: Number },
    crossWalletBalance: { type: Number },
  },
  { timestamps: true }
);
const fxWalletSchema = mongoose.Schema(
  {
    email: { type: String },
    balance: [balanceSchema],
  },
  { timestamps: true }
);
const FxWallet=mongoose.model('FxWallet',fxWalletSchema)
module.exports=FxWallet