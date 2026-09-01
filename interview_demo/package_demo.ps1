[CmdletBinding()]
param(
  [string]$OutputName = '',
  [string]$QualityReport = '',
  [string]$LiveSmokeReport = ''
)

$ErrorActionPreference = 'Stop'
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new()
$OutputEncoding = [System.Text.UTF8Encoding]::new()

$repoRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
$builtHtml = Join-Path $repoRoot 'work\demo-build\index.html'
$staging = [System.IO.Path]::GetFullPath((Join-Path $repoRoot 'work\demo-package-staging'))
$outputs = [System.IO.Path]::GetFullPath((Join-Path $repoRoot 'outputs'))
$repoPrefix = $repoRoot.TrimEnd([System.IO.Path]::DirectorySeparatorChar) + [System.IO.Path]::DirectorySeparatorChar

foreach ($target in @($staging, $outputs)) {
  if (-not $target.StartsWith($repoPrefix, [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "Refusing path outside repository: $target"
  }
}

function Get-Sha256Hex {
  param([Parameter(Mandatory = $true)][string]$Path)
  $stream = [System.IO.File]::OpenRead($Path)
  try {
    $algorithm = [System.Security.Cryptography.SHA256]::Create()
    try {
      return ([System.BitConverter]::ToString($algorithm.ComputeHash($stream))).Replace('-', '')
    } finally {
      $algorithm.Dispose()
    }
  } finally {
    $stream.Dispose()
  }
}

if (-not (Test-Path -LiteralPath $builtHtml -PathType Leaf)) {
  throw 'Missing work\demo-build\index.html; run npm run build:demo first.'
}

$gitHead = (& git -C $repoRoot rev-parse HEAD).Trim()
$shortHead = (& git -C $repoRoot rev-parse --short=8 HEAD).Trim()
$workingTreeDirty = -not [string]::IsNullOrWhiteSpace((& git -C $repoRoot status --porcelain | Out-String))
if ($workingTreeDirty) {
  throw 'Final Demo packaging requires a clean Git worktree.'
}

if ([string]::IsNullOrWhiteSpace($QualityReport)) {
  $QualityReport = Join-Path $repoRoot 'work\verification\quality-report.json'
}
$resolvedQualityReport = (Resolve-Path -LiteralPath $QualityReport).Path
$quality = Get-Content -Raw -Encoding UTF8 -LiteralPath $resolvedQualityReport | ConvertFrom-Json
if ($quality.status -ne 'VERIFIED' -or $quality.schemaVersion -ne 1) {
  throw 'Quality report is absent or not VERIFIED.'
}
if ($quality.sourceRevision.gitHead -ne $gitHead -or $quality.sourceRevision.workingTreeDirty) {
  throw 'Quality report does not match the current clean Git revision.'
}
$qualityAge = [DateTime]::UtcNow - ([DateTime]::Parse([string]$quality.generatedAt)).ToUniversalTime()
if ($qualityAge.TotalHours -gt 24 -or $qualityAge.TotalSeconds -lt -300) {
  throw 'Quality report is stale or has an invalid timestamp.'
}
if ($quality.artifacts.demoHtmlSha256 -ne (Get-Sha256Hex -Path $builtHtml)) {
  throw 'Built Demo HTML does not match the verified artifact hash.'
}
$requiredAssertions = @('lint', 'typecheck', 'defaultTestsNoNetwork', 'productionBuild', 'offlineSingleFileBuild', 'offlineBrowserRender', 'offlineHtmlPresent')
$actualAssertions = @($quality.assertions.PSObject.Properties.Name)
if (Compare-Object -ReferenceObject $requiredAssertions -DifferenceObject $actualAssertions) {
  throw 'Quality report assertions do not exactly match the required gate set.'
}
$requiredSourceFiles = @(
  'src/ai/impact-analysis.ts',
  'src/ai/openai-impact-provider.ts',
  'src/ai/impact-route.ts',
  'src/components/decision-experience.tsx',
  'src/components/model-impact-experience.tsx',
  'src/data/nvda-model-fixtures.ts',
  'demo/main.tsx',
  'vite.demo.config.ts'
)
$actualSourceFiles = @($quality.sourceFileHashes.PSObject.Properties.Name)
if (Compare-Object -ReferenceObject $requiredSourceFiles -DifferenceObject $actualSourceFiles) {
  throw 'Quality report source hashes do not exactly match the required file set.'
}
foreach ($property in $quality.sourceFileHashes.PSObject.Properties) {
  $sourcePath = Join-Path $repoRoot $property.Name
  if (-not (Test-Path -LiteralPath $sourcePath -PathType Leaf)) {
    throw "Quality report references a missing source file: $($property.Name)"
  }
  if ((Get-Sha256Hex -Path $sourcePath) -ne [string]$property.Value) {
    throw "Source file changed after quality gates: $($property.Name)"
  }
}
foreach ($property in $quality.assertions.PSObject.Properties) {
  if ($property.Value -ne 'PASS') {
    throw "Quality assertion is not PASS: $($property.Name)"
  }
}
$stamp = [DateTime]::UtcNow.ToString('yyyyMMdd')
if ([string]::IsNullOrWhiteSpace($OutputName)) {
  $OutputName = "Serenity_Personal_Demo_${stamp}_${shortHead}.zip"
}
if ([System.IO.Path]::GetFileName($OutputName) -ne $OutputName -or -not $OutputName.EndsWith('.zip', [System.StringComparison]::OrdinalIgnoreCase)) {
  throw 'OutputName must be a plain .zip filename.'
}
$zipPath = Join-Path $outputs $OutputName

if (Test-Path -LiteralPath $staging) {
  Remove-Item -LiteralPath $staging -Recurse -Force
}
New-Item -ItemType Directory -Path $staging | Out-Null
New-Item -ItemType Directory -Path $outputs -Force | Out-Null

Copy-Item -LiteralPath $builtHtml -Destination (Join-Path $staging '00_START_HERE.html')
Copy-Item -LiteralPath (Join-Path $PSScriptRoot 'README_FIRST.txt') -Destination (Join-Path $staging '01_README_FIRST.txt')
Copy-Item -LiteralPath (Join-Path $PSScriptRoot 'INTERVIEW_SCRIPT.md') -Destination (Join-Path $staging '02_INTERVIEW_SCRIPT.md')
Copy-Item -LiteralPath (Join-Path $PSScriptRoot 'PROJECT_CONTEXT.md') -Destination (Join-Path $staging '03_PROJECT_CONTEXT.md')
Copy-Item -LiteralPath (Join-Path $PSScriptRoot 'DATA_AND_MODEL_NOTICE.txt') -Destination (Join-Path $staging '04_DATA_AND_MODEL_NOTICE.txt')

$liveSmoke = [ordered]@{
  status = 'NOT_RUN'
  reason = 'No verified live-smoke report was provided to the packager.'
  model = if ($env:OPENAI_MODEL) { $env:OPENAI_MODEL } else { 'gpt-5.6-luna' }
  verifiedAt = $null
}
if ([string]::IsNullOrWhiteSpace($LiveSmokeReport)) {
  $defaultLiveSmokeReport = Join-Path $repoRoot 'work\verification\live-model-smoke.json'
  if (Test-Path -LiteralPath $defaultLiveSmokeReport -PathType Leaf) {
    $LiveSmokeReport = $defaultLiveSmokeReport
  }
}
if (-not [string]::IsNullOrWhiteSpace($LiveSmokeReport)) {
  $resolvedReport = (Resolve-Path -LiteralPath $LiveSmokeReport).Path
  $report = Get-Content -Raw -Encoding UTF8 -LiteralPath $resolvedReport | ConvertFrom-Json
  $liveAge = [DateTime]::UtcNow - ([DateTime]::Parse([string]$report.verifiedAt)).ToUniversalTime()
  $liveReportValid = $report.schemaVersion -eq 1
  $liveReportValid = $liveReportValid -and $report.status -eq 'VERIFIED'
  $liveReportValid = $liveReportValid -and [bool]$report.verifiedAt
  $liveReportValid = $liveReportValid -and [bool]$report.model
  $liveReportValid = $liveReportValid -and $report.gitHead -eq $gitHead
  $liveReportValid = $liveReportValid -and $report.promptVersion -eq $quality.contracts.promptVersion
  $liveReportValid = $liveReportValid -and $report.impactSchemaSha256 -eq $quality.contracts.impactSchemaSha256
  $liveReportValid = $liveReportValid -and ([string]$report.inputHash -match '^[a-f0-9]{64}$')
  $liveReportValid = $liveReportValid -and ([string]$report.analysisRunId -match '^resp_')
  $liveReportValid = $liveReportValid -and $liveAge.TotalHours -le 24
  $liveReportValid = $liveReportValid -and $liveAge.TotalSeconds -ge -300
  if (-not $liveReportValid) {
    throw 'Live smoke report does not match the verified source and required assertions.'
  }
  $liveSmoke = [ordered]@{
    status = 'VERIFIED'
    reason = 'A separate live-smoke report was supplied and validated during packaging.'
    model = [string]$report.model
    verifiedAt = [string]$report.verifiedAt
  }
}

$verification = [ordered]@{
  schemaVersion = 1
  project = 'serenity-personal'
  generatedAt = [DateTime]::UtcNow.ToString('o')
  sourceRevision = [ordered]@{
    gitHead = $gitHead
    shortHead = $shortHead
    workingTreeDirty = $workingTreeDirty
  }
  demo = [ordered]@{
    mode = 'OFFLINE_FIXTURE'
    inputResearchAsOf = '2025-02-27T00:00:00.000Z'
    impactAnalysisAsOf = '2025-04-16T12:00:00.000Z'
    noInstall = $true
    noAccount = $true
    noApiKey = $true
    noAutomaticNetwork = $true
  }
  qualityGate = [ordered]@{
    reportGeneratedAt = [string]$quality.generatedAt
    promptVersion = [string]$quality.contracts.promptVersion
    impactSchemaSha256 = [string]$quality.contracts.impactSchemaSha256
    demoHtmlSha256 = [string]$quality.artifacts.demoHtmlSha256
  }
  implementationChecks = $quality.assertions
  liveModelSmoke = $liveSmoke
}
$verification | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath (Join-Path $staging '05_VERIFICATION.json') -Encoding UTF8

$hashLines = Get-ChildItem -LiteralPath $staging -File | Sort-Object Name | ForEach-Object {
  $hash = Get-Sha256Hex -Path $_.FullName
  "$hash *$($_.Name)"
}
[System.IO.File]::WriteAllLines(
  (Join-Path $staging '06_CHECKSUMS_SHA256.txt'),
  $hashLines,
  [System.Text.UTF8Encoding]::new($false)
)

if (Test-Path -LiteralPath $zipPath) {
  Remove-Item -LiteralPath $zipPath -Force
}
Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory(
  $staging,
  $zipPath,
  [System.IO.Compression.CompressionLevel]::Optimal,
  $false
)

$zipHash = Get-Sha256Hex -Path $zipPath
Write-Output "ZIP=$zipPath"
Write-Output "SHA256=$zipHash"
