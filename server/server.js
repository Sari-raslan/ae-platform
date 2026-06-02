cd C:\Users\ssare\keyboard-manager
$ErrorActionPreference = "Continue"

function Log($m){
  $line = "$(Get-Date -Format s) | $m"
  Write-Host $line
  Add-Content ".\logs\official-launch-agent.log" $line
}

Log "UAOS OFFICIAL LAUNCH AGENT STARTED"

$Version = "v8.0.0-official-launch-candidate"
$CommitMessage = "prepare official launch candidate pipeline"

New-Item -ItemType Directory -Force `
.\docs,`
.\legal,`
.\commercial,`
.\commercial\website,`
.\server,`
.\server\data,`
.\beta,`
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

Universal Arranger OS may collect feedback submitted by beta testers.

No payment card data is stored inside the desktop app.

Payment processing must be handled by Stripe, PayPal, or another secure provider.

Local license data may be stored on the user's device for activation status.

Contact:
support@uaos.app
"@ | Set-Content ".\legal\PRIVACY_POLICY.md" -Encoding UTF8

@"
# Terms of Service  Universal Arranger OS

Universal Arranger OS is provided as music production and arranger workstation software.

Beta versions may contain bugs.

Users are responsible for backing up their projects, samples, presets, and exported files.

Commercial use requires a valid license.

Refund policy and purchase terms must be finalized before public commercial launch.
"@ | Set-Content ".\legal\TERMS_OF_SERVICE.md" -Encoding UTF8

@"
# End User License Agreement  Universal Arranger OS

This license grants the user permission to install and use Universal Arranger OS.

Redistribution, resale, reverse engineering, or unauthorized copying is not permitted.

A commercial license key may be required for production builds.
"@ | Set-Content ".\legal\EULA.md" -Encoding UTF8

Log "Writing official launch docs"

@"
# Universal Arranger OS  Official Launch Candidate

## Version
v8.0.0-official-launch-candidate

## Status
Official Launch Candidate Prepared

## Included
- Electron Desktop Runtime
- React/Vite Build
- Windows Installer Pipeline
- Portable EXE Pipeline
- Commercial Website Placeholder
- Local License API
- Stripe Checkout Foundation
- PayPal Placeholder
- Privacy Policy
- Terms of Service
- EULA
- Beta Feedback Form
- Post-launch Monitor
- GitHub Tag Pipeline

## Still Required For Public Commercial Launch
- Real Stripe webhook server deployment
- Real website hosting/domain
- Code signing certificate activation
- GitHub Release artifact upload
- Auto-update production feed
- QA on multiple Windows machines
"@ | Set-Content ".\docs\OFFICIAL_LAUNCH_CANDIDATE.md" -Encoding UTF8

@"
# Beta Feedback Form

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

Log "Writing commercial website"

@"
<!doctype html>
<html>
<head>
  <meta charset='utf-8' />
  <title>Universal Arranger OS</title>
  <style>
    body{font-family:Arial;background:#050816;color:white;padding:40px}
    .card{background:#0d1324;border:1px solid #28324f;border-radius:18px;padding:28px;max-width:900px}
    a,button{display:inline-block;background:white;color:#050816;padding:12px 18px;border-radius:10px;text-decoration:none;font-weight:bold;border:0;margin:6px;cursor:pointer}
    .ok{color:#9cffb0}
  </style>
</head>
<body>
  <div class='card'>
    <h1>Universal Arranger OS</h1>
    <p class='ok'>Official Launch Candidate</p>
    <p>Professional arranger workstation for Windows.</p>
    <h2>Download</h2>
    <p>Use the files inside the release folder or GitHub Releases.</p>
    <a href='https://github.com/Sari-raslan/ae-platform/releases'>GitHub Releases</a>
    <h2>Purchase</h2>
    <p>Checkout is prepared. Activate Stripe/PayPal keys before public launch.</p>
    <a href='http://localhost:8787'>Local Purchase / License Server</a>
  </div>
</body>
</html>
"@ | Set-Content ".\commercial\website\index.html" -Encoding UTF8

Log "Writing commercial config"

@"
{
  "product": "Universal Arranger OS",
  "version": "8.0.0",
  "tag": "v8.0.0-official-launch-candidate",
  "channel": "launch-candidate",
  "publicLaunch": false,
  "closedBeta": true,
  "payments": {
    "stripe": "env-required",
    "paypal": "env-required"
  },
  "licenseServer": "local-foundation",
  "secretsPolicy": "local-env-only",
  "github": {
    "owner": "Sari-raslan",
    "repo": "ae-platform"
  }
}
"@ | Set-Content ".\commercial\official-launch-config.json" -Encoding UTF8

Log "Writing server"

@"
{
  "name": "uaos-commercial-server",
  "version": "8.0.0",
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
        <p>Official Launch Candidate License Server</p>
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

app.listen(port, () => console.log(`UAOS launch server running on http://localhost:${port}`));
