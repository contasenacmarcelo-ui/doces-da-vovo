const ordersList = document.getElementById("ordersList")
const adminMessage = document.getElementById("adminMessage")
const editForm = document.getElementById("editForm")
const editNome = document.getElementById("editNome")
const editEmail = document.getElementById("editEmail")
const editPedido = document.getElementById("editPedido")
let editingId = null
let timerMensagem = null

document.addEventListener("DOMContentLoaded", carregarPedidos)
document.getElementById("cancelEdit").addEventListener("click", cancelarEdicao)
document.getElementById("logout").addEventListener("click", sair)

editForm.addEventListener("submit", async (event) => {
    event.preventDefault()
    if (editingId === null) return

    try {
        const response = await fetch(`/pedidos/${editingId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                nome: editNome.value.trim(),
                email: editEmail.value.trim(),
                pedido: editPedido.value.trim(),
            }),
        })
        const result = await response.json()
        if (!response.ok) {
            mostrarMensagem(result.mensagem || "Não foi possível atualizar o pedido.", "ERROR")
            return
        }

        mostrarMensagem(result.mensagem || "Pedido atualizado com sucesso.", "Sucesso")
        cancelarEdicao()
        await carregarPedidos()
    } catch (error) {
        console.error("Erro ao atualizar pedido", error)
        mostrarMensagem("Erro ao atualizar o pedido.", "ERROR")
    }
})

async function carregarPedidos() {
    try {
        const response = await fetch("/pedidos")
        if (response.status === 401) {
            window.location.href = "/pages/login.html"
            return
        }
        if (!response.ok) throw new Error(`Resposta de status: ${response.status}`)

        const orders = await response.json()
        ordersList.replaceChildren()
        orders.forEach(adicionarPedido)
    } catch (error) {
        console.error("Erro ao carregar pedidos", error)
        mostrarMensagem("Erro ao carregar os pedidos.", "ERROR")
    }
}

function adicionarPedido(order) {
    const row = document.createElement("tr")
    ;[order.nome, order.email, order.pedido].forEach((value) => {
        const cell = document.createElement("td")
        cell.textContent = value
        row.appendChild(cell)
    })

    const actions = document.createElement("td")
    actions.className = "admin-actions"
    const editButton = document.createElement("button")
    editButton.type = "button"
    editButton.textContent = "Editar"
    editButton.addEventListener("click", () => iniciarEdicao(order))
    const deleteButton = document.createElement("button")
    deleteButton.type = "button"
    deleteButton.textContent = "Apagar"
    deleteButton.addEventListener("click", () => apagarPedido(order.id))
    deleteButton.className = "excluir"
    actions.append(editButton, deleteButton)
    row.appendChild(actions)
    ordersList.appendChild(row)
}

function iniciarEdicao(order) {
    editingId = order.id
    editNome.value = order.nome
    editEmail.value = order.email
    editPedido.value = order.pedido
    editForm.hidden = false
    editForm.scrollIntoView({ behavior: "smooth", block: "start" })
}

function cancelarEdicao() {
    editingId = null
    editForm.reset()
    editForm.hidden = true
}

async function apagarPedido(id) {
    if (!window.confirm("Deseja apagar este pedido?")) return

    try {
        const response = await fetch(`/pedidos/${id}`, { 
            method: "DELETE" 
        })

        const result = await response.json()

        if (!response.ok) {
            mostrarMensagem(result.mensagem || "Não foi possível apagar o pedido.", "ERROR")
            return
        }

        mostrarMensagem(result.mensagem || "Pedido apagado com sucesso.", "Sucesso")

        if (editingId === id) cancelarEdicao()

        await carregarPedidos()
    } catch (error) {
        console.error("Erro ao apagar pedido", error)
        mostrarMensagem("Erro ao apagar o pedido.", "ERROR")
    }
}

async function sair() {
    try {
        const response = await fetch("/admin/logout", { method: "POST" })
        if (!response.ok) throw new Error(`Resposta de status: ${response.status}`)
        window.location.href = "/pages/login.html"
    } catch (error) {
        console.error("Erro ao encerrar sessão", error)
        mostrarMensagem("Não foi possível encerrar a sessão.", "ERROR")
    }
}

function mostrarMensagem(text, type) {
    adminMessage.textContent = text
    adminMessage.dataset.tipo = type
     clearTimeout(timerMensagem)
     timerMensagem = setTimeout(() => {
        adminMessage.textContent = ''
        adminMessage.removeAttribute('data-tipo')
    }, 6000)
}