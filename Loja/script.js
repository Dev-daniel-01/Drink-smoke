let produtos = []

const user = requireLogin("../Login/")

window.onload = function () {
    if (!user) return
    document.getElementById("user").textContent = user.name
    document.getElementById("user-avatar").textContent = initials(user.name)
    updateCartBadge()
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("logout-btn").addEventListener("click", () => logout("../Login/"))

    // Fetch dos produtos e armazenamento na variável global
    fetch("../Dados/loja.json")
        .then((response) => response.json())
        .then((data) => {
            produtos = data
            const produtosContainer = document.getElementById("produtos-container")

            produtos.forEach((produto, index) => {
                const card = document.createElement("div")
                card.className = "card"

                const imgWrap = document.createElement("div")
                imgWrap.className = "card-img-wrap"

                const imagem = document.createElement("img")
                imagem.src = produto.imagem
                imagem.alt = produto.descricao
                imagem.className = "card-img-top"
                imgWrap.appendChild(imagem)

                const cardBody = document.createElement("div")
                cardBody.className = "card-body"

                const cardTitle = document.createElement("h5")
                cardTitle.className = "card-title"
                cardTitle.textContent = produto.descricao

                const cardText = document.createElement("p")
                cardText.className = "card-text card-price"
                cardText.textContent = "R$ " + produto.preco.toFixed(2)

                const btnAdicionarAoCarrinho = document.createElement("button")
                btnAdicionarAoCarrinho.type = "button"
                btnAdicionarAoCarrinho.className = "btn btn-adicionar-ao-carrinho"
                btnAdicionarAoCarrinho.setAttribute("data-indice", index)
                btnAdicionarAoCarrinho.textContent = "Adicionar ao carrinho"

                cardBody.appendChild(cardTitle)
                cardBody.appendChild(cardText)
                cardBody.appendChild(btnAdicionarAoCarrinho)

                card.appendChild(imgWrap)
                card.appendChild(cardBody)

                produtosContainer.appendChild(card)
            })
        })
        .catch((error) => console.error("Erro ao carregar o arquivo JSON", error))

    // Manipulador de eventos para o botão "Adicionar ao carrinho"
    $("#produtos-container").on("click", ".btn-adicionar-ao-carrinho", function () {
        const indexDoProduto = $(this).data("indice")
        const produtoSelecionado = produtos[indexDoProduto]
        let carrinho = getCarrinho()
        carrinho.push(produtoSelecionado)
        localStorage.setItem("carrinho", JSON.stringify(carrinho))
        updateCartBadge()
        showToast(`"${produtoSelecionado.descricao}" adicionado ao carrinho`, "success")
    })
})
