// Cabinet YAH — script principal

document.addEventListener('DOMContentLoaded', () => {
  // Menu mobile
  const toggle = document.querySelector('.nav__toggle');
  const nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => nav.classList.toggle('open'));
    nav.querySelectorAll('.nav__links a').forEach(link => {
      link.addEventListener('click', () => nav.classList.remove('open'));
    });
  }

  // Lien de navigation actif selon la page courante
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === current) link.classList.add('active');
  });

  // Année dynamique dans le footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Animation d'apparition au scroll
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  // Effet d'ombre sur l'en-tête au défilement
  const header = document.querySelector('.header');
  const backToTop = document.createElement('button');
  backToTop.className = 'back-to-top';
  backToTop.setAttribute('aria-label', 'Retour en haut de page');
  backToTop.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>';
  document.body.appendChild(backToTop);

  const onScroll = () => {
    const scrolled = window.scrollY > 40;
    if (header) header.classList.toggle('is-scrolled', scrolled);
    backToTop.classList.toggle('is-visible', window.scrollY > 500);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Formulaire de contact (envoi via client mail, sans backend)
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const nom = data.get('nom') || '';
      const email = data.get('email') || '';
      const telephone = data.get('telephone') || '';
      const objet = data.get('objet') || 'Demande de contact';
      const message = data.get('message') || '';

      const body = `Nom : ${nom}%0D%0AEmail : ${email}%0D%0ATéléphone : ${telephone}%0D%0A%0D%0A${message}`;
      const mailto = `mailto:maitremaho07@gmail.com?subject=${encodeURIComponent(objet)}&body=${body}`;

      const successBox = document.querySelector('.form-success');
      if (successBox) successBox.classList.add('show');

      window.location.href = mailto;
    });
  }
});
