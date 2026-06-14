const container = document.getElementById("productContainer");

let cart = [];

/* ===========================
   MAHSULOTLARNI YUKLASH
=========================== */

async function loadProducts() {

    const response = await fetch("/api/products");
    const products = await response.json();

    container.innerHTML = "";

    products.forEach(product => {

        container.innerHTML += `
        
        <div class="card">

            <img src="/uploads/${product.image}" alt="${product.name}">

            <div class="card-content">

                <h3>${product.name}</h3>

                <div class="price">
                    ${Number(product.price).toLocaleString()} so'm
                </div>

                <div class="counter">

                    <button onclick="minusProduct(${product.id})">
                        -
                    </button>

                    <span id="qty-${product.id}">0</span>

                    <button onclick="addProduct(${product.id}, '${product.name}', ${product.price})">
                        +
                    </button>

                </div>

                <div class="itemTotal" id="total-${product.id}">
                    0 so'm
                </div>

            </div>

        </div>
        `;
    });
}

/* ===========================
   SAVATGA QO'SHISH
=========================== */

function addProduct(id, name, price) {

    const item = cart.find(x => x.id === id);

    if (item) {
        item.qty++;
    } else {
        cart.push({ id, name, price, qty: 1 });
    }

    renderCart();
}

/* ===========================
   KAMAYTIRISH
=========================== */

function minusProduct(id) {

    const item = cart.find(x => x.id === id);

    if (!item) return;

    item.qty--;

    if (item.qty <= 0) {
        cart = cart.filter(x => x.id !== id);
    }

    renderCart();
}

/* ===========================
   CART UPDATE
=========================== */

function renderCart() {

    document.getElementById("cartCount").innerText =
        cart.reduce((sum, item) => sum + item.qty, 0);

    document.querySelectorAll("[id^='qty-']").forEach(el => {
        el.innerText = 0;
    });

    document.querySelectorAll("[id^='total-']").forEach(el => {
        el.innerText = "0 so'm";
    });

    cart.forEach(item => {

        const qtyElement = document.getElementById(`qty-${item.id}`);
        const totalElement = document.getElementById(`total-${item.id}`);

        if (qtyElement) qtyElement.innerText = item.qty;

        if (totalElement) {
            totalElement.innerText =
                (item.qty * item.price).toLocaleString() + " so'm";
        }

    });

    updateCartModal();
}

/* ===========================
   MODAL CART
=========================== */

function updateCartModal() {

    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");

    cartItems.innerHTML = "";

    let total = 0;

    cart.forEach(item => {

        total += item.price * item.qty;

        cartItems.innerHTML += `
        
        <div class="cart-item">

            <div>
                <b>${item.name}</b>
            </div>

            <div class="cart-controls">

                <button onclick="minusProduct(${item.id})">-</button>

                <span>${item.qty}</span>

                <button onclick="addProduct(${item.id}, '${item.name}', ${item.price})">+</button>

            </div>

            <div>
                ${(item.qty * item.price).toLocaleString()} so'm
            </div>

        </div>
        `;
    });

    cartTotal.innerText = total.toLocaleString() + " so'm";
}

/* ===========================
   OPEN / CLOSE CART
=========================== */

function openCart() {
    document.getElementById("cartModal").style.display = "block";
}

function closeCart() {
    document.getElementById("cartModal").style.display = "none";
}

/* ===========================
   ADMIN
=========================== */

function openAdmin() {

    const password = prompt("Admin parolini kiriting");

    if (password === "12345") {
        window.location.href = "/admin/admin.html";
    } else {
        alert("Parol noto'g'ri");
    }
}

/* ===========================
   ORDER BUTTON
=========================== */

document.querySelector(".checkoutBtn")
.addEventListener("click", sendOrder);

/* ===========================
   SEND ORDER (TELEGRAM)
=========================== */

async function sendOrder() {

    if (cart.length === 0) {
        alert("Savat bo'sh");
        return;
    }

    const name =
        document.getElementById("customerName").value.trim();

    const phone =
        document.getElementById("customerPhone").value.trim();

    const location =
        document.getElementById("customerLocation").value.trim();

    if (!name || !phone || !location) {
        alert("Barcha maydonlarni to'ldiring");
        return;
    }

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.qty,
        0
    );

    const res = await fetch("/api/order", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name,
            phone,
            location,
            products: cart,
            total
        })
    });

    const data = await res.json();

    if (data.success) {

        alert("Buyurtma yuborildi ✅");

        cart = [];

        renderCart();

        closeCart();

    } else {
        alert("Xatolik yuz berdi ❌");
    }
}

/* ===========================
   START
=========================== */

loadProducts();