document.addEventListener('DOMContentLoaded', () => {
    // Menú hamburguesa
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    let isMenuOpen = false;

    hamburger.addEventListener('click', () => {
        isMenuOpen = !isMenuOpen;
        navLinks.classList.toggle('active');
        hamburger.textContent = isMenuOpen ? '✖' : '☰';
    });

    // Deslizamiento suave para enlaces del menú y el logo
    document.querySelectorAll('.nav-links a, .logo a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            if (window.innerWidth <= 768 && isMenuOpen) {
                navLinks.classList.remove('active');
                isMenuOpen = false;
                hamburger.textContent = '☰';
            }
        });
    });

    // Slider Parallax
    const slides = document.querySelectorAll('.slide');
    const sliderPrev = document.querySelector('.slider-prev');
    const sliderNext = document.querySelector('.slider-next');
    let currentSlide = 0;

    function updateSlide() {
        slides.forEach(slide => slide.classList.remove('active'));
        slides[currentSlide].classList.add('active');
    }

    sliderNext.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlide();
    });

    sliderPrev.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateSlide();
    });

    setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlide();
    }, 5000);

    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY;
        slides.forEach(slide => {
            slide.style.transform = `translateY(${scrollPos * 0.5}px) scale(1.05)`;
        });
    });

    // Texto Dinámico en Hero
    const dynamicText = document.getElementById('dynamic-text');
    const phrases = ["Un Creador de Sueños", "Un Estratega Visionario", "Un Innovador Digital", "Un Narrador Visual"];
    let phraseIndex = 0;

    function updateDynamicText() {
        dynamicText.textContent = phrases[phraseIndex];
        dynamicText.style.opacity = 0;
        setTimeout(() => {
            dynamicText.style.opacity = 1;
        }, 100);
        phraseIndex = (phraseIndex + 1) % phrases.length;
    }
    updateDynamicText();
    setInterval(updateDynamicText, 3000);

    // Función para inicializar un carrusel con indicadores
    function initializeCarousel(trackId, prevBtnSelector, nextBtnSelector, indicatorsId) {
        const track = document.getElementById(trackId);
        const prevBtn = document.querySelector(prevBtnSelector);
        const nextBtn = document.querySelector(nextBtnSelector);
        const indicatorsContainer = document.getElementById(indicatorsId);
        const items = track.querySelectorAll('.carousel-item');
        let currentIndex = 0;
        const totalItems = items.length;

        // Crear indicadores
        for (let i = 0; i < totalItems; i++) {
            const indicator = document.createElement('div');
            indicator.classList.add('carousel-indicator');
            if (i === 0) indicator.classList.add('active');
            indicator.addEventListener('click', () => {
                currentIndex = i;
                updateCarousel();
            });
            indicatorsContainer.appendChild(indicator);
        }

        const indicators = indicatorsContainer.querySelectorAll('.carousel-indicator');

        function updateCarousel() {
            const itemsPerView = window.innerWidth > 1024 ? 3 : window.innerWidth > 768 ? 2 : 1;
            const itemWidth = track.offsetWidth / itemsPerView;
            const maxIndex = Math.ceil(totalItems / itemsPerView) - 1;
            currentIndex = Math.min(Math.max(currentIndex, 0), maxIndex);
            const offset = -currentIndex * itemWidth;
            track.style.transform = `translateX(${offset}px)`;

            // Actualizar indicadores
            indicators.forEach((indicator, i) => {
                indicator.classList.toggle('active', i === currentIndex);
            });
        }

        nextBtn.addEventListener('click', () => {
            currentIndex++;
            updateCarousel();
        });

        prevBtn.addEventListener('click', () => {
            currentIndex--;
            updateCarousel();
        });

        window.addEventListener('resize', updateCarousel);
        updateCarousel();
    }

    // Carrusel de Portafolio desde data.json
    fetch('data.json')
        .then(response => {
            if (!response.ok) throw new Error('No se pudo cargar data.json');
            return response.json();
        })
        .then(data => {
            const portfolioTrack = document.getElementById('portfolio-track');
            data.portfolio.forEach(item => {
                const div = document.createElement('div');
                div.classList.add('carousel-item');
                div.innerHTML = `
                    <img src="${item.image}" alt="${item.title}" loading="lazy">
                    <h3>${item.title}</h3>
                `;
                div.addEventListener('click', () => openModal(item));
                portfolioTrack.appendChild(div);
            });
            initializeCarousel('portfolio-track', '#portfolio .carousel-prev', '#portfolio .carousel-next', 'portfolio-indicators');
        })
        .catch(error => {
            console.error('Error al cargar data.json:', error);
            document.getElementById('portfolio-track').innerHTML = '<p>Error al cargar el portafolio.</p>';
        });

    // Carrusel de Trabajos Audiovisuales
    const videoTrack = document.getElementById('video-track');
    const videoPortfolio = [
        { title: "Guía Turistica", url: "https://www.youtube.com/embed/0qr4ogilrBE?si=VRyT-aWI7cFFgFxy", description: "Video promocional que captura la atención al instante." },
        { title: "Perspectivas Aéreas Únicas", url: "https://www.youtube.com/embed/pG62fVDCUlw?si=1RyZ3P5IKajJCZIL", description: "Grabación con drone que redefine los estándares visuales." },
        { title: "Animación Dinámica", url: "https://www.youtube.com/embed/-ttykC2cjAg?si=XZz2ffjYFovFIC7N", description: "Motion graphics que combinan creatividad y energía." },
        { title: "Reel Social Estratégico", url: "https://www.youtube.com/embed/uXPehszV_rg?si=3_LyvV1b1zenFhEv", description: "Contenido corto optimizado para redes sociales." },
        { title: "Reel Social Estratégico", url: "https://www.youtube.com/embed/hnpeZFmLwD0?si=2wzOZX9NRHGEKZ-p", description: "Contenido corto optimizado para redes sociales." },
        { title: "Reel Social Estratégico", url: "https://www.youtube.com/embed/pA1_tBCbzUQ?si=mKxftpOm0ipiyiE8", description: "Contenido corto optimizado para redes sociales." }
    ];

    videoPortfolio.forEach(item => {
        const div = document.createElement('div');
        div.classList.add('carousel-item');
        div.innerHTML = `
            <iframe src="${item.url}" allowfullscreen loading="lazy"></iframe>
            <h3>${item.title}</h3>
        `;
        div.addEventListener('click', () => openModal(item));
        videoTrack.appendChild(div);
    });

    initializeCarousel('video-track', '#audiovisual .carousel-prev', '#audiovisual .carousel-next', 'video-indicators');

    // Modal
    const modal = document.getElementById('modal');
    const closeModal = document.querySelector('.close');

    function openModal(item) {
        document.getElementById('modal-title').textContent = item.title;
        document.getElementById('modal-description').textContent = item.description;
        const modalVideo = document.getElementById('modal-video');
        modalVideo.style.display = item.url ? 'block' : 'none';
        modalVideo.src = item.url || '';
        modal.style.display = 'block';
    }

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
        document.getElementById('modal-video').src = '';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.getElementById('modal-video').src = '';
        }
    });

    // Formulario con validación SweetAlert
    const form = document.getElementById('contact-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !message) {
            Swal.fire({
                icon: 'error',
                title: '¡Faltan datos!',
                text: 'Por favor, completa todos los campos para continuar.',
                confirmButtonColor: '#ff004d',
                background: '#1a1a1a',
                color: '#fff'
            });
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            Swal.fire({
                icon: 'error',
                title: '¡Email no válido!',
                text: 'Ingresa un correo electrónico correcto (ejemplo@dominio.com).',
                confirmButtonColor: '#ff004d',
                background: '#1a1a1a',
                color: '#fff'
            });
            return;
        }

        const whatsappMessage = `Hola Wilmer, soy ${name}. Mi correo es ${email}. Mensaje: ${message}`;
        const encodedMessage = encodeURIComponent(whatsappMessage);
        const whatsappNumber = "51930288404";
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

        Swal.fire({
            icon: 'success',
            title: '¡Todo listo!',
            text: 'Tu mensaje está a punto de volar a WhatsApp. ¿Confirmas?',
            showCancelButton: true,
            confirmButtonColor: '#ff004d',
            cancelButtonColor: '#666',
            confirmButtonText: 'Sí, enviar',
            cancelButtonText: 'No',
            background: '#1a1a1a',
            color: '#fff'
        }).then((result) => {
            if (result.isConfirmed) {
                window.open(whatsappUrl, '_blank');
                form.reset();
                Swal.fire({
                    icon: 'success',
                    title: '¡Mensaje enviado!',
                    text: 'Tu idea ya está en camino. ¡Hablamos pronto!',
                    confirmButtonColor: '#ff004d',
                    background: '#1a1a1a',
                    color: '#fff'
                });
            }
        });
    });

    // Partículas Interactivas
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particlesArray = Array.from({ length: 100 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 4 + 1,
        speedX: Math.random() * 1 - 0.5,
        speedY: Math.random() * 1 - 0.5
    }));

    let mouse = { x: null, y: null };
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particlesArray.forEach((p, i) => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 212, 255, 0.8)';
            ctx.fill();

            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 100) {
                p.speedX += dx * 0.01;
                p.speedY += dy * 0.01;
            }

            p.x += p.speedX;
            p.y += p.speedY;
            if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
            if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;

            for (let j = i + 1; j < particlesArray.length; j++) {
                const p2 = particlesArray[j];
                const dist = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);
                if (dist < 100) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(0, 212, 255, ${1 - dist / 100})`;
                    ctx.stroke();
                }
            }
        });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // Habilidades y Herramientas
    const toolsList = document.getElementById('tools-list');
    const skillCards = document.querySelectorAll('.skill-card');

    const tools = {
        marketing: [
            { name: 'Google Ads', icon: 'fas fa-ad' },
            { name: 'Google Analytics', icon: 'fas fa-chart-line' },
            { name: 'SEMRush', icon: 'fas fa-search' },
            { name: 'HubSpot', icon: 'fas fa-briefcase' },
            { name: 'Ahrefs', icon: 'fas fa-globe' },
            { name: 'Moz', icon: 'fas fa-search-dollar' },
            { name: 'Facebook Ads', icon: 'fab fa-facebook' },
            { name: 'TikTok Ads', icon: 'fab fa-tiktok' },
            { name: 'Metricool', icon: 'fas fa-envelope' },
            { name: 'ActiveCam', icon: 'fas fa-mail-bulk' },
            { name: 'Google Tag Manager', icon: 'fas fa-tags' },
            { name: 'Ubersuggest', icon: 'fas fa-lightbulb' }
        ],
        video: [
            { name: 'Premiere Pro', icon: 'fas fa-video' },
            { name: 'After Effects', icon: 'fas fa-film' },
            { name: 'DaVinci Resolve', icon: 'fas fa-cut' },
            { name: 'Moho', icon: 'fas fa-video-slash' },
            { name: 'CapCut', icon: 'fas fa-mobile-alt' },
            { name: 'Filmora', icon: 'fas fa-video' },
            { name: 'InShot', icon: 'fas fa-crop' },
            { name: 'VN Video Editor', icon: 'fas fa-play' },
            { name: 'Lumen5', icon: 'fas fa-robot' },
            { name: 'HitFilm Express', icon: 'fas fa-magic' },
            { name: 'Animoto', icon: 'fas fa-photo-video' },
            { name: 'Cartoon Animator', icon: 'fas fa-desktop' }
        ],
        web: [
            { name: 'HTML/CSS', icon: 'fab fa-html5' },
            { name: 'JavaScript', icon: 'fab fa-js' },
            { name: 'React', icon: 'fab fa-react' },
            { name: 'Node.js', icon: 'fab fa-node' },
            { name: 'WordPress', icon: 'fab fa-wordpress' },
            { name: 'Next.js', icon: 'fas fa-code' },
            { name: 'Django', icon: 'fab fa-python' },
            { name: 'PHP', icon: 'fab fa-php' },
            { name: 'Bootstrap', icon: 'fab fa-bootstrap' },
            { name: 'Tailwind CSS', icon: 'fas fa-wind' },
            { name: 'Vue.js', icon: 'fab fa-vuejs' },
            { name: 'Svelte', icon: 'fas fa-leaf' }
        ],
        design: [
            { name: 'Photoshop', icon: 'fas fa-image' },
            { name: 'Illustrator', icon: 'fas fa-pen-nib' },
            { name: 'Figma', icon: 'fab fa-figma' },
            { name: 'Canva', icon: 'fas fa-palette' },
            { name: 'CorelDRAW', icon: 'fas fa-draw-polygon' },
            { name: 'Affinity Designer', icon: 'fas fa-vector-square' },
            { name: 'Sketch', icon: 'fas fa-bezier-curve' },
            { name: 'Procreate', icon: 'fas fa-paint-brush' },
            { name: 'InDesign', icon: 'fas fa-file-alt' },
            { name: 'Blender', icon: 'fas fa-cube' },
            { name: 'GIMP', icon: 'fas fa-image' },
            { name: 'Krita', icon: 'fas fa-pencil-alt' }
        ],
        social: [
            { name: 'Hootsuite', icon: 'fas fa-calendar-alt' },
            { name: 'Buffer', icon: 'fas fa-clock' },
            { name: 'Meta Business', icon: 'fab fa-facebook' },
            { name: 'TikTok Ads', icon: 'fab fa-tiktok' },
            { name: 'Later', icon: 'fas fa-schedule' },
            { name: 'Sprout Social', icon: 'fas fa-comments' },
            { name: 'SocialPilot', icon: 'fas fa-share-alt' },
            { name: 'TweetDeck', icon: 'fab fa-twitter' },
            { name: 'Loomly', icon: 'fas fa-chart-bar' },
            { name: 'Sendible', icon: 'fas fa-paper-plane' },
            { name: 'CoSchedule', icon: 'fas fa-tasks' },
            { name: 'Zoho Social', icon: 'fas fa-users' }
        ],
        ia: [
            { name: 'ChatGPT', icon: 'fas fa-robot' },
            { name: 'MidJourney', icon: 'fas fa-brain' },
            { name: 'Grok', icon: 'fas fa-microchip' },
            { name: 'DeekSeek', icon: 'fas fa-cogs' },
            { name: 'DALL·E', icon: 'fas fa-paint-brush' },
            { name: 'ElevenLabs', icon: 'fas fa-images' },
            { name: 'Adobe Firefly ', icon: 'fas fa-language' },
            { name: 'Runway ', icon: 'fas fa-keyboard' },
            { name: 'Synthesia', icon: 'fas fa-video' },
            { name: 'Claude AI', icon: 'fas fa-comments' },
            { name: 'Perplexity AI', icon: 'fas fa-search' },
            { name: 'Rytr', icon: 'fas fa-microphone' }
        ]
    };

    function displayTools(skill) {
        toolsList.innerHTML = '';
        const selectedTools = tools[skill] || [];
        selectedTools.forEach((tool, index) => {
            const div = document.createElement('div');
            div.classList.add('tool-item');
            div.innerHTML = `<i class="${tool.icon}"></i> ${tool.name}`;
            toolsList.appendChild(div);
            setTimeout(() => {
                div.classList.add('visible');
            }, index * 100);
        });
    }

    skillCards.forEach(card => {
        card.addEventListener('click', () => {
            skillCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            const skill = card.dataset.skill;
            displayTools(skill);
        });
    });

    displayTools('marketing');
    skillCards[0].classList.add('active');

    // Acordeón para Experiencia Laboral
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const isOpen = content.style.maxHeight;

            document.querySelectorAll('.accordion-content').forEach(item => {
                if (item !== content) item.style.maxHeight = null;
            });

            content.style.maxHeight = isOpen ? null : `${content.scrollHeight}px`;
        });
    });

    // Botón Subir al Cielo
    const scrollTopBtn = document.querySelector('.scroll-top-btn');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    scrollTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});