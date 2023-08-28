import { Router } from "express";
import { deleteSignOut, getUserLogin, postSignIn, postSignUp } from "../controllers/user.controllers.js";

const routerUser = Router()

routerUser.post('/sign-up', postSignUp)

routerUser.post('/sign-in', postSignIn)

routerUser.get('/user-login', getUserLogin)

routerUser.delete("/sign-out", deleteSignOut)

export default routerUser