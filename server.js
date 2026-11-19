import app from "./src/app.js"

const PORT = Number(process.env.PORT) || 3000
const server = app


server.listen(PORT, "0.0.0.0", ()=>{
    console.log(`O servidor está rodando em http://localhost:${PORT}`)
})
