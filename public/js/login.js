const loginForm = document.getElementById("loginForm")
const loginMessage = document.getElementById("loginMessage")

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault()
    loginMessage.textContent = ""
    loginMessage.removeAttribute("data-tipo")

    const usuario = document.getElementById("usuario").value.trim()
    const senha = document.getElementById("senha").value

    try {
        const response = await fetch("/admin/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ usuario, senha }),
        })
        const result = await response.json()

        if (!response.ok) {
            loginMessage.textContent = result.mensagem || "Não foi possível entrar."
            loginMessage.dataset.tipo = "ERROR"
            return
        }

        window.location.href = "/pages/admin.html"
    } catch (error) {
        console.error("Erro ao realizar login", error)
        loginMessage.textContent = "Erro ao conectar com o servidor."
        loginMessage.dataset.tipo = "ERROR"
    }
})
