// Main Application Script
class App {
    constructor() {
        this.html = document.documentElement;
        this.init();
    }

    init() {
        this.setupThemeSwitcher();
        this.setupLanguageSwitcher();
        this.setupNavigation();
        this.setupCarousel();
        this.initParticles();
    }

    setupThemeSwitcher() {
        const themeButtons = document.querySelectorAll('.controls button[data-theme]');

        const setTheme = (theme) => {
            this.html.setAttribute('data-theme', theme);

            // Update active button
            themeButtons.forEach(btn => btn.classList.remove('active'));
            const activeButton = document.querySelector(`[data-theme="${theme}"]`);
            if (activeButton) {
                activeButton.classList.add('active');
            }

            // Save theme to localStorage
            localStorage.setItem('theme', theme);

            // Re-initialize particles with new colors
            this.initParticles();
        };

        // Check for saved theme or system preference
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme) {
            setTheme(savedTheme);
        } else {
            setTheme(prefersDark ? 'dark' : 'light');
        }

        // Theme button events
        themeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const theme = button.dataset.theme;
                setTheme(theme);
            });
        });

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (!localStorage.getItem('theme')) {
                setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    setupLanguageSwitcher() {
        const langButtons = document.querySelectorAll('.controls button[data-lang]');
        const langElementsEn = document.querySelectorAll('.lang-en');
        const langElementsUr = document.querySelectorAll('.lang-ur');

        const setLanguage = (lang) => {
            if (lang === 'ur') {
                // Show Urdu, hide English
                langElementsEn.forEach(el => el.style.display = 'none');
                langElementsUr.forEach(el => el.style.display = 'inline');
                this.html.setAttribute('lang', 'ur');
                document.body.style.fontFamily = "'Noto Nastaliq Urdu', 'Poppins', sans-serif";
                document.body.style.direction = 'rtl';
            } else {
                // Show English, hide Urdu
                langElementsEn.forEach(el => el.style.display = 'inline');
                langElementsUr.forEach(el => el.style.display = 'none');
                this.html.setAttribute('lang', 'en');
                document.body.style.fontFamily = "'Poppins', sans-serif";
                document.body.style.direction = 'ltr';
            }

            // Update active button
            langButtons.forEach(btn => btn.classList.remove('active'));
            const activeButton = document.querySelector(`[data-lang="${lang}"]`);
            if (activeButton) {
                activeButton.classList.add('active');
            }

            // Save language preference
            localStorage.setItem('language', lang);
        };

        // Check for saved language
        const savedLang = localStorage.getItem('language') || 'en';
        setLanguage(savedLang);

        // Language button events
        langButtons.forEach(button => {
            button.addEventListener('click', () => {
                const lang = button.dataset.lang;
                setLanguage(lang);
            });
        });
    }

    setupNavigation() {
        const sections = document.querySelectorAll('main section[id]');
        const navLinks = document.querySelectorAll('.nav-links a');
        const headerHeight = document.querySelector('header').offsetHeight;

        const activateNavLink = () => {
            let currentSectionId = '';
            const scrollPosition = window.scrollY + headerHeight + 50;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    currentSectionId = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        };

        // Run on scroll and load
        window.addEventListener('scroll', activateNavLink);
        window.addEventListener('load', activateNavLink);
    }

    setupCarousel() {
        const carouselContainer = document.querySelector('.carousel-container');
        const carouselSlides = document.querySelector('.carousel-slides');
        const slides = document.querySelectorAll('.carousel-slide');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');

        if (!carouselSlides || !slides.length) return;

        const slideCount = slides.length;
        let currentIndex = 0;
        let autoPlayInterval;

        const moveToSlide = (index) => {
            if (index >= slideCount) {
                currentIndex = 0;
            } else if (index < 0) {
                currentIndex = slideCount - 1;
            } else {
                currentIndex = index;
            }
            carouselSlides.style.transform = `translateX(-${currentIndex * 100}%)`;
        };

        const startAutoPlay = () => {
            autoPlayInterval = setInterval(() => {
                moveToSlide(currentIndex + 1);
            }, 5000);
        };

        const stopAutoPlay = () => {
            clearInterval(autoPlayInterval);
        };

        // Event listeners
        nextBtn?.addEventListener('click', () => moveToSlide(currentIndex + 1));
        prevBtn?.addEventListener('click', () => moveToSlide(currentIndex - 1));

        // Pause on hover
        carouselContainer?.addEventListener('mouseenter', stopAutoPlay);
        carouselContainer?.addEventListener('mouseleave', startAutoPlay);

        // Start autoplay
        startAutoPlay();
    }

    initParticles() {
        const theme = this.html.getAttribute('data-theme') || 'light';
        let particleColor, lineColor;

        switch (theme) {
            case 'dark':
                particleColor = '#bb86fc';
                lineColor = '#bb86fc';
                break;
            case 'red':
                particleColor = '#ff414d';
                lineColor = '#ff414d';
                break;
            case 'aqua':
                particleColor = '#07DEE6';
                lineColor = '#07DEE6';
                break;
            default: // light
                particleColor = '#6a11cb';
                lineColor = '#2575fc';
        }

        // Enhanced particles configuration
        particlesJS('particles-js', {
            "particles": {
                "number": {
                    "value": 120,
                    "density": {
                        "enable": true,
                        "value_area": 1000
                    }
                },
                "color": {
                    "value": [particleColor, lineColor, "#ffffff"]
                },
                "shape": {
                    "type": ["circle", "triangle", "polygon"],
                    "stroke": {
                        "width": 0,
                        "color": particleColor
                    },
                    "polygon": {
                        "nb_sides": 6
                    }
                },
                "opacity": {
                    "value": 0.6,
                    "random": true,
                    "anim": {
                        "enable": true,
                        "speed": 1,
                        "opacity_min": 0.1,
                        "sync": false
                    }
                },
                "size": {
                    "value": 4,
                    "random": true,
                    "anim": {
                        "enable": true,
                        "speed": 2,
                        "size_min": 0.5,
                        "sync": false
                    }
                },
                "line_linked": {
                    "enable": true,
                    "distance": 120,
                    "color": lineColor,
                    "opacity": 0.3,
                    "width": 1.5,
                    "condensed_mode": {
                        "enable": true,
                        "rotateX": 600,
                        "rotateY": 600
                    }
                },
                "move": {
                    "enable": true,
                    "speed": 2,
                    "direction": "none",
                    "random": true,
                    "straight": false,
                    "out_mode": "bounce",
                    "bounce": false,
                    "attract": {
                        "enable": true,
                        "rotateX": 600,
                        "rotateY": 1200
                    }
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": ["grab", "bubble"]
                    },
                    "onclick": {
                        "enable": true,
                        "mode": "push"
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 140,
                        "line_linked": {
                            "opacity": 0.8
                        }
                    },
                    "bubble": {
                        "distance": 100,
                        "size": 8,
                        "duration": 2,
                        "opacity": 0.8,
                        "speed": 3
                    },
                    "repulse": {
                        "distance": 100,
                        "duration": 0.4
                    },
                    "push": {
                        "particles_nb": 6
                    },
                    "remove": {
                        "particles_nb": 2
                    }
                }
            },
            "retina_detect": true
        });
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new App();
});
