/**
 * main.js - Portfolio Interactions & Animations
 * Utilizes vanilla JS, Canvas, and GSAP for high-performance motion.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Icons
    lucide.createIcons();

    // Check user preference for motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 2. State & DOM Elements
    const state = {
        theme: 'dark', // default
        isNavOpen: false,
    };

    const els = {
        html: document.documentElement,
        themeToggle: document.getElementById('theme-toggle'),
        cmdThemeToggle: document.getElementById('cmd-theme-toggle'),
        cmdPaletteBtn: document.getElementById('command-palette-btn'),
        cmdPalette: document.getElementById('command-palette'),
        cmdPaletteContent: document.getElementById('command-palette-content'),
        closePaletteBtn: document.getElementById('close-palette'),
        tooltip: document.getElementById('custom-tooltip'),
        bgCanvas: document.getElementById('bg-canvas'),
        archCanvas: document.getElementById('arch-canvas'),
        radarCanvas: document.getElementById('radarChart'),
        typewriter: document.getElementById('typewriter'),
        metricTicker: document.querySelector('.live-metrics-ticker'),
        heroTerminal: document.getElementById('hero-terminal')
    };

    // 3. Theme Management
    function toggleTheme() {
        if (state.theme === 'dark') {
            els.html.classList.remove('dark');
            els.html.classList.add('light-mode');
            state.theme = 'light';
        } else {
            els.html.classList.add('dark');
            els.html.classList.remove('light-mode');
            state.theme = 'dark';
        }

        // Re-initialize canvas colors based on new CSS variables
        initParticleCanvas();
        drawRadarChart();
        drawArchitectureLines();
    }

    els.themeToggle.addEventListener('click', toggleTheme);
    els.cmdThemeToggle.addEventListener('click', () => {
        toggleTheme();
        closeCommandPalette();
    });

    // 4. Command Palette
    function openCommandPalette() {
        els.cmdPalette.classList.remove('hidden');
        els.cmdPalette.classList.add('flex');

        // Animate in
        if (!prefersReducedMotion) {
            gsap.to(els.cmdPalette, { opacity: 1, duration: 0.2 });
            gsap.to(els.cmdPaletteContent, { scale: 1, duration: 0.2, ease: "back.out(1.7)" });
        } else {
            els.cmdPalette.style.opacity = 1;
            els.cmdPaletteContent.style.transform = "scale(1)";
        }

        setTimeout(() => els.cmdPaletteContent.querySelector('input').focus(), 100);
    }

    function closeCommandPalette() {
        if (!prefersReducedMotion) {
            gsap.to(els.cmdPaletteContent, { scale: 0.95, duration: 0.2 });
            gsap.to(els.cmdPalette, {
                opacity: 0,
                duration: 0.2,
                onComplete: () => {
                    els.cmdPalette.classList.add('hidden');
                    els.cmdPalette.classList.remove('flex');
                }
            });
        } else {
            els.cmdPalette.style.opacity = 0;
            els.cmdPalette.classList.add('hidden');
            els.cmdPalette.classList.remove('flex');
        }
    }

    els.cmdPaletteBtn.addEventListener('click', openCommandPalette);
    els.closePaletteBtn.addEventListener('click', closeCommandPalette);
    els.cmdPalette.addEventListener('click', (e) => {
        if (e.target === els.cmdPalette) closeCommandPalette();
    });

    document.addEventListener('keydown', (e) => {
        // cmd+k or ctrl+k
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            if (els.cmdPalette.classList.contains('hidden')) {
                openCommandPalette();
            } else {
                closeCommandPalette();
            }
        }
        if (e.key === 'Escape' && !els.cmdPalette.classList.contains('hidden')) {
            closeCommandPalette();
        }
    });

    // Close palette on cmd item click
    document.querySelectorAll('.cmd-item').forEach(item => {
        item.addEventListener('click', () => {
            if (item.id !== 'cmd-theme-toggle') {
                closeCommandPalette();
            }
        });
    });


    // 5. Typewriter Effect
    const roles = ['Data Engineer.', 'Analytics Engineer.', 'BI Developer.', 'Data Scientist.'];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            els.typewriter.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            els.typewriter.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentRole.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeed = 500; // Pause before next
        }

        if (!prefersReducedMotion) {
            setTimeout(typeEffect, typeSpeed);
        } else {
            // No animation, just set the first role permanently
            els.typewriter.textContent = roles[0];
            els.typewriter.classList.remove('border-r-2');
        }
    }
    typeEffect();

    // 6. Fake Live Metrics Ticker
    function generateMockMetrics() {
        const statuses = ['OK', 'SYNC', 'OPT'];
        let html = '';
        for (let i = 0; i < 20; i++) {
            const cpu = Math.floor(Math.random() * 40) + 10;
            const ram = Math.floor(Math.random() * 60) + 20;
            const lag = Math.floor(Math.random() * 150) + 10;
            const stat = statuses[Math.floor(Math.random() * statuses.length)];
            html += `<span class="inline-block mx-4 flex items-center gap-1"><i data-lucide="activity" class="w-3 h-3 text-primary"></i> Cluster-${i}: CPU ${cpu}% | RAM ${ram}% | Lag ${lag}ms [${stat}]</span>`;
        }
        els.metricTicker.innerHTML = html + html; // duplicate for infinite scroll
        lucide.createIcons();
    }

    generateMockMetrics();
    setInterval(() => {
        if (!prefersReducedMotion) generateMockMetrics();
    }, 5000);

    if (!prefersReducedMotion) {
        gsap.to(els.metricTicker, {
            xPercent: -50,
            ease: "none",
            duration: 30,
            repeat: -1
        });
    }

    // 6.5. Fake Terminal Output
    const terminalLogs = [
        "> INITIALIZING VIRTUAL ENVIRONMENT...",
        "> LOADING core_dependencies.py...",
        "[OK] Pyspark 3.5.0 cluster online",
        "[OK] dbt-core v1.7 ready",
        "> CONNECTING TO DATA LAKE...",
        "   - Authentication: Azure Entra ID [Bearer Token]",
        "[OK] Connection established. Latency: 12ms",
        "> STARTING STREAMING JOB...",
        "   - Kafka topic: telemetry_events_prod",
        "   - Sink: Delta Lake (Bronze layer)",
        "[INFO] Processing 14,502 msgs/sec...",
        "> AWAITING QUERIES..."
    ];
    let terminalIndex = 0;

    function generateTerminalOutput() {
        if (!els.heroTerminal || prefersReducedMotion) return;

        const container = els.heroTerminal.querySelector('.terminal-lines');
        if (!container) return;

        const logLine = document.createElement('div');
        logLine.textContent = terminalLogs[terminalIndex];

        // Add color based on content
        if (logLine.textContent.includes("[OK]") || logLine.textContent.includes("SUCCESS")) {
            logLine.classList.add('text-success');
        } else if (logLine.textContent.includes("[INFO]") || logLine.textContent.includes("> ")) {
            logLine.classList.add('text-info');
        } else if (logLine.textContent.includes("ERROR")) {
            logLine.classList.add('text-red-500');
        } else {
            logLine.classList.add('text-textMuted');
        }

        container.appendChild(logLine);

        // keep max 6 lines
        if (container.children.length > 5) {
            container.removeChild(container.firstChild);
        }

        terminalIndex++;
        if (terminalIndex >= terminalLogs.length) {
            terminalIndex = Math.max(0, terminalLogs.length - 4); // Loop last few loosely
            setTimeout(() => {
                if (container.lastChild) container.lastChild.textContent = `[INFO] Heartbeat OK. Sync: ${Math.floor(Math.random() * 100)}ms`;
            }, 2000);
        }

        // Random typing delay
        const nextDelay = Math.random() * 800 + 400; // 400ms to 1200ms
        setTimeout(generateTerminalOutput, nextDelay);
    }

    // Start terminal intro after short delay
    setTimeout(generateTerminalOutput, 1500);

    // 7. Custom Tooltip Logic
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips.forEach(el => {
        el.addEventListener('mouseenter', (e) => {
            const text = el.getAttribute('data-tooltip');
            els.tooltip.textContent = text;
            els.tooltip.style.opacity = '1';
        });

        el.addEventListener('mousemove', (e) => {
            // Position tooltip dynamically near cursor
            els.tooltip.style.left = e.clientX + 15 + 'px';
            els.tooltip.style.top = e.clientY + 15 + 'px';
        });

        el.addEventListener('mouseleave', () => {
            els.tooltip.style.opacity = '0';
        });
    });


    // 8. GSAP Scroll Animations
    gsap.registerPlugin(ScrollTrigger);

    if (!prefersReducedMotion) {

        // Counter Animation
        const counters = document.querySelectorAll('.counter');
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');

            ScrollTrigger.create({
                trigger: counter,
                start: "top 85%",
                onEnter: () => {
                    gsap.to(counter, {
                        innerHTML: target,
                        duration: 2,
                        snap: { innerHTML: 1 },
                        ease: "power1.inOut",
                        onUpdate: function () {
                            // format decimal if needed
                            if (counter.innerHTML.includes('.')) {
                                // no formatting logic here as data is integers for now, but hook is ready
                            }
                        }
                    });
                },
                once: true
            });
        });

        // Skill Bars Animation
        const bars = document.querySelectorAll('.skill-progress');
        bars.forEach(bar => {
            const width = bar.getAttribute('data-width');
            ScrollTrigger.create({
                trigger: bar,
                start: "top 90%",
                onEnter: () => {
                    gsap.to(bar, { width: width, duration: 1.5, ease: "power2.out" });
                },
                once: true
            });
        });

        // Project Cards Stagged In
        const projectCards = document.querySelectorAll('.project-card');
        ScrollTrigger.create({
            trigger: "#projects",
            start: "top 80%",
            onEnter: () => {
                gsap.to(projectCards, {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: "power3.out"
                });
            },
            once: true
        });

        // Timeline items staggered in
        const timelineItems = document.querySelectorAll('.timeline-item');
        ScrollTrigger.create({
            trigger: ".about-timeline",
            start: "top 80%",
            onEnter: () => {
                gsap.from(timelineItems, {
                    x: -20,
                    opacity: 0,
                    duration: 0.5,
                    stagger: 0.2,
                    ease: "power2.out"
                });
            },
            once: true
        });
    }

    // 9. Interactive Canvas Background (Data Particles)
    function initParticleCanvas() {
        if (!els.bgCanvas || prefersReducedMotion) return;

        const ctx = els.bgCanvas.getContext('2d');

        // Setup responsive size
        function resizeCanvas() {
            els.bgCanvas.width = window.innerWidth;
            els.bgCanvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        const style = getComputedStyle(document.body);
        const parseColor = (customProp) => {
            // Handle rgba/hex loosely used in CSS vars by just pulling it.
            const val = style.getPropertyValue(customProp).trim();
            // Assuming it looks like `#38bdf8` or `rgba(...)`
            return val;
        };

        const colors = [
            parseColor('--primary'),
            parseColor('--secondary'),
            parseColor('--info')
        ];

        let particles = [];
        const numParticles = Math.min(window.innerWidth / 10, 100);

        class Particle {
            constructor() {
                this.x = Math.random() * els.bgCanvas.width;
                this.y = Math.random() * els.bgCanvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                // pick random color
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x > els.bgCanvas.width) this.x = 0;
                if (this.x < 0) this.x = els.bgCanvas.width;
                if (this.y > els.bgCanvas.height) this.y = 0;
                if (this.y < 0) this.y = els.bgCanvas.height;
            }
            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        for (let i = 0; i < numParticles; i++) {
            particles.push(new Particle());
        }

        let mouse = { x: null, y: null };
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.x;
            mouse.y = e.y;
        });

        function animateParticles() {
            ctx.clearRect(0, 0, els.bgCanvas.width, els.bgCanvas.height);

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                // Connection lines
                for (let j = i; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.strokeStyle = particles[i].color.replace(')', ', 0.1)').replace('rgb', 'rgba').replace('rgbaa', 'rgba'); // hack for opacity
                        if (particles[i].color.startsWith('#')) {
                            // If it's hex, use global alpha
                            ctx.globalAlpha = 1 - (distance / 100);
                            ctx.strokeStyle = particles[i].color;
                        } else {
                            ctx.globalAlpha = 1; // already rgba
                        }

                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                        ctx.globalAlpha = 1; // reset
                    }
                }

                // Repel from mouse
                if (mouse.x && mouse.y) {
                    const dxM = particles[i].x - mouse.x;
                    const dyM = particles[i].y - mouse.y;
                    const distM = Math.sqrt(dxM * dxM + dyM * dyM);
                    if (distM < 150) {
                        particles[i].x += dxM * 0.01;
                        particles[i].y += dyM * 0.01;
                    }
                }
            }
            requestAnimationFrame(animateParticles);
        }

        animateParticles();
    }
    initParticleCanvas();

    // 10. Radar Chart Drawing
    function drawRadarChart() {
        if (!els.radarCanvas) return;
        const ctx = els.radarCanvas.getContext('2d');
        const style = getComputedStyle(document.body);
        const secondary = style.getPropertyValue('--secondary').trim();
        const borderCol = style.getPropertyValue('--border').trim();
        const textCol = style.getPropertyValue('--text-muted').trim();

        const cw = els.radarCanvas.clientWidth;
        const ch = els.radarCanvas.clientHeight || 250;
        els.radarCanvas.width = cw;
        els.radarCanvas.height = ch;

        const cx = cw / 2;
        const cy = ch / 2;
        const radius = Math.min(cw, ch) / 2 - 30; // padding

        const data = [
            { label: 'Data Model', val: 0.9 },
            { label: 'Pipelines', val: 0.85 },
            { label: 'Cloud Inf', val: 0.7 },
            { label: 'Analytics', val: 0.95 },
            { label: 'ML / AI', val: 0.6 }
        ];

        const sides = data.length;
        const maxVal = 1;

        ctx.clearRect(0, 0, cw, ch);

        // Draw web
        ctx.strokeStyle = borderCol;
        ctx.lineWidth = 1;

        for (let j = 1; j <= 4; j++) {
            ctx.beginPath();
            let r = radius * (j / 4);
            for (let i = 0; i <= sides; i++) {
                let angle = (Math.PI * 2 * i / sides) - Math.PI / 2;
                let x = cx + r * Math.cos(angle);
                let y = cy + r * Math.sin(angle);
                if (i == 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        }

        // Draw axis lines and labels
        ctx.fillStyle = textCol;
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        for (let i = 0; i < sides; i++) {
            let angle = (Math.PI * 2 * i / sides) - Math.PI / 2;
            // axis line
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
            ctx.stroke();

            // label
            let lx = cx + (radius + 15) * Math.cos(angle);
            let ly = cy + (radius + 15) * Math.sin(angle);
            ctx.fillText(data[i].label, lx, ly);
        }

        // Draw shape starting from 0 to target (Animation)
        let progress = 0;

        function renderShape() {
            ctx.clearRect(0, 0, cw, ch);
            // Re-draw web (lazy way instead of keeping two canvases)
            ctx.strokeStyle = borderCol;
            ctx.lineWidth = 1;
            for (let j = 1; j <= 4; j++) {
                ctx.beginPath();
                let r = radius * (j / 4);
                for (let i = 0; i <= sides; i++) {
                    let angle = (Math.PI * 2 * i / sides) - Math.PI / 2;
                    let x = cx + r * Math.cos(angle);
                    let y = cy + r * Math.sin(angle);
                    if (i == 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
            }
            ctx.fillStyle = textCol;
            for (let i = 0; i < sides; i++) {
                let angle = (Math.PI * 2 * i / sides) - Math.PI / 2;
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.lineTo(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
                ctx.stroke();
                let lx = cx + (radius + 15) * Math.cos(angle);
                let ly = cy + (radius + 15) * Math.sin(angle);
                ctx.fillText(data[i].label, lx, ly);
            }

            // Draw data
            ctx.beginPath();
            for (let i = 0; i < sides; i++) {
                let currVal = data[i].val * (prefersReducedMotion ? 1 : progress);
                let r = radius * (currVal / maxVal);
                let angle = (Math.PI * 2 * i / sides) - Math.PI / 2;
                let x = cx + r * Math.cos(angle);
                let y = cy + r * Math.sin(angle);

                if (i == 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();

            // Fill
            ctx.fillStyle = secondary.startsWith('#') ? secondary + '40' : secondary.replace('rgb', 'rgba').replace(')', ', 0.3)');
            ctx.fill();

            // Stroke
            ctx.strokeStyle = secondary;
            ctx.lineWidth = 2;
            ctx.stroke();

            // Points
            for (let i = 0; i < sides; i++) {
                let currVal = data[i].val * (prefersReducedMotion ? 1 : progress);
                let r = radius * (currVal / maxVal);
                let angle = (Math.PI * 2 * i / sides) - Math.PI / 2;
                let x = cx + r * Math.cos(angle);
                let y = cy + r * Math.sin(angle);

                ctx.beginPath();
                ctx.arc(x, y, 4, 0, Math.PI * 2);
                ctx.fillStyle = secondary;
                ctx.fill();
            }

            if (!prefersReducedMotion && progress < 1) {
                progress += 0.03;
                requestAnimationFrame(renderShape);
            }
        }

        // Trigger on Scroll
        if (prefersReducedMotion) {
            renderShape();
        } else {
            ScrollTrigger.create({
                trigger: els.radarCanvas,
                start: "top 80%",
                onEnter: () => renderShape(),
                once: true
            });
        }
    }

    // Slight delay to ensure DOM sizing
    setTimeout(drawRadarChart, 500);
    window.addEventListener('resize', drawRadarChart);


    // 11. Interactive Architecture Hover Effects
    function drawArchitectureLines() {
        if (!els.archCanvas) return;
        const container = document.querySelector('.architecture-diagram');
        if (!container) return;

        const ctx = els.archCanvas.getContext('2d');
        const updateCanvasSize = () => {
            els.archCanvas.width = container.clientWidth;
            els.archCanvas.height = container.clientHeight;
        };
        updateCanvasSize();
        window.addEventListener('resize', updateCanvasSize);

        const nodes = document.querySelectorAll('.arch-node');
        const descEl = document.getElementById('arch-description');

        const style = getComputedStyle(document.body);
        const primary = style.getPropertyValue('--primary').trim();
        const borderLine = style.getPropertyValue('--border').trim();

        // Node definitions for descriptive text mapping
        const flowDesc = {
            'db': 'Extracting structured operational data using CDC (Change Data Capture).',
            'api': 'Pulling JSON payloads from external SaaS providers via custom Python ingestion scripts.',
            'stream': 'Consuming real-time telemetry events via Azure Event Hubs / Kafka.',
            'bronze': 'Landing zone: Raw data saved as Parquet/Delta with append-only semantics.',
            'silver': 'Data is cleansed, joined, and normalized. Schema enforcement and data quality checks applied.',
            'gold': 'Business-level aggregates created. Star schema modeled for performance in reporting.',
            'bi': 'Connecting live or via DirectLake to Power BI for interactive executive dashboards.',
            'ml': 'Features served to predictive models using Scikit-Learn or MLflow endpoints.'
        };

        // Draw static faint lines connecting logical columns
        function drawBaseLines() {
            ctx.clearRect(0, 0, els.archCanvas.width, els.archCanvas.height);

            // Connecting DB, API, Stream to Bronze
            const bronze = document.querySelector('[data-node="bronze"]');
            if (!bronze) return;

            const bronzeRect = bronze.getBoundingClientRect();
            const contRect = container.getBoundingClientRect();
            const bX = bronzeRect.left - contRect.left;
            const bY = bronzeRect.top - contRect.top + (bronzeRect.height / 2);

            ctx.strokeStyle = borderLine;
            ctx.lineWidth = 1;
            ctx.setLineDash([5, 5]);

            ['db', 'api', 'stream'].forEach(id => {
                const node = document.querySelector(`[data-node="${id}"]`);
                if (node) {
                    const rect = node.getBoundingClientRect();
                    const nX = rect.left - contRect.left + rect.width;
                    const nY = rect.top - contRect.top + (rect.height / 2);

                    ctx.beginPath();
                    ctx.moveTo(nX, nY);
                    // curve
                    ctx.bezierCurveTo(nX + 50, nY, bX - 50, bY, bX, bY);
                    ctx.stroke();
                }
            });

            // Bronze to Silver
            const silver = document.querySelector('[data-node="silver"]');
            if (silver) {
                const sRect = silver.getBoundingClientRect();
                const sX = sRect.left - contRect.left;
                const sY = sRect.top - contRect.top + (sRect.height / 2);

                ctx.beginPath();
                ctx.moveTo(bX + bronzeRect.width, bY);
                ctx.lineTo(sX, sY);
                ctx.stroke();

                // Silver to Gold
                const gold = document.querySelector('[data-node="gold"]');
                if (gold) {
                    const gRect = gold.getBoundingClientRect();
                    const gX = gRect.left - contRect.left + (gRect.width / 2);
                    const gY = gRect.top - contRect.top;

                    ctx.beginPath();
                    ctx.moveTo(sX + (sRect.width / 2), sY + (sRect.height / 2));
                    ctx.lineTo(gX, gY);
                    ctx.stroke();

                    // Gold to BI / ML
                    ['bi', 'ml'].forEach(id => {
                        const destNode = document.querySelector(`[data-node="${id}"]`);
                        if (destNode) {
                            const dRect = destNode.getBoundingClientRect();
                            const dX = dRect.left - contRect.left;
                            const dY = dRect.top - contRect.top + (dRect.height / 2);
                            const gEndX = gRect.left - contRect.left + gRect.width;
                            const gEndY = gRect.top - contRect.top + (gRect.height / 2);

                            ctx.beginPath();
                            ctx.moveTo(gEndX, gEndY);
                            ctx.bezierCurveTo(gEndX + 50, gEndY, dX - 50, dY, dX, dY);
                            ctx.stroke();
                        }
                    });
                }
            }
            ctx.setLineDash([]);
        }

        setTimeout(drawBaseLines, 500); // ensure layout rendered

        // Hover interaction
        nodes.forEach(node => {
            node.addEventListener('mouseenter', () => {
                const type = node.getAttribute('data-node');
                if (flowDesc[type]) {
                    descEl.textContent = flowDesc[type];
                    descEl.style.opacity = '1';
                    descEl.classList.remove('text-textMuted');
                    descEl.classList.add('text-primary');
                }
            });
            node.addEventListener('mouseleave', () => {
                descEl.textContent = 'Interactive: Hover over nodes to trace data flow.';
                descEl.style.opacity = '0.5';
                descEl.classList.add('text-textMuted');
                descEl.classList.remove('text-primary');
            });
        });
    }

    drawArchitectureLines();

    // 12. Bot Form Tracker
    const botContainer = document.getElementById('bot-container');
    const botIcon = document.getElementById('bot-icon');
    const botText = document.getElementById('bot-text');
    const contactForm = document.querySelector('#contact form');

    if (botContainer && botIcon && contactForm) {
        const formInputs = contactForm.querySelectorAll('input, textarea');

        formInputs.forEach(input => {
            input.addEventListener('focus', () => {
                botText.textContent = "OBSERVING...";
                botText.classList.replace('text-primary', 'text-warning');
                botIcon.classList.replace('text-primary', 'text-warning');
                botContainer.classList.replace('opacity-90', 'opacity-100');
            });

            input.addEventListener('input', (e) => {
                botText.textContent = "SYNTHESIZING...";
                botText.classList.replace('text-warning', 'text-secondary');
                botIcon.classList.replace('text-warning', 'text-secondary');

                // Add a gentle pulse and glow
                botIcon.style.transform = `scale(1.15)`;
                botIcon.style.filter = `drop-shadow(0 0 8px var(--secondary))`;

                clearTimeout(botIcon.animTimeout);
                botIcon.animTimeout = setTimeout(() => {
                    botIcon.style.transform = `scale(1)`;
                    botIcon.style.filter = `none`;
                }, 300);
            });

            input.addEventListener('blur', () => {
                botText.textContent = "STANDBY...";
                botText.classList.remove('text-warning', 'text-secondary');
                botIcon.classList.remove('text-warning', 'text-secondary');
                botText.classList.add('text-primary');
                botIcon.classList.add('text-primary');
                botContainer.classList.replace('opacity-100', 'opacity-90');
                botIcon.style.transform = `translateY(0px) scale(1)`;
            });
        });
    }

});
