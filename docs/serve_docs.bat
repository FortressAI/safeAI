@echo off
REM serve_docs.bat - Script to serve the docs folder using Python's built-in HTTP server.
REM Usage: Run this script from the docs directory

set PORT=8000

echo Serving docs folder at http://localhost:%PORT%
python -m http.server %PORT% --directory .
pause 