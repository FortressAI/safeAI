#!/bin/bash

# Base directory for guides
BASE_DIR="interactive"

# Create base directory if it doesn't exist
mkdir -p "$BASE_DIR"

# Create arc-page-guide directory and copy template files
mkdir -p "$BASE_DIR/arc-page-guide"

# Create template files if they don't exist
if [ ! -f "$BASE_DIR/arc-page-guide/styles.css" ]; then
    cat > "$BASE_DIR/arc-page-guide/styles.css" << 'CSSEOM'
/* Guide styles */
:root {
    --primary-color: #4f46e5;
    --primary-hover: #4338ca;
    --secondary-color: #818cf8;
    --background-color: #f8fafc;
    --surface-color: #ffffff;
    --text-color: #1e293b;
    --text-secondary: #64748b;
    --border-color: #e2e8f0;
    --success-color: #10b981;
    --warning-color: #f59e0b;
    --error-color: #ef4444;
    --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
    --gradient-primary: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    --animation-timing: 0.3s;
}

/* Add Font Awesome for icons */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');

/* Add custom animations */
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes slideUp {
    from {
        transform: translateY(20px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
}

@keyframes shimmer {
    0% { background-position: -1000px 0; }
    100% { background-position: 1000px 0; }
}

/* Enhanced body styles */
body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    line-height: 1.6;
    color: var(--text-color);
    background-color: var(--background-color);
    margin: 0;
    padding: 0;
    min-height: 100vh;
    overflow-x: hidden;
}

/* Enhanced header */
header {
    text-align: center;
    margin-bottom: 40px;
    padding: 60px 0;
    background: var(--gradient-primary);
    border-radius: 16px;
    color: white;
    box-shadow: var(--shadow-lg);
    transform: translateY(-20px);
    animation: slideDown 0.5s ease-out;
    position: relative;
    overflow: hidden;
}

header::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%),
                linear-gradient(-45deg, rgba(255,255,255,0.1) 25%, transparent 25%);
    background-size: 60px 60px;
    opacity: 0.1;
    animation: shimmer 2s linear infinite;
}

header h1 {
    margin: 0;
    font-size: 3rem;
    font-weight: 800;
    text-shadow: 0 2px 4px rgba(0,0,0,0.1);
    position: relative;
    z-index: 1;
}

/* Enhanced navigation */
.guide-nav {
    background: var(--surface-color);
    padding: 20px;
    border-radius: 12px;
    box-shadow: var(--shadow-md);
    margin-bottom: 30px;
    position: sticky;
    top: 20px;
    z-index: 100;
    backdrop-filter: blur(10px);
    background-color: rgba(255, 255, 255, 0.9);
    transition: all var(--animation-timing) ease;
}

.guide-nav.scrolled {
    padding: 15px;
    box-shadow: var(--shadow-lg);
}

.guide-nav ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    justify-content: center;
    gap: 20px;
}

.guide-nav a {
    color: var(--text-color);
    text-decoration: none;
    padding: 12px 24px;
    border-radius: 8px;
    transition: all var(--animation-timing) ease;
    font-weight: 500;
    position: relative;
    display: flex;
    align-items: center;
    gap: 8px;
}

.guide-nav a i {
    font-size: 1.2em;
    transition: transform var(--animation-timing) ease;
}

.guide-nav a:hover i {
    transform: translateX(3px);
}

/* Enhanced sections */
section {
    margin-bottom: 40px;
    background: var(--surface-color);
    padding: 30px;
    border-radius: 16px;
    box-shadow: var(--shadow-md);
    transition: all var(--animation-timing) ease;
    opacity: 0;
    transform: translateY(20px);
    animation: slideUp 0.5s ease-out forwards;
}

section.visible {
    opacity: 1;
    transform: translateY(0);
}

section:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
}

/* Enhanced content boxes */
.content-box {
    padding: 25px;
    background: var(--background-color);
    border-radius: 12px;
    margin-top: 20px;
    border: 1px solid var(--border-color);
    transition: all var(--animation-timing) ease;
}

