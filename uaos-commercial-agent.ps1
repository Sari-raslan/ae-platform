cd C:\Users\ssare\keyboard-manager
$ErrorActionPreference = "Continue"

function Log($m){
  Add-Content ".\logs\commercial-agent.log" "$(Get-Date -Format s) | $m"
}

Log "COMMERCIAL AGENT STARTED"

Log "Loading env file"
Get-Content ".\.env.commercial.local" | ForEach-Object {
  if ($_ -match "^\s*([^#][^=]+)=(.*)$") {
    [Environment]::SetEnvironmentVariable($matches[1].Trim(), $matches[2].Trim(), "Process")
  }
}

Log "Build frontend"
cd .\frontend
npm run build | Out-File "..\logs\commercial-agent.log" -Append
cd ..

if (!(Test-Path ".\frontend\dist\index.html")) {
  Log "ERROR build failed"
  exit 1
}

Log "Build Windows release"
npm run release:win | Out-File ".\logs\commercial-agent.log" -Append

Log "Create commercial manifest"
@"
{
  "product": "Universal Arranger OS",
  "channel": "commercial",
  "generatedAt": "$(Get-Date -Format s)",
  "githubTokenConfigured": $([bool]$env:GITHUB_TOKEN),
  "stripeConfigured": $([bool]$env:STRIPE_SECRET_KEY),
  "paypalConfigured": $([bool]$env:PAYPAL_SECRET),
  "codeSigningConfigured": $([bool]$env:CODE_SIGN_CERT_PATH),
  "websiteDeployConfigured": $([bool]$env:WEBSITE_DEPLOY_TOKEN)
}
"@ | Set-Content ".\commercial\commercial-agent-report.json" -Encoding UTF8

Log "Git commit/tag/push"
git add .
git commit -m "commercial background agent run" | Out-File ".\logs\commercial-agent.log" -Append

$tag = "v7.2.0-commercial-agent"
if (!(git tag --list $tag)) {
  git tag $tag
}

git push origin main --tags | Out-File ".\logs\commercial-agent.log" -Append

Log "COMMERCIAL AGENT FINISHED"
