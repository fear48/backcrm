import mongoose from "mongoose";

const Schema = mongoose.Schema;

const HistoryModel = new Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  members: { type: String, required: true },
  sum: { type: Number, required: true },
  payStatus: { type: Number, required: true },
  eventId: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  time: { type: String, required: true },
  room: { type: String, required: true }
});

const History = mongoose.model("History", HistoryModel, "history");
export default History;
