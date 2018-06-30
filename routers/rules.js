import express from "express";
import salesController from "../controllers/salesController";

const router = express.Router();

router.get("/", salesController.getAllSales);
router.post("/", salesController.addNewSale);
router.put("/:id", salesController.changeSaleInfo);
router.delete("/:id", salesController.deleteSale);
router.post("/checkdates", salesController.cheakDates);

export default router;