.content-box:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
}

/* Enhanced lists */
.feature-list li, .step-list li {
    margin-bottom: 12px;
    position: relative;
    padding-left: 35px;
    transition: all var(--animation-timing) ease;
}

.feature-list li:hover, .step-list li:hover {
    transform: translateX(5px);
}

.feature-list li::before {
    content: '→';
    position: absolute;
    left: 0;
    color: var(--primary-color);
    font-size: 1.2em;
    transition: transform var(--animation-timing) ease;
}

.feature-list li:hover::before {
    transform: translateX(5px);
}

/* Enhanced buttons */
.demo-button, .navigation-buttons button {
    background: var(--gradient-primary);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    cursor: pointer;
    transition: all var(--animation-timing) ease;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    position: relative;
    overflow: hidden;
}

.demo-button::before, .navigation-buttons button::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: all 0.5s ease;
}

.demo-button:hover::before, .navigation-buttons button:hover::before {
    left: 100%;
}

/* Enhanced metrics */
.metric-item {
    background: var(--surface-color);
    padding: 25px;
    border-radius: 12px;
    border: 1px solid var(--border-color);
    transition: all var(--animation-timing) ease;
    position: relative;
    overflow: hidden;
}

.metric-item::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: var(--gradient-primary);
    transform: scaleX(0);
    transition: transform var(--animation-timing) ease;
}

.metric-item:hover::before {
    transform: scaleX(1);
}

/* Enhanced alerts */
.note, .tip, .warning {
    padding: 20px;
    margin-top: 20px;
    border-radius: 8px;
    animation: slideIn 0.3s ease-out;
    display: flex;
    align-items: flex-start;
    gap: 12px;
}

.note i, .tip i, .warning i {
    font-size: 1.5em;
    flex-shrink: 0;
}

/* Enhanced footer */
footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: var(--surface-color);
    padding: 20px;
    box-shadow: var(--shadow-lg);
    backdrop-filter: blur(10px);
    background-color: rgba(255, 255, 255, 0.9);
    transition: all var(--animation-timing) ease;
}

footer.hidden {
    transform: translateY(100%);
}

/* Enhanced progress bar */
.progress-bar {
    height: 4px;
    background: var(--border-color);
    margin-bottom: 15px;
    border-radius: 2px;
    overflow: hidden;
    position: relative;
}

.progress {
    height: 100%;
    background: var(--gradient-primary);
    width: 0;
    transition: width 0.3s ease;
    position: relative;
}

.progress::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    animation: shimmer 1.5s infinite;
}

/* Enhanced mobile responsiveness */
@media (max-width: 768px) {
    .guide-nav ul {
        flex-direction: column;
        gap: 10px;
    }
    
    .control-grid, .metrics-grid, .troubleshooting-grid {
        grid-template-columns: 1fr;
    }
    
    section {
        padding: 20px;
    }

    header {
        padding: 30px 20px;
    }

    header h1 {
        font-size: 2rem;
    }

    .guide-nav {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        margin: 0;
        border-radius: 0;
        transform: translateY(-100%);
        transition: transform 0.3s ease;
    }

    .guide-nav.visible {
        transform: translateY(0);
    }

    .guide-container {
        padding-top: 60px;
    }

    .content-box {
        padding: 15px;
    }

    .navigation-buttons {
        flex-direction: column;
    }
}

/* Enhanced dark mode */
@media (prefers-color-scheme: dark) {
    :root {
        --background-color: #0f172a;
        --surface-color: #1e293b;
        --text-color: #f1f5f9;
        --text-secondary: #94a3b8;
        --border-color: #334155;
    }

    .content-box {
        background: var(--surface-color);
        border-color: var(--border-color);
    }

    .guide-nav {
        background-color: rgba(30, 41, 59, 0.9);
    }

    .guide-nav a {
        color: var(--text-color);
    }

    .guide-nav a:hover {
        background-color: var(--primary-color);
        color: white;
    }

    .note {
        background-color: #451a03;
    }

    .tip {
        background-color: #064e3b;
    }

    .warning {
        background-color: #450a0a;
    }

    footer {
        background-color: rgba(30, 41, 59, 0.9);
    }

    /* Dark mode specific animations */
    .metric-item::before {
        background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
    }

    .progress::after {
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
    }
}

