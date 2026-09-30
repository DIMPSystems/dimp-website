const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('[data-menu-toggle]');
const navigation = document.querySelector('[data-nav]');
const form = document.querySelector('[data-contact-form]');
const formStatus = document.querySelector('[data-form-status]');
const menuLabel = menuToggle.querySelector('.sr-only');
const menuLinks = Array.from(navigation.querySelectorAll('a'));
let lockedScrollY = 0;
let isScrollLocked = false;

const isMobileNavigation = () => window.matchMedia('(max-width: 899.98px)').matches;
const isMenuOpen = () => menuToggle.getAttribute('aria-expanded') === 'true';

const focusElement = (element) => {
  if (!element) return;

  try {
    element.focus({ preventScroll: true });
  } catch {
    element.focus();
  }
};

const setNavigationAvailability = (isAvailable) => {
  if (isAvailable) {
    navigation.removeAttribute('inert');
    navigation.removeAttribute('aria-hidden');
    return;
  }

  navigation.setAttribute('inert', '');
  navigation.setAttribute('aria-hidden', 'true');
};

const lockBodyScroll = () => {
  if (isScrollLocked) return;

  lockedScrollY = window.scrollY || document.documentElement.scrollTop;
  document.documentElement.classList.add('menu-open');
  document.body.classList.add('menu-open');
  document.body.style.top = `-${lockedScrollY}px`;
  isScrollLocked = true;
};

const unlockBodyScroll = () => {
  if (!isScrollLocked) return;

  document.documentElement.classList.remove('menu-open');
  document.body.classList.remove('menu-open');
  document.body.style.top = '';
  const scrollBehavior = document.documentElement.style.scrollBehavior;
  document.documentElement.style.scrollBehavior = 'auto';
  window.scrollTo({ top: lockedScrollY, left: 0, behavior: 'auto' });
  document.documentElement.style.scrollBehavior = scrollBehavior;
  isScrollLocked = false;
};

const openMenu = () => {
  menuToggle.setAttribute('aria-expanded', 'true');
  menuLabel.textContent = 'Cerrar menú';
  navigation.classList.add('open');
  setNavigationAvailability(true);
  lockBodyScroll();
  window.requestAnimationFrame(() => focusElement(menuLinks[0]));
};

const closeMenu = ({ returnFocus = false } = {}) => {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuLabel.textContent = 'Abrir menú';
  navigation.classList.remove('open');
  setNavigationAvailability(!isMobileNavigation());
  unlockBodyScroll();
  if (returnFocus) focusElement(menuToggle);
};

menuToggle.addEventListener('click', () => {
  if (isMenuOpen()) closeMenu({ returnFocus: true });
  else openMenu();
});

menuLinks.forEach((link) => link.addEventListener('click', () => closeMenu({ returnFocus: true })));

document.addEventListener('keydown', (event) => {
  if (!isMobileNavigation() || !isMenuOpen()) return;

  if (event.key === 'Escape') {
    event.preventDefault();
    closeMenu({ returnFocus: true });
    return;
  }

  if (event.key !== 'Tab') return;

  const focusableElements = [menuToggle, ...menuLinks];
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  if (event.shiftKey && document.activeElement === firstFocusable) {
    event.preventDefault();
    focusElement(lastFocusable);
  } else if (!event.shiftKey && document.activeElement === lastFocusable) {
    event.preventDefault();
    focusElement(firstFocusable);
  }
});

const syncNavigation = () => {
  if (isMobileNavigation()) {
    setNavigationAvailability(isMenuOpen());
  } else {
    closeMenu();
  }
};

window.addEventListener('resize', syncNavigation, { passive: true });
syncNavigation();

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 16);
}, { passive: true });

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

// ---------------------------------------------------------------------------
// Formulario de contacto → Google Apps Script (guarda en una Google Sheet y
// avisa por email). Pegar acá la URL del Web App publicado (termina en /exec).
// Ver apps-script/README.md para el paso a paso.
// ---------------------------------------------------------------------------
const FORM_ENDPOINT = 'https://script.google.com/macros/s/AKfycbx6XQbqfsn1NGsq1f7nl7mz6Coo5KVD9CPsrpmFqxqZMJNul7xTiWhaZxHcH1enDOlc/exec';

