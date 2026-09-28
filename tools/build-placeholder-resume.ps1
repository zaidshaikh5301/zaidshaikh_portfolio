# Builds a valid, single-page placeholder resume PDF so the download button
# works out of the box. Overwrite assets/resume.pdf with your real resume.
$ErrorActionPreference = 'Stop'

$out = Join-Path $PSScriptRoot '..\assets\resume.pdf'
$out = [System.IO.Path]::GetFullPath($out)

function PdfEscape([string]$s) {
    $s = $s -replace '\\', '\\' -replace '\(', '\(' -replace '\)', '\)'
    return $s
}

$lines = @(
    @{ t = 'M'; x = 60; y = 760; s = 24; f = 'F1'; txt = 'Mohamad Zaid A. Shaikh' },
    @{ t = 'M'; x = 60; y = 738; s = 12; f = 'F2'; txt = 'Frontend Developer / React Developer (Full Stack capable)' },
    @{ t = 'M'; x = 60; y = 720; s = 10; f = 'F2'; txt = 'Navsari, Gujarat, India  |  +91 76984 20078  |  zaidshaikh3543@gmail.com' },
    @{ t = 'M'; x = 60; y = 704; s = 10; f = 'F2'; txt = 'linkedin.com/in/zaid-shaikh-823961345' },
    @{ t = 'M'; x = 60; y = 664; s = 13; f = 'F1'; txt = 'PROFILE' },
    @{ t = 'M'; x = 60; y = 644; s = 10; f = 'F2'; txt = 'Frontend developer focused on building modern, responsive and scalable web' },
    @{ t = 'M'; x = 60; y = 630; s = 10; f = 'F2'; txt = 'applications using React.js, TypeScript, JavaScript, Tailwind CSS and REST APIs.' },
    @{ t = 'M'; x = 60; y = 616; s = 10; f = 'F2'; txt = 'Open to internships, junior / entry-level roles and freelance work.' },
    @{ t = 'M'; x = 60; y = 580; s = 13; f = 'F1'; txt = 'EXPERIENCE' },
    @{ t = 'M'; x = 60; y = 560; s = 11; f = 'F1'; txt = 'Front-End Developer Intern - Wappzo InfoTech, Navsari' },
    @{ t = 'M'; x = 60; y = 546; s = 10; f = 'F2'; txt = 'Oct 2025 - Nov 2025' },
    @{ t = 'M'; x = 60; y = 528; s = 10; f = 'F2'; txt = '- Built 8+ responsive webpages, improving mobile compatibility.' },
    @{ t = 'M'; x = 60; y = 514; s = 10; f = 'F2'; txt = '- Assisted with PHP and MySQL authentication and dynamic database features.' },
    @{ t = 'M'; x = 60; y = 500; s = 10; f = 'F2'; txt = '- Resolved 20+ UI bugs and improved responsiveness.' },
    @{ t = 'M'; x = 60; y = 486; s = 10; f = 'F2'; txt = '- Collaborated using Git and GitHub.' },
    @{ t = 'M'; x = 60; y = 450; s = 13; f = 'F1'; txt = 'EDUCATION' },
    @{ t = 'M'; x = 60; y = 430; s = 11; f = 'F1'; txt = 'Bachelor of Computer Applications (BCA)' },
    @{ t = 'M'; x = 60; y = 416; s = 10; f = 'F2'; txt = 'Naran Lala College of Professional and Applied Sciences  |  2023 - 2026' },
    @{ t = 'M'; x = 60; y = 380; s = 13; f = 'F1'; txt = 'SKILLS' },
    @{ t = 'M'; x = 60; y = 360; s = 10; f = 'F2'; txt = 'Frontend: React.js, TypeScript, JavaScript (ES6+), HTML5, CSS3, Tailwind CSS,' },
    @{ t = 'M'; x = 60; y = 346; s = 10; f = 'F2'; txt = 'Bootstrap, React Router, TanStack Query, Axios' },
    @{ t = 'M'; x = 60; y = 332; s = 10; f = 'F2'; txt = 'Backend: Node.js, Express.js, PHP, REST APIs, JWT Authentication, Socket.IO' },
    @{ t = 'M'; x = 60; y = 318; s = 10; f = 'F2'; txt = 'Database: MongoDB, MySQL' },
    @{ t = 'M'; x = 60; y = 304; s = 10; f = 'F2'; txt = 'Tools: Git, GitHub, Vite, VS Code, npm, Swagger / OpenAPI' },
    @{ t = 'M'; x = 60; y = 290; s = 10; f = 'F2'; txt = 'AI-assisted development: Microsoft Copilot, OpenAI Codex' },
    @{ t = 'M'; x = 60; y = 254; s = 13; f = 'F1'; txt = 'PROJECTS' },
    @{ t = 'M'; x = 60; y = 234; s = 11; f = 'F1'; txt = 'CodeBit' },
    @{ t = 'M'; x = 60; y = 220; s = 10; f = 'F2'; txt = 'Developer collaboration platform - React, TypeScript, Node.js, Express,' },
    @{ t = 'M'; x = 60; y = 206; s = 10; f = 'F2'; txt = 'MongoDB, JWT, Socket.IO.' },
    @{ t = 'M'; x = 60; y = 188; s = 11; f = 'F1'; txt = 'CodeBit API' },
    @{ t = 'M'; x = 60; y = 174; s = 10; f = 'F2'; txt = 'Backend service with Swagger documentation - Node.js, Express, TypeScript,' },
    @{ t = 'M'; x = 60; y = 160; s = 10; f = 'F2'; txt = 'MongoDB, JWT, Swagger, Socket.IO.' },
    @{ t = 'M'; x = 60; y = 142; s = 11; f = 'F1'; txt = 'Noor Tailor' },
    @{ t = 'M'; x = 60; y = 128; s = 10; f = 'F2'; txt = 'Custom-designed MERN e-commerce website for a tailoring business.' },
    @{ t = 'M'; x = 60; y = 96;  s = 9;  f = 'F2'; txt = 'This is a placeholder resume. Replace assets/resume.pdf with your real PDF.' }
)

