import pool from "../config/db.js"

async function buscarPedidos(req, res) {
    try {
        const [rows] = await pool.execute("SELECT * FROM pedidos")

        res.json(rows)
    } catch (error) {
        res.status(501).json({ mensagem: "Erro ao buscar pedidos" })
    }
}
async function cadastrarPedidos(req, res) {
    try {
        const nome = (req.body.nome || "").trim()
        const email = (req.body.email || "").trim()
        const pedido = (req.body.pedido || "").trim()

        if (!nome || !email || !pedido) {
            res.json("Todas os campos são obrigatórios")
        }

        await pool.execute("INSERT INTO pedidos (nome, email, pedido)VALUES( ?, ?, ?)", [nome, email, pedido])

        res.json({ mensagem: "Pedido cadastrado com sucesso!" })
    } catch (e) {
        res.status(501).json({ mensagem: "Erro ao buscar pedidos" })
        console.log(e)
    }
}
async function atualizarPedido(req, res) {
    try {
        const id = req.params.id

        const nome = (req.body.nome || "").trim()
        const email = (req.body.email || "").trim()
        const pedido = (req.body.pedido || "").trim()

        if (!nome || !email || !pedido) {
            res.json("Todas os campos são obrigatórios")
        }
        await pool.execute("UPDATE pedidos SET nome = ?, email = ?, pedido = ? WHERE id = ?", [nome, email, pedido, id])

        res.json({ mensagem: "Pedido atualizado com sucesso!" })

    } catch (error) {
        res.status(501).json({ mensagem: "Erro ao alterar pedidos" })

    }
}

async function deletarPedido(req, res) {
    try {
        const id = req.params.id

        await pool.execute("DELETE FROM pedidos WHERE id = ?", [id])

        res.json({ mensagem: "Pedido deletado com sucesso!" })

    } catch (e) {
        res.status(501).json({mensagem: "Erro ao buscar pedidos"})
        console.error(e)
    }
}
export { buscarPedidos, cadastrarPedidos, atualizarPedido, deletarPedido}