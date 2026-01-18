@echo off
echo Installing migration dependencies...
echo.

REM Install required packages
call npm install pocketbase gray-matter marked
call npm install --save-dev tsx @types/node typescript

echo.
echo ===================================
echo Migration setup complete!
echo ===================================
echo.
echo Next steps:
echo 1. Copy .env.migration to .env
echo 2. Edit .env with your PocketBase credentials
echo 3. Run: npm run migrate
echo.
pause
