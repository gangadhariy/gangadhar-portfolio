/* ============================================================
   GANGADHAR I YALEHOLI — Portfolio Script
   Particle Background · Custom Cursor · Typewriter · Counters
   Scroll Reveals · Tilt Cards · Skill Bars · Mobile Nav
   ============================================================ */

(function () {
  'use strict';

  // ── CANVAS PARTICLE BACKGROUND ──────────────────────────
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');

  let W, H, particles = [], connections = [];

  function resizeCanvas() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.size = Math.random() * 1.5 + 0.3;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.pulseSpeed = Math.random() * 0.02 + 0.005;
      this.pulseOffset = Math.random() * Math.PI * 2;
    }
    update(t) {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > W) this.speedX *= -1;
      if (this.y < 0 || this.y > H) this.speedY *= -1;
      this.currentOpacity = this.opacity * (0.5 + 0.5 * Math.sin(t * this.pulseSpeed + this.pulseOffset));
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 229, 255, ${this.currentOpacity})`;
      ctx.fill();
    }
  }

  function initParticles() {
    const count = Math.min(Math.floor((W * H) / 12000), 120);
    particles = Array.from({ length: count }, () => new Particle());
  }
  initParticles();

  let mouseX = -9999, mouseY = -9999;
  window.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

  let animTime = 0;
  function animateCanvas() {
    requestAnimationFrame(animateCanvas);
    animTime++;
    ctx.clearRect(0, 0, W, H);

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 229, 255, ${0.07 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
      // Mouse connections
      const mdx = particles[i].x - mouseX;
      const mdy = particles[i].y - mouseY;
      const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
      if (mdist < 160) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(mouseX, mouseY);
        ctx.strokeStyle = `rgba(0, 229, 255, ${0.18 * (1 - mdist / 160)})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }

    particles.forEach(p => { p.update(animTime); p.draw(); });
  }
  animateCanvas();

  // ── CUSTOM CURSOR ────────────────────────────────────────
  const cursor = document.getElementById('cursor');
  const trail = document.getElementById('cursor-trail');
  let trailX = 0, trailY = 0;

  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateTrail() {
    trailX += (mouseX - trailX) * 0.12;
    trailY += (mouseY - trailY) * 0.12;
    trail.style.left = trailX + 'px';
    trail.style.top = trailY + 'px';
    requestAnimationFrame(animateTrail);
  }
  animateTrail();

  document.querySelectorAll('a, button, .skill-card, .contact-card, .btn, .badge').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width = '20px';
      cursor.style.height = '20px';
      trail.style.width = '50px';
      trail.style.height = '50px';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width = '12px';
      cursor.style.height = '12px';
      trail.style.width = '36px';
      trail.style.height = '36px';
    });
  });

  // ── NAV SCROLL ───────────────────────────────────────────
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });

  // ── MOBILE NAV ───────────────────────────────────────────
  const menuBtn = document.getElementById('nav-menu');
  const mobileNav = document.getElementById('mobile-nav');
  let menuOpen = false;

  menuBtn.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobileNav.classList.toggle('open', menuOpen);
    const spans = menuBtn.querySelectorAll('span');
    if (menuOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  document.querySelectorAll('.mob-link').forEach(link => {
    link.addEventListener('click', () => {
      menuOpen = false;
      mobileNav.classList.remove('open');
      menuBtn.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });

  // ── TYPEWRITER ───────────────────────────────────────────
  const roles = [
    'DevOps Engineer',
    'Kubernetes Architect',
    'AWS Cloud Specialist',
    'GitOps Practitioner',
    'Music Composer',
    'Infrastructure Automation'
  ];
  const typeEl = document.getElementById('role-typewriter');
  let roleIdx = 0, charIdx = 0, deleting = false, typeTimeout;

  function type() {
    const current = roles[roleIdx];
    if (!deleting) {
      typeEl.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) {
        deleting = true;
        typeTimeout = setTimeout(type, 2000);
        return;
      }
    } else {
      typeEl.textContent = current.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
      }
    }
    typeTimeout = setTimeout(type, deleting ? 50 : 90);
  }
  type();

  // ── COUNTER ANIMATION ────────────────────────────────────
  function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const duration = 1800;
    const start = performance.now();
    function step(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.floor(eased * target);
      if (t < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }

  // ── INTERSECTION OBSERVER ────────────────────────────────
  const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -60px 0px' };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal, .timeline-item').forEach(el => {
    revealObserver.observe(el);
  });

  // Skill bars
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.querySelectorAll('.skill-bar').forEach(bar => {
            bar.style.width = bar.dataset.width + '%';
          });
        }, 200);
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const skillsSection = document.getElementById('skills');
  if (skillsSection) skillObserver.observe(skillsSection);

  // Counters — trigger when stats visible
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.stat-num').forEach(el => animateCounter(el));
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) statsObserver.observe(heroStats);

  // Reveal sections
  document.querySelectorAll('.section-header, .about-grid, .skills-grid, .tech-badges, .music-layout, .contact-grid').forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });

  // ── SKILL CARD TILT ──────────────────────────────────────
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -8;
      const rotY = ((x - cx) / cx) * 8;
      card.style.transform = `translateY(-8px) scale(1.02) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      card.style.transformStyle = 'preserve-3d';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ── SMOOTH SCROLL & ACTIVE NAV ───────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
    });
  });

  // ── SECTION ACTIVE HIGHLIGHT IN NAV ─────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) current = section.id;
    });
    navLinks.forEach(link => {
      link.style.color = link.getAttribute('href') === '#' + current ? 'var(--cyan)' : '';
    });
  });

  // ── PAGE LOAD STAGGER ────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
      document.body.style.transition = 'opacity 0.5s ease';
      document.body.style.opacity = '1';
    }, 50);
  });

  // ── EXPERIENCE CARDS STAGGER ────────────────────────────
  const expItems = document.querySelectorAll('.timeline-item');
  const expObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 150);
        expObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  expItems.forEach(item => expObserver.observe(item));

  // ── BADGE HOVER WAVE ─────────────────────────────────────
  const badges = document.querySelectorAll('.badge');
  badges.forEach((badge, i) => {
    badge.style.animationDelay = `${i * 0.05}s`;
  });

  console.log('%cGangadhar I Yaleholi — Portfolio', 'color: #00e5ff; font-size: 16px; font-weight: bold;');
  console.log('%cDevOps Engineer & Music Composer', 'color: #64748b; font-size: 12px;');

})();