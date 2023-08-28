import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import Joi from 'joi'
import { MongoClient } from 'mongodb';
import { v4 as uuid } from "uuid"
import bcrypt from 'bcrypt'

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

const db = mongoClient.db()

// schemas

const userSchema = Joi.object({
	name: Joi.string().required(),
	email: Joi.string().email().required(),
	password: Joi.string().min(3).required()
})

const transactionSchema = Joi.object({
	description: Joi.string().required(),
	value: Joi.number().positive().precision(2)
})
// rotas

// cadastro
app.post('/sign-up', async (req, res) => {
	const {name, email, password} = req.body

	const passwordHash = bcrypt.hashSync(password, 10);

	const validation = userSchema.validate(req.body, { abortEarly: false });
  
	if (validation.error) {
	  const errors = validation.error.details.map((detail) => detail.message);
	  return res.status(422).send(errors);
	}

	try{
		const user = await db.collection('users').findOne({ email })
		if(user) return res.status(409).send("Email já cadastrado")

		await db.collection('users').insertOne({ name, email, password: passwordHash })
		res.sendStatus(201)
	} catch (err) {
		res.status(500).send(err.message)
	}
})

// login
app.post('/sign-in', async (req, res) => {
	const { email, password } = req.body

	try{
		const user = await db.collection('users').findOne({ email })
		if (!user) return res.status(404).send("Usuario não cadastrado")

		const passwordIsCorrect = bcrypt.compareSync(password, user.password)
		if (!passwordIsCorrect) return res.status(401).send("Senha incorreta")

		const token = uuid()
		
		const obj ={ token:token , idUser: user._id, name: user.name}

		await db.collection('sessions').insertOne(obj)
		res.status(200).send(obj)
	} catch (err) {
		res.status(500).send(err.message)
	}
})

app.get('/user-login', async (req, res) => {
	const { authorization } = req.headers

	const token = authorization?.replace("Bearer ","")

	if(!token) return res.status(401).send("Envie o token na requisição")

	try{
		const session = await db.collection("sessions").findOne({token})
		if(!session) return res.status(401).send("Envie um token valido")

		const user = await db.collection('users').findOne({ _id: session.idUser})
		delete user.password

		res.send(user)
	} catch (err) {
		res.status(500).send(err.message)
	}
})

app.delete("/sign-out", async (req, res) => {
	const { authorization } = req.headers

	const token = authorization?.replace("Bearer ","")

	if(!token) return res.status(401).send("Envie o token na requisição")

	try{
		const session = await db.collection("sessions").findOne({token})
		if(!session) return res.status(401).send("Envie um token valido")

		await db.collection("sessions").deleteOne({ token })
		res.sendStatus(200)
	} catch (err) {
		res.status(500).send(err.message)
	}
})

app.post('/nova-transacao/:tipo', async (req, res) => {
	const {tipo} = req.params;
	console.log(tipo)
	const {description, value} = req.body

	const validation = transactionSchema.validate(req.body, { abortEarly: false });
  
	if (validation.error) {
	  const errors = validation.error.details.map((detail) => detail.message);
	  return res.status(422).send(errors);
	}

	const { authorization } = req.headers

	const token = authorization?.replace("Bearer ","")

	if(!token) return res.status(401).send("Envie o token na requisição")

	try{
		const session = await db.collection("sessions").findOne({token})
		if(!session) return res.status(401).send("Envie um token valido")

		await db.collection('transactions').insertOne({ token, value, description })
		res.sendStatus(201)
	} catch (err) {
		res.status(500).send(err.message)
	}
})

app.get('/transactions', async (req, res) => {
	const { authorization } = req.headers

	const token = authorization?.replace("Bearer ","")

	if(!token) return res.status(401).send("Envie o token na requisição")

	try{
		const session = await db.collection("sessions").findOne({token})
		if(!session) return res.status(401).send("Envie um token valido")

		const transaction = await db.collection('transactions').findOne({ _id: session.idUser})

		res.send(transaction)
	} catch (err) {
		res.status(500).send(err.message)
	}
})

app.get("/", (request, response) => {
    response.send("Running..");
})

// rodando a aplicação servidora para ouvir requisições na porta 5000
const PORT = 5000;
app.listen( PORT, () => console.log(`Server running at port ${PORT}`))