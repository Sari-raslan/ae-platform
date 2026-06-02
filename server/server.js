import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Stripe from "stripe";
import crypto from "crypto";
import fs from "fs";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 8787;
const stripeKey = process.env.STRIPE_SECRET_KEY || "";
const stripe = stripeKey ? new Stripe(stripeKey) : null;
const dbPath = "./data/licenses.local.json";

function readDb() {
  if (!fs.existsSync(dbPath)) return [];
  return JSON.parse(fs.readFileSync(dbPath, "utf8"));
}

function writeDb(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

function createLicense(email = "customer@uaos.local") {
  const license = {
    key: "UAOS-" + crypto.randomBytes(4).toString("hex").toUpperCase() + "-" + crypto.randomBytes(4).toString("hex").toUpperCase(),
    email,
    status: "active",
    createdAt: new Date().toISOString()
  };

  const db = readDb();
  db.unshift(license);
  writeDb(db);
  return license;
}

app.get("/", (req, res) => {
  res.send(`
    <html>
      <body style="font-family:Arial;background:#050816;color:white;padding:40px">
        <h1>Universal Arranger OS</h1>
        <p>Commercial server online.</p>
        <p>Stripe configured: ${Boolean(stripeKey)}</p>
        <button onclick="fetch('/api/dev-create-license',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:'beta@uaos.local'})}).then(r=>r.json()).then(x=>alert(x.license.key))">Generate Beta License</button>
      </body>
    </html>
  `);
});

app.post("/api/create-checkout-session", async (req, res) => {
  try {
    if (!stripe) return res.status(400).json({ ok: false, message: "Stripe not configured" });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
      success_url: process.env.UAOS_SUCCESS_URL,
      cancel_url: process.env.UAOS_CANCEL_URL,
      customer_email: req.body.email || undefined,
      metadata: { product: "Universal Arranger OS" }
    });

    res.json({ ok: true, url: session.url });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
});

app.post("/api/dev-create-license", (req, res) => {
  res.json({ ok: true, license: createLicense(req.body.email) });
});

app.post("/api/activate-license", (req, res) => {
  const found = readDb().find((x) => x.key === req.body.key);
  if (!found) return res.status(404).json({ ok: false, message: "License not found" });
  res.json({ ok: true, license: found });
});

app.get("/success", (req, res) => res.send("<h1>Payment success</h1>"));
app.get("/cancel", (req, res) => res.send("<h1>Payment cancelled</h1>"));

app.listen(port, () => console.log(`UAOS commercial server running on http://localhost:${port}`));
