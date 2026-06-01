cd C:\Users\ssare\keyboard-manager
$ErrorActionPreference = "Continue"

function Log($m){
  $line = "$(Get-Date -Format s) | $m"
  Write-Host $line
  Add-Content ".\logs\overnight-agent.log" $line
}

Log "UAOS OVERNIGHT AGENT STARTED"

Log "1. Git status"
git status | Out-File ".\logs\overnight-agent.log" -Append

Log "2. Creating beta feedback package"

@"
# Universal Arranger OS  Beta Test Guide

## هدف النسخة التجريبية

اختبار:
- Electron desktop runtime
- MIDI workflow
- Arranger playback
- Sample engine
- Project save/load
- Installer
- Portable EXE

## المطلوب من المجربين

1. تشغيل البرنامج
2. اختبار الصوت
3. تجربة MIDI USB keyboard
4. تجربة Start / Stop arranger
5. تجربة تحميل samples
6. إرسال الملاحظات

## أسئلة الملاحظات

- هل البرنامج فتح بدون شاشة بيضاء أو سوداء
- هل الصوت يعمل
- هل MIDI ظهر
- هل الواجهة مفهومة
- هل حصل crash
- ما أهم ميزة ناقصة
"@ | Set-Content ".\beta\BETA_TEST_GUIDE.md" -Encoding UTF8

@"
# Universal Arranger OS  Feedback Form

Name:
Device:
Windows Version:
MIDI Keyboard:
Audio Interface:

## Result

[ ] App opened
[ ] Audio worked
[ ] MIDI detected
[ ] Arranger worked
[ ] Installer worked
[ ] Portable EXE worked

## Problems

Write here:

## Suggestions

Write here:
"@ | Set-Content ".\beta\FEEDBACK_FORM.md" -Encoding UTF8

@"
# UAOS Overnight Agent Report

Started: $(Get-Date)

Tasks:
- Build frontend
- Build Windows release
- Generate beta docs
- Prepare release artifacts
- Commit and push
"@ | Set-Content ".\docs\OVERNIGHT_AGENT_REPORT.md" -Encoding UTF8

Log "3. Building frontend"
cd .\frontend
npm run build | Out-File "..\logs\overnight-agent.log" -Append
cd ..

if (!(Test-Path ".\frontend\dist\index.html")) {
  Log "ERROR: frontend dist missing"
  exit 1
}

Log "4. Building Windows release"
npm run release:win | Out-File ".\logs\overnight-agent.log" -Append

Log "5. Writing final beta manifest"

@"
{
  "product": "Universal Arranger OS",
  "phase": "beta-testing",
  "version": "v6.1.0-beta-agent",
  "status": "beta-package-ready",
  "generatedAt": "$(Get-Date -Format s)",
  "outputs": [
    "release/",
    "beta/BETA_TEST_GUIDE.md",
    "beta/FEEDBACK_FORM.md",
    "docs/OVERNIGHT_AGENT_REPORT.md"
  ]
}
"@ | Set-Content ".\beta\beta-manifest.json" -Encoding UTF8

Log "6. Git commit/tag/push"

git add .
git commit -m "prepare beta testing package from overnight agent" | Out-File ".\logs\overnight-agent.log" -Append

$tag = "v6.1.0-beta-agent"
if (!(git tag --list $tag)) {
  git tag $tag
}

git push origin main --tags | Out-File ".\logs\overnight-agent.log" -Append

Log "7. Final status"
git status | Out-File ".\logs\overnight-agent.log" -Append

Log "UAOS OVERNIGHT AGENT FINISHED"
