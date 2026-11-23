import pool from "../config/db.js"

async function criarTabelaPedidos() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pedidos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL,
        pedido VARCHAR(255) NOT NULL,
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        atualizado TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log("Tabela 'pedidos' pronta no Filess.io!");
  } catch (erro) {
    console.error("Erro ao criar tabela:", erro);
  }
}

criarTabelaPedidos();

async function buscarPedidos(req, res) {
    try {
        const [rows] = await pool.execute("SELECT * FROM pedidos")

        return res.json(rows)
    } catch (error) {
        console.error('Erro interno: ', error)
        return res.status(500).json({
            mensagem: "Erro ao buscar pedidos"
        })
    }
}
async function cadastrarPedidos(req, res) {
    try {
        const nome = (req.body.nome || "").trim()
        const email = (req.body.email || "").trim()
        const pedido = (req.body.pedido || "").trim()

        if (!nome || !email || !pedido) {
            return res.status(400).json({
                erro: "Todos os campos são obrigatórios"
            })
        }

        await pool.execute("INSERT INTO pedidos (nome, email, pedido)VALUES( ?, ?, ?)", [nome, email, pedido])

        return res.status(200).json({
            mensagem: "Pedido cadastrado com sucesso!"
        })
    } catch (error) {
        console.error('Erro interno: ', error)
        return res.status(500).json({
            mensagem: "Erro ao buscar pedidos"
        })
    }
}
async function atualizarPedido(req, res) {
    try {
        const id = req.params.id

        const nome = (req.body.nome || "").trim()
        const email = (req.body.email || "").trim()
        const pedido = (req.body.pedido || "").trim()

        if (!nome || !email || !pedido) {
            return res.status(400).json({
                erro: "Todos os campos são obrigatórios"
            })
        }

        await pool.execute("UPDATE pedidos SET nome = ?, email = ?, pedido = ? WHERE id = ?", [nome, email, pedido, id])

        return res.status(200).json({
            mensagem: "Pedido atualizado com sucesso!"
        })
    } catch (error) {
        console.error('Erro interno: ', error)
        return res.status(500).json({
            mensagem: "Erro ao alterar pedidos"
        })
    }
}

async function deletarPedido(req, res) {
    try {
        const id = req.params.id

        await pool.execute("DELETE FROM pedidos WHERE id = ?", [id])

        return res.status(200).json({ 
            mensagem: "Pedido deletado com sucesso!"
        })
    } catch (error) {
        console.error('Erro interno: ', error)
        return res.status(500).json({
            mensagem: "Erro ao buscar pedidos"
        })
    }
}

export { buscarPedidos, cadastrarPedidos, atualizarPedido, deletarPedido}