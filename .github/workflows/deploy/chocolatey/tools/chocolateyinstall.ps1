$ErrorActionPreference = 'Stop' # stop on all errors
$toolsDir   = "$(Split-Path -parent $MyInvocation.MyCommand.Definition)"

$url          = 'https://github.com/asyncapi/modelina/releases/download/v{{version}}/modelina.x86.exe'
$url64        = 'https://github.com/asyncapi/modelina/releases/download/v{{version}}/modelina.x64.exe' 

$packageArgs = @{
  packageName   = $env:ChocolateyPackageName
  unzipLocation = $toolsDir
  fileType      = 'EXE' 
  url           = $url
  url64bit      = $url64
  #file         = $fileLocation NOTE: Commented out because we are using url instead

  softwareName  = 'asyncapi-modelina*'

  checksum      = '{{checksum}}'
  checksumType  = 'sha256' #default is md5, can also be sha1, sha256 or sha512
  checksum64    = '{{checksum64}}'
  checksumType64= 'sha256' #default is checksumType

  validExitCodes= @(0, 3010, 1641)
  silentArgs   = '/S'           # NSIS
}

Install-ChocolateyPackage @packageArgs # https://docs.chocolatey.org/en-us/create/functions/install-chocolateypackage
