cd C:\Users\ssare\keyboard-manager
$ErrorActionPreference = "Continue"

function Log($m){
  $line = "$(Get-Date -Format s) | $m"
  Write-Host $line
  Add-Content ".\logs\full-auto-commercial-agent.log" $line
}

Log "UAOS FULL AUTO COMMERCIAL AGENT STARTED"

# حماية الأسرار
Log "Securing secrets"
Add-Content .gitignore "`n.env.commercial.local"
Add-Content .gitignore "`n.env*"
Add-Content .gitignore "`n*.local"
Add-Content .gitignore "`nserver/.env"
Add-Content .gitignore "`nserver/data/*.local.json"
Add-Content .gitignore "`ncommercial-agent-secrets.json"

git rm --cached .env.commercial.local 2>$null
git rm --cached server/.env 2>$null

# إنشاء المجلدات
Log "Creating folders"
New-Item -ItemType Directory -Force .\commercial,.\commercial\website,.\beta,.\docs,.\release,.\server,.\server\data | Out-Null

# Beta feedback
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

# Commercial report
Log "Writing commercial readiness report"
@"
# Universal Arranger OS  Commercial Readiness

Generated: $(Get-Date)

## Status

Prepared for Closed Beta and Commercial Pipeline.

## Completed

- Frontend build pipeline
- Electron desktop runtime
- Windows release pipeline
- Beta feedback form
- Commercial config foundation
- Local license API foundation
- Stripe/PayPal env placeholders
- Secrets protected by .gitignore

## Not automatic without accounts/API activation

- Real payment charging
- Real license server hosting
- Real website deployment
- Code signing certificate activation
- Real auto update publishing

## Next Manual Items

- Rotate exposed Stripe key
- Put new keys only in .env.commercial.local
- Do not commit secrets
- Upload release artifacts to GitHub Release or website
"@ | Set-Content ".\commercial\COMMERCIAL_READINESS_REPORT.md" -Encoding UTF8

# Commercial config safe
Log "Writing safe commercial config"
@"
{
  "product": "Universal Arranger OS",
  "version": "7.6.0",
  "channel": "commercial-beta",
  "purchaseEnabled": false,
  "secretsPolicy": "local-env-only",
  "envFile": ".env.commercial.local",
  "github": {
    "owner": "Sari-raslan",
    "repo": "ae-platform"
  },
  "status": "closed-beta-ready"
}
"@ | Set-Content ".\commercial\commercial-config.safe.json" -Encoding UTF8

# Website landing
Log "Writing local website landing"
@"
<!doctype html>
<html>
<head>
  <meta charset='utf-8' />
  <title>Universal Arranger OS</title>
  <style>
    body{font-family:Arial;background:#050816;color:white;padding:40px}
    .card{background:#0d1324;border:1px solid #28324f;border-radius:18px;padding:28px;max-width:800px}
    a{display:inline-block;background:white;color:#050816;padding:12px 18px;border-radius:10px;text-decoration:none;font-weight:bold}
  </style>
</head>
<body>
  <div class='card'>
    <h1>Universal Arranger OS</h1>
    <p>Professional arranger workstation for Windows.</p>
    <h2>Closed Beta / Commercial Preview</h2>
    <p>Installer and portable EXE are inside the release folder.</p>
    <a href='https://github.com/Sari-raslan/ae-platform/releases'>GitHub Releases</a>
  </div>
</body>
</html>
"@ | Set-Content ".\commercial\website\index.html" -Encoding UTF8

# Server safe foundation
Log "Writing local license server"
@"
{
  "name": "uaos-commercial-server",
  "version": "7.6.0",
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
  res.json({
    product: "Universal Arranger OS",
    status: "online",
    stripeConfigured: Boolean(stripeKey)
  });
});

app.post("/api/create-checkout-session", async (req, res) => {
  try {
    if (!stripe) {
      return res.status(400).json({ ok: false, message: "Stripe not configured" });
    }

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

app.listen(port, () => {
  console.log(`UAOS commercial server running on http://localhost:${port}`);
});
