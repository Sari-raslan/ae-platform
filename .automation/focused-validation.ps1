$ErrorActionPreference = "Stop"

# ---------------------------------------------------------
# CONFIG
# ---------------------------------------------------------

$RepoPath = "C:\Users\ssare\keyboard-manager"

$LogDir = "$RepoPath\.automation\logs"

$Timestamp = Get-Date -Format "yyyyMMdd-HHmmss"

New-Item -ItemType Directory `
  -Force `
  -Path $LogDir | Out-Null

$LogFile = "$LogDir\focused-validation-$Timestamp.log"

# ---------------------------------------------------------
# START LOGGING
# ---------------------------------------------------------

Start-Transcript -Path $LogFile

try {

    Set-Location $RepoPath

    Write-Host "======================================="
    Write-Host "FOCUSED SAFE VALIDATION STARTED"
    Write-Host "======================================="

    git -c safe.directory=$RepoPath status    $AllowedUntracked = @(
        ".automation/",
        "FINAL_DEPLOYMENT_REPORT.txt"
    )

    $statusLines = git `
      -c safe.directory=$RepoPath `
      status --porcelain

    $unexpected = @()

    foreach ($line in $statusLines) {
        $trimmed = $line.Trim()
        $allowed = $false

        foreach ($allowedPath in $AllowedUntracked) {
            if ($trimmed -like "*$allowedPath*") {
                $allowed = $true
            }
        }

        if (-not $allowed) {
            $unexpected += $trimmed
        }
    }

    if ($unexpected.Count -gt 0) {
        Write-Host "Unexpected working tree changes detected:"
        $unexpected | ForEach-Object { Write-Host $ErrorActionPreference = "Stop"

# ---------------------------------------------------------
# CONFIG
# ---------------------------------------------------------

$RepoPath = "C:\Users\ssare\keyboard-manager"

$LogDir = "$RepoPath\.automation\logs"

$Timestamp = Get-Date -Format "yyyyMMdd-HHmmss"

New-Item -ItemType Directory `
  -Force `
  -Path $LogDir | Out-Null

$LogFile = "$LogDir\focused-validation-$Timestamp.log"

# ---------------------------------------------------------
# START LOGGING
# ---------------------------------------------------------

Start-Transcript -Path $LogFile

try {

    Set-Location $RepoPath

    Write-Host "======================================="
    Write-Host "FOCUSED SAFE VALIDATION STARTED"
    Write-Host "======================================="

    git -c safe.directory=$RepoPath status

    $status = git `
      -c safe.directory=$RepoPath `
      status --porcelain

    if ($status) {
        throw "Working tree not clean."
    }

    Write-Host "Working tree clean."

    $RequiredFiles = @(
        "frontend/src/components/style-bank/StyleBankViewer.jsx",
        "frontend/src/components/style-bank/StyleBankGrid.jsx",
        "frontend/src/components/style-bank/StyleConflictPanel.jsx",
        "frontend/src/components/style-bank/StyleDiagnosticsPanel.jsx"
    )

    foreach ($file in $RequiredFiles) {

        if (!(Test-Path $file)) {
            throw "Missing required file: $file"
        }
    }

    Write-Host "Required files verified."

    if (!(Test-Path "node_modules")) {
        throw "node_modules missing."
    }

    Write-Host "Dependencies verified."

    Write-Host "Running build..."

    npm run build

    if ($LASTEXITCODE -ne 0) {
        throw "Build failed."
    }

    Write-Host "Build passed."

    Write-Host "Running smoke tests..."

    npm run smoke

    if ($LASTEXITCODE -ne 0) {
        throw "Smoke tests failed."
    }

    Write-Host "Smoke tests passed."

    $packageJson = Get-Content package.json -Raw

    if ($packageJson -match '"lint"') {

        Write-Host "Running lint..."

        $oldPreference = $ErrorActionPreference
        $ErrorActionPreference = "Continue"

        npm run lint

        $lintExit = $LASTEXITCODE

        $ErrorActionPreference = $oldPreference

        if ($lintExit -ne 0) {
            Write-Host "Lint warnings detected."
        }
        else {
            Write-Host "Lint passed."
        }
    }

    $postStatus = git `
      -c safe.directory=$RepoPath `
      status --porcelain

    if ($postStatus) {
        throw "Validation modified files."
    }

    git `
      -c safe.directory=$RepoPath `
      status --short

    git `
      -c safe.directory=$RepoPath `
      log --oneline -3

    Write-Host "======================================="
    Write-Host "FOCUSED SAFE VALIDATION COMPLETE"
    Write-Host "NO COMMITS CREATED"
    Write-Host "NO PUSH EXECUTED"
    Write-Host "READY FOR CONTROLLED RELEASE"
    Write-Host "======================================="
}
finally {

    Stop-Transcript

    Write-Host "Validation log:"
    Write-Host $LogFile
}
 }
        throw "Working tree contains unexpected changes."
    }

    Write-Host "Working tree verified."
    Write-Host "Only approved release files detected."

    $RequiredFiles = @(
        "frontend/src/components/style-bank/StyleBankViewer.jsx",
        "frontend/src/components/style-bank/StyleBankGrid.jsx",
        "frontend/src/components/style-bank/StyleConflictPanel.jsx",
        "frontend/src/components/style-bank/StyleDiagnosticsPanel.jsx"
    )

    foreach ($file in $RequiredFiles) {

        if (!(Test-Path $file)) {
            throw "Missing required file: $file"
        }
    }

    Write-Host "Required files verified."

    if (!(Test-Path "node_modules")) {
        throw "node_modules missing."
    }

    Write-Host "Dependencies verified."

    Write-Host "Running build..."

    npm run build

    if ($LASTEXITCODE -ne 0) {
        throw "Build failed."
    }

    Write-Host "Build passed."

    Write-Host "Running smoke tests..."

    npm run smoke

    if ($LASTEXITCODE -ne 0) {
        throw "Smoke tests failed."
    }

    Write-Host "Smoke tests passed."

    $packageJson = Get-Content package.json -Raw

    if ($packageJson -match '"lint"') {

        Write-Host "Running lint..."

        $oldPreference = $ErrorActionPreference
        $ErrorActionPreference = "Continue"

        npm run lint

        $lintExit = $LASTEXITCODE

        $ErrorActionPreference = $oldPreference

        if ($lintExit -ne 0) {
            Write-Host "Lint warnings detected."
        }
        else {
            Write-Host "Lint passed."
        }
    }

    $postStatus = git `
      -c safe.directory=$RepoPath `
      status --porcelain

    if ($postStatus) {
        throw "Validation modified files."
    }

    git `
      -c safe.directory=$RepoPath `
      status --short

    git `
      -c safe.directory=$RepoPath `
      log --oneline -3

    Write-Host "======================================="
    Write-Host "FOCUSED SAFE VALIDATION COMPLETE"
    Write-Host "NO COMMITS CREATED"
    Write-Host "NO PUSH EXECUTED"
    Write-Host "READY FOR CONTROLLED RELEASE"
    Write-Host "======================================="
}
finally {

    Stop-Transcript

    Write-Host "Validation log:"
    Write-Host $LogFile
}

