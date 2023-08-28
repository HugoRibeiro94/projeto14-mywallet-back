import { Router } from "express";
import { getTransactions, postTransactions } from "../controllers/transactions.controllers.js";

const routerTransactions = Router()

routerTransactions.post('/nova-transacao/:tipo', postTransactions)

routerTransactions.get('/transactions', getTransactions)

export default routerTransactions