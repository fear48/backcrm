import mongoose from "mongoose";

const Schema = mongoose.Schema;

const TransactionModel = new Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  uid: { type: String, required: false },
  date: { type: Date, default: new Date() },
  sum: { type: Number, required: true },
  type: { type: Number, required: true },
  category: { type: String, required: false },
  categoryName: { type: String },
  payType: { type: Number, required: true }
});

const Transaction = mongoose.model(
  "Transaction",
  TransactionModel,
  "transactions"
);
export default Transaction;
