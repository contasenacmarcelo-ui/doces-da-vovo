const formulario = document.getElementById("formulario")
const nomeInput = document.getElementById("nome")
const emailInput = document.getElementById("email")
const pedidoInput = document.getElementById("pedido")
const btn = document.getElementById("btn")
const mensagem = document.getElementById("exibirMensagem")
const listarPedidos = document.getElementById("listarPedidos")
const url = "/pedidos"
let idEditando = null

formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault()

    const nome = nomeInput.value.trim()
    const email = emailInput.value.trim()
    const pedido = pedidoInput.value.trim()

    if (!nome || !email || !pedido) {
        exibirMensagem("Todos os campos são obrigatórios!", "ERROR")
        return
    }

    if (idEditando !== null) {
        await atualizarPedido(idEditando)
        return
    }

    try {
        const resposta = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ nome, email, pedido })
        })

        const dados = await resposta.json()

        if (!resposta.ok) {
            exibirMensagem(dados.mensagem || "Erro de resposta no backend", "ERROR")
            return
        }
        exibirMensagem(dados.mensagem, "Sucesso")

        formulario.reset()
    } catch (e) {
        console.error("Erro ao cadastrar pedido", e)
        exibirMensagem("Erro ao cadastrar pedido", "ERROR")
    }
})

function exibirMensagem(texto, tipo) {
    mensagem.textContent = texto
    mensagem.dataset.tipo = tipo

    setTimeout(() => {
        mensagem.textContent = ""
        mensagem.removeAttribute("data-tipo")
    }, 6000)
}