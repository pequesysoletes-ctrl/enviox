// ══════════ NAVBAR SCROLL ══════════
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  if (currentScroll > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  lastScroll = currentScroll;
}, { passive: true });

// ══════════ MOBILE MENU ══════════
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');

menuBtn.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  menuBtn.textContent = navLinks.classList.contains('open') ? '✕' : '☰';
});

// Close menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuBtn.textContent = '☰';
  });
});

// ══════════ SCROLL REVEAL ══════════
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// ══════════ COUNTER ANIMATION ══════════
const counters = document.querySelectorAll('[data-target]');

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target);
      const duration = 2000;
      const start = performance.now();

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);

        if (target >= 1000) {
          el.textContent = current.toLocaleString('es-ES') + '+';
        } else {
          el.textContent = current + '+';
        }

        if (progress < 1) {
          requestAnimationFrame(update);
        }
      }
      requestAnimationFrame(update);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

counters.forEach(el => counterObserver.observe(el));

// ══════════ FAQ ACCORDION ══════════
document.querySelectorAll('.faq-question').forEach(question => {
  question.addEventListener('click', () => {
    const item = question.parentElement;
    const answer = item.querySelector('.faq-answer');
    const isActive = item.classList.contains('active');

    // Close all
    document.querySelectorAll('.faq-item').forEach(faq => {
      faq.classList.remove('active');
      faq.querySelector('.faq-answer').style.maxHeight = '0';
    });

    // Open clicked (if wasn't active)
    if (!isActive) {
      item.classList.add('active');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
});

// ══════════ PRICING TABS ══════════
document.querySelectorAll('.pricing-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    // Update active tab
    document.querySelectorAll('.pricing-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    // Show corresponding panel
    const product = tab.dataset.product;
    document.querySelectorAll('.pricing-panel').forEach(panel => {
      panel.classList.remove('active');
    });
    document.getElementById(`panel-${product}`).classList.add('active');
  });
});

// ══════════ SMOOTH SCROLL ══════════
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ══════════ PRODUCT CARD TILT (desktop) ══════════
if (window.matchMedia('(hover: hover)').matches) {
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-6px) perspective(800px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// ══════════ PARALLAX ORBS ══════════
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const orbs = document.querySelectorAll('.hero-orb');
  orbs.forEach((orb, i) => {
    const speed = 0.15 + (i * 0.05);
    orb.style.transform = `translateY(${scrolled * speed}px)`;
  });
}, { passive: true });

// ══════════ COOKIE CONSENT ══════════
(function() {
  const banner = document.getElementById('cookieBanner');
  if (!banner) return;

  const consent = localStorage.getItem('enviox_cookies');
  if (consent) return; // Already answered

  // Show banner after a short delay
  setTimeout(() => {
    banner.classList.add('visible');
  }, 1500);

  const accept = document.getElementById('cookieAccept');
  const reject = document.getElementById('cookieReject');

  function hideBanner(value) {
    localStorage.setItem('enviox_cookies', value);
    banner.classList.remove('visible');
  }

  if (accept) accept.addEventListener('click', () => hideBanner('all'));
  if (reject) reject.addEventListener('click', () => hideBanner('essential'));
})();
