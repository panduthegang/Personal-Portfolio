// Three.js Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
const container = document.getElementById('three-container');

renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// Create animated background
const geometry = new THREE.TorusGeometry(12, 4, 20, 100);
const material = new THREE.MeshBasicMaterial({ 
    color: 0x2a9d8f,
    wireframe: true,
    transparent: true,
    opacity: 0.8
});
const torus = new THREE.Mesh(geometry, material);
torus.position.z = -5;  // Bring it closer to camera
scene.add(torus);

// Add dodecahedron
const dodecahedronGeometry = new THREE.DodecahedronGeometry(4, 0);
const dodecahedronMaterial = new THREE.MeshBasicMaterial({
    color: 0xe9c46a,
    wireframe: true,
    transparent: true,
    opacity: 0.5
});
const dodecahedron = new THREE.Mesh(dodecahedronGeometry, dodecahedronMaterial);
dodecahedron.position.x = -15;
dodecahedron.position.z = 5;  // Push it back
scene.add(dodecahedron);

// Add icosahedron
const icosahedronGeometry = new THREE.IcosahedronGeometry(3.5, 0);
const icosahedronMaterial = new THREE.MeshBasicMaterial({
    color: 0x264653,
    wireframe: true,
    transparent: true,
    opacity: 0.6
});
const icosahedron = new THREE.Mesh(icosahedronGeometry, icosahedronMaterial);
icosahedron.position.x = 15;
icosahedron.position.y = 5;
icosahedron.position.z = 8;  // Push it back
scene.add(icosahedron);

// Add octahedron ring
const octahedronGeometry = new THREE.OctahedronGeometry(1.5, 0);
const octahedronMaterial = new THREE.MeshBasicMaterial({
    color: 0x2a9d8f,
    wireframe: true,
    transparent: true,
    opacity: 0.3
});

const octahedrons = [];
const octahedronCount = 8;
for(let i = 0; i < octahedronCount; i++) {
    const octahedron = new THREE.Mesh(octahedronGeometry, octahedronMaterial);
    const angle = (i / octahedronCount) * Math.PI * 2;
    const radius = 22;  // Increased radius
    octahedron.position.x = Math.cos(angle) * radius;
    octahedron.position.z = Math.sin(angle) * radius + 10;  // Push back and adjust orbit
    octahedron.position.y = Math.sin(i) * 2;
    octahedrons.push(octahedron);
    scene.add(octahedron);
}

// Add tetrahedron
const tetrahedronGeometry = new THREE.TetrahedronGeometry(2.5, 0);
const tetrahedronMaterial = new THREE.MeshBasicMaterial({
    color: 0xe9c46a,
    wireframe: true,
    transparent: true,
    opacity: 0.4
});
const tetrahedron = new THREE.Mesh(tetrahedronGeometry, tetrahedronMaterial);
tetrahedron.position.y = -10;
tetrahedron.position.x = -8;
tetrahedron.position.z = 7;  // Push it back
scene.add(tetrahedron);

camera.position.z = 30;

// Particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 5000;
const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 100;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMaterial = new THREE.PointsMaterial({ 
    size: 0.005,
    color: 0x2a9d8f
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    
    const time = Date.now() * 0.001;
    
    // Main torus animation
    torus.rotation.x += 0.002;
    torus.rotation.y += 0.003;
    torus.rotation.z += 0.001;
    torus.scale.x = torus.scale.y = 1 + Math.sin(time * 0.5) * 0.1;  // Subtle breathing effect
    
    dodecahedron.rotation.x += 0.002;
    dodecahedron.rotation.y -= 0.001;
    dodecahedron.position.y = Math.sin(time) * 2;
    
    icosahedron.rotation.x -= 0.001;
    icosahedron.rotation.y += 0.002;
    icosahedron.position.y = Math.cos(time) * 3;
    
    tetrahedron.rotation.x += 0.003;
    tetrahedron.rotation.y -= 0.002;
    tetrahedron.position.y = -10 + Math.sin(time * 1.5) * 2;
    
    // Animate octahedron ring with varying speeds
    octahedrons.forEach((octahedron, i) => {
        const angle = (i / octahedronCount) * Math.PI * 2 + time * 0.5;  // Slower rotation
        const radius = 22 + Math.sin(time * 2 + i) * 2;  // Dynamic radius
        octahedron.position.x = Math.cos(angle) * radius;
        octahedron.position.z = Math.sin(angle) * radius + 10;
        octahedron.position.y = Math.sin(time * 2 + i) * 2;
        octahedron.rotation.x += 0.02;
        octahedron.rotation.y += 0.01;
    });
    
    particlesMesh.rotation.y += 0.0005;
    
    renderer.render(scene, camera);
}

animate();

// Responsive Canvas
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Mobile Navigation
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('nav-active');
    navToggle.classList.toggle('toggle-active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('nav-active');
        navToggle.classList.remove('toggle-active');
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !navToggle.contains(e.target) && navLinks.classList.contains('nav-active')) {
        navLinks.classList.remove('nav-active');
        navToggle.classList.remove('toggle-active');
    }
});

