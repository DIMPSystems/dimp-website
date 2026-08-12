const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('[data-menu-toggle]');
const navigation = document.querySelector('[data-nav]');
const form = document.querySelector('[data-contact-form]');
const formStatus = document.querySelector('[data-form-status]');
const menuLabel = menuToggle.querySelector('.sr-only');
const menuLinks = Array.from(navigation.querySelectorAll('a'));
let lockedScrollY = 0;
let isScrollLocked = false;

const isMobileNavigation = () => window.matchMedia('(max-width: 900px)').matches;
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

form.addEventListener('submit', (event) => {
  event.preventDefault();
  formStatus.textContent = 'La consulta todavía no se envió. Por ahora, podés escribirnos por email.';
});

document.querySelector('[data-year]').textContent = new Date().getFullYear();
