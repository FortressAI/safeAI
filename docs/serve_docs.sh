#!/bin/bash
# serve_docs.sh - Script to serve the docs folder using Python's built-in HTTP server.
# Usage: Run this script from the docs directory

PORT=8000

echo "Serving docs folder at http://localhost:$PORT"
python3 -m http.server $PORT --directory . 