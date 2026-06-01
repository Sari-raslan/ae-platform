cd C:\Users\ssare\keyboard-manager
$ErrorActionPreference = "Continue"

function Log($m) {
  Add-Content ".\logs\secure-commercial-agent.log" "$(Get-Date -Format s) | $m"
}

Log "SECURE COMMERCIAL AGENT STARTED"

if (!(Test-Path ".\.env.commercial.local")) {
  Log "ERROR: .env.commercial.local missing"
  Log "Create it from .env.commercial.example"
  exit 1
}

Get-Content ".\.env.commercial.local" | ForEach-Object {
  if ($_ -match "^\s*([^#][^=]+)=(.*)$") {
    [Environment]::SetEnvironmentVariable($matches[1].Trim(), $matches[2].Trim(), "Process")
  }
}

$report = @{
  generatedAt = (Get-Date).ToString("s")
  githubTokenConfigured = [bool]$env:GITHUB_TOKEN
  stripeConfigured = [bool]$env:STRIPE_SECRET_KEY
  stripePriceConfigured = [bool]$env:STRIPE_PRICE_ID
  paypalConfigured = [bool]$env:PAYPAL_SECRET
  codeSigningConfigured = [bool]$env:CODE_SIGN_CERT_PATH
  websiteDeployConfigured = [bool]$env:WEBSITE_DEPLOY_TOKEN
  website = $env:UAOS_WEBSITE
  email = $env:UAOS_COMMERCIAL_EMAIL
}

$report | ConvertTo-Json -Depth 5 | Set-Content ".\commercial\secure-commercial-readiness.json" -Encoding UTF8

Log "Building frontend"
cd .\frontend
npm run build | Out-File "..\logs\secure-commercial-agent.log" -Append
cd ..

if (!(Test-Path ".\frontend\dist\index.html")) {
  Log "ERROR: frontend build failed"
  exit 1
}

Log "Building Windows release"
npm run release:win | Out-File ".\logs\secure-commercial-agent.log" -Append

Log "SECURE COMMERCIAL AGENT FINISHED"
