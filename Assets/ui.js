/* Helpers de UI compartilhados entre Loja e Carrinho */

function getStack() {
    let stack = document.querySelector(".toast-stack");
    if (!stack) {
        stack = document.createElement("div");
        stack.className = "toast-stack";
        document.body.appendChild(stack);
    }
    return stack;
}

const TOAST_ICONS = { success: "✅", error: "⚠️", info: "🛒" };

function showToast(message, type = "info", duration = 2600) {
    const stack = getStack();
    const toast = document.createElement("div");
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `<span class="toast__icon">${TOAST_ICONS[type] || TOAST_ICONS.info}</span><span class="toast__msg"></span>`;
    toast.querySelector(".toast__msg").textContent = message;
    stack.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("toast--leaving");
        toast.addEventListener("animationend", () => toast.remove(), { once: true });
    }, duration);
}

function getCarrinho() {
    return JSON.parse(localStorage.getItem("carrinho")) || [];
}

function updateCartBadge() {
    const badge = document.getElementById("cart-badge");
    if (!badge) return;
    const count = getCarrinho().length;
    badge.textContent = count;
    badge.style.display = count > 0 ? "flex" : "none";
}

function initials(name) {
    if (!name) return "?";
    return name.trim().charAt(0).toUpperCase();
}

/* Garante que só usuários logados vejam Loja/Carrinho; redireciona para o Login caso contrário */
function requireLogin(loginPath) {
    const storedUser = localStorage.getItem("usuario");
    if (!storedUser) {
        window.location.href = loginPath;
        return null;
    }
    try {
        return JSON.parse(storedUser);
    } catch (e) {
        window.location.href = loginPath;
        return null;
    }
}

function logout(loginPath) {
    localStorage.removeItem("usuario");
    window.location.href = loginPath;
}
