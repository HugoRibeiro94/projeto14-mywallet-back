import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import Joi from 'joi'
import { MongoClient } from 'mongodb';
import { v4 as uuid } from "uuid"
import bcrypt from 'bcrypt'
import dayjs from "dayjs";
import { deleteSignOut, getUserLogin, postSignIn, postSignUp } from "./controllers/user.controllers.js";
import { getTransactions, postTransactions } from "./controllers/transactions.controllers.js";

// criando a aplicação servidora
const app = express()

// configurações
app.use(cors())
app.use(express.json())
dotenv.config()

// conectando ao banco
const mongoClient = new MongoClient(process.env.DATABASE_URL);

try{
	await mongoClient.connect()
	console.log("MongoDB conected")
} catch (err) {
	console.log(err.message)
}

export const db = mongoClient.db()

app.post('/sign-up', postSignUp)

app.post('/sign-in', postSignIn)

app.get('/user-login', getUserLogin)

app.delete("/sign-out", deleteSignOut)

app.post('/nova-transacao/:tipo', postTransactions)

app.get('/transactions', getTransactions)

// rodando a aplicação servidora para ouvir requisições na porta 5000
const PORT = process.env.PORT || 5000;
app.listen( PORT, () => console.log(`Server running at port ${PORT}`))