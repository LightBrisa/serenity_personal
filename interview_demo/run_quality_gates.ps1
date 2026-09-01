[CmdletBinding()]
param(
  [switch]$AllowDirty
)

$ErrorActionPreference = 'Stop'
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new()
$OutputEncoding = [System.Text.UTF8Encoding]::new()

$repoRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
$reportDir = [System.IO.Path]::GetFullPath((Join-Path $repoRoot 'work\verification'))
$repoPrefix = $repoRoot.TrimEnd([System.IO.Path]::DirectorySeparatorChar) + [System.IO.Path]::DirectorySeparatorChar
if (-not $reportDir.StartsWith($repoPrefix, [System.StringComparison]::OrdinalIgnoreCase)) {
  throw "Refusing report path outside repository: $reportDir"
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

$gitHead = (& git -C $repoRoot rev-parse HEAD).Trim()
$shortHead = (& git -C $repoRoot rev-parse --short=8 HEAD).Trim()
$dirtyBefore = -not [string]::IsNullOrWhiteSpace((& git -C $repoRoot status --porcelain | Out-String))
if ($dirtyBefore -and -not $AllowDirty) {
  throw 'Quality gates require a clean Git worktree. Commit the intended source first, or use -AllowDirty only for a non-final rehearsal.'
}

$assertions = [ordered]@{}
function Invoke-NpmGate {
  param([string]$Name, [string]$Script)
  & npm.cmd run $Script
  if ($LASTEXITCODE -ne 0) {
    throw "Quality gate failed: $Name"
  }
  $script:assertions[$Name] = 'PASS'
}

Invoke-NpmGate -Name 'lint' -Script 'lint'
Invoke-NpmGate -Name 'typecheck' -Script 'typecheck'
Invoke-NpmGate -Name 'defaultTestsNoNetwork' -Script 'test'
Invoke-NpmGate -Name 'productionBuild' -Script 'build'
Invoke-NpmGate -Name 'offlineSingleFileBuild' -Script 'build:demo'

& powershell -NoProfile -ExecutionPolicy Bypass -File (Join-Path $PSScriptRoot 'verify_demo_browser.ps1')
if ($LASTEXITCODE -ne 0) {
  throw 'Quality gate failed: offlineBrowserRender'
}
$assertions['offlineBrowserRender'] = 'PASS'

$demoHtml = Join-Path $repoRoot 'work\demo-build\index.html'
if (-not (Test-Path -LiteralPath $demoHtml -PathType Leaf)) {
  throw 'Offline build completed without work\demo-build\index.html.'
}
$assertions['offlineHtmlPresent'] = 'PASS'

$dirtyAfter = -not [string]::IsNullOrWhiteSpace((& git -C $repoRoot status --porcelain | Out-String))
if ($dirtyAfter -ne $dirtyBefore) {
  throw 'Tracked worktree state changed while quality gates were running.'
}

$criticalFiles = @(
  'src/ai/impact-analysis.ts',
  'src/ai/openai-impact-provider.ts',
  'src/ai/impact-route.ts',
  'src/components/decision-experience.tsx',
  'src/components/model-impact-experience.tsx',
  'src/data/nvda-model-fixtures.ts',
  'demo/main.tsx',
  'vite.demo.config.ts'
)
$sourceFileHashes = [ordered]@{}
foreach ($relativePath in $criticalFiles) {
  $absolutePath = Join-Path $repoRoot $relativePath
  if (-not (Test-Path -LiteralPath $absolutePath -PathType Leaf)) {
    throw "Missing critical source file: $relativePath"
  }
  $sourceFileHashes[$relativePath] = Get-Sha256Hex -Path $absolutePath
}

$impactSource = Get-Content -Raw -Encoding UTF8 -LiteralPath (Join-Path $repoRoot 'src\ai\impact-analysis.ts')
$promptMatch = [regex]::Match($impactSource, "IMPACT_PROMPT_VERSION\s*=\s*'([^']+)'")
if (-not $promptMatch.Success) {
  throw 'Could not read IMPACT_PROMPT_VERSION from source.'
}

New-Item -ItemType Directory -Path $reportDir -Force | Out-Null
$reportPath = Join-Path $reportDir 'quality-report.json'
$report = [ordered]@{
  schemaVersion = 1
  status = 'VERIFIED'
  generatedAt = [DateTime]::UtcNow.ToString('o')
  sourceRevision = [ordered]@{
    gitHead = $gitHead
    shortHead = $shortHead
    workingTreeDirty = $dirtyAfter
  }
  contracts = [ordered]@{
    promptVersion = $promptMatch.Groups[1].Value
    impactSchemaSha256 = $sourceFileHashes['src/ai/impact-analysis.ts']
  }
  artifacts = [ordered]@{
    demoHtmlSha256 = Get-Sha256Hex -Path $demoHtml
    demoHtmlBytes = (Get-Item -LiteralPath $demoHtml).Length
  }
  assertions = $assertions
  sourceFileHashes = $sourceFileHashes
}
$report | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $reportPath -Encoding UTF8
Write-Output "QUALITY_REPORT=$reportPath"
