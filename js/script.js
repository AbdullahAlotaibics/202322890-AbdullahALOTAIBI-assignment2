
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
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
        status.textContent = 'Please fill out all fields.';
        return;
    }

    // simulate submit
    status.textContent = 'Sending...';
    setTimeout(() => {
        status.textContent = 'Thanks! Your message was sent (simulation).';
        form.reset();
    }, 900);
});

// Tab switching
const navButtons = document.querySelectorAll('.nav-btn');
navButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active from all buttons and sections
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-section').forEach(section => section.classList.remove('active'));
        // Add active to clicked button and corresponding section
        button.classList.add('active');
        const sectionId = button.getAttribute('data-section');
        document.getElementById(sectionId).classList.add('active');
    });
});

// Fun fact API
async function fetchFunFact() {
    const factText = document.getElementById('fun-fact-text');
    const factSection = document.getElementById('fun-fact');
    
    // Add loading state with pulse animation
    factText.style.opacity = '0.6';
    factText.textContent = 'Loading a fun fact...';
    
    try {
        const response = await fetch('https://uselessfacts.jsph.pl/random.json?language=en');
        if (!response.ok) {
            throw new Error('Failed to fetch fact');
        }
        const data = await response.json();
        factText.style.opacity = '1';
        factText.textContent = data.text;
    } catch (error) {
        factText.style.opacity = '1';
        factText.textContent = 'Sorry, couldn\'t load a fun fact right now. Please try again later!';
        console.error('Error fetching fun fact:', error);
    }
}

// Load initial fact and set up button
document.addEventListener('DOMContentLoaded', () => {
    fetchFunFact();
    const newFactBtn = document.getElementById('new-fact-btn');
    if (newFactBtn) {
        newFactBtn.addEventListener('click', fetchFunFact);
    }
});
