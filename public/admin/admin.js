const form = document.getElementById("productForm");
const list = document.getElementById("list");

/* =========================
   ADD PRODUCT
========================= */

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const formData = new FormData(form);

    const res = await fetch("/api/product", {
        method: "POST",
        body: formData
    });

    const data = await res.json();

    if (data.success) {

        alert("✅ Mahsulot qo'shildi");

        form.reset();

        loadProducts();

    } else {

        alert("❌ Xatolik yuz berdi");

    }

});

/* =========================
   LOAD PRODUCTS
========================= */

async function loadProducts() {

    const res = await fetch("/api/products");

    const products = await res.json();

    list.innerHTML = "";

    products.forEach(p => {

        list.innerHTML += `
            <div class="item">

                <img
                    src="/uploads/${p.image}"
                    width="80"
                >

                <div>
                    <b>${p.name}</b><br>
                    ${Number(p.price).toLocaleString()} so'm
                </div>

                <button
                    onclick="deleteProduct(${p.id})"
                >
                    🗑 O'chirish
                </button>

            </div>
        `;

    });

}

/* =========================
   DELETE PRODUCT
========================= */

async function deleteProduct(id) {

    const check =
        confirm("Mahsulotni o'chirasizmi?");

    if (!check) return;

    const res = await fetch(
        `/api/product/${id}`,
        {
            method: "DELETE"
        }
    );

    const data = await res.json();

    if (data.success) {

        alert("🗑 Mahsulot o'chirildi");

        loadProducts();

    } else {

        alert("❌ O'chirishda xatolik");

    }

}

/* =========================
   START
========================= */

loadProducts();