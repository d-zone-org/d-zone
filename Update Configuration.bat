@echo off
color 0f
title D-Zone Configuration Updater
echo Welcome to D-Zone Configuration Updater.
echo.
echo Config Updater is an application that automatically updates
echo your discord-config.json file to include all the servers that
echo the bot is in.
echo.
echo Proceeding with this process will automatically overwrite your
echo discord-config.json file.
echo.
echo Make sure to change your bot token is in update-config.js on
echo line 10 to make it so the script can read the servers your bot
echo is on.
echo.
echo Type "accept" to continue with the file overwrite.
echo.
set /p input=
echo.
if not %input% == accept (
    echo Input was not "accept", cancelling...
) ELSE (
    node update-config.js
)
echo.
echo Press any key to exit...
pause >nul
exit