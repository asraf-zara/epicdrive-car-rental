(() => {
  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];

  // Current year
  const yearEl = qs('#currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Header scroll state
  const header = qs('#siteHeader');
  const onScroll = () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 20);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile navigation
  const menuBtn = qs('#mobileMenuBtn');
  const mobileNav = qs('#mobileNav');
  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', () => {
      const open = mobileNav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(open));
    });
    qsa('a', mobileNav).forEach(link => link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    }));
  }

  // Reveal on scroll
  const revealItems = qsa('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('visible'));
  }

  // Intro screen - only once per browser session
  const intro = qs('#introScreen');
  const skipIntro = qs('#skipIntro');
  const closeIntro = () => {
    if (!intro) return;
    intro.classList.add('hide');
    sessionStorage.setItem('epicdriveIntroSeen', '1');
  };
  if (intro) {
    if (sessionStorage.getItem('epicdriveIntroSeen') === '1') {
      intro.classList.add('hide');
    } else {
      setTimeout(closeIntro, 2100);
    }
    if (skipIntro) skipIntro.addEventListener('click', closeIntro);
  }

  // Booking drawer
  const bookingOverlay = qs('#bookingOverlay');
  const bookingPanel = qs('#bookingPanel');
  const bookingClose = qs('#bookingClose');
  const bookingCarName = qs('#bookingCarName');
  const bookingCarPrice = qs('#bookingCarPrice');
  const bookingWhatsappBtn = qs('#bookingWhatsappBtn');

  function openBooking(name, price) {
    if (!bookingPanel || !bookingOverlay) return;
    if (bookingCarName) bookingCarName.textContent = name || 'General Booking';
    if (bookingCarPrice) bookingCarPrice.textContent = price || 'Choose your vehicle';

    if (bookingWhatsappBtn && window.EPICDRIVE) {
      const message = name === 'General Booking'
        ? 'Hello EPICDRIVE, I would like to ask about renting a car. Please share the available vehicles and rental details.'
        : `Hello EPICDRIVE, I am interested in renting the ${name}. Please confirm availability and rental details.`;
      bookingWhatsappBtn.href = `https://wa.me/${window.EPICDRIVE.whatsappNumber}?text=${encodeURIComponent(message)}`;
    }

    bookingPanel.classList.add('open');
    bookingOverlay.classList.add('open');
    bookingPanel.setAttribute('aria-hidden', 'false');
    bookingOverlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
  }

  function closeBooking() {
    if (!bookingPanel || !bookingOverlay) return;
    bookingPanel.classList.remove('open');
    bookingOverlay.classList.remove('open');
    bookingPanel.setAttribute('aria-hidden', 'true');
    bookingOverlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
  }

  qsa('.js-open-booking').forEach(btn => {
    btn.addEventListener('click', () => openBooking(btn.dataset.car, btn.dataset.price));
  });
  bookingClose?.addEventListener('click', closeBooking);
  bookingOverlay?.addEventListener('click', closeBooking);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeBooking();
  });

  // Home fleet switcher
  if (window.CAR_DATA && qs('#fleetShowcase')) {
    const tabs = qsa('.fleet-tab');
    const stage = qs('#fleetCarStage');
    const image = qs('#fleetCarImage');
    const category = qs('#fleetCategory');
    const brand = qs('#fleetBrand');
    const name = qs('#fleetName');
    const tagline = qs('#fleetTagline');
    const specs = qs('#fleetSpecs');
    const price = qs('#fleetPrice');
    const viewLink = qs('#fleetViewLink');
    const bookBtn = qs('#fleetBookBtn');

    function renderCar(index) {
      const car = window.CAR_DATA[index];
      if (!car) return;
      tabs.forEach((t, i) => t.classList.toggle('active', i === index));
      stage?.classList.add('switching');

      setTimeout(() => {
        if (image) {
          image.src = car.image;
          image.alt = `${car.brand} ${car.name}`;
        }
        if (category) category.textContent = car.category;
        if (brand) brand.textContent = car.brand;
        if (name) name.textContent = car.name;
        if (tagline) tagline.textContent = car.tagline;
        if (specs) specs.innerHTML = `<span>${car.seats}</span><span>${car.transmission}</span><span>${car.fuel}</span>`;
        if (price) price.textContent = car.price;
        if (viewLink) viewLink.href = `/cars/${car.slug}`;
        if (bookBtn) {
          bookBtn.dataset.car = `${car.brand} ${car.name}`;
          bookBtn.dataset.price = car.price;
        }
        stage?.classList.remove('switching');
      }, 220);
    }

    tabs.forEach((tab, index) => tab.addEventListener('click', () => renderCar(index)));
  }

  // Lightweight 3D pointer parallax for desktop
  const canHover = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  if (canHover) {
    qsa('.car-parallax').forEach(el => {
      const depth = Number(el.dataset.depth || 12);
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5;
        const y = (e.clientY - r.top) / r.height - .5;
        el.style.transform = `perspective(1100px) rotateY(${x * depth}deg) rotateX(${-y * depth * .55}deg) translateZ(0)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'perspective(1100px) rotateY(0deg) rotateX(0deg)';
      });
    });
  }

  // ===== EPICDRIVE Motion Pack =====
  // Scroll progress
  const progress = document.createElement('div');
  progress.className = 'motion-progress';
  document.body.appendChild(progress);
  const updateProgress = () => {
    const doc = document.documentElement;
    const max = Math.max(1, doc.scrollHeight - window.innerHeight);
    const value = Math.min(1, Math.max(0, window.scrollY / max));
    progress.style.transform = `scaleX(${value})`;
  };
  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });

  // Cursor glow for desktop
  if (canHover) {
    const glow = document.createElement('div');
    glow.className = 'motion-cursor-glow';
    document.body.appendChild(glow);
    window.addEventListener('pointermove', e => {
      glow.style.left = `${e.clientX}px`;
      glow.style.top = `${e.clientY}px`;
      glow.classList.add('visible');
    }, { passive: true });
    document.addEventListener('mouseleave', () => glow.classList.remove('visible'));
  }

  // Ripple + press feedback
  const interactiveSelectors = '.button, .nav-book-btn, .fleet-tab, .process-card, .catalog-card, .hero-stack, .brand';
  qsa(interactiveSelectors).forEach(el => {
    el.addEventListener('pointerdown', e => {
      el.classList.add('is-pressed', 'touch-flash');
      const r = el.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'motion-ripple';
      ripple.style.left = `${e.clientX - r.left}px`;
      ripple.style.top = `${e.clientY - r.top}px`;
      el.appendChild(ripple);
      setTimeout(() => ripple.remove(), 760);
      setTimeout(() => el.classList.remove('touch-flash'), 460);
    });
    const release = () => el.classList.remove('is-pressed');
    el.addEventListener('pointerup', release);
    el.addEventListener('pointercancel', release);
    el.addEventListener('pointerleave', release);
  });

  // Magnetic buttons on desktop
  if (canHover) {
    qsa('.button, .nav-book-btn, .brand').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        const strength = el.classList.contains('brand') ? 0.08 : 0.14;
        el.style.setProperty('--mag-x', `${x * strength}px`);
        el.style.setProperty('--mag-y', `${y * strength}px`);
      });
      el.addEventListener('pointerleave', () => {
        el.style.setProperty('--mag-x', '0px');
        el.style.setProperty('--mag-y', '0px');
      });
    });
  }

  // Tilt on touch / drag for hero cars and cards
  qsa('.hero-stack, .process-card, .catalog-card').forEach(el => {
    const isHero = el.classList.contains('hero-stack');
    const setTilt = e => {
      const r = el.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
      const y = Math.max(0, Math.min(1, (e.clientY - r.top) / r.height));
      const ry = (x - .5) * 12;
      const rx = (.5 - y) * 8;
      if (isHero) {
        el.style.setProperty('--tilt-x', `${rx}deg`);
        el.style.setProperty('--tilt-y', `${ry}deg`);
      } else {
        el.style.setProperty('--card-x', `${rx}deg`);
        el.style.setProperty('--card-y', `${ry}deg`);
      }
    };
    el.addEventListener('pointerdown', e => {
      if (e.pointerType !== 'mouse') {
        el.classList.add('touch-active');
        setTilt(e);
      }
    });
    el.addEventListener('pointermove', e => {
      if (el.classList.contains('touch-active')) setTilt(e);
    });
    const resetTilt = () => {
      el.classList.remove('touch-active');
      if (isHero) {
        el.style.setProperty('--tilt-x', '0deg');
        el.style.setProperty('--tilt-y', '0deg');
      } else {
        el.style.setProperty('--card-x', '0deg');
        el.style.setProperty('--card-y', '0deg');
      }
    };
    el.addEventListener('pointerup', resetTilt);
    el.addEventListener('pointercancel', resetTilt);
  });

})();