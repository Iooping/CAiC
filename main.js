// Fireflies Animation - HTML Canvas
const canvas = document.getElementById('fireflies-canvas');
const ctx = canvas.getContext('2d');

let fireflies = [];
const numFireflies = 100;
const speed = 0.5;

class Firefly {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.glow = Math.random() * 0.5 + 0.1;
        this.vx = (Math.random() - 0.5) * speed;
        this.vy = (Math.random() - 0.5) * speed;
        this.opacity = 0;
        this.pathX = Math.random() * 20 - 10;
        this.pathY = Math.random() * 20 - 10;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Gentle path following and bounds check
        if (Math.random() < 0.05) {
            this.vx = (Math.random() - 0.5) * speed;
            this.vy = (Math.random() - 0.5) * speed;
        }

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        // Fade in and out effect
        this.opacity += (this.glow - this.opacity) * 0.05;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 150, ${this.opacity})`;
        ctx.shadowColor = `rgba(255, 255, 150, ${this.opacity})`;
        ctx.shadowBlur = this.size * 5;
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

function initFireflies() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    fireflies = [];
    for (let i = 0; i < numFireflies; i++) {
        fireflies.push(new Firefly());
    }
}

function animateFireflies() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const firefly of fireflies) {
        firefly.update();
        firefly.draw();
    }
    requestAnimationFrame(animateFireflies);
}

window.addEventListener('resize', initFireflies);
initFireflies();
animateFireflies();

// GSAP Scroll Animations
gsap.registerPlugin(ScrollTrigger);

// Hero section animations
gsap.from(".hero-title", {
    y: 50,
    opacity: 0,
    duration: 1,
    ease: "power2.out"
});

gsap.from(".hero-subtitle", {
    y: 50,
    opacity: 0,
    duration: 1,
    delay: 0.3,
    ease: "power2.out"
});

gsap.from(".cta-container", {
    y: 50,
    opacity: 0,
    duration: 1,
    delay: 0.6,
    ease: "power2.out"
});

// Chat section animations on scroll
gsap.from(".chat-card", {
    y: 100,
    opacity: 0,
    duration: 1,
    scrollTrigger: {
        trigger: ".chat-section",
        start: "top 80%",
        toggleActions: "play none none none"
    }
});

// AI Chat Interface Logic
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const sendChatBtn = document.getElementById('send-chat-btn');

function appendUserMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message user-message';
    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll to bottom
}

function appendAIMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message system-message';
    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function handleChatInput() {
    const message = chatInput.value.trim();
    if (message === '') return;

    appendUserMessage(message);
    chatInput.value = '';

    // Simulate API call to the AI agent
    appendAIMessage('Thinking...');

    try {
        const response = await fetch('https://us-central1-your-firebase-project.cloudfunctions.net/chatAgent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: message })
        });

        if (response.ok) {
            const data = await response.json();
            // Replace 'Thinking...' with the actual response
            const lastMessage = chatMessages.lastElementChild;
            if (lastMessage && lastMessage.textContent === 'Thinking...') {
                chatMessages.removeChild(lastMessage);
            }
            appendAIMessage(data.response);
        } else {
            throw new Error('Server responded with an error.');
        }

    } catch (error) {
        console.error('Chat API error:', error);
        const lastMessage = chatMessages.lastElementChild;
        if (lastMessage && lastMessage.textContent === 'Thinking...') {
            chatMessages.removeChild(lastMessage);
        }
        appendAIMessage('Sorry, something went wrong. Please try again.');
    }
}

// Event Listeners for functional buttons
sendChatBtn.addEventListener('click', handleChatInput);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleChatInput();
    }
});

document.getElementById('get-started-btn').addEventListener('click', () => {
    console.log('Get Started button clicked! - Navigating to a contact form or signup page.');
    // Add logic to navigate or open a modal
});

document.getElementById('learn-more-btn').addEventListener('click', () => {
    console.log('Learn More button clicked! - Scrolling to the next section.');
    gsap.to(window, { duration: 1, scrollTo: ".chat-section", ease: "power2.inOut" });
});

document.getElementById('persona-toggle-btn').addEventListener('click', () => {
    console.log('Persona toggle button clicked! - This would open a modal for persona selection.');
    // Add logic for a persona selection modal here
    alert("Persona Selection feature is coming soon!");
});