/* Add loading animation */
.loading {
    position: relative;
    overflow: hidden;
}

.loading::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    animation: shimmer 1.5s infinite;
}

/* Add scroll to top button */
.scroll-top {
    position: fixed;
    bottom: 100px;
    right: 20px;
    background: var(--gradient-primary);
    color: white;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all var(--animation-timing) ease;
    opacity: 0;
    transform: translateY(20px);
    box-shadow: var(--shadow-md);
}

.scroll-top.visible {
    opacity: 1;
    transform: translateY(0);
}

.scroll-top:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
}

/* Add section transitions */
.section-transition {
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.5s ease;
}

.section-transition.visible {
    opacity: 1;
    transform: translateY(0);
}

/* Add interactive elements */
.interactive-element {
    cursor: pointer;
    transition: all var(--animation-timing) ease;
}

.interactive-element:hover {
    transform: scale(1.05);
}

/* Add tooltips */
.tooltip {
    position: relative;
    display: inline-block;
}

.tooltip .tooltip-text {
    visibility: hidden;
    background-color: var(--surface-color);
    color: var(--text-color);
    text-align: center;
    padding: 8px 12px;
    border-radius: 6px;
    position: absolute;
    z-index: 1;
    bottom: 125%;
    left: 50%;
    transform: translateX(-50%);
    opacity: 0;
    transition: opacity var(--animation-timing) ease;
    box-shadow: var(--shadow-md);
    white-space: nowrap;
}

.tooltip:hover .tooltip-text {
    visibility: visible;
    opacity: 1;
}

/* Add focus styles */
:focus {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
}

/* Add keyboard navigation styles */
.keyboard-nav :focus {
    outline: 3px solid var(--primary-color);
    outline-offset: 2px;
}

/* Add reduced motion support */
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
    }
}
CSSEOM
fi

if [ ! -f "$BASE_DIR/arc-page-guide/script.js" ]; then
    cat > "$BASE_DIR/arc-page-guide/script.js" << 'JSEOM'
// Guide state management
const state = {
    currentSection: 0,
    sections: document.querySelectorAll('section'),
    progress: 0,
    isScrolled: false,
    isDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
    isReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
};

// Initialize the guide
function initGuide() {
    updateProgress();
    setupNavigation();
    setupDemoButtons();
    setupCharts();
    setupScrollTop();
    setupThemeToggle();
    setupKeyboardNavigation();
    setupTooltips();
    setupIntersectionObserver();
    setupScrollListener();
}

// Update progress bar with animation
function updateProgress() {
    const progress = (state.currentSection / (state.sections.length - 1)) * 100;
    const progressBar = document.querySelector('.progress');
    progressBar.style.width = `${progress}%`;
    state.progress = progress;
}

// Setup navigation with enhanced animations
function setupNavigation() {
    const prevButton = document.querySelector('.navigation-buttons button:first-child');
    const nextButton = document.querySelector('.navigation-buttons button:last-child');

    prevButton.addEventListener('click', () => {
        if (state.currentSection > 0) {
            state.currentSection--;
            scrollToSection(state.currentSection);
        }
    });

    nextButton.addEventListener('click', () => {
        if (state.currentSection < state.sections.length - 1) {
            state.currentSection++;
            scrollToSection(state.currentSection);
        }
    });

    updateButtonStates();
}

// Enhanced scroll to section with smooth animation
function scrollToSection(index) {
    const section = state.sections[index];
    const headerOffset = 80;
    const elementPosition = section.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
        top: offsetPosition,
        behavior: state.isReducedMotion ? 'auto' : 'smooth'
    });

    updateProgress();
    updateButtonStates();
}

