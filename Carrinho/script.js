$(document).ready(function() {
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    const listElement = $("#lista");
    const totalElement = $("#total");

    function exibirCarrinho() {
        listElement.empty();
        let totalPreco = 0;
        const contadorItens = {};

        // Agrupa itens iguais contando as quantidades
        $.each(carrinho, function(index, item) {
            const chave = `${item.descricao}-${item.preco}-${item.imagem}`;
            if (contadorItens[chave]) {
                contadorItens[chave].quantidade++;
            } else {
                contadorItens[chave] = { ...item, quantidade: 1 };
            }
        });

        // Exibe cada item com sua quantidade
        $.each(contadorItens, function(chave, item) {
            const listItem = $("<li>").text(
                `${item.descricao} - Preço: $${item.preco} - Quantidade: ${item.quantidade}`
            );

            const removeButton = $("<button>")
                .text("❌")
                .css("margin-left", "10px")
                .click(function() {
                    removerItemDoCarrinho(item);
                });

            listItem.append(removeButton);
            listElement.append(listItem);
            totalPreco += item.preco * item.quantidade;
        });

        totalElement.text(`Total: $${totalPreco}`);
    }
    
    function removerItemDoCarrinho(item) {
        // Encontra o índice do item no carrinho
        const index = carrinho.findIndex(i => 
            i.descricao === item.descricao && 
            i.preco === item.preco && 
            i.imagem === item.imagem
        );
        
        if (index !== -1) {
            carrinho.splice(index, 1);
            localStorage.setItem("carrinho", JSON.stringify(carrinho));
            exibirCarrinho();
        }
    }

    exibirCarrinho();
});

function gerarDocumentoWord() {
    const listElement = document.getElementById("lista");
    const totalElement = document.getElementById("total");

    const listaClone = listElement.cloneNode(true);
    
    // Remove botões de remover
    $(listaClone).find("button").remove();

    const listaHtml = listaClone.innerHTML;
    const totalHtml = totalElement.innerHTML;

    const conteudoHtml = `
    <html>
        <head>
            <meta charset="UTF-8" />
            <style>
            body {
                font-family: 'Arial', sans-serif;
                margin: 30px;
                padding: 0;
                background-color: #f8f8f8;
                color: #333;
            }
            h1 {
                color: #c0392b; /* Vermelho */
                text-align: center;
                margin-bottom: 40px;
                border-bottom: 3px solid #ecf0f1;
                padding-bottom: 10px;
                font-size: 2rem;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 30px;
                background-color: #fff;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            table, th, td {
                border: 1px solid #ddd;
            }
            th, td {
                padding: 12px 18px;
                text-align: left;
                font-size: 1rem;
            }
            th {
                background-color: #e74c3c;
                color: white;
                font-weight: bold;
            }
            td {
                background-color: #f9f9f9;
            }
            .total {
                text-align: center;
                font-weight: bold;
                font-size: 1.5rem;
                color: #333;
                margin-top: 20px;
                border-top: 2px solid black; /* Borda preta sólida */
                padding-top: 20px;
            }
            .footer {
                margin-top: 40px;
                text-align: center;
                font-size: 0.9rem;
                color: #7f8c8d;
            }
            </style>
        </head>
        <body>
            <h1>Pedido Confirmado</h1>
            <table>
                <thead>
                    <tr>
                        <th>Nota Fiscal</th>
                        <th>Preço</th>
                    </tr>
                </thead>
                <tbody>
                    ${listaHtml}
                </tbody>
            </table>
            <p class="total">${totalHtml}</p>
            <div class="footer">
                <p>Obrigado por comprar conosco!</p>
                <p>Seu pedido será processado em breve.</p>
            </div>
        </body>
    </html>
`;

    const blob = new Blob([conteudoHtml], { type: "application/msword" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Carrinho.doc";
    link.click();

    document.getElementById("pedido").style.display = "block";
}

function successClose() {
    document.getElementById("pedido").style.display = "none";
}