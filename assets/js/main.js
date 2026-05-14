document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
    const themeIcon = themeToggle?.querySelector('i');
    const mobileThemeIcon = mobileThemeToggle?.querySelector('i');
    
    const setTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        const iconClass = theme === 'dark' ? 'ph ph-sun' : 'ph ph-moon';
        if (themeIcon) themeIcon.className = iconClass;
        if (mobileThemeIcon) mobileThemeIcon.className = iconClass;
    };

    const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(savedTheme);

    const handleThemeToggle = () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    };

    themeToggle?.addEventListener('click', handleThemeToggle);
    mobileThemeToggle?.addEventListener('click', handleThemeToggle);

    // --- RTL Toggle ---
    const rtlToggle = document.getElementById('rtl-toggle');
    const mobileRtlToggle = document.getElementById('mobile-rtl-toggle');
    
    const setRTL = (isRTL) => {
        document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
        localStorage.setItem('rtl', isRTL);
    };

    const savedRTL = localStorage.getItem('rtl') === 'true';
    setRTL(savedRTL);

    const handleRtlToggle = () => {
        const currentRTL = document.documentElement.getAttribute('dir') === 'rtl';
        setRTL(!currentRTL);
    };

    rtlToggle?.addEventListener('click', handleRtlToggle);
    mobileRtlToggle?.addEventListener('click', handleRtlToggle);

    // --- Hamburger Menu ---
    const hamburger = document.getElementById('hamburger');
    const drawer = document.getElementById('drawer');
    const drawerOverlay = document.getElementById('drawer-overlay');
    const drawerClose = document.getElementById('drawer-close');

    const toggleDrawer = (open) => {
        drawer.classList.toggle('open', open);
        drawerOverlay.classList.toggle('open', open);
        document.body.style.overflow = open ? 'hidden' : '';
    };

    hamburger?.addEventListener('click', () => toggleDrawer(true));
    drawerClose?.addEventListener('click', () => toggleDrawer(false));
    drawerOverlay?.addEventListener('click', () => toggleDrawer(false));

    // --- Typewriter Effect ---
    const typewriterElement = document.getElementById('typewriter');
    if (typewriterElement) {
        const words = JSON.parse(typewriterElement.dataset.words);
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 100;

        const type = () => {
            const currentWord = words[wordIndex];
            const shouldDelete = isDeleting;
            
            if (shouldDelete) {
                typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 50;
            } else {
                typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 100;
            }

            if (!shouldDelete && charIndex === currentWord.length) {
                isDeleting = true;
                typeSpeed = 2000; // Pause at end
            } else if (shouldDelete && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 500;
            }

            setTimeout(type, typeSpeed);
        };

        type();
    }

    // --- Count Up Animation ---
    const countUp = (element) => {
        const target = parseInt(element.dataset.count);
        const duration = 2000;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const value = Math.floor(progress * target);
            
            element.textContent = value + (element.dataset.suffix || '');
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    };

    const countElements = document.querySelectorAll('[data-count]');
    const observerOptions = { threshold: 0.5 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                countUp(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    countElements.forEach(el => observer.observe(el));

    // --- Form Validation ---
    const forms = document.querySelectorAll('form[data-validate]');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;
            const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
            
            inputs.forEach(input => {
                const errorElement = input.nextElementSibling;
                if (!input.value.trim()) {
                    input.style.border = '1px solid #FF4444';
                    if (errorElement && errorElement.classList.contains('error-msg')) {
                        errorElement.textContent = 'This field is required';
                    }
                    isValid = false;
                } else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
                    input.style.border = '1px solid #FF4444';
                    if (errorElement && errorElement.classList.contains('error-msg')) {
                        errorElement.textContent = 'Please enter a valid email';
                    }
                    isValid = false;
                } else {
                    input.style.border = '1px solid var(--color-accent)';
                    if (errorElement && errorElement.classList.contains('error-msg')) {
                        errorElement.textContent = '';
                    }
                }
            });

            if (isValid) {
                const successMsg = form.querySelector('.success-msg');
                if (successMsg) {
                    successMsg.style.display = 'block';
                    form.reset();
                    setTimeout(() => {
                        successMsg.style.display = 'none';
                    }, 5000);
                }
            }
        });
    });

    // --- Back to Top ---
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = '<i class="ph ph-arrow-up"></i>';
    backToTopBtn.setAttribute('aria-label', 'Back to Top');
    document.body.appendChild(backToTopBtn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});