// Setup demo buttons with enhanced feedback
function setupDemoButtons() {
    const demoButtons = document.querySelectorAll('.demo-button');
    
    demoButtons.forEach(button => {
        button.addEventListener('click', () => {
            const action = button.textContent.toLowerCase();
            showDemoFeedback(action);
            button.classList.add('loading');
            setTimeout(() => button.classList.remove('loading'), 1000);
        });
    });
}

// Enhanced demo feedback with animation
function showDemoFeedback(action) {
    const feedback = document.createElement('div');
    feedback.className = 'demo-feedback';
    feedback.textContent = `Demo: ${action} action performed`;
    
    const container = document.querySelector('.guide-container');
    container.appendChild(feedback);
    
    setTimeout(() => {
        feedback.style.opacity = '0';
        setTimeout(() => feedback.remove(), 300);
    }, 2000);
}

// Setup charts with enhanced visualization
function setupCharts() {
    const chartContainers = document.querySelectorAll('.metric-chart');
    
    chartContainers.forEach(container => {
        const canvas = document.createElement('canvas');
        container.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        canvas.width = width;
        canvas.height = height;
        
        drawChart(ctx, width, height);
    });
}

// Enhanced chart drawing with animations
function drawChart(ctx, width, height) {
    const data = Array.from({ length: 20 }, () => Math.random() * 100);
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, state.isDarkMode ? '#4f46e5' : '#818cf8');
    gradient.addColorStop(1, state.isDarkMode ? '#4338ca' : '#4f46e5');
    
    ctx.clearRect(0, 0, width, height);
    
    ctx.beginPath();
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 2;
    
    data.forEach((value, index) => {
        const x = (index / (data.length - 1)) * width;
        const y = height - (value / 100) * height;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.stroke();
}

// Setup scroll to top button
function setupScrollTop() {
    const scrollTop = document.createElement('button');
    scrollTop.className = 'scroll-top';
    scrollTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(scrollTop);
    
    scrollTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: state.isReducedMotion ? 'auto' : 'smooth'
        });
    });
    
    window.addEventListener('scroll', () => {
        scrollTop.classList.toggle('visible', window.scrollY > 300);
    });
}

// Setup theme toggle
function setupThemeToggle() {
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = state.isDarkMode ? 
        '<i class="fas fa-sun"></i>' : 
        '<i class="fas fa-moon"></i>';
    document.body.appendChild(themeToggle);
    
    themeToggle.addEventListener('click', () => {
        state.isDarkMode = !state.isDarkMode;
        document.documentElement.classList.toggle('dark-mode');
        themeToggle.innerHTML = state.isDarkMode ? 
            '<i class="fas fa-sun"></i>' : 
            '<i class="fas fa-moon"></i>';
    });
}

// Setup keyboard navigation
function setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            if (state.currentSection > 0) {
                state.currentSection--;
                scrollToSection(state.currentSection);
            }
        } else if (e.key === 'ArrowRight') {
            if (state.currentSection < state.sections.length - 1) {
                state.currentSection++;
                scrollToSection(state.currentSection);
            }
        }
    });
}

// Setup tooltips
function setupTooltips() {
    const tooltips = document.querySelectorAll('.tooltip');
    
    tooltips.forEach(tooltip => {
        tooltip.addEventListener('mouseenter', () => {
            const tooltipText = tooltip.querySelector('.tooltip-text');
            tooltipText.style.opacity = '1';
        });
        
        tooltip.addEventListener('mouseleave', () => {
            const tooltipText = tooltip.querySelector('.tooltip-text');
            tooltipText.style.opacity = '0';
        });
    });
}

// Setup intersection observer for animations
function setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                const index = Array.from(state.sections).indexOf(entry.target);
                if (index !== state.currentSection) {
                    state.currentSection = index;
                    updateProgress();
                    updateButtonStates();
                }
            }
        });
    }, { threshold: 0.5 });

    state.sections.forEach(section => {
        section.classList.add('section-transition');
        observer.observe(section);
    });
}

