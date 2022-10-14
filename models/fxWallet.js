const mongoose = require("mongoose");
const balanceSchema = mongoose.Schema(
  {
    asset: { type: String },
    walletBalance: { type: String },
    crossWalletBalance: { type: String },
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