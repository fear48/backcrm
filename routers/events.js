import express from "express";
import eventController from "../controllers/eventController";

const router = express.Router();

router.get("/", eventController.getAllEvents);
router.post("/", eventController.addNewEvent);
router.get("/:id", eventController.getEventById);
router.delete("/:id", eventController.deleteEventById);
router.put("/:id", eventController.changeEventInfo);
router.post("/checkdates", eventController.cheakDates);
router.post("/geteventsbydate", eventController.getEventsByDate);

export default router;