// Setup scroll listener for navigation
function setupScrollListener() {
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        const nav = document.querySelector('.guide-nav');
        
        if (currentScroll > lastScroll && currentScroll > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

// Update button states
function updateButtonStates() {
    const prevButton = document.querySelector('.navigation-buttons button:first-child');
    const nextButton = document.querySelector('.navigation-buttons button:last-child');
    
    prevButton.disabled = state.currentSection === 0;
    nextButton.disabled = state.currentSection === state.sections.length - 1;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initGuide();
});
JSEOM
fi

# Array of guide names and their descriptions
guides=(
    "dashboard:Overview and navigation of the SafeAI dashboard"
    "knowledge-graphs:Managing and exploring knowledge graphs"
    "agents:Managing AI agents and their configurations"
    "security:Security settings and monitoring"
    "settings:Platform settings and preferences"
    "agent-workshop:Creating and configuring new agents"
    "knowledge-graph-explorer:Exploring and managing knowledge graphs"
    "security-dashboard:Security monitoring and management"
    "token-management:Managing tokens and transactions"
    "math-atp:Using the Math ATP interface"
    "arc-prize:Working with ARC Prize solutions"
)

# Function to create a guide directory
create_guide_dir() {
    local guide_name=$1
    local guide_dir="$BASE_DIR/$guide_name-guide"
    mkdir -p "$guide_dir"
    echo "Created directory: $guide_dir"
}

# Function to format title
format_title() {
    local title=$1
    # Replace hyphens with spaces and capitalize each word
    echo "$title" | tr '-' ' ' | awk '{for(i=1;i<=NF;i++)sub(/./,toupper(substr($i,1,1)),$i)}1'
}

# Function to get guide-specific content
get_guide_content() {
    local guide_name=$1
    case $guide_name in
        "dashboard")
            echo "The Dashboard is your central hub for monitoring and managing your SafeAI platform. It provides a comprehensive overview of your system's status, performance metrics, and important notifications."
            ;;
        "knowledge-graphs")
            echo "Knowledge Graphs are powerful tools for organizing and connecting information in your SafeAI system. They help agents understand relationships between different pieces of data and make more informed decisions."
            ;;
        "agents")
            echo "AI Agents are the core components of your SafeAI system. They are intelligent programs that can perform tasks, make decisions, and interact with users while following safety guidelines."
            ;;
        "security")
            echo "Security settings help you protect your SafeAI platform and ensure safe operation of your AI agents. This section provides tools for managing access, monitoring threats, and maintaining compliance."
            ;;
        "settings")
            echo "Platform settings allow you to customize your SafeAI experience, configure system preferences, and manage user preferences. These settings affect how the platform behaves and appears."
            ;;
        "agent-workshop")
            echo "The Agent Workshop is where you can create, test, and refine your AI agents. It provides tools for configuring agent behavior, setting safety parameters, and testing agent capabilities."
            ;;
        "knowledge-graph-explorer")
            echo "The Knowledge Graph Explorer helps you visualize and manage the relationships between different pieces of information in your system. It's a powerful tool for understanding how your agents process and connect data."
            ;;
        "security-dashboard")
            echo "The Security Dashboard provides real-time monitoring of your system's security status, including threat detection, access logs, and compliance metrics. It helps you maintain a secure environment for your AI operations."
            ;;
        "token-management")
            echo "Token Management handles all aspects of your SafeAI tokens, including balances, transactions, and staking. This section helps you manage your platform's economic aspects."
            ;;
        "math-atp")
            echo "The Math ATP (Automated Theorem Prover) interface provides specialized tools for mathematical reasoning and proof generation. It helps ensure the logical correctness of AI operations."
            ;;
        "arc-prize")
            echo "The ARC Prize interface supports the development and testing of solutions for the ARC Prize challenge. It provides tools for creating, testing, and submitting AI solutions that demonstrate safe and beneficial behavior."
            ;;
    esac
}

