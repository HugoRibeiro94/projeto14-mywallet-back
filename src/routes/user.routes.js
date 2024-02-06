import { Router } from "express";
import { deleteSignOut, getUserLogin, postSignIn, postSignUp } from "../controllers/user.controllers.js";
import { userSchema } from "../schemas/user.schemas.js";
import { validateSchema } from "../middlewares/validateSchema.js";

const routerUser = Router()

routerUser.post('/sign-up', validateSchema(userSchema), postSignUp)

routerUser.post('/sign-in', postSignIn)

routerUser.get('/user-login', getUserLogin)

routerUser.delete("/sign-out", deleteSignOut)

export default routerUser