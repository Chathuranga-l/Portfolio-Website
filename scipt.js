// Three.js Scene Setup
        let scene, camera, renderer, particles, geometryParticles;
        let mouse = { x: 0, y: 0 };
        let time = 0;

        function initThreeJS() {
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setClearColor(0x0a0a1a, 0.1);
            document.getElementById('threejs-container').appendChild(renderer.domElement);

            // Create simple particle system
            createParticleSystem();

            camera.position.z = 30;
            animate();
        }

        function createParticleSystem() {
            const particleCount = 800;
            geometryParticles = new THREE.BufferGeometry();
            const positions = new Float32Array(particleCount * 3);
            const colors = new Float32Array(particleCount * 3);
            const velocities = new Float32Array(particleCount * 3);

            for (let i = 0; i < particleCount; i++) {
                // Random positions
                positions[i * 3] = (Math.random() - 0.5) * 100;
                positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
                positions[i * 3 + 2] = (Math.random() - 0.5) * 100;

                // Subtle colors - mostly white with hints of blue
                const colorChoice = Math.random();
                const color = new THREE.Color();
                if (colorChoice < 0.7) {
                    color.setHex(0xffffff); // White
                } else if (colorChoice < 0.9) {
                    color.setHex(0x6366f1); // Blue
                } else {
                    color.setHex(0x8b5cf6); // Purple
                }
                
                colors[i * 3] = color.r;
                colors[i * 3 + 1] = color.g;
                colors[i * 3 + 2] = color.b;

                // Random velocities for floating motion
                velocities[i * 3] = (Math.random() - 0.5) * 0.02;
                velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
                velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
            }

            geometryParticles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometryParticles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            geometryParticles.userData = { velocities: velocities };

            const material = new THREE.PointsMaterial({
                size: 1.5,
                vertexColors: THREE.VertexColors,
                transparent: true,
                opacity: 0.6,
                blending: THREE.AdditiveBlending,
                sizeAttenuation: true
            });

            particles = new THREE.Points(geometryParticles, material);
            scene.add(particles);
        }

        function animate() {
            requestAnimationFrame(animate);
            time += 0.005;

            if (particles) {
                const positions = particles.geometry.attributes.position.array;
                const velocities = particles.geometry.userData.velocities;

                // Gentle floating motion
                for (let i = 0; i < positions.length; i += 3) {
                    // Apply velocities
                    positions[i] += velocities[i];
                    positions[i + 1] += velocities[i + 1];
                    positions[i + 2] += velocities[i + 2];

                    // Add subtle wave motion
                    positions[i + 1] += Math.sin(time + positions[i] * 0.01) * 0.01;

                    // Boundary checking - wrap around
                    if (positions[i] > 50) positions[i] = -50;
                    if (positions[i] < -50) positions[i] = 50;
                    if (positions[i + 1] > 50) positions[i + 1] = -50;
                    if (positions[i + 1] < -50) positions[i + 1] = 50;
                    if (positions[i + 2] > 50) positions[i + 2] = -50;
                    if (positions[i + 2] < -50) positions[i + 2] = 50;
                }

                particles.geometry.attributes.position.needsUpdate = true;
                
                // Very subtle rotation
                particles.rotation.y += 0.0005;
                
                // Gentle mouse interaction
                particles.rotation.x += mouse.y * 0.00005;
                particles.rotation.y += mouse.x * 0.00005;
            }

            // Subtle camera movement
            camera.position.x += (mouse.x * 2 - camera.position.x) * 0.01;
            camera.position.y += (mouse.y * 2 - camera.position.y) * 0.01;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        }

        // Mouse movement tracking with smooth interpolation
        let targetMouse = { x: 0, y: 0 };
        let currentMouse = { x: 0, y: 0 };
        
        document.addEventListener('mousemove', (event) => {
            targetMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            targetMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        });

        // Smooth mouse interpolation
        function updateMouse() {
            currentMouse.x += (targetMouse.x - currentMouse.x) * 0.05;
            currentMouse.y += (targetMouse.y - currentMouse.y) * 0.05;
            mouse = currentMouse;
            requestAnimationFrame(updateMouse);
        }
        updateMouse();

        // Window resize handler
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // Scroll indicator
        function updateScrollIndicator() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = scrollTop / scrollHeight;
            
            document.getElementById('scrollIndicator').style.transform = `scaleX(${scrollPercent})`;
        }

        // Animate the main name with individual letter animation
        function animateMainName() {
            const nameElement = document.getElementById('animatedName');
            const nameText = nameElement.textContent;
            nameElement.innerHTML = '';
            
            // Split name into individual letters
            nameText.split('').forEach((letter, index) => {
                const span = document.createElement('span');
                span.className = 'letter';
                span.textContent = letter === ' ' ? '\u00A0' : letter; // Use non-breaking space
                span.style.animationDelay = `${index * 0.1}s`;
                nameElement.appendChild(span);
            });
        }

        // Mobile menu functionality
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const navLinks = document.getElementById('navLinks');

        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('nav')) {
                mobileMenuBtn.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Navbar background on scroll
        function updateNavbar() {
            const navbar = document.getElementById('navbar');
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(15, 15, 35, 0.9)';
            } else {
                navbar.style.background = 'var(--glass-bg)';
            }
        }

        // Enhanced Intersection Observer with staggered animations
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Staggered animation delay
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0) scale(1)';
                        entry.target.classList.add('animate-in');
                    }, index * 100);
                }
            });
        }, observerOptions);

        // Observe sections with enhanced animations
        document.querySelectorAll('.section').forEach((section, index) => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(60px) scale(0.95)';
            section.style.transition = 'all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            observer.observe(section);
        });

        // Animate project cards individually
        document.querySelectorAll('.project-card').forEach((card, index) => {
            card.style.setProperty('--card-index', index);
            card.style.opacity = '0';
            card.style.transform = 'translateY(40px) rotateX(10deg)';
            card.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            
            const cardObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0) rotateX(0deg)';
                        }, index * 200);
                    }
                });
            }, { threshold: 0.1 });
            
            cardObserver.observe(card);
        });

        // Animate skill items
        document.querySelectorAll('.skill-item').forEach((skill, index) => {
            skill.style.opacity = '0';
            skill.style.transform = 'scale(0.8) rotateY(20deg)';
            skill.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            
            const skillObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'scale(1) rotateY(0deg)';
                        }, index * 100);
                    }
                });
            }, { threshold: 0.3 });
            
            skillObserver.observe(skill);
        });

        // Contact form submission
        document.querySelector('.contact-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simulate form submission
            const button = this.querySelector('.btn');
            const originalText = button.textContent;
            button.textContent = 'Sending...';
            button.disabled = true;
            
            setTimeout(() => {
                button.textContent = 'Message Sent!';
                setTimeout(() => {
                    button.textContent = originalText;
                    button.disabled = false;
                    this.reset();
                }, 2000);
            }, 1500);
        });

        // Event listeners
        window.addEventListener('scroll', () => {
            updateScrollIndicator();
            updateNavbar();
        });

        // Initialize name animation when page loads
        window.addEventListener('load', () => {
            animateMainName();
            setTimeout(() => {
                document.getElementById('loadingScreen').classList.add('fade-out');
            }, 1000);
        });

        // Initialize Three.js when page loads
        window.addEventListener('load', initThreeJS);

        // Enhanced interactive hover effects with 3D transforms
        document.querySelectorAll('.project-card').forEach((card, index) => {
            card.addEventListener('mouseenter', function(e) {
                this.style.transform = 'translateY(-15px) rotateX(5deg) rotateY(5deg) scale(1.03)';
                this.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.4), 0 0 30px rgba(99, 102, 241, 0.3)';
                this.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            });
            
            card.addEventListener('mouseleave', function(e) {
                this.style.transform = 'translateY(0) rotateX(0deg) rotateY(0deg) scale(1)';
                this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
            });

            // Add mousemove for subtle 3D tilt effect
            card.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const deltaX = (e.clientX - centerX) / (rect.width / 2);
                const deltaY = (e.clientY - centerY) / (rect.height / 2);
                
                this.style.transform = `translateY(-15px) rotateX(${deltaY * -5}deg) rotateY(${deltaX * 5}deg) scale(1.03)`;
            });
        });

        document.querySelectorAll('.skill-item').forEach(skill => {
            skill.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px) scale(1.1) rotateZ(5deg)';
                this.style.boxShadow = '0 15px 30px rgba(99, 102, 241, 0.4)';
                this.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
            });
            
            skill.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1) rotateZ(0deg)';
                this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
            });
        });

        // Enhanced button hover effects
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-4px) scale(1.05)';
                this.style.boxShadow = '0 15px 35px rgba(99, 102, 241, 0.4)';
            });
            
            btn.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
                this.style.boxShadow = '0 5px 15px rgba(99, 102, 241, 0.2)';
            });
        });

        // Parallax effect for hero section
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const hero = document.querySelector('.hero');
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        });



        // Advanced Mode Controls
        const advancedToggle = document.getElementById('advancedToggle');
        const advancedPanel = document.getElementById('advancedPanel');
        let advancedMode = false;

        advancedToggle.addEventListener('click', () => {
            advancedMode = !advancedMode;
            advancedToggle.classList.toggle('active');
            advancedPanel.classList.toggle('active');
        });

        // Theme Controls
        document.querySelectorAll('.theme-option').forEach(option => {
            option.addEventListener('click', () => {
                document.querySelectorAll('.theme-option').forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                
                const theme = option.dataset.theme;
                updateTheme(theme);
            });
        });

        function updateTheme(theme) {
            const themes = {
                blue: { primary: '#6366f1', secondary: '#3b82f6' },
                purple: { primary: '#8b5cf6', secondary: '#ec4899' },
                green: { primary: '#10b981', secondary: '#06b6d4' },
                orange: { primary: '#f59e0b', secondary: '#ef4444' },
                cyan: { primary: '#06b6d4', secondary: '#8b5cf6' },
                pink: { primary: '#ec4899', secondary: '#f97316' }
            };

            if (themes[theme]) {
                document.documentElement.style.setProperty('--primary-color', themes[theme].primary);
                document.documentElement.style.setProperty('--secondary-color', themes[theme].secondary);
            }
        }
