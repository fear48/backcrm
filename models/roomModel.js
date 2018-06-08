import mongoose from "mongoose";

const Schema = mongoose.Schema;

const RoomModel = new Schema({
  roomName: { type: String, required: true },
  type: { type: Number, required: true },
  weekEarlyPricePhoto: { type: Number, required: true },
  weekBasePricePhoto: { type: Number, required: true },
  weekLatePricePhoto: { type: Number, required: true },
  weekendEarlyPricePhoto: { type: Number, required: true },
  weekendBasePricePhoto: { type: Number, required: true },
  weekendLatePricePhoto: { type: Number, required: true },
  weekEarlyPriceVideo: { type: Number, required: true },
  weekBasePriceVideo: { type: Number, required: true },
  weekLatePriceVideo: { type: Number, required: true },
  weekendEarlyPriceVideo: { type: Number, required: true },
  weekendBasePriceVideo: { type: Number, required: true },
  weekendLatePriceVideo: { type: Number, required: true },
  weekEarlyPriceEvent: { type: Number, required: true },
  weekBasePriceEvent: { type: Number, required: true },
  weekLatePriceEvent: { type: Number, required: true },
  weekendEarlyPriceEvent: { type: Number, required: true },
  weekendBasePriceEvent: { type: Number, required: true },
  weekendLatePriceEvent: { type: Number, required: true },
  color: { type: String, required: true, minlength: 3, maxlength: 6 },
  googleCalendarId: { type: String, required: false }
});

const Room = mongoose.model("Room", RoomModel, "rooms");
export default Room;