const submitButton = form.querySelector('[data-submit]');
const submitLabel = submitButton.innerHTML;
const FALLBACK_HTML = 'También podés escribirnos a <a href="mailto:dimpsystems@gmail.com">dimpsystems@gmail.com</a> o por <a href="https://wa.me/5491149172740" target="_blank" rel="noopener">WhatsApp</a>.';

const setStatus = (type, html) => {
  formStatus.className = `form-status ${type ? `is-${type}` : ''}`;
  formStatus.innerHTML = html;
};

const validateForm = () => {
  let firstInvalid = null;
  form.querySelectorAll('input[required], textarea[required]').forEach((field) => {
    const isValid = field.value.trim() !== '' && field.checkValidity();
    field.setAttribute('aria-invalid', String(!isValid));
    if (!isValid && !firstInvalid) firstInvalid = field;
  });
  return firstInvalid;
};

form.addEventListener('input', (event) => {
  if (event.target.getAttribute('aria-invalid') === 'true' && event.target.checkValidity() && event.target.value.trim()) {
    event.target.setAttribute('aria-invalid', 'false');
  }
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const firstInvalid = validateForm();
  if (firstInvalid) {
    setStatus('error', 'Revisá los campos marcados: nombre, un email válido y tu mensaje.');
    focusElement(firstInvalid);
    return;
  }

  if (!FORM_ENDPOINT) {
    setStatus('error', `El formulario todavía no está conectado. ${FALLBACK_HTML}`);
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = 'Enviando…';
  setStatus('', '');

  try {
    // Envío como formulario simple (sin headers custom) para que Apps Script lo
    // acepte sin preflight de CORS y lo lea desde e.parameter.
    const response = await fetch(FORM_ENDPOINT, { method: 'POST', body: new URLSearchParams(new FormData(form)) });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.ok) throw new Error(result.error || `HTTP ${response.status}`);

    form.reset();
    form.querySelectorAll('[aria-invalid]').forEach((field) => field.removeAttribute('aria-invalid'));
    setStatus('ok', '¡Gracias! Recibimos tu consulta y te vamos a responder a la brevedad.');
  } catch (error) {
    console.error('No se pudo enviar el formulario:', error);
    setStatus('error', `No pudimos enviar tu consulta. ${FALLBACK_HTML}`);
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = submitLabel;
  }
});

document.querySelector('[data-year]').textContent = new Date().getFullYear();

// ---------------------------------------------------------------------------
// Pequeños toques de movimiento con intención (no decorativos por defecto):
// las cifras del caso "22h → 2h" cuentan al entrar en pantalla, y la foto del
// hero tiene una profundidad sutil al scrollear. Ambos respetan "reducir
// movimiento".
// ---------------------------------------------------------------------------
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const countElements = document.querySelectorAll('[data-count-to]');
if (countElements.length && !prefersReducedMotion) {
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      countObserver.unobserve(entry.target);

      const target = Number(entry.target.dataset.countTo);
      const duration = 900;
      const start = performance.now();

      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        entry.target.textContent = Math.round(target * eased);
        if (progress < 1) window.requestAnimationFrame(step);
      };

      window.requestAnimationFrame(step);
    });
  }, { threshold: 0.6 });

  countElements.forEach((element) => countObserver.observe(element));
}

const heroPhotoImg = document.querySelector('.hero-bg img');
if (heroPhotoImg && !prefersReducedMotion) {
  let ticking = false;

  const updateHeroParallax = () => {
    const heroSection = heroPhotoImg.closest('.hero');
    if (heroSection) {
      const rect = heroSection.getBoundingClientRect();
      const offset = Math.min(Math.max(rect.top * -0.06, -18), 18);
      heroPhotoImg.style.transform = `translateY(${offset}px) scale(1.08)`;
    }
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateHeroParallax);
      ticking = true;
    }
  }, { passive: true });

  updateHeroParallax();
}
