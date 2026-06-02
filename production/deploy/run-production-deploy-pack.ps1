cd C:\Users\ssare\keyboard-manager
$ErrorActionPreference = "Continue"

function Log($m){
  Add-Content ".\logs\production-deploy.log" "$(Get-Date -Format s) | $m"
}

Log "PRODUCTION DEPLOY PACK STARTED"

if (!(Test-Path ".\.env.production.local")) {
  Copy-Item ".\.env.production.example" ".\.env.production.local"
  Log "Created .env.production.local. Fill it before real deploy."
}

Add-Content .gitignore "`n.env.production.local"
Add-Content .gitignore "`n*.pfx"
Add-Content .gitignore "`n*.pem"
Add-Content .gitignore "`n*.key"

cd .\frontend
npm run build | Out-File "..\logs\production-deploy.log" -Append
cd ..

npm run release:win | Out-File ".\logs\production-deploy.log" -Append

$exe = Get-ChildItem ".\release" -Recurse -Filter *.exe -ErrorAction SilentlyContinue

@"
# UAOS Production Deployment Checklist

Generated: $(Get-Date)

## Build
- EXE Count: $($exe.Count)

## Required Manual Production Steps
- [ ] Rotate old Stripe key
- [ ] Add fresh keys to .env.production.local
- [ ] Deploy website hosting
- [ ] Deploy Stripe webhook server
- [ ] Configure Stripe webhook URL
- [ ] Run code signing
- [ ] Test installer on 3 Windows devices
- [ ] Upload release artifacts to GitHub Release
- [ ] Enable public download page

## EXE Files
$($exe | ForEach-Object { $_.FullName } | Out-String)
"@ | Set-Content ".\production\PRODUCTION_DEPLOYMENT_CHECKLIST.md" -Encoding UTF8

Copy-Item ".\release\*.exe" ".\production\artifacts\" -Force -ErrorAction SilentlyContinue

git add .gitignore .env.production.example production
git commit -m "add production deployment pack" 2>$null

$tag = "v9.1.0-production-deployment-pack"
if (!(git tag --list $tag)) {
  git tag $tag
}

git push origin main --tags | Out-File ".\logs\production-deploy.log" -Append

Start-Process notepad ".\production\PRODUCTION_DEPLOYMENT_CHECKLIST.md"
Start-Process ".\production\artifacts"

Log "PRODUCTION DEPLOY PACK FINISHED"
