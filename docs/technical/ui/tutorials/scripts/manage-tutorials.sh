#!/bin/bash

# SafeAI Tutorial Management Script
# This script helps manage video tutorials and interactive guides

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Base directories
VIDEO_DIR="videos"
INTERACTIVE_DIR="interactive"
SCRIPTS_DIR="scripts"

# Function to display usage
show_usage() {
    echo "Usage: $0 [command] [options]"
    echo "Commands:"
    echo "  create-video    - Create a new video tutorial"
    echo "  create-guide    - Create a new interactive guide"
    echo "  list           - List all tutorials"
    echo "  update         - Update tutorial metadata"
    echo "  validate       - Validate tutorial structure"
    echo "  help           - Show this help message"
}

# Function to create a new video tutorial
create_video() {
    local title="$1"
    local duration="$2"
    local topics="$3"
    
    # Create video directory
    local video_dir="$VIDEO_DIR/$(echo "$title" | tr '[:upper:]' '[:lower:]' | tr ' ' '-')"
    mkdir -p "$video_dir"
    
    # Create metadata file
    cat > "$video_dir/metadata.json" << EOF
{
    "title": "$title",
    "duration": "$duration",
    "topics": $topics,
    "created": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
    "status": "draft"
}
EOF
    
    echo -e "${GREEN}Created video tutorial: $title${NC}"
}

# Function to create a new interactive guide
create_guide() {
    local title="$1"
    local type="$2"
    
    # Create guide directory
    local guide_dir="$INTERACTIVE_DIR/$(echo "$title" | tr '[:upper:]' '[:lower:]' | tr ' ' '-')"
    mkdir -p "$guide_dir"
    
    # Create guide structure
    cat > "$guide_dir/index.html" << EOF
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>$title - SafeAI Interactive Guide</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="guide-container">
        <header>
            <h1>$title</h1>
        </header>
        <main>
            <!-- Guide content will be added here -->
        </main>
    </div>
    <script src="guide.js"></script>
</body>
</html>
EOF
    
    # Create styles
    cat > "$guide_dir/styles.css" << EOF
/* Guide styles */
.guide-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}
EOF
    
    # Create JavaScript
    cat > "$guide_dir/guide.js" << EOF
// Guide functionality
document.addEventListener('DOMContentLoaded', () => {
    // Guide initialization code
});
EOF
    
    echo -e "${GREEN}Created interactive guide: $title${NC}"
}

# Function to list all tutorials
list_tutorials() {
    echo -e "${YELLOW}Video Tutorials:${NC}"
    for dir in "$VIDEO_DIR"/*/; do
        if [ -f "$dir/metadata.json" ]; then
            title=$(jq -r '.title' "$dir/metadata.json")
            duration=$(jq -r '.duration' "$dir/metadata.json")
            echo "- $title ($duration)"
        fi
    done
    
    echo -e "\n${YELLOW}Interactive Guides:${NC}"
    for dir in "$INTERACTIVE_DIR"/*/; do
        if [ -f "$dir/index.html" ]; then
            title=$(grep -o '<title>.*</title>' "$dir/index.html" | sed 's/<title>\(.*\) - SafeAI Interactive Guide<\/title>/\1/')
            echo "- $title"
        fi
    done
}

# Function to validate tutorial structure
validate_tutorials() {
    local valid=true
    
    # Validate video tutorials
    for dir in "$VIDEO_DIR"/*/; do
        if [ ! -f "$dir/metadata.json" ]; then
            echo -e "${RED}Error: Missing metadata.json in $dir${NC}"
            valid=false
        fi
    done
    
    # Validate interactive guides
    for dir in "$INTERACTIVE_DIR"/*/; do
        if [ ! -f "$dir/index.html" ]; then
            echo -e "${RED}Error: Missing index.html in $dir${NC}"
            valid=false
        fi
        if [ ! -f "$dir/styles.css" ]; then
            echo -e "${RED}Error: Missing styles.css in $dir${NC}"
            valid=false
        fi
        if [ ! -f "$dir/guide.js" ]; then
            echo -e "${RED}Error: Missing guide.js in $dir${NC}"
            valid=false
        fi
    done
    
    if [ "$valid" = true ]; then
        echo -e "${GREEN}All tutorials validated successfully${NC}"
    else
        echo -e "${RED}Tutorial validation failed${NC}"
        exit 1
    fi
}

# Main script logic
case "$1" in
    "create-video")
        if [ -z "$2" ] || [ -z "$3" ] || [ -z "$4" ]; then
            echo -e "${RED}Error: Missing required arguments${NC}"
            show_usage
            exit 1
        fi
        create_video "$2" "$3" "$4"
        ;;
    "create-guide")
        if [ -z "$2" ] || [ -z "$3" ]; then
            echo -e "${RED}Error: Missing required arguments${NC}"
            show_usage
            exit 1
        fi
        create_guide "$2" "$3"
        ;;
    "list")
        list_tutorials
        ;;
    "validate")
        validate_tutorials
        ;;
    "help"|"")
        show_usage
        ;;
    *)
        echo -e "${RED}Unknown command: $1${NC}"
        show_usage
        exit 1
        ;;
esac 