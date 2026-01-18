// Chat Widget - Native JavaScript
// No third-party dependencies

// Open chat modal
function openChat() {
    const modal = document.getElementById('chatModal');
    modal.style.display = 'block';
    document.getElementById('chatSuccess').style.display = 'none';
    document.getElementById('chatForm').reset();
}

// Close chat modal
function closeChat() {
    const modal = document.getElementById('chatModal');
    modal.style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('chatModal');
    if (event.target === modal) {
        closeChat();
    }
}

// Handle chat form submission
document.addEventListener('DOMContentLoaded', function() {
    const chatForm = document.getElementById('chatForm');
    
    chatForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = chatForm.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        
        // Disable button and show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        // Collect form data
        const formData = {
            name: document.getElementById('name').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            email: document.getElementById('email').value.trim(),
            message: document.getElementById('message').value.trim()
        };
        
        // Validation: at least phone or email required
        if (!formData.phone && !formData.email) {
            alert('Please provide either a phone number or email address.');
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            return;
        }
        
        try {
            // Submit to Netlify function
            const response = await fetch('/.netlify/functions/chat-submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            if (!response.ok) {
                throw new Error('Failed to send message');
            }
            
            const result = await response.json();
            
            if (result.success) {
                // Show success message
                document.getElementById('chatForm').style.display = 'none';
                document.getElementById('chatSuccess').style.display = 'block';
                
                // Reset form after delay
                setTimeout(() => {
                    closeChat();
                    chatForm.style.display = 'block';
                    chatForm.reset();
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                }, 3000);
            }
        } catch (error) {
            console.error('Error submitting chat:', error);
            alert('Failed to send message. Please try again or contact us directly.');
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // ESC to close modal
    if (e.key === 'Escape') {
        closeChat();
    }
});
