@echo off
echo Starting Football Reservation System Server...
echo.
echo Your website will be available at:
echo   - On this computer: http://localhost:8000
echo   - On mobile (same WiFi): http://YOUR_IP_ADDRESS:8000
echo.
echo To find your IP address, look below:
ipconfig | findstr /i "IPv4"
echo.
echo Press Ctrl+C to stop the server
echo.
python -m http.server 8000
