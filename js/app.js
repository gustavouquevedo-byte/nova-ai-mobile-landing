/**
 * NovaAI - Interactive Landing Page Logic (Mobile-First)
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. GLOBAL STATE & SELECTORS
       ========================================================================== */
    const loader = document.getElementById('loader');
    const loaderCanvas = document.getElementById('loader-canvas');
    const loaderLogoSymbol = document.getElementById('loader-logo-symbol');
    
    const bgCanvas = document.getElementById('bg-canvas');
    const header = document.querySelector('.main-header');
    const menuToggle = document.getElementById('menu-toggle-btn');
    const mobileNav = document.getElementById('mobile-navigation');
    const navLinks = document.querySelectorAll('.nav-link-item');
    
    // Modal Selectors
    const demoModal = document.getElementById('demo-modal');
    const openModalBtns = document.querySelectorAll('.open-modal-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const demoForm = document.getElementById('demo-form');
    const successMsg = document.getElementById('modal-success-msg');
    
    // Simulator Selectors
    const simIndustrySelector = document.getElementById('sim-industry-selector');
    const simChatBody = document.getElementById('sim-chat-body');
    const simActionsContainer = document.getElementById('sim-actions-container');
    const simBotName = document.getElementById('sim-bot-name');
    const simNotifications = document.getElementById('sim-notifications');
    const simChatForm = document.getElementById('sim-chat-form');
    const simChatInput = document.getElementById('sim-chat-input');

    // Device / Touch state
    let isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    /* ==========================================================================
       2. PRELOADER & LOGO ASSEMBLY ANIMATION (CANVAS)
       ========================================================================== */
    function runPreloaderAnimation() {
        const ctx = loaderCanvas.getContext('2d');
        let width = loaderCanvas.width = window.innerWidth;
        let height = loaderCanvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = loaderCanvas.width = window.innerWidth;
            height = loaderCanvas.height = window.innerHeight;
        });

        // Generate particle energy flowing to the center
        const particles = [];
        const particleCount = 60;
        const centerX = width / 2;
        const centerY = height / 2;

        for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.max(width, height) * (0.5 + Math.random() * 0.5);
            particles.push({
                x: centerX + Math.cos(angle) * distance,
                y: centerY + Math.sin(angle) * distance,
                targetX: centerX + (Math.random() - 0.5) * 40,
                targetY: centerY + (Math.random() - 0.5) * 40,
                size: Math.random() * 2.5 + 1.2,
                speed: 0.02 + Math.random() * 0.03,
                opacity: Math.random() * 0.5 + 0.5,
                color: i % 2 === 0 ? '#8b5cf6' : '#06b6d4'
            });
        }

        let animationFrame;
        let elapsed = 0;

        function animateLoader() {
            ctx.clearRect(0, 0, width, height);
            
            // Draw connector lines to form a neural web near the center
            ctx.strokeStyle = 'rgba(139, 92, 246, 0.08)';
            ctx.lineWidth = 0.8;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 80) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            // Draw particles flowing to the core
            particles.forEach(p => {
                p.x += (p.targetX - p.x) * p.speed;
                p.y += (p.targetY - p.y) * p.speed;
                
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.opacity;
                ctx.fill();
            });
            ctx.globalAlpha = 1.0;

            elapsed++;
            if (elapsed < 120) {
                animationFrame = requestAnimationFrame(animateLoader);
            }
        }

        animateLoader();

        // 1.0s: Reveal & Glow Logo
        setTimeout(() => {
            loaderLogoSymbol.style.transition = 'all 1.0s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            loaderLogoSymbol.style.opacity = '1';
            loaderLogoSymbol.style.transform = 'scale(1)';
            loaderLogoSymbol.style.filter = 'drop-shadow(0 0 20px #8b5cf6)';
            
            // Pulsing animation trigger
            loaderLogoSymbol.classList.add('logo-symbol-glow');
            loaderLogoSymbol.style.animation = 'pulseGlow 2s infinite ease-in-out';
        }, 800);

        // 2.2s: Desvanecer loader
        setTimeout(() => {
            cancelAnimationFrame(animationFrame);
            loader.style.opacity = '0';
            loader.style.visibility = 'hidden';
            document.body.style.overflowY = 'auto'; // Habilitar scroll
        }, 2200);
    }

    // Inicializar preloader de inmediato
    document.body.style.overflowY = 'hidden'; // Bloquear scroll en carga
    runPreloaderAnimation();


    /* ==========================================================================
       2.5. HERO WORD-BY-WORD ANIMATION (after preloader)
       ========================================================================== */
    function triggerHeroWordAnimations() {
        const wordElements = document.querySelectorAll('.word-animate');
        let maxDelay = 0;

        wordElements.forEach(word => {
            const delay = parseInt(word.getAttribute('data-delay')) || 0;
            if (delay > maxDelay) maxDelay = delay;

            setTimeout(() => {
                if (word) {
                    word.style.animation = 'wordAppear 0.8s ease-out forwards';
                }
            }, delay);
        });

        // Activate subtitle & buttons fade-in after all words have appeared
        const fadeElements = document.querySelectorAll('.hero-fade-in');
        setTimeout(() => {
            fadeElements.forEach(el => {
                el.classList.add('active');
            });
        }, maxDelay + 600);
    }

    // Trigger hero animations 500ms after preloader fades (2200ms + 500ms)
    setTimeout(triggerHeroWordAnimations, 2700);


    /* ==========================================================================
       3. INTERACTIVE CANVAS BACKGROUND (NEURAL NET)
       ========================================================================== */
    function initBackgroundCanvas() {
        const ctx = bgCanvas.getContext('2d');
        let width = bgCanvas.width = window.innerWidth;
        let height = bgCanvas.height = window.innerHeight;

        let particles = [];
        let connectionDistance = 90;
        let particleCount = isTouch ? 35 : 75; // Menor carga en móviles

        // Mouse/Touch connection target
        let pointer = { x: null, y: null, active: false };

        window.addEventListener('resize', () => {
            width = bgCanvas.width = window.innerWidth;
            height = bgCanvas.height = window.innerHeight;
            particles = [];
            createParticles();
        });

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.3;
                this.vy = (Math.random() - 0.5) * 0.3;
                this.size = Math.random() * 1.5 + 1;
                this.color = Math.random() > 0.5 ? '#8b5cf6' : '#3b82f6';
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Bounce at boundaries
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }

        function createParticles() {
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function animateBg() {
            ctx.clearRect(0, 0, width, height);

            // Draw connections
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < connectionDistance) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(139, 92, 246, ${0.15 * (1 - dist / connectionDistance)})`;
                        ctx.lineWidth = 0.6;
                        ctx.stroke();
                    }
                }

                // Interactive Pointer Connections
                if (pointer.active && pointer.x !== null) {
                    const pdx = particles[i].x - pointer.x;
                    const pdy = particles[i].y - pointer.y;
                    const pdist = Math.sqrt(pdx * pdx + pdy * pdy);
                    if (pdist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(pointer.x, pointer.y);
                        ctx.strokeStyle = `rgba(6, 182, 212, ${0.25 * (1 - pdist / 120)})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(animateBg);
        }

        // Pointer Event Listeners
        const setPointerPosition = (e) => {
            const x = e.clientX || (e.touches && e.touches[0].clientX);
            const y = e.clientY || (e.touches && e.touches[0].clientY);
            pointer.x = x;
            pointer.y = y;
        };

        window.addEventListener('mousemove', (e) => {
            pointer.active = true;
            setPointerPosition(e);
        });

        window.addEventListener('mouseout', () => { pointer.active = false; });

        window.addEventListener('touchstart', (e) => {
            pointer.active = true;
            setPointerPosition(e);
        }, { passive: true });

        window.addEventListener('touchmove', (e) => {
            setPointerPosition(e);
        }, { passive: true });

        window.addEventListener('touchend', () => { pointer.active = false; });

        createParticles();
        animateBg();
    }

    initBackgroundCanvas();


    /* ==========================================================================
       4. NAVIGATION & HEADER CONTROLLER
       ========================================================================== */
    // Scroll header background transition
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header.style.background = 'rgba(3, 3, 7, 0.85)';
            header.style.borderBottomColor = 'rgba(139, 92, 246, 0.15)';
        } else {
            header.style.background = 'rgba(3, 3, 7, 0.5)';
            header.style.borderBottomColor = 'rgba(255, 255, 255, 0.05)';
        }
    });

    // Toggle menu click
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        mobileNav.classList.toggle('active');
        
        // Block scroll when menu is active
        if (mobileNav.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // Close nav on click links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });


    /* ==========================================================================
       5. MODAL FORM & LEAD CAPTURE
       ========================================================================== */
    const openModal = () => {
        demoModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        demoModal.classList.remove('active');
        document.body.style.overflow = '';
        // Reset form state
        setTimeout(() => {
            demoForm.reset();
            demoForm.style.display = 'flex';
            successMsg.style.display = 'none';
        }, 400);
    };

    openModalBtns.forEach(btn => btn.addEventListener('click', openModal));
    closeModalBtn.addEventListener('click', closeModal);
    demoModal.addEventListener('click', (e) => {
        if (e.target === demoModal) closeModal();
    });

    // Form Submission Action
    demoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Mock API Call simulation
        const submitBtn = demoForm.querySelector('button');
        submitBtn.innerText = "Conectando sistemas...";
        submitBtn.disabled = true;

        setTimeout(() => {
            demoForm.style.display = 'none';
            successMsg.style.display = 'flex';
            submitBtn.disabled = false;
            submitBtn.innerText = "Confirmar Solicitud de Demo";
        }, 1200);
    });


    /* ==========================================================================
       6. INTERACTIVE AI ASSISTANT SIMULATOR (SECTION 4)
       ========================================================================== */
    const simulatorData = {
        salon: {
            botName: "BellaSpá AI",
            initialMessages: [
                { type: 'bot', text: "¡Hola! Bienvenida a BellaSpá. Soy tu asistente virtual 24/7. ¿En qué puedo ayudarte hoy?" }
            ],
            actions: [
                { id: 'salon_citas', text: "📅 Agendar cita para mañana" },
                { id: 'salon_pregunta', text: "💄 ¿Qué tratamientos faciales ofrecen?" },
                { id: 'salon_promo', text: "✨ Ver promociones del mes" }
            ],
            responses: {
                salon_citas: {
                    chat: [
                        { type: 'user', text: "Me gustaría agendar una cita para mañana por la tarde." },
                        { type: 'system', text: "⚙️ <strong>Acción del Sistema:</strong> Conectando con Google Calendar..." },
                        { type: 'bot', text: "Tengo disponible mañana a las 16:30hs o 18:00hs con nuestra especialista Sofía. ¿Te sirve alguna de estas opciones?" }
                    ],
                    newActions: [
                        { id: 'salon_citas_confirmar', text: "Reservar 16:30hs con Sofía" }
                    ]
                },
                salon_citas_confirmar: {
                    chat: [
                        { type: 'user', text: "Reservar a las 16:30hs con Sofía por favor." },
                        { type: 'system', text: "⚙️ <strong>Acción de Google Calendar:</strong> Bloqueando espacio y enviando confirmación..." },
                        { type: 'bot', text: "¡Hecho! Reserva confirmada para mañana a las 16:30hs. Acabo de agendarlo en tu Google Calendar y te llegará un recordatorio por WhatsApp 2 horas antes de tu cita. ¡Te esperamos!" }
                    ],
                    newActions: [],
                    notification: {
                        icon: "🗓️",
                        title: "Reserva Agendada",
                        message: "Google Cal: 16:30 - Limpieza Facial (Sofía)"
                    }
                },
                salon_pregunta: {
                    chat: [
                        { type: 'user', text: "¿Qué tratamientos faciales ofrecen?" },
                        { type: 'bot', text: "Ofrecemos: Limpieza profunda (hidratación profunda), Peeling ultrasónico e Hidrafacial Premium. ¿Te gustaría conocer el precio de alguno en particular?" }
                    ],
                    newActions: [
                        { id: 'salon_pregunta_precio', text: "Ver precio de Hidrafacial" }
                    ]
                },
                salon_pregunta_precio: {
                    chat: [
                        { type: 'user', text: "Ver precio de Hidrafacial." },
                        { type: 'bot', text: "El Hidrafacial Premium tiene un valor de $45 USD. Incluye exfoliación volumétrica, extracción de impurezas y nutrición celular. ¿Te gustaría agendar una sesión?" }
                    ],
                    newActions: [
                        { id: 'salon_citas', text: "📅 Agendar cita" }
                    ]
                },
                salon_promo: {
                    chat: [
                        { type: 'user', text: "Ver promociones del mes" },
                        { type: 'bot', text: "¡Claro! Este mes tenemos un 20% de descuento en tratamientos de Spa Corporal de lunes a miércoles. ¿Te gustaría reservar tu lugar?" }
                    ],
                    newActions: [
                        { id: 'salon_citas', text: "📅 Reservar promoción" }
                    ]
                }
            }
        },
        clinica: {
            botName: "Sanitas AI",
            initialMessages: [
                { type: 'bot', text: "Bienvenido a Consultorios Médicos Sanitas. Soy tu asistente de agendamiento inteligente. ¿Qué trámite deseas realizar?" }
            ],
            actions: [
                { id: 'clinica_turnos', text: "🩺 Solicitar turno médico" },
                { id: 'clinica_obra', text: "💳 Ver obras sociales / coberturas" }
            ],
            responses: {
                clinica_turnos: {
                    chat: [
                        { type: 'user', text: "Hola, necesito solicitar un turno médico." },
                        { type: 'bot', text: "Perfecto. Por favor selecciona la especialidad médica que necesitas consultar:" }
                    ],
                    newActions: [
                        { id: 'clinica_pediatra', text: "Pediatría" },
                        { id: 'clinica_cardio', text: "Cardiología" }
                    ]
                },
                clinica_pediatra: {
                    chat: [
                        { type: 'user', text: "Necesito un turno para Pediatría." },
                        { type: 'system', text: "⚙️ <strong>Acción de Base de Datos:</strong> Consultando disponibilidad de pediatras..." },
                        { type: 'bot', text: "Tenemos disponibilidad para Pediatría con el Dr. Martínez este miércoles a las 10:15hs o el viernes a las 14:00hs. ¿Cuál prefieres?" }
                    ],
                    newActions: [
                        { id: 'clinica_confirmar', text: "Confirmar Miércoles 10:15hs" }
                    ]
                },
                clinica_cardio: {
                    chat: [
                        { type: 'user', text: "Necesito un turno para Cardiología." },
                        { type: 'system', text: "⚙️ <strong>Acción de Base de Datos:</strong> Consultando especialistas..." },
                        { type: 'bot', text: "La Dra. Gómez (Cardióloga) tiene turnos disponibles este jueves a las 09:00hs o el próximo lunes a las 11:30hs. ¿Te sirve?" }
                    ],
                    newActions: [
                        { id: 'clinica_confirmar', text: "Confirmar Jueves 09:00hs" }
                    ]
                },
                clinica_confirmar: {
                    chat: [
                        { type: 'user', text: "Confirmar ese turno por favor." },
                        { type: 'system', text: "⚙️ <strong>Acción CRM / Calendario:</strong> Registrando turno y generando orden..." },
                        { type: 'bot', text: "¡Excelente! Tu turno ha sido agendado. Hemos registrado tus datos en el CRM médico y te hemos enviado el código de reserva a tu WhatsApp. ¡Que tengas un excelente día!" }
                    ],
                    newActions: [],
                    notification: {
                        icon: "🏥",
                        title: "Nuevo Turno Médico",
                        message: "CRM: Paciente registrado - Confirmación enviada"
                    }
                },
                clinica_obra: {
                    chat: [
                        { type: 'user', text: "¿Qué obras sociales y coberturas aceptan?" },
                        { type: 'bot', text: "Aceptamos la mayoría de coberturas nacionales (OSDE, Medicus, Galeno, Swiss Medical) y seguros corporativos. ¿Deseas verificar alguna en específico?" }
                    ],
                    newActions: [
                        { id: 'clinica_turnos', text: "🩺 Agendar Turno" }
                    ]
                }
            }
        },
        servicios: {
            botName: "Mendoza Estudio AI",
            initialMessages: [
                { type: 'bot', text: "Bienvenido a Mendoza & Asociados. Soy tu asistente virtual corporativo. ¿En qué área legal o contable necesitas asistencia?" }
            ],
            actions: [
                { id: 'servicios_consulta', text: "⚖️ Agendar consulta con un abogado" },
                { id: 'servicios_presupuesto', text: "💵 Solicitar cotización de servicios" }
            ],
            responses: {
                servicios_consulta: {
                    chat: [
                        { type: 'user', text: "Quiero agendar una consulta con un abogado." },
                        { type: 'bot', text: "¿Cuál es el rubro de tu consulta? Contamos con especialistas en Derecho Civil, Laboral y Corporativo." }
                    ],
                    newActions: [
                        { id: 'servicios_corporativo', text: "Asesoramiento Corporativo/Empresas" },
                        { id: 'servicios_laboral', text: "Derecho Laboral" }
                    ]
                },
                servicios_corporativo: {
                    chat: [
                        { type: 'user', text: "Asesoramiento Corporativo." },
                        { type: 'system', text: "⚙️ <strong>Filtro de Workflows:</strong> Calificando Lead para socio Senior..." },
                        { type: 'bot', text: "Entendido. Para darte la mejor asesoría corporativa, ¿cuál es el tamaño aproximado de tu empresa actual?" }
                    ],
                    newActions: [
                        { id: 'servicios_demo_final', text: "1-10 Empleados (Pyme)" },
                        { id: 'servicios_demo_final', text: "Más de 10 Empleados" }
                    ]
                },
                servicios_laboral: {
                    chat: [
                        { type: 'user', text: "Tengo una consulta sobre Derecho Laboral." },
                        { type: 'system', text: "⚙️ <strong>Filtro de Workflows:</strong> Asignando especialista..." },
                        { type: 'bot', text: "Entendido. Por favor selecciona si eres empleador o empleado para canalizar tu caso correctamente:" }
                    ],
                    newActions: [
                        { id: 'servicios_demo_final', text: "Represento a la Empresa (Empleador)" },
                        { id: 'servicios_demo_final', text: "Consulta Particular (Empleado)" }
                    ]
                },
                servicios_demo_final: {
                    chat: [
                        { type: 'user', text: "Seleccionar opción." },
                        { type: 'system', text: "⚙️ <strong>Acción de Calendario:</strong> Sincronizando agenda de socios..." },
                        { type: 'bot', text: "Perfecto. He canalizado tu solicitud. El especialista tiene disponibilidad para una videollamada de diagnóstico de 15 minutos mañana a las 11:00hs. ¿Agendamos?" }
                    ],
                    newActions: [
                        { id: 'servicios_confirmacion_final', text: "Confirmar Videollamada" }
                    ]
                },
                servicios_confirmacion_final: {
                    chat: [
                        { type: 'user', text: "Sí, agendar videollamada." },
                        { type: 'system', text: "⚙️ <strong>Acción de Zoom / Google Meet:</strong> Creando enlace de videollamada..." },
                        { type: 'bot', text: "¡Listo! Videollamada agendada. Te he enviado un correo automático con el enlace de Zoom y el recordatorio a tu WhatsApp. ¡Hablamos mañana!" }
                    ],
                    newActions: [],
                    notification: {
                        icon: "💼",
                        title: "Reunión de Zoom Creada",
                        message: "Google Meet: Reunión agendada para consulta legal"
                    }
                },
                servicios_presupuesto: {
                    chat: [
                        { type: 'user', text: "Solicitar cotización de servicios" },
                        { type: 'bot', text: "Por supuesto. Para enviarte un presupuesto estimado automatizado, ¿necesitas servicios contables mensuales, auditoría o constitución de sociedad?" }
                    ],
                    newActions: [
                        { id: 'servicios_corporativo', text: "Contabilidad Pymes" }
                    ]
                }
            }
        },
        retail: {
            botName: "Novatech Pyme AI",
            initialMessages: [
                { type: 'bot', text: "¡Hola! Gracias por comunicarte con Novatech. ¿Deseas consultar por el stock de algún producto o el estado de tu pedido?" }
            ],
            actions: [
                { id: 'retail_stock', text: "📦 Consultar stock de producto" },
                { id: 'retail_pedido', text: "🚚 Ver estado de mi pedido" }
            ],
            responses: {
                retail_stock: {
                    chat: [
                        { type: 'user', text: "Hola, me gustaría saber si tienen stock de algún producto." },
                        { type: 'bot', text: "¡Por supuesto! ¿Qué producto estás buscando? Ingresa o selecciona una de nuestras categorías populares:" }
                    ],
                    newActions: [
                        { id: 'retail_auriculares', text: "Auriculares Inalámbricos Pro" },
                        { id: 'retail_cargadores', text: "Cargadores de Carga Rápida" }
                    ]
                },
                retail_auriculares: {
                    chat: [
                        { type: 'user', text: "Auriculares Inalámbricos Pro." },
                        { type: 'system', text: "⚙️ <strong>Acción de Sistema:</strong> Consultando stock en inventario central..." },
                        { type: 'bot', text: "¡Sí, tenemos stock! Nos quedan las últimas 4 unidades en color Negro y 2 unidades en Blanco en nuestro depósito central. ¿Quieres que te reserve uno para retirar hoy?" }
                    ],
                    newActions: [
                        { id: 'retail_reservar', text: "Reservar 1 Auricular Negro" }
                    ]
                },
                retail_cargadores: {
                    chat: [
                        { type: 'user', text: "Cargador Carga Rápida." },
                        { type: 'system', text: "⚙️ <strong>Acción de Sistema:</strong> Buscando en el ERP de stock..." },
                        { type: 'bot', text: "¡Confirmado! Tenemos stock disponible para entrega inmediata. ¿Te gustaría comprar con envío a domicilio?" }
                    ],
                    newActions: [
                        { id: 'retail_reservar', text: "Comprar con envío a domicilio" }
                    ]
                },
                retail_reservar: {
                    chat: [
                        { type: 'user', text: "Confirmar reserva/compra." },
                        { type: 'system', text: "⚙️ <strong>Acción de Facturación:</strong> Generando enlace de cobro automatizado..." },
                        { type: 'bot', text: "¡Listo! He reservado el producto en el sistema de stock. Te enviamos el link de pago seguro de Mercado Pago / Stripe a tu chat para finalizar la compra. ¡Gracias!" }
                    ],
                    newActions: [],
                    notification: {
                        icon: "🛒",
                        title: "Alerta de Venta & Stock",
                        message: "E-Commerce: 1 Auricular Pro Reservado (Enlace enviado)"
                    }
                },
                retail_pedido: {
                    chat: [
                        { type: 'user', text: "Ver estado de mi pedido." },
                        { type: 'bot', text: "Por favor, indícame tu número de pedido o el correo con el que realizaste la compra para rastrearlo en nuestro sistema:" }
                    ],
                    newActions: [
                        { id: 'retail_sim_pedido_status', text: "Buscar pedido #48920" }
                    ]
                },
                retail_sim_pedido_status: {
                    chat: [
                        { type: 'user', text: "Pedido #48920" },
                        { type: 'system', text: "⚙️ <strong>Acción de Logística:</strong> Buscando guía en Andreani / DHL..." },
                        { type: 'bot', text: "Tu pedido #48920 ya fue despachado. Se encuentra en camino y la fecha estimada de entrega a domicilio es mañana martes entre las 09:00 y las 14:00hs. ¿Deseas el código de seguimiento?" }
                    ],
                    newActions: []
                }
            }
        }
    };

    let activeIndustry = 'salon';

    function changeSimulatorIndustry(industryKey) {
        if (!simulatorData[industryKey]) return;
        activeIndustry = industryKey;
        
        // Update tabs active state
        document.querySelectorAll('.industry-tab').forEach(tab => {
            if (tab.getAttribute('data-industry') === industryKey) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });

        // Set Bot Name
        simBotName.innerText = simulatorData[industryKey].botName;
        
        // Reset chat body
        simChatBody.innerHTML = '';
        simActionsContainer.innerHTML = '';
        
        // Start load
        loadInitialMessages(simulatorData[industryKey]);
    }

    function loadInitialMessages(data) {
        // Show Typing animation
        showTypingIndicator();
        
        setTimeout(() => {
            removeTypingIndicator();
            data.initialMessages.forEach(msg => {
                appendChatMessage(msg.type, msg.text);
            });
            // No auto-response buttons — user types freely
        }, 800);
    }

    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'msg msg-typing';
        typingDiv.id = 'sim-typing-indicator';
        typingDiv.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        simChatBody.appendChild(typingDiv);
        scrollChatToBottom();
    }

    function removeTypingIndicator() {
        const ind = document.getElementById('sim-typing-indicator');
        if (ind) ind.remove();
    }

    function appendChatMessage(type, text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `msg msg-${type}`;
        msgDiv.innerHTML = text;
        simChatBody.appendChild(msgDiv);
        scrollChatToBottom();
    }

    function scrollChatToBottom() {
        simChatBody.scrollTop = simChatBody.scrollHeight;
    }

    function renderActions(actionsList) {
        simActionsContainer.innerHTML = '';
        if (!actionsList || actionsList.length === 0) return;
        
        actionsList.forEach(act => {
            const btn = document.createElement('button');
            btn.className = 'sim-btn';
            btn.innerText = act.text;
            btn.addEventListener('click', () => handleUserAction(act.id));
            simActionsContainer.appendChild(btn);
        });
    }

    function handleUserAction(actionId) {
        const industry = simulatorData[activeIndustry];
        const res = industry.responses[actionId];
        if (!res) return;

        // Clear actions immediately to prevent double tap
        simActionsContainer.innerHTML = '';

        // Play scenario response step by step
        let delay = 0;
        res.chat.forEach((chatMsg) => {
            if (chatMsg.type === 'user') {
                appendChatMessage('user', chatMsg.text);
            } else if (chatMsg.type === 'system') {
                delay += 500;
                setTimeout(() => {
                    appendChatMessage('system', chatMsg.text);
                }, delay);
            } else if (chatMsg.type === 'bot') {
                delay += 1000;
                setTimeout(() => {
                    showTypingIndicator();
                }, delay);
                
                delay += 800;
                setTimeout(() => {
                    removeTypingIndicator();
                    appendChatMessage('bot', chatMsg.text);
                    // If it is the last message, render new action choices
                    if (chatMsg === res.chat[res.chat.length - 1] || (res.chat[res.chat.length - 1].type === 'system' && chatMsg === res.chat[res.chat.length - 2])) {
                        renderActions(res.newActions);
                    }
                }, delay);
            }
        });

        // Trigger OS Notification Toast if scenario has it
        if (res.notification) {
            setTimeout(() => {
                showPhoneNotification(res.notification.icon, res.notification.title, res.notification.message);
            }, delay + 1200);
        }
    }

    function showPhoneNotification(icon, title, message) {
        const toast = document.createElement('div');
        toast.className = 'notif-toast';
        toast.innerHTML = `
            <div class="notif-icon">${icon}</div>
            <div class="notif-content">
                <span class="notif-title">${title}</span>
                <span class="notif-message">${message}</span>
            </div>
        `;
        
        simNotifications.appendChild(toast);

        // Auto remove toast
        setTimeout(() => {
            toast.classList.add('fade-out');
            toast.addEventListener('animationend', () => {
                toast.remove();
            });
        }, 4000);
    }

    // Listen to real chat input submissions
    if (simChatForm) {
        simChatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const rawText = simChatInput.value.trim();
            if (!rawText) return;

            // Clear input
            simChatInput.value = '';

            // Render User bubble
            appendChatMessage('user', rawText);

            // Hide suggestions to keep interface clean during typing flow
            simActionsContainer.innerHTML = '';

            // Process response
            processTypedMessage(rawText);
        });
    }

    function processTypedMessage(text) {
        const query = text.toLowerCase();
        let botResponse = '';
        let systemMsg = null;

        // Keyword analysis according to active industry
        if (activeIndustry === 'salon') {
            if (query.includes('cita') || query.includes('turno') || query.includes('agenda') || query.includes('hora') || query.includes('reserv')) {
                systemMsg = "⚙️ <strong>Acción del Sistema:</strong> Conectando con Google Calendar...";
                botResponse = "Tengo disponible mañana a las 16:30hs o 18:00hs con nuestra especialista Sofía. ¿Te sirve alguna de estas opciones?";
            } else if (query.includes('precio') || query.includes('facial') || query.includes('tratamient') || query.includes('hacer') || query.includes('cuesta')) {
                botResponse = "Ofrecemos: Limpieza profunda, Peeling ultrasónico e Hidrafacial Premium. El Hidrafacial Premium cuesta $45 USD. ¿Te gustaría agendar una sesión?";
            } else if (query.includes('prom') || query.includes('descuent') || query.includes('oferta') || query.includes('mes')) {
                botResponse = "¡Este mes tenemos un 20% de descuento en Spa Corporal de lunes a miércoles! ¿Quieres reservar tu lugar?";
            } else if (query.includes('hola') || query.includes('buenas') || query.includes('buenos')) {
                botResponse = "¡Hola! Bienvenido a BellaSpá. Soy tu asistente virtual 24/7. ¿En qué puedo ayudarte hoy?";
            }
        } else if (activeIndustry === 'clinica') {
            if (query.includes('turno') || query.includes('cita') || query.includes('consult')) {
                botResponse = "Perfecto. Por favor selecciona la especialidad médica que necesitas: Pediatría o Cardiología.";
            } else if (query.includes('pediatr')) {
                systemMsg = "⚙️ <strong>Acción de Base de Datos:</strong> Consultando disponibilidad de pediatras...";
                botResponse = "Tenemos disponible para Pediatría con el Dr. Martínez este miércoles a las 10:15hs. ¿Te confirmamos este turno?";
            } else if (query.includes('cardi')) {
                systemMsg = "⚙️ <strong>Acción de Base de Datos:</strong> Consultando cardiólogos...";
                botResponse = "La Dra. Gómez (Cardióloga) tiene turnos disponibles este jueves a las 09:00hs. ¿Te sirve?";
            } else if (query.includes('obra') || query.includes('segur') || query.includes('cobertur') || query.includes('osde')) {
                botResponse = "Aceptamos la mayoría de las obras sociales nacionales (OSDE, Swiss Medical, Galeno, Medicus) y seguros privados. ¿Deseas agendar?";
            } else if (query.includes('hola') || query.includes('buenas') || query.includes('buenos')) {
                botResponse = "Bienvenido a Consultorios Médicos Sanitas. Soy tu asistente inteligente. ¿Qué trámite deseas realizar hoy?";
            }
        } else if (activeIndustry === 'servicios') {
            if (query.includes('abogad') || query.includes('consult') || query.includes('legal') || query.includes('reun') || query.includes('cita')) {
                botResponse = "Por supuesto. Contamos con especialistas en Derecho Civil, Laboral y Corporativo. ¿Qué tipo de asesoría necesitas?";
            } else if (query.includes('corporat') || query.includes('empres')) {
                systemMsg = "⚙️ <strong>Filtro de Workflows:</strong> Calificando Lead para socio Senior...";
                botResponse = "Entendido. Para darte la mejor asesoría corporativa, ¿cuál es el tamaño aproximado de tu empresa actual (empleados)?";
            } else if (query.includes('laboral') || query.includes('trabaj')) {
                botResponse = "Entendido. ¿Tu consulta es en calidad de Empleador (empresa) o Empleado (particular)?";
            } else if (query.includes('precio') || query.includes('presupuest') || query.includes('cotiza') || query.includes('costo')) {
                botResponse = "Para enviarte una cotización estimada automatizada, ¿necesitas servicios contables mensuales, auditoría o constitución de sociedad?";
            } else if (query.includes('hola') || query.includes('buenas') || query.includes('buenos')) {
                botResponse = "Bienvenido a Mendoza & Asociados. Soy tu asistente virtual corporativo. ¿En qué área legal o contable necesitas asistencia?";
            }
        } else if (activeIndustry === 'retail') {
            if (query.includes('stock') || query.includes('auricular') || query.includes('product') || query.includes('tienen')) {
                systemMsg = "⚙️ <strong>Acción de Sistema:</strong> Consultando stock en inventario central...";
                botResponse = "¡Sí, tenemos stock de los Auriculares Pro! Nos quedan las últimas 4 unidades en color negro. ¿Quieres que te reserve una para retirar hoy?";
            } else if (query.includes('pedido') || query.includes('compra') || query.includes('envio') || query.includes('estado')) {
                botResponse = "Por favor, indícame tu número de pedido (ej. #48920) o tu correo para rastrearlo.";
            } else if (query.includes('48920')) {
                systemMsg = "⚙️ <strong>Acción de Logística:</strong> Buscando guía en Andreani / DHL...";
                botResponse = "Tu pedido #48920 ya fue despachado. Se encuentra en camino y la fecha estimada de entrega es mañana martes entre las 09:00 y las 14:00hs.";
            } else if (query.includes('hola') || query.includes('buenas') || query.includes('buenos')) {
                botResponse = "¡Hola! Gracias por comunicarte con Novatech. ¿Deseas consultar por el stock de algún producto o el estado de tu pedido?";
            }
        }

        // Generic intelligent fallback
        if (!botResponse) {
            const topic = text.length > 25 ? "tu requerimiento" : `"${text}"`;
            botResponse = `Como asistente cognitivo de NovaAI, entiendo tu consulta sobre ${topic}. Puedo razonar, conectarme a tus bases de datos, responder audios o imágenes y resolver casos sin respuestas fijas. ¿Te gustaría agendar una demo corta para probarlo con tu negocio?`;
        }

        // Output formatting delays for realistic typing flow
        let responseDelay = 400;
        
        if (systemMsg) {
            setTimeout(() => {
                appendChatMessage('system', systemMsg);
            }, responseDelay);
            responseDelay += 900;
        }

        setTimeout(() => {
            showTypingIndicator();
        }, responseDelay);
        responseDelay += 1000;

        setTimeout(() => {
            removeTypingIndicator();
            appendChatMessage('bot', botResponse);
            // No buttons — user continues typing
        }, responseDelay);
    }

    // Set simulator tab listeners
    document.querySelectorAll('.industry-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            const indKey = tab.getAttribute('data-industry');
            changeSimulatorIndustry(indKey);
        });
    });

    /* ==========================================================================
       6.5. RADIAL ORBITAL TIMELINE LOGIC
       ========================================================================== */
    const timelineData = [
        {
            id: 1,
            title: "Asistentes IA",
            date: "WhatsApp Bot",
            status: "completed",
            energy: 95,
            content: `
                <ul>
                    <li>Atiende WhatsApp 24/7 de forma autónoma.</li>
                    <li>Agenda turnos integrando Google Calendar.</li>
                    <li>Envía presupuestos PDF instantáneamente.</li>
                    <li>Responde preguntas frecuentes sobre tu negocio.</li>
                    <li>Recupera clientes inactivos de forma inteligente.</li>
                </ul>
            `,
            // Inline WhatsApp Icon SVG
            icon: `<svg viewBox="0 0 24 24"><path fill="#25D366" d="M12.004 2C6.48 2 2 6.48 2 12c0 2.17.7 4.21 2 5.87L2.5 22l4.28-1.42A9.92 9.92 0 0 0 12.004 22c5.52 0 10-4.48 10-10S17.524 2 12.004 2zM12 20.38c-1.89 0-3.74-.51-5.36-1.48l-.38-.23-2.52.84.85-2.46-.25-.4a8.33 8.33 0 0 1-1.28-4.47c0-4.6 3.75-8.35 8.35-8.35s8.35 3.75 8.35 8.35-3.75 8.35-8.35 8.35zm4.61-6.31c-.25-.13-1.49-.74-1.72-.82-.23-.08-.4-.12-.57.13-.17.25-.66.82-.81.99-.15.17-.3.19-.55.06a7.01 7.01 0 0 1-2.03-1.25c-.79-.7-1.32-1.57-1.47-1.83-.15-.25-.02-.39.11-.52.12-.11.25-.3.38-.45.13-.15.17-.25.25-.41.08-.17.04-.32-.02-.45-.06-.13-.57-1.37-.78-1.88-.2-.5-.41-.43-.57-.44h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.09s.9 2.41 1.02 2.58c.12.17 1.76 2.69 4.27 3.78.6.26 1.06.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.49-.61 1.7-1.2.21-.58.21-1.09.15-1.2-.06-.11-.23-.21-.48-.34z"/></svg>`,
            relatedIds: [2, 5]
        },
        {
            id: 2,
            title: "CRM Inteligente",
            date: "Gestión Operativa",
            status: "completed",
            energy: 85,
            content: "Sincroniza y registra de forma autónoma cada interacción con tus clientes, actualizando historiales de compra, notas de contacto y embudos de ventas en tiempo real.",
            // Inline Database/Network Link SVG
            icon: `<svg viewBox="0 0 24 24"><path fill="#3b82f6" d="M12 2a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3zm7 4a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3zM5 14a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3z"/></svg>`,
            relatedIds: [1, 3, 5]
        },
        {
            id: 3,
            title: "Reportes",
            date: "Métricas & Stock",
            status: "in-progress",
            energy: 70,
            content: "Generación automática de informes de stock bajo, resúmenes de facturación diarios y balances operativos que se envían directamente a tu canal de WhatsApp o correo electrónico.",
            // Inline Graph/Chart SVG
            icon: `<svg viewBox="0 0 24 24"><path fill="#f59e0b" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 14h-2v-6h2v6zm-4 0h-2V7h2v10zm-4 0H7v-4h2v4z"/></svg>`,
            relatedIds: [2]
        },
        {
            id: 4,
            title: "Redes Sociales",
            date: "Meta API",
            status: "completed",
            energy: 90,
            content: "Conexión a APIs de Instagram y Facebook para responder comentarios en publicaciones e iniciar conversaciones de venta directas (DMs) al instante.",
            // Inline Instagram SVG
            icon: `<svg viewBox="0 0 24 24"><path fill="#e1306c" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>`,
            relatedIds: [1, 5]
        },
        {
            id: 5,
            title: "Seguimiento",
            date: "Retención",
            status: "pending",
            energy: 40,
            content: "Controla historiales de compra y programa recordatorios de seguimiento periódicos de manera automática para reactivar clientes inactivos.",
            // Inline Bell/Clock icon
            icon: `<svg viewBox="0 0 24 24"><path fill="#a855f7" d="M12 22a2.98 2.98 0 0 0 2.818-2H9.182A2.98 2.98 0 0 0 12 22zm7-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C8.63 5.36 7 7.92 7 11v5l-2 2v1h14v-1l-2-2z"/></svg>`,
            relatedIds: [1, 2, 4]
        }
    ];

    const orbitalNodesContainer = document.getElementById('orbital-nodes-container');
    const orbitalDetailsSheet = document.getElementById('orbital-details-sheet');
    const orbitalContainer = document.getElementById('orbital-container');

    let rotationAngle = 0;
    let autoRotate = true;
    let activeNodeId = null;

    // Render nodes initially
    function buildOrbitalNodes() {
        orbitalNodesContainer.innerHTML = '';
        timelineData.forEach((node, index) => {
            const nodeEl = document.createElement('div');
            nodeEl.className = 'orbital-node';
            nodeEl.id = `orb-node-${node.id}`;
            nodeEl.setAttribute('data-id', node.id);
            nodeEl.setAttribute('data-index', index);

            // Pulse glow background element
            const glow = document.createElement('div');
            glow.className = 'node-energy-pulse-bg';
            glow.style.width = `${node.energy * 0.4 + 48}px`;
            glow.style.height = `${node.energy * 0.4 + 48}px`;
            glow.style.left = `-${(node.energy * 0.4 + 48 - 52) / 2}px`;
            glow.style.top = `-${(node.energy * 0.4 + 48 - 52) / 2}px`;
            nodeEl.appendChild(glow);

            // Icon wrap
            const iconWrap = document.createElement('div');
            iconWrap.className = 'orbital-node-icon';
            iconWrap.innerHTML = node.icon;
            nodeEl.appendChild(iconWrap);

            // Label
            const label = document.createElement('div');
            label.className = 'orbital-node-label';
            label.innerText = node.title;
            nodeEl.appendChild(label);

            // Node Click
            nodeEl.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleOrbitalNode(node.id);
            });

            orbitalNodesContainer.appendChild(nodeEl);
        });
    }

    function updateNodesPositions() {
        const nodes = document.querySelectorAll('.orbital-node');
        const radius = 130; // Fits perfectly in 360px layout

        nodes.forEach(nodeEl => {
            const index = parseInt(nodeEl.getAttribute('data-index'));
            const angle = ((index / timelineData.length) * 360 + rotationAngle) % 360;
            const radian = (angle * Math.PI) / 180;

            const x = radius * Math.cos(radian);
            const y = radius * Math.sin(radian);

            const zIndex = Math.round(100 + 50 * Math.cos(radian));
            const opacity = Math.max(0.4, Math.min(1, 0.4 + 0.6 * ((1 + Math.sin(radian)) / 2)));

            nodeEl.style.setProperty('--x', `${x}px`);
            nodeEl.style.setProperty('--y', `${y}px`);
            nodeEl.style.zIndex = nodeEl.classList.contains('active') ? 200 : zIndex;
            nodeEl.style.opacity = nodeEl.classList.contains('active') ? 1 : opacity;
        });
    }

    function toggleOrbitalNode(id) {
        const currentlyActive = activeNodeId === id;
        
        // Reset classes
        document.querySelectorAll('.orbital-node').forEach(n => {
            n.classList.remove('active');
            n.classList.remove('related-pulse');
        });

        if (currentlyActive) {
            activeNodeId = null;
            autoRotate = true;
            orbitalDetailsSheet.classList.remove('active');
        } else {
            activeNodeId = id;
            autoRotate = false;
            
            const nodeEl = document.getElementById(`orb-node-${id}`);
            if (nodeEl) nodeEl.classList.add('active');

            // Align rotation to place active node on top (270 degrees)
            const index = timelineData.findIndex(item => item.id === id);
            const targetAngle = (index / timelineData.length) * 360;
            rotationAngle = (270 - targetAngle + 360) % 360;
            
            // Highlight related nodes
            const nodeData = timelineData.find(item => item.id === id);
            if (nodeData && nodeData.relatedIds) {
                nodeData.relatedIds.forEach(relId => {
                    const relNode = document.getElementById(`orb-node-${relId}`);
                    if (relNode) relNode.classList.add('related-pulse');
                });
            }

            // Fill card content
            fillDetailsCard(nodeData);
            orbitalDetailsSheet.classList.add('active');
        }
        
        updateNodesPositions();
    }

    function fillDetailsCard(node) {
        const badgeText = node.status === 'completed' ? 'COMPLETO' : node.status === 'in-progress' ? 'EN PROGRESO' : 'PENDIENTE';
        const badgeClass = node.status;
        
        orbitalDetailsSheet.innerHTML = `
            <div class="card-header-row">
                <span class="card-badge ${badgeClass}">${badgeText}</span>
                <span class="card-date">${node.date}</span>
            </div>
            <h3 class="card-node-title">${node.title}</h3>
            <div class="card-node-desc">${node.content}</div>
            
            <div class="card-energy-section">
                <div class="energy-title-row">
                    <span>Nivel de Carga</span>
                    <span>${node.energy}%</span>
                </div>
                <div class="energy-bar-track">
                    <div class="energy-bar-fill" id="energy-bar-${node.id}"></div>
                </div>
            </div>
        `;

        // Trigger energy fill animation after rendering
        setTimeout(() => {
            const bar = document.getElementById(`energy-bar-${node.id}`);
            if (bar) bar.style.width = `${node.energy}%`;
        }, 100);
    }

    // Tick rotation
    function orbitalTick() {
        if (autoRotate) {
            rotationAngle = (rotationAngle + 0.3) % 360;
            updateNodesPositions();
        }
        requestAnimationFrame(orbitalTick);
    }

    // Reset when click wrapper outside nodes
    orbitalContainer.addEventListener('click', (e) => {
        if (e.target === orbitalContainer || e.target.classList.contains('orbital-view') || e.target.classList.contains('orbital-orbit-line')) {
            activeNodeId = null;
            autoRotate = true;
            document.querySelectorAll('.orbital-node').forEach(n => {
                n.classList.remove('active');
                n.classList.remove('related-pulse');
            });
            orbitalDetailsSheet.classList.remove('active');
            updateNodesPositions();
        }
    });

    buildOrbitalNodes();
    orbitalTick();


    /* ==========================================================================
       7. ADDITIONAL UX/MOTION: ACCENT HOVER & INTERACTION
       ========================================================================== */
    // Add magnetic or subtle light reflection on glass cards
    const glassCards = document.querySelectorAll('.glass-card');
    glassCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Set css variables inside card to reflect light gradient dynamically
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });


    /* ==========================================================================
       8. RESULTS METRICS COUNTER ANIMATION
       ========================================================================== */
    function animateCounter(element, target, duration) {
        let start = 0;
        const startTime = performance.now();
        
        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing: ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * target);
            
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }
        requestAnimationFrame(updateCounter);
    }

    // Trigger counter animation when results section becomes visible
    const metricNumbers = document.querySelectorAll('.metric-number[data-target]');
    if (metricNumbers.length > 0) {
        const metricsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.getAttribute('data-target'));
                    animateCounter(entry.target, target, 1800);
                    metricsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        metricNumbers.forEach(el => metricsObserver.observe(el));
    }

    // Initialize Simulator on load
    changeSimulatorIndustry('salon');
});
