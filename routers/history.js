import express from "express";
import historyController from "../controllers/historyController";

const router = express.Router();

router.get("/", historyController.getAllHistory);
router.post("/", historyController.addNewHistory);
router.get("/:id", historyController.getHistoryById);
router.put("/event/:id", historyController.changeHistoryInfoByEventId);
router.put("/:id", historyController.changeHistoryInfo);
router.delete("/:id", historyController.deleteHistory);

export default router;