# Function to get guide-specific features
get_guide_features() {
    local guide_name=$1
    case $guide_name in
        "dashboard")
            echo "Real-time system status monitoring"
            echo "Performance metrics visualization"
            echo "Important notifications and alerts"
            echo "Quick access to key functions"
            echo "Customizable dashboard layout"
            ;;
        "knowledge-graphs")
            echo "Visual graph representation"
            echo "Node and relationship management"
            echo "Query and search capabilities"
            echo "Graph validation tools"
            echo "Import/export functionality"
            ;;
        "agents")
            echo "Agent creation and configuration"
            echo "Behavior customization"
            echo "Safety parameter settings"
            echo "Performance monitoring"
            echo "Agent interaction testing"
            ;;
        "security")
            echo "Access control management"
            echo "Threat monitoring"
            echo "Compliance reporting"
            echo "Security policy configuration"
            echo "Audit logging"
            ;;
        "settings")
            echo "User preferences"
            echo "System configuration"
            echo "Display options"
            echo "Notification settings"
            echo "Integration settings"
            ;;
        "agent-workshop")
            echo "Template selection"
            echo "Behavior editor"
            echo "Safety configuration"
            echo "Testing environment"
            echo "Deployment tools"
            ;;
        "knowledge-graph-explorer")
            echo "Interactive graph visualization"
            echo "Node inspection tools"
            echo "Relationship mapping"
            echo "Query interface"
            echo "Analysis tools"
            ;;
        "security-dashboard")
            echo "Real-time threat monitoring"
            echo "Access log viewing"
            echo "Compliance metrics"
            echo "Security alerts"
            echo "Incident response tools"
            ;;
        "token-management")
            echo "Wallet management"
            echo "Transaction history"
            echo "Staking interface"
            echo "Balance tracking"
            echo "Token operations"
            ;;
        "math-atp")
            echo "Theorem editor"
            echo "Proof generation"
            echo "Verification tools"
            echo "Mathematical library"
            echo "Result visualization"
            ;;
        "arc-prize")
            echo "Solution development"
            echo "Testing environment"
            echo "Submission tools"
            echo "Performance analysis"
            echo "Results tracking"
            ;;
    esac
}

# Function to get guide-specific steps
get_guide_steps() {
    local guide_name=$1
    case $guide_name in
        "dashboard")
            echo "Log in to your SafeAI account"
            echo "Navigate to the main dashboard"
            echo "Review system status and alerts"
            echo "Check performance metrics"
            echo "Configure dashboard layout"
            ;;
        "knowledge-graphs")
            echo "Access the Knowledge Graphs section"
            echo "Create a new knowledge graph"
            echo "Add nodes and relationships"
            echo "Validate graph structure"
            echo "Test graph queries"
            ;;
        "agents")
            echo "Select an agent to manage"
            echo "Review agent status"
            echo "Configure agent settings"
            echo "Test agent capabilities"
            echo "Monitor agent performance"
            ;;
        "security")
            echo "Access security settings"
            echo "Review current security status"
            echo "Configure access controls"
            echo "Set up monitoring rules"
            echo "Review security reports"
            ;;
        "settings")
            echo "Open platform settings"
            echo "Configure user preferences"
            echo "Adjust system settings"
            echo "Set up notifications"
            echo "Save changes"
            ;;
        "agent-workshop")
            echo "Choose an agent template"
            echo "Configure agent behavior"
            echo "Set safety parameters"
            echo "Test agent functionality"
            echo "Deploy the agent"
            ;;
        "knowledge-graph-explorer")
            echo "Open the explorer interface"
            echo "Load a knowledge graph"
            echo "Explore graph structure"
            echo "Analyze relationships"
            echo "Export findings"
            ;;
        "security-dashboard")
            echo "Access the security dashboard"
            echo "Review security metrics"
            echo "Check for alerts"
            echo "Investigate incidents"
            echo "Update security policies"
            ;;
        "token-management")
            echo "Access your wallet"
            echo "Check token balance"
            echo "Review transactions"
            echo "Manage staking"
            echo "Perform token operations"
            ;;
        "math-atp")
            echo "Open the theorem prover"
            echo "Enter mathematical statements"
            echo "Generate proofs"
            echo "Verify results"
            echo "Export findings"
            ;;
        "arc-prize")
            echo "Access the ARC Prize interface"
            echo "Create a new solution"
            echo "Implement required features"
            echo "Test the solution"
            echo "Submit for evaluation"
            ;;
    esac
}

