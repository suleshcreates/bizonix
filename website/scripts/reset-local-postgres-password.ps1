[CmdletBinding()]
param(
  [string]$EnvironmentFile = (Join-Path $PSScriptRoot "..\.env.local")
)

$ErrorActionPreference = "Stop"
$serviceName = "postgresql-x64-16"
$hbaPath = "C:\Program Files\PostgreSQL\16\data\pg_hba.conf"
$psqlPath = "C:\Program Files\PostgreSQL\16\bin\psql.exe"

if (-not (Test-Path -LiteralPath $EnvironmentFile)) {
  throw "Cannot find .env.local. Add POSTGRES_RECOVERY_PASSWORD there before running recovery."
}

$recoveryLine = Get-Content -LiteralPath $EnvironmentFile | Where-Object { $_ -match '^POSTGRES_RECOVERY_PASSWORD=' } | Select-Object -Last 1
if (-not $recoveryLine) {
  throw "POSTGRES_RECOVERY_PASSWORD is missing from .env.local."
}

$newPassword = $recoveryLine.Substring("POSTGRES_RECOVERY_PASSWORD=".Length).Trim()
if ($newPassword.Length -lt 16) {
  throw "POSTGRES_RECOVERY_PASSWORD must be at least 16 characters."
}

$originalHba = [System.IO.File]::ReadAllText($hbaPath)
$backupPath = "$hbaPath.bizonix-backup-$(Get-Date -Format 'yyyyMMddHHmmss')"
[System.IO.File]::WriteAllText($backupPath, $originalHba, (New-Object System.Text.UTF8Encoding($false)))

# This permits only the local recovery connection for the postgres user. The
# original SCRAM rules remain in place beneath it and are restored in finally.
$temporaryHba = @"
# Temporary Bizonix local recovery rule. Removed automatically by the recovery script.
host    all             postgres        127.0.0.1/32            trust
host    all             postgres        ::1/128                 trust

$originalHba
"@

try {
  [System.IO.File]::WriteAllText($hbaPath, $temporaryHba, (New-Object System.Text.UTF8Encoding($false)))
  Restart-Service -Name $serviceName -Force

  $escapedPassword = $newPassword.Replace("'", "''")
  & $psqlPath -w -h 127.0.0.1 -U postgres -d postgres -v ON_ERROR_STOP=1 -c "alter user postgres with password '$escapedPassword';"
  if ($LASTEXITCODE -ne 0) { throw "PostgreSQL did not accept the password reset command." }
} finally {
  [System.IO.File]::WriteAllText($hbaPath, $originalHba, (New-Object System.Text.UTF8Encoding($false)))
  Restart-Service -Name $serviceName -Force
}

Write-Output "Local PostgreSQL password reset and original authentication rules restored."
