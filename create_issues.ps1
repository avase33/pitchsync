# PitchSync -- Create GitHub Issues via REST API
param([string]$Token = $env:GITHUB_TOKEN)

$repo = "avase33/pitchsync"

if (-not $Token) {
    try {
        $credInput = "protocol=https`nhost=github.com`n"
        $credOutput = $credInput | git credential fill 2>$null
        $Token = ($credOutput | Where-Object { $_ -match "^password=" }) -replace "^password=", ""
    } catch {}
}

if (-not $Token) {
    Write-Host "ERROR: No GitHub token found." -ForegroundColor Red
    Write-Host "Set GITHUB_TOKEN env var or pass -Token <your-pat>" -ForegroundColor Yellow
    exit 1
}

$headers = @{
    "Authorization" = "Bearer $Token"
    "Accept" = "application/vnd.github+json"
    "X-GitHub-Api-Version" = "2022-11-28"
}

$baseUrl = "https://api.github.com/repos/$repo/issues"

$issues = @(
    @{
        title = "MVP: GitHub repo analysis and 10-slide pitch deck generation"
        body  = "Core flow: user pastes GitHub URL -> backend fetches README/metadata/languages -> analyzer extracts problem/solution/tech stack -> slideGenerator produces 10 ordered slides -> frontend polls and displays with SlideViewer."
        labels = @("enhancement")
    },
    @{
        title = "Slide editor: inline edit any slide content"
        body  = "Add an Edit mode to PitchDetailPage. Users can click any slide and edit headline, subheadline, bullet points, and items inline. Save via PATCH /api/pitches/:id with updated slides array."
        labels = @("enhancement")
    },
    @{
        title = "PDF export: download pitch deck as PDF"
        body  = "Use Puppeteer headless to render each slide at 1280x720, capture screenshots, and assemble into a multi-page PDF. Add a Download PDF button to PitchDetailPage."
        labels = @("enhancement")
    },
    @{
        title = "GitHub OAuth: support private repos"
        body  = "Add GitHub OAuth flow so users can connect their GitHub account and generate pitches from private repos they own. Store GitHub access token encrypted per user."
        labels = @("enhancement")
    },
    @{
        title = "AI-enhanced analysis with GPT-4o-mini"
        body  = "After heuristic analysis, send the README and repo metadata to GPT-4o-mini to generate richer, more accurate slide content. Falls back to heuristics if API is unavailable or fails."
        labels = @("enhancement", "ai")
    },
    @{
        title = "Slide theme customization and custom color palettes"
        body  = "Allow users to pick accent colors, background gradients, and font styles beyond the 5 built-in themes. Save custom theme per pitch. Preview in real time."
        labels = @("enhancement")
    },
    @{
        title = "Team collaboration: multi-user pitch editing"
        body  = "Add collaborators to a pitch deck. Owners can invite editors by email. Real-time collaborative editing via WebSocket or polling. Role: owner, editor, viewer."
        labels = @("enhancement")
    },
    @{
        title = "Embed widget: shareable iframe for pitch slides"
        body  = "Generate an embed code (<iframe src='/embed/:slug'>) for any public pitch. Embed viewer is a minimal fullscreen slide carousel with no auth required."
        labels = @("enhancement")
    },
    @{
        title = "PowerPoint export: download as .pptx"
        body  = "Use pptxgenjs to generate a .pptx file from slides. Each slide maps to a PPTX slide with matching layout (title, bullets, tech grid, roadmap columns). Download via API endpoint."
        labels = @("enhancement")
    },
    @{
        title = "Docker Compose + production CI/CD pipeline"
        body  = "Finalize docker-compose.yml for prod (nginx + backend + mongodb + healthchecks). GitHub Actions: test -> lint -> build docker images -> push ghcr.io -> SSH deploy. Document in README."
        labels = @("devops")
    }
)

Write-Host "Creating 10 milestone issues on $repo..." -ForegroundColor Cyan
Write-Host ""

$created = 0
foreach ($issue in $issues) {
    $body = @{
        title  = $issue.title
        body   = $issue.body
        labels = $issue.labels
    } | ConvertTo-Json

    try {
        $response = Invoke-RestMethod -Uri $baseUrl -Method Post -Headers $headers -Body $body -ContentType "application/json"
        Write-Host "  [OK] #$($response.number): $($issue.title)" -ForegroundColor Green
        $created++
    } catch {
        Write-Host "  [FAIL] $($issue.title): $($_.Exception.Message)" -ForegroundColor Red
    }
    Start-Sleep -Milliseconds 500
}

Write-Host ""
Write-Host "Done! $created/10 issues created." -ForegroundColor Green
Write-Host "View at: https://github.com/$repo/issues" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
