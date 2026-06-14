/* =========================
   PRODUCT LIST
========================= */

app.get("/api/products", (req, res) => {

    db.all(
        "SELECT * FROM products ORDER BY id DESC",
        [],
        (err, rows) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json(rows);

        }
    );

});

/* =========================
   DELETE PRODUCT
========================= */

app.delete("/api/product/:id", (req, res) => {

    const id = req.params.id;

    db.run(
        "DELETE FROM products WHERE id = ?",
        [id],
        function(err) {

            if (err) {
                return res.status(500).json({
                    success: false,
                    error: err.message
                });
            }

            res.json({
                success: true
            });

        }
    );

});

/* =========================
   ORDER TELEGRAM
========================= */

app.post("/api/order", async (req, res) => {

    try {

        const {
            name,
            phone,
            location,
            products,
            total
        } = req.body;

        let message = `
🛒 YANGI BUYURTMA

👤 Ism:
${name}

📞 Telefon:
${phone}

📍 Lokatsiya:
${location}

━━━━━━━━━━━━━━

📦 MAHSULOTLAR

`;

        products.forEach(item => {

            message += `
${item.name}
Soni: ${item.qty}
Jami: ${(item.qty * item.price).toLocaleString()} so'm

`;

        });

        message += `
━━━━━━━━━━━━━━

💰 JAMI:
${Number(total).toLocaleString()} so'm
`;

        await bot.sendMessage(
            process.env.ADMIN_CHAT_ID,
            message
        );

        res.json({
            success: true
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

});app.post("/api/login", (req, res) => {
    const { login, password } = req.body;

    if(login === "lalanaar1" && password === "1999"){
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ login, password })
});

const data = await res.json();