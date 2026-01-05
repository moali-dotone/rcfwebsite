const navToggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('primary-nav');
const overlay = document.querySelector('.nav-overlay');
const focusableSelectors = 'a[href], button:not([disabled]), textarea, input, select';

const trapFocus = (event) => {
  if (!nav.classList.contains('open')) return;
  const focusable = nav.querySelectorAll(focusableSelectors);
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.key === 'Tab') {
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  if (event.key === 'Escape') {
    closeMenu();
    navToggle.focus();
  }
};

function openMenu() {
  nav.classList.add('open');
  navToggle.setAttribute('aria-expanded', 'true');
  overlay.hidden = false;
  document.body.style.overflow = 'hidden';
  const firstLink = nav.querySelector('a, button');
  if (firstLink) firstLink.focus();
  nav.addEventListener('keydown', trapFocus);
}

function closeMenu() {
  nav.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
  overlay.hidden = true;
  document.body.style.overflow = '';
  nav.removeEventListener('keydown', trapFocus);
}

function toggleMenu() {
  if (nav.classList.contains('open')) {
    closeMenu();
  } else {
    openMenu();
  }
}

navToggle?.addEventListener('click', toggleMenu);
overlay?.addEventListener('click', closeMenu);
window.addEventListener('resize', () => {
  if (window.innerWidth > 900 && nav.classList.contains('open')) {
    closeMenu();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && nav.classList.contains('open')) {
    closeMenu();
    navToggle.focus();
  }
});

nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    if (nav.classList.contains('open')) {
      closeMenu();
    }
  });
});

const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

const form = document.getElementById('quote-form');
const status = form?.querySelector('.form__status');

if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (status) {
      status.textContent = '';
      status.classList.remove('error', 'success');
    }

    let valid = true;
    const requiredFields = form.querySelectorAll('[required]');

    requiredFields.forEach((field) => {
      field.classList.remove('has-error');
      if (!field.value.trim()) {
        valid = false;
        field.classList.add('has-error');
      }
      if (field.type === 'email') {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (field.value && !emailPattern.test(field.value.trim())) {
          valid = false;
          field.classList.add('has-error');
        }
      }
    });

    if (!valid) {
      form.reportValidity();
      if (status) {
        status.textContent = 'Please complete all required fields with valid details.';
        status.classList.add('error');
      }
      return;
    }

    if (status) {
      status.textContent = 'Thank you. Your request has been captured—our team will respond shortly.';
      status.classList.add('success');
    }
    form.reset();
  });
}