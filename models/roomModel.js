import mongoose from "mongoose";

const Schema = mongoose.Schema;

const RoomModel = new Schema({
  roomName: { type: String, required: true },
  type: { type: Number, required: true },
  weekEarlyPrice: { type: Number, required: true },
  weekBasePrice: { type: Number, required: true },
  weekLatePrice: { type: Number, required: true },
  weekendEarlyPrice: { type: Number, required: true },
  weekendBasePrice: { type: Number, required: true },
  weekendLatePrice: { type: Number, required: true },
  color: { type: String, required: true, minlength: 3, maxlength: 6 },
  googleCalendarId: { type: String, required: false }
});

const Room = mongoose.model("Room", RoomModel, "rooms");
export default Room;
