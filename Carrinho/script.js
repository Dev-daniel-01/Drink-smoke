const cartUser = requireLogin("../Login/")

$(document).ready(function () {
    if (!cartUser) return

    document.getElementById("user").textContent = cartUser.name
    document.getElementById("user-avatar").textContent = initials(cartUser.name)
    document.getElementById("logout-btn").addEventListener("click", () => logout("../Login/"))

    const listElement = $("#lista")
    const totalElement = $("#total")
    const emptyState = $("#cart-empty")
    const summary = $("#cart-summary")

    function agruparItens() {
        const carrinho = getCarrinho()
        const contadorItens = {}
        $.each(carrinho, function (index, item) {
            const chave = `${item.descricao}-${item.preco}-${item.imagem}`
            if (contadorItens[chave]) {
                contadorItens[chave].quantidade++
            } else {
                contadorItens[chave] = { ...item, quantidade: 1 }
            }
        })
        return contadorItens
    }

    function exibirCarrinho() {
        listElement.empty()
        let totalPreco = 0
        const contadorItens = agruparItens()
        const temItens = Object.keys(contadorItens).length > 0

        emptyState.css("display", temItens ? "none" : "flex")
        summary.css("display", temItens ? "flex" : "none")

        $.each(contadorItens, function (chave, item) {
            const subtotal = item.preco * item.quantidade
            totalPreco += subtotal

            const listItem = $(`
                <div class="cart-item">
                    <img class="cart-item__img" src="${item.imagem}" alt="${item.descricao}">
                    <div class="cart-item__info">
                        <p class="cart-item__name">${item.descricao}</p>
                        <p class="cart-item__unit">R$ ${item.preco.toFixed(2)} / un.</p>
                    </div>
                    <div class="cart-item__stepper">
                        <button type="button" class="menos" aria-label="Diminuir quantidade">−</button>
                        <span>${item.quantidade}</span>
                        <button type="button" class="mais" aria-label="Aumentar quantidade">+</button>
                    </div>
                    <p class="cart-item__subtotal">R$ ${subtotal.toFixed(2)}</p>
                    <button type="button" class="cart-item__remove" aria-label="Remover item">✕</button>
                </div>
            `)

            listItem.find(".menos").on("click", () => removerItemDoCarrinho(item))
            listItem.find(".mais").on("click", () => adicionarItemAoCarrinho(item))
            listItem.find(".cart-item__remove").on("click", () => removerTodosDoCarrinho(item))

            listElement.append(listItem)
        })

        totalElement.text(`Total: R$ ${totalPreco.toFixed(2)}`)
        updateCartBadge()
    }

    function removerItemDoCarrinho(item) {
        const carrinho = getCarrinho()
        const index = carrinho.findIndex(
            (i) => i.descricao === item.descricao && i.preco === item.preco && i.imagem === item.imagem
        )
        if (index !== -1) {
            carrinho.splice(index, 1)
            localStorage.setItem("carrinho", JSON.stringify(carrinho))
            exibirCarrinho()
        }
    }

    function removerTodosDoCarrinho(item) {
        const carrinho = getCarrinho().filter(
            (i) => !(i.descricao === item.descricao && i.preco === item.preco && i.imagem === item.imagem)
        )
        localStorage.setItem("carrinho", JSON.stringify(carrinho))
        exibirCarrinho()
    }

    function adicionarItemAoCarrinho(item) {
        const { quantidade, ...produto } = item
        const carrinho = getCarrinho()
        carrinho.push(produto)
        localStorage.setItem("carrinho", JSON.stringify(carrinho))
        exibirCarrinho()
    }

    window.gerarPedidoPDF = function () {
        const contadorItens = agruparItens()
        if (Object.keys(contadorItens).length === 0) {
            showToast("Seu carrinho está vazio", "error")
            return
        }

        let totalPreco = 0
        const linhas = []
        $.each(contadorItens, function (chave, item) {
            const subtotal = item.preco * item.quantidade
            totalPreco += subtotal
            linhas.push([item.descricao, String(item.quantidade), `R$ ${item.preco.toFixed(2)}`, `R$ ${subtotal.toFixed(2)}`])
        })

        const { jsPDF } = window.jspdf
        const doc = new jsPDF()

        doc.setFillColor(227, 32, 47)
        doc.rect(0, 0, 210, 26, "F")
        doc.setTextColor(255, 255, 255)
        doc.setFont("helvetica", "bold")
        doc.setFontSize(18)
        doc.text("Drink & Smoke", 14, 13)
        doc.setFont("helvetica", "normal")
        doc.setFontSize(11)
        doc.text("Pedido confirmado", 14, 21)

        doc.setTextColor(60, 60, 60)
        doc.setFontSize(10)
        doc.text(`Cliente: ${cartUser.name}`, 14, 34)
        doc.text(`Data: ${new Date().toLocaleString("pt-BR")}`, 14, 40)

        doc.autoTable({
            startY: 46,
            head: [["Produto", "Qtd.", "Preço unit.", "Subtotal"]],
            body: linhas,
            headStyles: { fillColor: [227, 32, 47], textColor: 255 },
            styles: { fontSize: 10, cellPadding: 3 },
            theme: "striped",
        })

        const finalY = doc.lastAutoTable.finalY + 10
        doc.setFontSize(13)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(20, 20, 20)
        doc.text(`Total: R$ ${totalPreco.toFixed(2)}`, 14, finalY)

        doc.setFontSize(9)
        doc.setFont("helvetica", "normal")
        doc.setTextColor(130, 130, 130)
        doc.text("Obrigado por comprar conosco! Seu pedido sera processado em breve.", 14, finalY + 10)

        doc.save("Pedido.pdf")

        showToast("Pedido gerado em PDF!", "success")
    }

    exibirCarrinho()
})
