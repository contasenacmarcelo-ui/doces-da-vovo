const formulario = document.getElementById("formulario")
const nomeInput = document.getElementById("nome")
const emailInput = document.getElementById("email")
const pedidoInput = document.getElementById("pedido")
const btn = document.getElementById("btn")
const mensagem = document.getElementById("exibirMensagem")
const listarPedidos = document.getElementById("listarPedidos")
const url = "/pedidos"

let idEditando = null

document.addEventListener("DOMContentLoaded", carregarPedidos)

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
        carregarPedidos()
    } catch (e) {
        console.error("Erro ao cadastrar pedido", e)
        exibirMensagem("Erro ao cadastrar pedido", "ERROR")
    }
})

async function carregarPedidos() {
    try {
        const resposta = await fetch(url)

        if (!resposta.ok) {
            throw new Error(`Resposta de status: ${resposta.status}`)
        }

        const resultado = await resposta.json()

        listarPedidos.innerHTML = ""

        resultado.forEach(item => {
            const lista = document.createElement("li")
            const btnEditar = document.createElement("button")
            const btnDeletar = document.createElement("button")

            btnDeletar.textContent = "Deletar"
            btnEditar.textContent = "Editar"

            lista.textContent = `Nome: ${item.nome} Email: ${item.email} Pedido: ${item.pedido} `

            btnDeletar.addEventListener("click", () => {
                deletarPedido(item.id)
            })

            btnEditar.addEventListener("click", () => {
                nomeInput.value = item.nome
                emailInput.value = item.email
                pedidoInput.value = item.pedido

                idEditando = item.id

                btn.textContent = "Salvar"
            })

            lista.appendChild(btnDeletar)
            lista.appendChild(btnEditar)
            listarPedidos.appendChild(lista)
        })
    } catch (error) {
        console.error("Erro ao carregar pedidos", error)
        exibirMensagem("Erro ao carregar pedidos", "ERROR")
    }
}

async function atualizarPedido(id) {
    const nome = nomeInput.value.trim()
    const email = emailInput.value.trim()
    const pedido = pedidoInput.value.trim()

    if (!nome || !email || !pedido) {
        exibirMensagem("Preencha todos os campos!", "ERROR")
        return
    }

    try {
        const resposta = await fetch(`/pedidos/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ nome, email, pedido })
        })

        const dados = await resposta.json()

        if (!resposta.ok) {
            exibirMensagem(dados.mensagem || "Erro ao fazer alteração!", "ERROR")
            
        }

        exibirMensagem(dados.mensagem || "Alteração feita com sucesso!", "Sucesso")

        idEditando = null
        btn.textContent = "Enviar"
        formulario.reset()
        carregarPedidos()

    } catch (e) {
        console.error("Erro ao alterar pedido", e)
        exibirMensagem("Erro ao alterar pedido", "ERROR")
    }
}

async function deletarPedido(id) {
    try {
        const resposta = await fetch(`${url}/${id}`, {
            method: "DELETE"
        })

        const dados = await resposta.json()

        if (!resposta.ok) {
            exibirMensagem(dados.mensagem || "Erro ao deletar pedido", "ERROR")
            return
        }

        exibirMensagem(dados.mensagem, "Sucesso")

        if (idEditando === id) {
            idEditando = null
            btn.textContent = "Enviar"
            formulario.reset()
        }

        carregarPedidos()
    } catch (e) {
        console.error("Erro ao deletar pedido:", e)
        exibirMensagem("Erro ao deletar pedido", "ERROR")
    }   
}

function exibirMensagem(texto, tipo) {
    

    mensagem.textContent = texto
    mensagem.dataset.tipo = tipo

    setTimeout(() => {
        mensagem.textContent = ""
        mensagem.removeAttribute("data-tipo")
    }, 6000)
}