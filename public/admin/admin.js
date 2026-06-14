const token = localStorage.getItem("admin_token");

if (!token) {
    window.location.href = "/admin/login.html";
}
const form = document.getElementById("productForm");
const list = document.getElementById("list");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const formData = new FormData(form);

    const res = await fetch("/api/product", {
        method: "POST",
        body: formData
    });

    const data = await res.json();

    if (data.success) {
        alert("Qo'shildi!");
        form.reset();
        loadProducts();
    } else {
        alert("Xatolik!");
    }

});

async function loadProducts() {

    const res = await fetch("/api/products");
    const products = await res.json();

    list.innerHTML = "";

    products.forEach(p => {

        list.innerHTML += `
            <div class="item">
                <img src="/uploads/${p.image}" width="80">

                <div>
                    <b>${p.name}</b><br>
                    ${Number(p.price).toLocaleString()} so'm
                </div>

                <button onclick="deleteProduct(${p.id})">
                    🗑 O'chirish
                </button>
            </div>
        `;
    });
}

async function deleteProduct(id) {

    if (!confirm("O'chirasizmi?")) return;

    await fetch("/api/product/${id}", {
        method: "DELETE"
    });

    loadProducts();
}

loadProducts();function logout() {
    localStorage.removeItem("admin_token");
    window.location.href = "/admin/login.html";
}