# Function to get guide-specific issues
get_guide_issues() {
    local guide_name=$1
    case $guide_name in
        "dashboard")
            echo "Dashboard not loading"
            echo "Missing metrics"
            echo "Incorrect data display"
            echo "Performance issues"
            echo "Notification problems"
            ;;
        "knowledge-graphs")
            echo "Graph loading errors"
            echo "Invalid relationships"
            echo "Query failures"
            echo "Data inconsistencies"
            echo "Export problems"
            ;;
        "agents")
            echo "Agent not responding"
            echo "Configuration errors"
            echo "Performance issues"
            echo "Safety violations"
            echo "Integration problems"
            ;;
        "security")
            echo "Access denied"
            echo "Policy conflicts"
            echo "Monitoring gaps"
            echo "Compliance issues"
            echo "Audit failures"
            ;;
        "settings")
            echo "Settings not saving"
            echo "Preference conflicts"
            echo "Display issues"
            echo "Notification problems"
            echo "Integration errors"
            ;;
        "agent-workshop")
            echo "Template loading errors"
            echo "Configuration issues"
            echo "Testing failures"
            echo "Deployment problems"
            echo "Safety violations"
            ;;
        "knowledge-graph-explorer")
            echo "Visualization issues"
            echo "Node display problems"
            echo "Relationship errors"
            echo "Query failures"
            echo "Export problems"
            ;;
        "security-dashboard")
            echo "Alert display issues"
            echo "Metric loading problems"
            echo "Incident tracking errors"
            echo "Policy update failures"
            echo "Reporting issues"
            ;;
        "token-management")
            echo "Transaction failures"
            echo "Balance discrepancies"
            echo "Staking issues"
            echo "Wallet errors"
            echo "Operation failures"
            ;;
        "math-atp")
            echo "Theorem errors"
            echo "Proof generation issues"
            echo "Verification failures"
            echo "Library loading problems"
            echo "Export errors"
            ;;
        "arc-prize")
            echo "Solution creation issues"
            echo "Testing failures"
            echo "Submission problems"
            echo "Evaluation errors"
            echo "Performance issues"
            ;;
    esac
}

# Function to get guide-specific solutions
get_guide_solutions() {
    local guide_name=$1
    case $guide_name in
        "dashboard")
            echo "Refresh the page"
            echo "Check system status"
            echo "Verify data sources"
            echo "Clear browser cache"
            echo "Contact support"
            ;;
        "knowledge-graphs")
            echo "Validate graph structure"
            echo "Check data integrity"
            echo "Review relationships"
            echo "Test queries"
            echo "Rebuild graph"
            ;;
        "agents")
            echo "Check agent status"
            echo "Review configuration"
            echo "Monitor resources"
            echo "Test capabilities"
            echo "Restart agent"
            ;;
        "security")
            echo "Verify permissions"
            echo "Review policies"
            echo "Check monitoring"
            echo "Update settings"
            echo "Contact security team"
            ;;
        "settings")
            echo "Clear preferences"
            echo "Reset settings"
            echo "Check conflicts"
            echo "Update browser"
            echo "Contact support"
            ;;
        "agent-workshop")
            echo "Reload templates"
            echo "Check configuration"
            echo "Validate settings"
            echo "Test environment"
            echo "Review safety rules"
            ;;
        "knowledge-graph-explorer")
            echo "Refresh visualization"
            echo "Check data loading"
            echo "Verify relationships"
            echo "Test queries"
            echo "Clear cache"
            ;;
        "security-dashboard")
            echo "Update monitoring"
            echo "Check alert settings"
            echo "Review incidents"
            echo "Verify policies"
            echo "Contact security"
            ;;
        "token-management")
            echo "Check transactions"
            echo "Verify balances"
            echo "Review operations"
            echo "Update wallet"
            echo "Contact support"
            ;;
        "math-atp")
            echo "Check theorems"
            echo "Verify proofs"
            echo "Update library"
            echo "Test verification"
            echo "Review results"
            ;;
        "arc-prize")
            echo "Check solution"
            echo "Verify features"
            echo "Test thoroughly"
            echo "Review submission"
            echo "Contact support"
            ;;
    esac
}

