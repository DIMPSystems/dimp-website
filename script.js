const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('[data-menu-toggle]');
const navigation = document.querySelector('[data-nav]');
const form = document.querySelector('[data-contact-form]');
const formStatus = document.querySelector('[data-form-status]');
const menuLabel = menuToggle.querySelector('.sr-only');

const isMobileNavigation = () => window.matchMedia('(max-width: 900px)').matches;

const closeMenu = ({ returnFocus = false } = {}) => {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuLabel.textContent = 'Abrir menú';
  navigation.classList.remove('open');
  document.body.classList.remove('menu-open');
  if (isMobileNavigation()) navigation.setAttribute('inert', '');
  if (returnFocus) menuToggle.focus();
};

menuToggle.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  menuLabel.textContent = isOpen ? 'Abrir menú' : 'Cerrar menú';
  navigation.classList.toggle('open', !isOpen);
  document.body.classList.toggle('menu-open', !isOpen);
  if (isOpen) navigation.setAttribute('inert', '');
  else navigation.removeAttribute('inert');
});

navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
    closeMenu({ returnFocus: true });
  }
});

const syncNavigation = () => {
  if (isMobileNavigation()) {
    if (menuToggle.getAttribute('aria-expanded') !== 'true') navigation.setAttribute('inert', '');
  } else {
    navigation.removeAttribute('inert');
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
