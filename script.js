/**
 * Divyanshu Kumar Sharma - Premium Portfolio Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Neural Network Background
    initNeuralCanvas();
    
    // 2. Custom Cursor
    initCustomCursor();
    
    // 3. Magnetic Buttons
    initMagneticButtons();
    
    // 4. Hero Typing Animation
    initTyping();
    
    // 5. Entrance Animations (Scroll)
    initScrollAnimations();
    
    // 6. Project Modal Logic
    initModal();
    
    // 7. Theme Toggle
    initThemeToggle();
    
    // 8. 3D Tilt Effect
    initTiltEffect();
});

/* --- Neural Background --- */
function initNeuralCanvas() {
    const canvas = document.getElementById('neural-canvas');
    const ctx = canvas.getContext('2d');
    
    let particles = [];
    const particleCount = 60;
    const connectionDistance = 150;
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resize);
    resize();
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 1;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--primary');
            ctx.fill();
        }
    }
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < connectionDistance) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    const opacity = 1 - (distance / connectionDistance);
                    ctx.strokeStyle = `rgba(59, 130, 246, ${opacity * 0.15})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }
    
    animate();
}

/* --- Custom Cursor & Trail --- */
function initCustomCursor() {
    const cursor = document.getElementById('custom-cursor');
    const trail = document.getElementById('cursor-trail');
    
    let mouseX = 0, mouseY = 0;
    let trailX = 0, trailY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });
    
    // Smooth trail animation
    function animateTrail() {
        // Linear interpolation for smooth trailing
        trailX += (mouseX - trailX) * 0.15;
        trailY += (mouseY - trailY) * 0.15;
        
        trail.style.left = trailX + 'px';
        trail.style.top = trailY + 'px';
        
        requestAnimationFrame(animateTrail);
    }
    animateTrail();
    
    const clickables = document.querySelectorAll('a, button, .project-card, .bento-item');
    clickables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(2)';
            trail.style.transform = 'translate(-50%, -50%) scale(1.5)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            trail.style.transform = 'translate(-50%, -50%) scale(1)';
        });
        el.style.cursor = 'none'; // Hide native cursor
    });
}

/* --- Magnetic Buttons --- */
function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn-magnetic');
    
    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.5}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });
}

/* --- Typing Animation --- */
function initTyping() {
    const target = document.querySelector('.hero-typing');
    const words = ["AI/ML Student", "Fullstack Developer", "Problem Solver", "Innovator"];
    let i = 0, j = 0, isDeleting = false;
    
    function type() {
        const currentWord = words[i % words.length];
        if (isDeleting) {
            target.textContent = currentWord.substring(0, j--);
            if (j < 0) { isDeleting = false; i++; }
        } else {
            target.textContent = currentWord.substring(0, j++);
            if (j > currentWord.length) isDeleting = true;
        }
        setTimeout(type, isDeleting ? 50 : 150);
    }
    
    type();
}

/* --- Entrance Animations --- */
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.glass, .timeline-item, .bento-item').forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
        el.style.transition = "all 0.8s cubic-bezier(0.23, 1, 0.32, 1)";
        observer.observe(el);
    });
}

/* --- Modal Logic --- */
function initModal() {
    const modal = document.getElementById('project-modal');
    const closeBtn = document.getElementById('close-modal');
    const modalBody = document.getElementById('modal-body');
    
    document.querySelectorAll('.project-view-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.project-card');
            const title = card.querySelector('h3').textContent;
            const desc = card.querySelector('p').textContent;
            const img = card.querySelector('.project-img').src;
            
            modalBody.innerHTML = `
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
                    <img src="${img}" style="width: 100%; border-radius: 15px;">
                    <div>
                        <h2 style="font-size: 2rem; margin-bottom: 20px;">${title}</h2>
                        <p style="color: var(--text-muted); margin-bottom: 30px;">${desc}</p>
                        <h4 style="margin-bottom: 15px;">Key Technologies</h4>
                        <div class="skill-tags" style="margin-bottom: 30px;">
                            <span class="tag">PyTorch</span>
                            <span class="tag">TensorFlow</span>
                            <span class="tag">OpenCV</span>
                        </div>
                        <a href="#" class="btn-magnetic btn-primary" style="text-decoration: none; color: white;">Visit Project</a>
                    </div>
                </div>
            `;
            modal.style.display = 'flex';
        });
    });
    
    closeBtn.onclick = () => modal.style.display = 'none';
    window.onclick = (e) => { if (e.target == modal) modal.style.display = 'none'; };
}

/* --- Theme Toggle --- */
function initThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    const body = document.body;
    const icon = toggle.querySelector('i');
    
    toggle.addEventListener('click', () => {
        const isDark = body.getAttribute('data-theme') !== 'light';
        body.setAttribute('data-theme', isDark ? 'light' : 'dark');
        icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    });
}

/* --- 3D Tilt Effect --- */
function initTiltEffect() {
    const cards = document.querySelectorAll('.project-card, .bento-item, .hero-img-container');
    
    cards.forEach(card => {
        card.classList.add('tilt');
        
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element.
            const y = e.clientY - rect.top;  // y position within the element.
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10; // Max rotation 10deg
            const rotateY = ((x - centerX) / centerX) * 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            card.style.transition = 'none';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            card.style.transition = 'transform 0.5s ease';
        });
    });
}