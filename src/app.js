import cors from "cors"
import express from "express"
import path from "path"
import router from "../src/routes/pedidosRoutes.js"
import {
    clearAdminSessionCookie,
    createAdminSession,
    getAdminSession,
    revokeAdminSession,
} from "./middleware/adminAuth.js"

const app = express()

app.use(cors())
app.use(express.json())

app.post("/admin/login", (req, res) => {
    const { usuario, senha } = req.body || {}
    const adminUsuario = process.env.ADMIN_USER || "admin"
    const adminSenha = process.env.ADMIN_PASSWORD || "1234"

    if (usuario !== adminUsuario || senha !== adminSenha) {
        return res.status(401).json({ mensagem: "Usuário ou senha inválidos." })
    }

    const token = createAdminSession()
    const secure = process.env.NODE_ENV === "production" ? "; Secure" : ""
    res.setHeader("Set-Cookie", `admin_session=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=28800${secure}`)
    return res.json({ mensagem: "Login realizado com sucesso." })
})

app.post("/admin/logout", (req, res) => {
    revokeAdminSession(req)
    clearAdminSessionCookie(res)
    res.json({ mensagem: "Sessão encerrada." })
})

app.get("/pages/admin.html", (req, res, next) => {
    if (!getAdminSession(req)) {
        return res.redirect("/pages/login.html")
    }

    return res.sendFile(path.join(process.cwd(), "public", "pages", "admin.html"))
})

app.use(express.static(path.join(process.cwd(), "public")))

app.get("/", (req,res)=>{
    res.sendFile(path.join(process.cwd(), "public","pages", "index.html"))
})

app.use("/pedidos", router)
export default app;