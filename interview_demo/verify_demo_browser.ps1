[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new()
$OutputEncoding = [System.Text.UTF8Encoding]::new()

$repoRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
$htmlPath = (Resolve-Path -LiteralPath (Join-Path $repoRoot 'work\demo-build\index.html')).Path
$browserCandidates = @(
  'C:\Program Files\Google\Chrome\Application\chrome.exe',
  'C:\Program Files (x86)\Google\Chrome\Application\chrome.exe',
  'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe',
  'C:\Program Files\Microsoft\Edge\Application\msedge.exe'
)
$browser = $browserCandidates | Where-Object { Test-Path -LiteralPath $_ -PathType Leaf } | Select-Object -First 1
if (-not $browser) {
  throw 'No supported local Chrome or Edge executable was found for offline browser verification.'
}

$verifyRoot = [System.IO.Path]::GetFullPath((Join-Path $repoRoot 'work\browser-verify'))
$repoPrefix = $repoRoot.TrimEnd([System.IO.Path]::DirectorySeparatorChar) + [System.IO.Path]::DirectorySeparatorChar
if (-not $verifyRoot.StartsWith($repoPrefix, [System.StringComparison]::OrdinalIgnoreCase)) {
  throw "Refusing browser verification path outside repository: $verifyRoot"
}
if (Test-Path -LiteralPath $verifyRoot) {
  Remove-Item -LiteralPath $verifyRoot -Recurse -Force
}
New-Item -ItemType Directory -Path $verifyRoot | Out-Null

$profile = Join-Path $verifyRoot 'profile'
$stdout = Join-Path $verifyRoot 'dom.txt'
$stderr = Join-Path $verifyRoot 'errors.txt'
$uri = ([System.Uri]$htmlPath).AbsoluteUri
$arguments = @(
  '--headless=new',
  '--disable-gpu',
  '--no-first-run',
  '--disable-background-networking',
  '--disable-sync',
  '--metrics-recording-only',
  "--user-data-dir=$profile",
  '--dump-dom',
  $uri
)
$process = Start-Process -FilePath $browser -ArgumentList $arguments -WindowStyle Hidden -Wait -PassThru -RedirectStandardOutput $stdout -RedirectStandardError $stderr
if ($process.ExitCode -ne 0) {
  throw "Offline browser render failed with exit code $($process.ExitCode)."
}
$dom = Get-Content -Raw -Encoding UTF8 -LiteralPath $stdout
$markerBase64 = @(
  '56a757q/5ryU56S65qih5byP',
  'SDIwIOW/hemhu+WPluW+l+iuuOWPrw==',
  '6L2u5Yiw5oiR5YGa5Yaz5a6a',
  '57u05oyB5Y6f5Yik5pat',
  '5pS55Li66ZyA6KaB6YeN55yL',
  '5YWI6KGl6K+B5o2u5YaN5Yaz5a6a',
  '6L+Z5p2h5Yik5pat5bey5LiN5oiQ56uL'
)
$requiredMarkers = $markerBase64 | ForEach-Object {
  [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($_))
}
foreach ($marker in $requiredMarkers) {
  if (-not $dom.Contains($marker)) {
    throw "Rendered offline Demo is missing marker: $marker"
  }
}
if ((Get-Item -LiteralPath $stderr).Length -ne 0) {
  throw 'Headless browser wrote errors during offline Demo rendering.'
}

Write-Output "BROWSER=$browser"
Write-Output "OFFLINE_URI=$uri"
Write-Output "RENDERED_UTF8_BYTES=$([System.Text.Encoding]::UTF8.GetByteCount($dom))"
