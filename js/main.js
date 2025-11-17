document.addEventListener('DOMContentLoaded', function() {
    // Enhanced Play Button Effects
    const playButton = document.querySelector('.play-btn');
    
    if (playButton) {
        // Create ripple effect on click
        playButton.addEventListener('click', function(e) {
            // Prevent default only if there's no href
            if (!this.getAttribute('href')) {
                e.preventDefault();
            }
            
            // Add click animation class
            this.classList.add('clicked');
            
            // Add ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${e.clientX - rect.left - size/2}px`;
            ripple.style.top = `${e.clientY - rect.top - size/2}px`;
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            // Remove ripple after animation
            setTimeout(() => {
                ripple.remove();
            }, 600);
            
            // Add playing animation
            this.classList.add('playing');
            
            // If there's an href, follow it after a short delay
            const href = this.getAttribute('href');
            if (href && href !== '#') {
                setTimeout(() => {
                    window.location.href = href;
                }, 300);
            }
        });
        
        // Hover effects
        const playIcon = playButton.querySelector('i');
        let hoverTimeout;
        
        playButton.addEventListener('mouseenter', () => {
            clearTimeout(hoverTimeout);
            playButton.classList.add('hover');
            if (playIcon) {
                playIcon.style.transform = 'scale(1.2)';
            }
        });
        
        playButton.addEventListener('mouseleave', () => {
            playButton.classList.remove('hover');
            if (playIcon) {
                playIcon.style.transform = 'scale(1)';
            }
        });
        
        // Remove animation classes after they complete
        playButton.addEventListener('animationend', function() {
            this.classList.remove('clicked', 'playing');
        });
    }
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
