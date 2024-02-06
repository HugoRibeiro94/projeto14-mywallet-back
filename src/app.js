import express from "express"
import cors from "cors"
import routerUser from "./routes/user.routes.js";
import routerTransactions from "./routes/transactions.routes.js";

const app = express()

app.use(cors())
app.use(express.json())

app.use(routerUser)
app.use(routerTransactions)

const PORT = process.env.PORT || 5000;
app.listen( PORT, () => console.log(`Server running at port ${PORT}`))