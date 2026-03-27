
const htmlElement = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');

if (themeToggle) {
    const currentTheme = localStorage.getItem('theme') || 'light';
    htmlElement.setAttribute('data-theme', currentTheme);
    themeToggle.textContent = currentTheme === 'light' ? '🌙' : '☀️';

    themeToggle.addEventListener('click', () => {
        const theme = htmlElement.getAttribute('data-theme');
        const newTheme = theme === 'light' ? 'dark' : 'light';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        themeToggle.textContent = newTheme === 'light' ? '🌙' : '☀️';
    });
}

// Contact form handling
const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');

form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Clear previous error states
    clearFormErrors();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    let isValid = true;
    let errors = [];

    // Validate name
    if (!name) {
        showFieldError('name', 'Name is required');
        isValid = false;
        errors.push('name');
    } else if (name.length < 2) {
        showFieldError('name', 'Name must be at least 2 characters long');
        isValid = false;
        errors.push('name');
    }

    // Validate email
    if (!email) {
        showFieldError('email', 'Email is required');
        isValid = false;
        errors.push('email');
    } else if (!isValidEmail(email)) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
        errors.push('email');
    }

    // Validate message
    if (!message) {
        showFieldError('message', 'Message is required');
        isValid = false;
        errors.push('message');
    } else if (message.length < 10) {
        showFieldError('message', 'Message must be at least 10 characters long');
        isValid = false;
        errors.push('message');
    }

    if (!isValid) {
        status.textContent = 'Please correct the errors above and try again.';
        status.className = 'error';
        return;
    }

    // Show loading state
    status.textContent = 'Sending your message...';
    status.className = 'loading';

    // Disable form during submission
    setFormDisabled(true);

    // Simulate API call with potential failure
    simulateFormSubmission(name, email, message)
        .then(() => {
            status.textContent = 'Thank you! Your message has been sent successfully.';
            status.className = 'success';
            form.reset();
            clearFormErrors();
        })
        .catch((error) => {
            status.textContent = 'Sorry, we couldn\'t send your message right now. Please try again later or contact us directly.';
            status.className = 'error';
            console.error('Form submission error:', error);
        })
        .finally(() => {
            setFormDisabled(false);
        });
});

function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorElement = document.createElement('span');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    field.classList.add('error');
    field.parentNode.insertBefore(errorElement, field.nextSibling);
}

function clearFormErrors() {
    // Remove all error messages
    document.querySelectorAll('.field-error').forEach(el => el.remove());
    // Remove error classes from inputs
    document.querySelectorAll('#contactForm input, #contactForm textarea').forEach(el => el.classList.remove('error'));
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function setFormDisabled(disabled) {
    const inputs = form.querySelectorAll('input, textarea, button');
    inputs.forEach(input => {
        input.disabled = disabled;
    });
    if (disabled) {
        form.classList.add('submitting');
    } else {
        form.classList.remove('submitting');
    }
}

function simulateFormSubmission(name, email, message) {
    return new Promise((resolve, reject) => {
        // Simulate network delay
        setTimeout(() => {
            // Simulate occasional failure (10% chance)
            if (Math.random() < 0.1) {
                reject(new Error('Network error'));
            } else {
                resolve();
            }
        }, 1500);
    });
}

// Tab switching
const navButtons = document.querySelectorAll('.nav-btn');
navButtons.forEach(button => {
    button.addEventListener('click', () => {
        switchToSection(button.getAttribute('data-section'));
    });
});

function switchToSection(sectionId) {
    // Remove active from all buttons and sections
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-section').forEach(section => section.classList.remove('active'));
    // Add active to clicked button and corresponding section
    const button = document.querySelector(`[data-section="${sectionId}"]`);
    if (button) {
        button.classList.add('active');
    }
    document.getElementById(sectionId).classList.add('active');
    // Scroll to section
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
}

// Fun fact API
async function fetchFunFact() {
    const factText = document.getElementById('fun-fact-text');
    const newFactBtn = document.getElementById('new-fact-btn');

    // Show loading state
    factText.textContent = 'Loading a fun fact...';
    factText.className = 'loading';
    newFactBtn.disabled = true;
    newFactBtn.textContent = 'Loading...';

    try {
        const response = await fetch('https://uselessfacts.jsph.pl/random.json?language=en');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Success state
        factText.textContent = data.text;
        factText.className = 'success';

    } catch (error) {
        // Error state
        factText.textContent = 'Sorry, couldn\'t load a fun fact right now. Please check your internet connection and try again.';
        factText.className = 'error';
        console.error('Error fetching fun fact:', error);
    } finally {
        // Reset button
        newFactBtn.disabled = false;
        newFactBtn.textContent = 'Get New Fact';
    }
}

// Projects loading
async function loadProjects() {
    const projectsContainer = document.querySelector('.projects');
    const projectsSection = document.getElementById('projects');

    // Show loading state
    projectsContainer.innerHTML = '<div class="loading-state">Loading projects...</div>';

    try {
        // Simulate API call to load projects
        const projects = await fetchProjects();

        if (projects.length === 0) {
            // Empty state
            projectsContainer.innerHTML = '<div class="empty-state">No projects found. Check back later for new projects!</div>';
        } else {
            // Render projects
            projectsContainer.innerHTML = projects.map(project => `
                <article class="project card" aria-labelledby="p${project.id}">
                    <div>
                        <h3 id="p${project.id}" style="margin:0">${project.title}</h3>
                        <p style="margin:6px 0;color:var(--muted)">${project.description}</p>
                    </div>
                </article>
            `).join('');
        }

    } catch (error) {
        // Error state
        projectsContainer.innerHTML = '<div class="error-state">Failed to load projects. Please try refreshing the page.</div>';
        console.error('Error loading projects:', error);
    }
}

function fetchProjects() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate occasional failure (5% chance)
            if (Math.random() < 0.05) {
                reject(new Error('Network error'));
                return;
            }

            // Simulate successful data (you can modify this to return empty array to test empty state)
            const projects = [
                {
                    id: 1,
                    title: 'ModelWatch',
                    description: 'A system designed to monitor machine-learning model performance and detect data drift before predictions fail in real-world use.'
                },
                {
                    id: 2,
                    title: 'Supervised ML on Structured Data',
                    description: 'Built machine-learning models using tabular numerical data, applying feature scaling and selection to compare the effectiveness of different supervised algorithms.'
                }
            ];

            resolve(projects);
        }, 1000);
    });
}

// Load initial fact and set up button
document.addEventListener('DOMContentLoaded', () => {
    fetchFunFact();
    loadProjects();

    const newFactBtn = document.getElementById('new-fact-btn');
    if (newFactBtn) {
        newFactBtn.addEventListener('click', fetchFunFact);
    }

    // View projects button
    const viewProjectsBtn = document.getElementById('view-projects-btn');
    if (viewProjectsBtn) {
        viewProjectsBtn.addEventListener('click', () => {
            // Switch to projects tab
            switchToSection('projects');
        });
    }
});
