// Animations Module
class AnimationsManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupPreloader();
        this.setupScrollAnimations();
        this.setupPoetryInteractions();
        this.setupBackToTop();
    }

    setupPreloader() {
        const preloader = document.getElementById('preloader');
        if (!preloader) return;

        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('hidden');
            }, 500); // Small delay for smooth transition
        });
    }

    setupScrollAnimations() {
        const sectionsToAnimate = document.querySelectorAll('.animate-on-scroll');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target); // Animate only once
                }
            });
        }, {
            threshold: 0.1 // Trigger when 10% of the element is visible
        });

        sectionsToAnimate.forEach(section => {
            observer.observe(section);
        });
    }

    setupPoetryInteractions() {
        this.setupCopyButtons();
        this.setupLikeButtons();
    }

    setupCopyButtons() {
        const copyButtons = document.querySelectorAll('.copy-btn');

        copyButtons.forEach(button => {
            button.addEventListener('click', () => {
                const blockquote = button.closest('blockquote');
                if (!blockquote) return;

                const paragraphs = blockquote.querySelectorAll('p');
                let textToCopy = '';

                paragraphs.forEach(p => {
                    textToCopy += p.innerText + '\n';
                });

                // Use the Clipboard API to copy text
                navigator.clipboard.writeText(textToCopy.trim()).then(() => {
                    // Provide visual feedback
                    const originalContent = button.innerHTML;
                    button.innerHTML = 'Copied!';
                    button.classList.add('copied');

                    setTimeout(() => {
                        button.innerHTML = originalContent;
                        button.classList.remove('copied');
                    }, 2000); // Revert after 2 seconds
                }).catch(err => {
                    console.error('Failed to copy text: ', err);
                    // Fallback for older browsers
                    this.fallbackCopyTextToClipboard(textToCopy.trim());
                });
            });
        });
    }

    setupLikeButtons() {
        const likeButtons = document.querySelectorAll('.like-btn');

        likeButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Toggle the 'liked' state
                button.classList.toggle('liked');

                // Create and animate the heart burst effect
                if (button.classList.contains('liked')) {
                    this.createHeartBurst(button);
                }
            });
        });
    }

    createHeartBurst(button) {
        for (let i = 0; i < 7; i++) {
            const burst = document.createElement('div');
            burst.classList.add('heart-burst');
            burst.innerHTML = '❤️';
            burst.style.setProperty('--tx', (Math.random() - 0.5) * 60 + 'px');
            burst.style.setProperty('--ty', (Math.random() - 0.5) * 60 + 'px');
            button.appendChild(burst);

            // Remove the element after animation
            setTimeout(() => burst.remove(), 700);
        }
    }

    fallbackCopyTextToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            document.execCommand('copy');
            // Show success feedback
            this.showCopySuccess();
        } catch (err) {
            console.error('Fallback copy failed:', err);
        }

        textArea.remove();
    }

    showCopySuccess() {
        // Simple success indicator
        const notification = document.createElement('div');
        notification.textContent = 'Copied to clipboard!';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--primary-color);
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 1000;
            animation: fadeInOut 2s ease-in-out;
        `;
        document.body.appendChild(notification);

        setTimeout(() => notification.remove(), 2000);
    }

    setupBackToTop() {
        const backToTopBtn = document.getElementById('back-to-top-btn');
        if (!backToTopBtn) return;

        window.addEventListener('scroll', () => {
            if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// CSS for animations
const animationStyles = `
@keyframes fadeInOut {
    0%, 100% { opacity: 0; transform: translateY(-10px); }
    50% { opacity: 1; transform: translateY(0); }
}

.heart-burst {
    position: absolute;
    font-size: 16px;
    pointer-events: none;
    animation: burst 0.7s ease-out forwards;
}

@keyframes burst {
    0% {
        opacity: 1;
        transform: scale(0) translate(var(--tx), var(--ty));
    }
    50% {
        opacity: 1;
        transform: scale(1.2) translate(var(--tx), var(--ty));
    }
    100% {
        opacity: 0;
        transform: scale(0.8) translate(var(--tx), var(--ty));
    }
}

#back-to-top-btn {
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
}

#back-to-top-btn.show {
    opacity: 1;
    visibility: visible;
}
`;

// Add animation styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = animationStyles;
document.head.appendChild(styleSheet);

// Initialize Animations Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AnimationsManager();
});