@echo off
color 0f
title D-Zone Configuration Updater
echo This will automatically update your discord-config.json
echo to populate the server list with all servers your bot
echo has access to.
echo.
echo Your token must be defined as an environment variable or in .env
echo.
echo If you have any existing servers in the configuration,
echo they will not be overwritten.
echo.
echo Type "accept" to continue with the file update.
echo.
set /p input=
echo.
if not %input% == accept (
    echo You did not "accept" the update, cancelling...
) ELSE (
    node script/update-config.js
)
echo.
echo Press any key to exit...
pause >nul
exit
