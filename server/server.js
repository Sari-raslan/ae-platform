cd C:\Users\ssare\keyboard-manager
$ErrorActionPreference = "Continue"

function Log($m){
  $line = "$(Get-Date -Format s) | $m"
  Write-Host $line
  Add-Content ".\logs\uaos-final-background-agent.log" $line
}

Log "UAOS FINAL BACKGROUND AGENT STARTED"

$Version = "v8.2.0-final-background-launch-agent"
$CommitMessage = "final background launch automation"

New-Item -ItemType Directory -Force `
.\docs,`
.\legal,`
.\commercial,`
.\commercial\website,`
.\beta,`
.\server,`
.\server\data,`
.\release,`
.\logs `
| Out-Null

Log "Protecting secrets"

Add-Content .gitignore "`n.env.commercial.local"
Add-Content .gitignore "`n.env*"
Add-Content .gitignore "`n*.local"
Add-Content .gitignore "`nserver/.env"
Add-Content .gitignore "`nserver/data/*.local.json"
Add-Content .gitignore "`n*.pfx"
Add-Content .gitignore "`n*.pem"
Add-Content .gitignore "`n*.key"

git rm --cached .env.commercial.local 2>$null
git rm --cached server/.env 2>$null

Log "Writing legal docs"

@"
# Privacy Policy  Universal Arranger OS

Universal Arranger OS may collect optional beta feedback.

No payment card information is stored inside the desktop app.

Payments must be processed through Stripe, PayPal, or another secure provider.

License data may be stored locally for activation status.

Contact:
support@uaos.app
"@ | Set-Content ".\legal\PRIVACY_POLICY.md" -Encoding UTF8

@"
# Terms of Service  Universal Arranger OS

Universal Arranger OS is music workstation software.

Beta versions may contain bugs.

Users are responsible for backups.

Commercial use requires a valid license.
"@ | Set-Content ".\legal\TERMS_OF_SERVICE.md" -Encoding UTF8

@"
# EULA  Universal Arranger OS

This software is licensed, not sold.

Unauthorized redistribution, resale, or reverse engineering is prohibited.

A commercial license key may be required.
"@ | Set-Content ".\legal\EULA.md" -Encoding UTF8

Log "Writing beta feedback"

@"
# Universal Arranger OS  Beta Feedback Form

Name:
Email:
Country:
Device:
Windows Version:
MIDI Keyboard:
Audio Interface:

## Checklist

[ ] App opens
[ ] Installer works
[ ] Portable EXE works
[ ] Audio works
[ ] MIDI detected
[ ] Arranger works
[ ] Samples load
[ ] Project save/load works
[ ] License activation works
[ ] Checkout page works

## Problems

Write here:

## Suggestions

Write here:

## Rating

1 / 2 / 3 / 4 / 5
"@ | Set-Content ".\beta\BETA_FEEDBACK_FORM.md" -Encoding UTF8

Log "Writing commercial config"

@"
{
  "product": "Universal Arranger OS",
  "version": "8.2.0",
  "channel": "launch-candidate",
  "closedBeta": true,
  "publicLaunch": false,
  "payments": {
    "stripe": "env-required",
    "paypal": "env-required"
  },
  "licenseServer": "local-foundation",
  "secretsPolicy": "local-env-only"
}
"@ | Set-Content ".\commercial\official-launch-config.json" -Encoding UTF8

Log "Writing website"

@"
<!doctype html>
<html>
<head>
<meta charset='utf-8' />
<title>Universal Arranger OS</title>
<style>
body{font-family:Arial;background:#050816;color:white;padding:40px}
.card{background:#0d1324;border:1px solid #28324f;border-radius:18px;padding:28px;max-width:900px}
a{display:inline-block;background:white;color:#050816;padding:12px 18px;border-radius:10px;text-decoration:none;font-weight:bold;margin:6px}
.ok{color:#9cffb0}
</style>
</head>
<body>
<div class='card'>
<h1>Universal Arranger OS</h1>
<p class='ok'>Official Launch Candidate</p>
<p>Professional arranger workstation for Windows.</p>
<a href='https://github.com/Sari-raslan/ae-platform/releases'>GitHub Releases</a>
<a href='http://localhost:8787'>Purchase / License Server</a>
</div>
</body>
</html>
"@ | Set-Content ".\commercial\website\index.html" -Encoding UTF8

Log "Writing server"

@"
{
  "name": "uaos-commercial-server",
  "version": "8.2.0",
  "type": "module",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.3",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "stripe": "^14.25.0"
  }
}
"@ | Set-Content ".\server\package.json" -Encoding UTF8

@"
PORT=8787
STRIPE_SECRET_KEY=
STRIPE_PRICE_ID=
UAOS_SUCCESS_URL=http://localhost:8787/success
UAOS_CANCEL_URL=http://localhost:8787/cancel
"@ | Set-Content ".\server\.env.example" -Encoding UTF8

@'
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
        <p>License / Checkout Server Online</p>
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

app.listen(port, () => console.log(`UAOS server running on http://localhost:${port}`));
