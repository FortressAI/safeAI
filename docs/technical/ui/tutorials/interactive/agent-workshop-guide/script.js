// Guide state management
const state = {
    currentSection: 0,
    sections: document.querySelectorAll('section'),
    progress: 0
};

// Initialize the guide
function initGuide() {
    updateProgress();
    setupNavigation();
    setupDemoButtons();
    setupCharts();
}

// Update progress bar
function updateProgress() {
    const progress = (state.currentSection / (state.sections.length - 1)) * 100;
    document.querySelector('.progress').style.width = `${progress}%`;
    state.progress = progress;
}

// Setup navigation buttons
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

    // Update button states
    function updateButtonStates() {
        prevButton.disabled = state.currentSection === 0;
        nextButton.disabled = state.currentSection === state.sections.length - 1;
    }

    updateButtonStates();
}

// Scroll to section
function scrollToSection(index) {
    const section = state.sections[index];
    section.scrollIntoView({ behavior: 'smooth' });
    updateProgress();
    updateButtonStates();
}

// Setup demo buttons
function setupDemoButtons() {
    const demoButtons = document.querySelectorAll('.demo-button');
    
    demoButtons.forEach(button => {
        button.addEventListener('click', () => {
            const action = button.textContent.toLowerCase();
            showDemoFeedback(action);
        });
    });
}

// Show demo feedback
function showDemoFeedback(action) {
    const feedback = document.createElement('div');
    feedback.className = 'demo-feedback';
    feedback.textContent = `Demo: ${action} action performed`;
    
    const container = document.querySelector('.guide-container');
    container.appendChild(feedback);
    
    setTimeout(() => {
        feedback.remove();
    }, 2000);
}

// Setup metric charts
function setupCharts() {
    const chartContainers = document.querySelectorAll('.metric-chart');
    
    chartContainers.forEach(container => {
        // Create a simple line chart using canvas
        const canvas = document.createElement('canvas');
        container.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw chart
        drawChart(ctx, width, height);
    });
}

// Draw chart
function drawChart(ctx, width, height) {
    // Generate sample data
    const data = Array.from({ length: 20 }, () => Math.random() * 100);
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw line
    ctx.beginPath();
    ctx.strokeStyle = '#2563eb';
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

// Handle section visibility
function handleSectionVisibility() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const index = Array.from(state.sections).indexOf(entry.target);
                if (index !== state.currentSection) {
                    state.currentSection = index;
                    updateProgress();
                    updateButtonStates();
                }
            }
        });
    }, { threshold: 0.5 });

    state.sections.forEach(section => observer.observe(section));
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initGuide();
    handleSectionVisibility();
}); 