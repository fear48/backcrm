import mongoose from "mongoose";

const Schema = mongoose.Schema;

const EventModel = new Schema({
  title: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  prepaid: { type: Boolean, default: false, required: true },
  email: { type: String, required: false },
  grimId: { type: String, required: false },
  cancelled: { type: Boolean, required: false },
  calendarId: { type: String, required: true },
  eventId: { type: String, required: true },
  paid: { type: Boolean, default: false, required: true },
  roomId: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  uid: { type: String, required: false },
  sum: { type: Number, required: true },
  eventType: { type: String, required: true },
  members: { type: String, required: true },
  paymentType: { type: Number, required: true },
  comment: { type: String, required: false },
  target: { type: Number, required: false },
  createdAt: { type: Date, default: new Date(), required: true }
});

const Event = mongoose.model("Event", EventModel, "events");
export default Event;
