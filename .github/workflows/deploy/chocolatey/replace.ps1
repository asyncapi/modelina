param (
  [Parameter(Mandatory=$true)]
  [string]$version,
  [string]$checksum,
  [string]$checksum64
)

$filePaths = @(
  './tools/chocolateyinstall.ps1'
  './modelina.nuspec'
)

foreach ($filePath in $filePaths) {
  $fileContents = Get-Content $filePath
  $fileContents = $fileContents -replace '{{version}}', $version
  $fileContents = $fileContents -replace '{{checksum}}', $checksum
  $fileContents = $fileContents -replace '{{checksum64}}', $checksum64
  Set-Content $filePath $fileContents
}