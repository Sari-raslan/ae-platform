cd C:\Users\ssare\keyboard-manager
$ErrorActionPreference = "Continue"

"UAOS BACKGROUND AGENT STARTED: $(Get-Date)" | Out-File .\logs\background-agent.log -Append

git status | Out-File .\logs\background-agent.log -Append

cd .\frontend
npm run build | Out-File ..\logs\background-agent.log -Append
cd ..

npm run release:win | Out-File .\logs\background-agent.log -Append

git add .
git commit -m "background automated workstation update" | Out-File .\logs\background-agent.log -Append

$tag = "v6.1.0-background-agent-build"
if (!(git tag --list $tag)) {
  git tag $tag
}

git push origin main --tags | Out-File .\logs\background-agent.log -Append

"UAOS BACKGROUND AGENT FINISHED: $(Get-Date)" | Out-File .\logs\background-agent.log -Append
