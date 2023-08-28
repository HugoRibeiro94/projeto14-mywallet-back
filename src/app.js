import express from "express"
import cors from "cors"
import routerUser from "./routes/user.routes.js";
import routerTransactions from "./routes/transactions.routes.js";

// criando a aplicação servidora
const app = express()

// configurações
app.use(cors())
app.use(express.json())

app.use(routerUser)
app.use(routerTransactions)

// rodando a aplicação servidora para ouvir requisições na porta 5000
const PORT = process.env.PORT || 5000;
app.listen( PORT, () => console.log(`Server running at port ${PORT}`))