$sb = New-Object System.Text.StringBuilder
foreach ($l in $lines) {
    $esc = PdfEscape $l.txt
    [void]$sb.AppendLine("BT /$($l.f) $($l.s) Tf $($l.x) $($l.y) Td ($esc) Tj ET")
}
$content = $sb.ToString()
$contentBytes = [System.Text.Encoding]::GetEncoding(28591).GetBytes($content)

$objects = @(
  "<< /Type /Catalog /Pages 2 0 R >>",
  "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
  "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>",
  "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>",
  "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>",
  $null  # stream object, built below
)

$enc = [System.Text.Encoding]::GetEncoding(28591)
$ms = New-Object System.IO.MemoryStream
function Write-Ascii($ms, $s) { $b = $enc.GetBytes($s); $ms.Write($b, 0, $b.Length) }

Write-Ascii $ms "%PDF-1.4`n"
# Binary comment marks the file as containing binary data (helps some tools)
$ms.Write([byte[]](0x25,0xE2,0xE3,0xCF,0xD3), 0, 4); Write-Ascii $ms "`n"

$offsets = @()
for ($i = 0; $i -lt $objects.Count; $i++) {
  $offsets += $ms.Position
  Write-Ascii $ms "$($i + 1) 0 obj`n"
  if ($i -eq 5) {
    Write-Ascii $ms "<< /Length $($contentBytes.Length) >>`nstream`n"
    $ms.Write($contentBytes, 0, $contentBytes.Length)
    Write-Ascii $ms "`nendstream`n"
  } else {
    Write-Ascii $ms "$($objects[$i])`n"
  }
  Write-Ascii $ms "endobj`n"
}

$xrefPos = $ms.Position
Write-Ascii $ms "xref`n"
Write-Ascii $ms "0 $($objects.Count + 1)`n"
Write-Ascii $ms "0000000000 65535 f `n"
foreach ($off in $offsets) {
  Write-Ascii $ms ("{0:D10} 00000 n `n" -f $off)
}
Write-Ascii $ms "trailer`n<< /Size $($objects.Count + 1) /Root 1 0 R >>`nstartxref`n$xrefPos`n%%EOF`n"

[System.IO.File]::WriteAllBytes($out, $ms.ToArray())
$ms.Dispose()
Write-Output "Wrote $out ($((Get-Item $out).Length) bytes)"
