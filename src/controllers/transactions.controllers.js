import { db } from "../app.js"
import { v4 as uuid } from "uuid"
import bcrypt from 'bcrypt'
import dayjs from "dayjs";
import Joi from 'joi'

const transactionSchema = Joi.object({
	description: Joi.string().required(),
	value: Joi.number().positive().precision(2)
})

export async function getTransactions (req, res){
	const { authorization } = req.headers
	
	const token = authorization?.replace("Bearer ","")

	if(!token) return res.status(401).send("Envie o token na requisição")

	try{
		const session = await db.collection("sessions").findOne({token})
		if(!session) return res.status(401).send("Envie um token valido")

		const transaction = await db.collection('transactions').find({idTransaction:session.idUser}).toArray()

		res.send(transaction)
	} catch (err) {
		res.status(500).send(err.message)
	}
}

export async function postTransactions (req,res){
	const {tipo} = req.params;
	
	const {description, value} = req.body

	const validation = transactionSchema.validate(req.body, { abortEarly: false });
  
	if (validation.error) {
	  const errors = validation.error.details.map((detail) => detail.message);
	  return res.status(422).send(errors);
	}

	const { authorization } = req.headers

	const token = authorization?.replace("Bearer ","")

	if(!token) return res.status(401).send("Envie o token na requisição")

	const date = dayjs(Date.now()).format('DD/MM')
	try{
		const session = await db.collection("sessions").findOne({token})
		if(!session) return res.status(401).send("Envie um token valido")

		await db.collection('transactions').insertOne({ token, value, description, date:date, tipo:tipo, idTransaction: session.idUser })
		res.sendStatus(201)
	} catch (err) {
		res.status(500).send(err.message)
	}
}