// Form Validation
const form = document.querySelector('.contact-form');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Basic form validation
    const name = form.querySelector('input[type="text"]').value;
    const email = form.querySelector('input[type="email"]').value;
    const message = form.querySelector('textarea').value;
    
    if (!name || !email || !message) {
        alert('Please fill in all fields');
        return;
    }
    
    // Here you would typically send the form data to a server
    console.log('Form submitted:', { name, email, message });
    alert('Thank you for your message! I will get back to you soon.');
    form.reset();
});

// Contact Form Handling
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    // Create mailto URL with form data
    const mailtoUrl = `mailto:harshsrathod959@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    )}`;
    
    // Open default email client
    window.location.href = mailtoUrl;
    
    // Show success message
    setTimeout(() => {
        alert('Thank you! Your default email client has been opened with your message.');
        this.reset();
    }, 500);
});

// Add floating label behavior
document.querySelectorAll('.form-group input, .form-group textarea').forEach(field => {
    field.addEventListener('focus', () => {
        field.parentNode.classList.add('focused');
    });
    
    field.addEventListener('blur', () => {
        if (!field.value) {
            field.parentNode.classList.remove('focused');
        }
    });
    
    // Check initial state
    if (field.value) {
        field.parentNode.classList.add('focused');
    }
});

// Scroll Animations
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Mouse move parallax effect for hero section
document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth - 0.5;
    const mouseY = e.clientY / window.innerHeight - 0.5;
    
    torus.rotation.x += mouseY * 0.1;
    torus.rotation.y += mouseX * 0.1;
    
    dodecahedron.rotation.x += mouseY * 0.05;
    dodecahedron.rotation.y += mouseX * 0.05;
    
    icosahedron.rotation.x += mouseY * 0.08;
    icosahedron.rotation.y += mouseX * 0.08;
    
    tetrahedron.rotation.x += mouseY * 0.06;
    tetrahedron.rotation.y += mouseX * 0.06;
    
    octahedrons.forEach(octahedron => {
        octahedron.rotation.x += mouseY * 0.03;
        octahedron.rotation.y += mouseX * 0.03;
    });
});

// Project Cards Juggling Animation
const projectCards = document.querySelectorAll('.project-card');
let juggleTimeouts = [];

const juggleCard = (card, index) => {
    const randomDelay = Math.random() * 1000;
    const floatHeight = -15 - Math.random() * 10; // Random float height between -15 and -25
    const duration = 2000 + Math.random() * 1000; // Random duration between 2-3s
    
    // Clear previous animation
    if (juggleTimeouts[index]) {
        clearTimeout(juggleTimeouts[index]);
    }
    
    // Initial position
    card.style.transform = 'translateY(0)';
    card.style.transition = `transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
    
    // Start juggling after random delay
    juggleTimeouts[index] = setTimeout(() => {
        card.style.transform = `translateY(${floatHeight}px)`;
        
        // Return to original position
        setTimeout(() => {
            card.style.transform = 'translateY(0)';
            
            // Repeat animation
            setTimeout(() => juggleCard(card, index), 100);
        }, duration);
    }, randomDelay);
};

// Intersection Observer for project cards
const projectObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            const card = entry.target;
            
            // Initial fade in
            card.style.opacity = '0';
            card.style.transform = 'translateY(50px)';
            
            setTimeout(() => {
                card.style.transition = 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
                
                // Start juggling after fade in
                setTimeout(() => {
                    juggleCard(card, index);
                }, 800);
            }, index * 200); // Stagger the animations
        } else {
            // Stop juggling when out of view
            if (juggleTimeouts[index]) {
                clearTimeout(juggleTimeouts[index]);
            }
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.2,
    rootMargin: '0px'
});

// Observe all project cards
projectCards.forEach(card => {
    projectObserver.observe(card);
});

// Enhanced project card interactions
document.querySelectorAll('.project-card').forEach((card, index) => {
    // Add index to tech tags for staggered animation
    card.querySelectorAll('.tech-tag').forEach((tag, tagIndex) => {
        tag.style.setProperty('--tag-index', tagIndex);
    });
    
    // Mouse move effect
    card.addEventListener('mousemove', (e) => {
        // Don't apply effects if hovering over buttons
        if (e.target.closest('.project-link')) return;
        
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Update CSS variables for gradient
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
        
        // Tilt effect
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        // Don't apply transform if hovering over buttons
        if (!e.target.closest('.project-links')) {
            card.style.transform = `
                perspective(1000px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                translateZ(10px)
            `;
        }
    });
    
    // Reset card on mouse leave
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) translateZ(0)';
        const content = card.querySelector('.project-content');
        const image = card.querySelector('.project-image');
        if (content) content.style.transform = '';
        if (image) image.style.transform = '';
    });
});

// Simplified button hover effect
document.querySelectorAll('.project-link').forEach(button => {
    button.addEventListener('mouseenter', (e) => {
        e.stopPropagation(); // Prevent card effects when hovering button
    });
});

// Add magnetic effect to buttons
document.querySelectorAll('.project-link').forEach(button => {
    button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const deltaX = (x - centerX) / 8;
        const deltaY = (y - centerY) / 8;
        
        button.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = '';
    });
});
