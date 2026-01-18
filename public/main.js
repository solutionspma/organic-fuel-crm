// Main JavaScript for Organic Fuel website
// Additional site functionality

// Pexels API Integration for Dynamic Images
const PEXELS_API_KEY = 'RH8RBXiR6FvHEKqhKz6t6BQqGQHLJc4eXgNQq5oPd9FVVSJlTuzhAWvV';

async function loadPexelsImages() {
    // Get all service cards with Pexels query attributes
    const serviceCards = document.querySelectorAll('.service-card[data-pexels-query]');
    
    for (const card of serviceCards) {
        const query = card.getAttribute('data-pexels-query');
        const imageDiv = card.querySelector('.service-image');
        
        if (!imageDiv) continue;
        
        try {
            const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`, {
                headers: {
                    'Authorization': PEXELS_API_KEY
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.photos && data.photos.length > 0) {
                    const photo = data.photos[0];
                    imageDiv.style.backgroundImage = `url(${photo.src.large})`;
                    imageDiv.style.opacity = '0';
                    imageDiv.style.transition = 'opacity 0.6s ease-in-out';
                    setTimeout(() => {
                        imageDiv.style.opacity = '1';
                    }, 100);
                }
            }
        } catch (error) {
            console.warn('Failed to load Pexels image:', error);
        }
        
        // Add small delay between requests to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 250));
    }
}

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Load Pexels images
    loadPexelsImages();
    
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Add active state to navigation based on scroll position
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 100) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
});

// Form validation helper
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    // Remove all non-numeric characters
    const cleaned = phone.replace(/\D/g, '');
    // Check if it's a valid length (10-15 digits)
    return cleaned.length >= 10 && cleaned.length <= 15;
}

// Export for use in other scripts
window.organicFuel = {
    validateEmail,
    validatePhone
};

// Console branding
console.log('%c🌱 Organic Fuel', 'font-size: 20px; font-weight: bold; color: #2563eb;');
console.log('%cOwned communications infrastructure. Not rented.', 'font-size: 12px; color: #10b981;');