# Function to create guide files
create_guide_files() {
    local guide_name=$1
    local description=$2
    local guide_dir="$BASE_DIR/$guide_name-guide"
    local title=$(format_title "$guide_name")
    local content=$(get_guide_content "$guide_name")
    
    # Create HTML file
    cat > "$guide_dir/index.html" << EOFHTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - Interactive Guide</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="guide-container">
        <header>
            <h1>${title}</h1>
            <p class="subtitle">${description}</p>
        </header>

        <nav class="guide-nav">
            <ul>
                <li><a href="#overview">Overview</a></li>
                <li><a href="#features">Features</a></li>
                <li><a href="#usage">Usage</a></li>
                <li><a href="#troubleshooting">Troubleshooting</a></li>
            </ul>
        </nav>

        <section id="overview">
            <h2>Overview</h2>
            <div class="content-box">
                <p>${content}</p>
                <div class="tip">
                    <strong>Tip:</strong> Take time to familiarize yourself with the interface before performing any actions.
                </div>
            </div>
        </section>

        <section id="features">
            <h2>Key Features</h2>
            <div class="content-box">
                <div class="feature-list">
                    <ul>
$(get_guide_features "$guide_name" | while read -r feature; do
    echo "                        <li>${feature}</li>"
done)
                    </ul>
                </div>
                <div class="note">
                    <strong>Note:</strong> Some features may require specific permissions or access levels.
                </div>
            </div>
        </section>

        <section id="usage">
            <h2>How to Use</h2>
            <div class="content-box">
                <div class="step-list">
                    <ol>
$(get_guide_steps "$guide_name" | while read -r step; do
    echo "                        <li>${step}</li>"
done)
                    </ol>
                </div>
                <div class="warning">
                    <strong>Warning:</strong> Always verify your actions before confirming them.
                </div>
            </div>
        </section>

        <section id="troubleshooting">
            <h2>Troubleshooting</h2>
            <div class="content-box">
                <div class="troubleshooting-grid">
                    <div class="issue-item">
                        <h4>Common Issues</h4>
                        <ol>
$(get_guide_issues "$guide_name" | while read -r issue; do
    echo "                            <li>${issue}</li>"
done)
                        </ol>
                    </div>
                    <div class="issue-item">
                        <h4>Solutions</h4>
                        <ol>
$(get_guide_solutions "$guide_name" | while read -r solution; do
    echo "                            <li>${solution}</li>"
done)
                        </ol>
                    </div>
                </div>
                <div class="tip">
                    <strong>Tip:</strong> If you're still experiencing issues, contact SafeAI support for assistance.
                </div>
            </div>
        </section>
    </div>

    <footer>
        <div class="progress-bar">
            <div class="progress"></div>
        </div>
        <div class="navigation-buttons">
            <button>Previous</button>
            <button>Next</button>
        </div>
    </footer>

    <script src="script.js"></script>
</body>
</html>
EOFHTML

    # Copy CSS file
    cp "$BASE_DIR/arc-page-guide/styles.css" "$guide_dir/styles.css"
    
    # Copy JavaScript file
    cp "$BASE_DIR/arc-page-guide/script.js" "$guide_dir/script.js"
    
    echo "Created guide files for: $guide_name"
}

# Main execution
echo "Generating interactive guides..."

# Create guides for each page
for guide in "${guides[@]}"; do
    IFS=':' read -r name description <<< "$guide"
    echo "Creating guide for: $name"
    create_guide_dir "$name"
    create_guide_files "$name" "$description"
done

echo "All guides have been generated successfully!" 