import { db } from "../database/databse.connection.js";
import { v4 as uuid } from "uuid"
import bcrypt from 'bcrypt'
import { userSchema } from "../schemas/user.schemas.js";

export async function postSignUp (req, res){
	const {name, email, password} = req.body

	const passwordHash = bcrypt.hashSync(password, 10);

	try{
		const user = await db.collection('users').findOne({ email })
		if(user) return res.status(409).send("Email já cadastrado")

		await db.collection('users').insertOne({ name, email, password: passwordHash })
		res.sendStatus(201)
	} catch (err) {
		res.status(500).send(err.message)
	}
}

export async function postSignIn (req, res){
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
}

export async function getUserLogin (req, res){
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
}

export async function deleteSignOut(req,res){
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
}
