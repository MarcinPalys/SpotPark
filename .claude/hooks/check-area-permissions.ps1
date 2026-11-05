# Hook PreToolUse - egzekwuje podzial pracy w zespole SpotPark.
# Blokuje Damianowi edycje w SpotPark.Api/ (backend nalezy do Marcina).
# Marcin ma pelny dostep do obu obszarow.
# Rozpoznaje Damiana po git config user.email / user.name.

$ErrorActionPreference = 'SilentlyContinue'

$inputJson = [Console]::In.ReadToEnd()
if (-not $inputJson) { exit 0 }

try {
    $hookData = $inputJson | ConvertFrom-Json
} catch {
    exit 0
}

$filePath = $hookData.tool_input.file_path
if (-not $filePath) {
    $filePath = $hookData.tool_input.notebook_path
}
if (-not $filePath) { exit 0 }

$normalized = $filePath -replace '\\', '/'
$isBackend = ($normalized -match '(^|/)SpotPark\.Api(/|$)')
if (-not $isBackend) { exit 0 }

$gitEmail = ''
$gitName = ''
try { $gitEmail = (& git config user.email 2>$null) -join '' } catch {}
try { $gitName  = (& git config user.name  2>$null) -join '' } catch {}

$isDamian = ($gitEmail -like '*damian*') `
         -or ($gitEmail -like '*jurus*') `
         -or ($gitName  -like '*Damian*') `
         -or ($gitName  -like '*09876*')

if ($isDamian) {
    $reason = "Backend (SpotPark.Api/) nalezy do Marcina. Damian pracuje wylacznie w spotpark-frontend/. Zmiana zablokowana przez hook .claude/hooks/check-area-permissions.ps1. Jesli to pomylka: sprawdz git config user.email albo porozmawiaj z Marcinem."
    $payload = @{
        hookSpecificOutput = @{
            hookEventName = 'PreToolUse'
            permissionDecision = 'deny'
            permissionDecisionReason = $reason
        }
    }
    $json = $payload | ConvertTo-Json -Depth 5 -Compress
    Write-Output $json
    exit 0
}

exit 0
