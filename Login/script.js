function login(){
    var nome = $("#nome").val()
    var senha = $("#senha").val()

    if(nome && senha && nome === "noth" && senha === "3333"){
        const user = {
            name: nome,
            dataEntrada: new Date(),
            id: Math.floor(Math.random() * 100000),
        }

        localStorage.setItem("usuario", JSON.stringify(user))

        window.location.href = "../loja/"
    }else{
        document.getElementById("error-modal").style.display = "flex"
        document.getElementById("nome").style.border = "2px solid red"
        document.getElementById("senha").style.border = "2px solid red"
    }
}

function fecharError(){
    document.getElementById("nome").style.border = "2px solid aliceblue"
    document.getElementById("senha").style.border = "2px solid aliceblue"
    document.getElementById("error-modal").style.display = "none"
}

function showPassword(){
    var imputSenha = document.querySelector("#senha")
    if(imputSenha.getAttribute("type") === "password"){
    imputSenha.setAttribute("type", "text")

}else{
    imputSenha.setAttribute("type", "password")
}
}