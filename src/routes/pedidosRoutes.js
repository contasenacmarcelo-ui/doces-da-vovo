import express from "express"
import { buscarPedidos } from "../controllers/pedidosControllers.js"
import { cadastrarPedidos } from "../controllers/pedidosControllers.js"
import { atualizarPedido } from "../controllers/pedidosControllers.js"
import { deletarPedido } from "../controllers/pedidosControllers.js"
import { requireAdmin } from "../middleware/adminAuth.js"

const router = express.Router()

router.get("/", buscarPedidos)
router.post("/", cadastrarPedidos)
router.put("/:id", requireAdmin, atualizarPedido)
router.delete("/:id", requireAdmin, deletarPedido)


export default router