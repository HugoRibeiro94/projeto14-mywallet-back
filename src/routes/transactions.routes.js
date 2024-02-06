import { Router } from "express";
import { getTransactions, postTransactions } from "../controllers/transactions.controllers.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { transactionSchema } from "../schemas/transactions.schemas.js";

const routerTransactions = Router()

routerTransactions.post('/nova-transacao/:tipo', validateSchema(transactionSchema), postTransactions)

routerTransactions.get('/transactions', getTransactions)

export default routerTransactions