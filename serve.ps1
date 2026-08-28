$port = 8080
$ip = "0.0.0.0"
$listener = New-Object System.Net.Sockets.TcpListener([System.Net.IPAddress]::Any, $port)
$listener.Start()
Write-Host "Server running on http://localhost:8080/"
Write-Host "Mobile access: http://192.168.8.166:8080/"
Write-Host "Press Ctrl+C to stop"

$filePath = "e:\xiaolu-web\portfolio\ai-pm-game.html"
$fileBytes = [System.IO.File]::ReadAllBytes($filePath)
$header = "HTTP/1.1 200 OK`r`nContent-Type: text/html; charset=utf-8`r`nContent-Length: $($fileBytes.Length)`r`nConnection: close`r`nAccess-Control-Allow-Origin: *`r`n`r`n"
$headerBytes = [System.Text.Encoding]::UTF8.GetBytes($header)

while ($true) {
    $client = $listener.AcceptTcpClient()
    $stream = $client.GetStream()
    $stream.Write($headerBytes, 0, $headerBytes.Length)
    $stream.Write($fileBytes, 0, $fileBytes.Length)
    $stream.Flush()
    Start-Sleep -Milliseconds 10
    $client.Close()
    Write-Host "Served at $(Get-Date -Format 'HH:mm:ss')"
}
