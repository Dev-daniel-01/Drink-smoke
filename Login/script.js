function login() {
    var nome = $("#nome").val()
    var senha = $("#senha").val()

    if (nome && senha && nome === "noth" && senha === "3333") {
        const user = {
            name: nome,
            dataEntrada: new Date(),
            id: Math.floor(Math.random() * 100000),
        }

        localStorage.setItem("usuario", JSON.stringify(user))

        window.location.href = "../Loja/"
    } else {
        document.getElementById("error-modal").classList.add("error-toast--visible")
        document.getElementById("nome").closest(".field").classList.add("field--invalid")
        document.getElementById("senha").closest(".field").classList.add("field--invalid")
    }
}

function fecharError() {
    document.getElementById("nome").closest(".field").classList.remove("field--invalid")
    document.getElementById("senha").closest(".field").classList.remove("field--invalid")
    document.getElementById("error-modal").classList.remove("error-toast--visible")
}

function showPassword() {
    var imputSenha = document.querySelector("#senha")
    if (imputSenha.getAttribute("type") === "password") {
        imputSenha.setAttribute("type", "text")
    } else {
        imputSenha.setAttribute("type", "password")
    }
}

window.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("usuario")) {
        window.location.href = "../Loja/"
    }
})
