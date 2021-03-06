import express from 'express';
import clientsController from '../controllers/clientController'

const router = express.Router()

router.get("/", clientsController.getAllClients)
router.post("/", clientsController.addClient)
router.put("/:id", clientsController.changeClient)
router.delete('/:id', clientsController.deleteClient)
router.post("/:id/comments", clientsController.addComment)
router.delete('/:id/comments/:commentId', clientsController.deleteComment)
router.post("/:id/comments/:commentId", clientsController.rateComment)

export default router;