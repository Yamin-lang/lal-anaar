const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const multer = require("multer");
const cors = require("cors");
const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

/* =========================
   TELEGRAM
========================= */

const bot = new TelegramBot(
    process.env.BOT_TOKEN,
    { polling: true }
);
/* =========================
   DATABASE
========================= */

const db = new sqlite3.Database("./database/db.sqlite");

db.run(`
CREATE TABLE IF NOT EXISTS products(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    price INTEGER,
    image TEXT
)
`);

/* =========================
   MULTER
========================= */

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }

});

const upload = multer({ storage });

/* =========================
   TEST TELEGRAM
========================= */

bot.sendMessage(
    process.env.ADMIN_CHAT_ID,
    "🚀 Lal Anaar server ishga tushdi"
)
.then(() => {
    console.log("Telegram test yuborildi");
})
.catch((err) => {
    console.log("Telegram xatosi:");
    console.log(err.message);
});

/* =========================
   PRODUCT ADD
========================= */

app.post(
    "/api/product",
    upload.single("image"),
    (req, res) => {

        const { name, price } = req.body;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Rasm tanlanmagan"
            });
        }

        db.run(
            "INSERT INTO products(name,price,image) VALUES(?,?,?)",
            [
                name,
                price,
                req.file.filename
            ],
            function(err) {

                if (err) {
                    return res.status(500).json(err);
                }

                res.json({
                    success: true,
                    id: this.lastID
                });

            }
        );

    }
);

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

});/* =========================
DELETE PRODUCT
========================= */

app.delete("/api/product/:id", (req, res) => {

```
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
```

});

/* =========================
LOGIN API
========================= */

app.post("/api/login", (req, res) => {

```
const { login, password } = req.body;

if (
    login === "lalanaar1" &&
    password === "1999"
) {

    return res.json({
        success: true
    });

}

return res.status(401).json({
    success: false,
    message: "Login yoki parol noto'g'ri"
});
```

});/* =========================
   TELEGRAM START
========================= */

bot.onText(/\/start/, (msg) => {

    bot.sendMessage(
        msg.chat.id,
        "🍎 Lal Anaar katalogiga xush kelibsiz",
        {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: "📦 Katalog",
                            url: "https://lal-anaar.onrender.com"
                        }
                    ]
                ]
            }
        }
    );

});


/* =========================
   SERVER START
========================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(`
=================================
 LAL ANAAR SERVER ISHLADI
 http://localhost:${PORT}
=================================
`);

});