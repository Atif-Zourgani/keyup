/* KeyUp! – interactions légères (aucune dépendance) */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  var header = document.querySelector('.site-header');
  var burger = document.querySelector('.burger');
  var nav = document.getElementById('main-nav');

  /* Ombre du header après un peu de scroll */
  function onScroll() {
    if (header) header.classList.toggle('scrolled', window.scrollY > 8);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* Menu mobile */
  function setMenu(open) {
    if (!burger || !nav) return;
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    nav.classList.toggle('open', open);
  }
  if (burger) {
    burger.addEventListener('click', function () {
      setMenu(burger.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { setMenu(false); burger.focus(); }
    });
  }

  /* Apparition au scroll */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* Lien actif dans le menu */
  var links = document.querySelectorAll('.main-nav ul a');
  var map = {};
  links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var a = map[en.target.id];
        if (!a) return;
        if (en.isIntersecting) {
          links.forEach(function (l) { l.classList.remove('active'); l.removeAttribute('aria-current'); });
          a.classList.add('active');
          a.setAttribute('aria-current', 'true');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(function (id) {
      var s = document.getElementById(id);
      if (s) spy.observe(s);
    });
  }

  /* Pré-sélection de l'offre depuis les boutons des cartes */
  var select = document.getElementById('f-offer');
  document.querySelectorAll('[data-offer]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (select) select.value = btn.getAttribute('data-offer');
    });
  });

  /* Formulaire : validation côté navigateur (mode démonstration) */
  var form = document.getElementById('contact-form');
  var status = document.getElementById('form-status');

  function fieldError(id, msg) {
    var input = document.getElementById(id);
    var err = document.getElementById('e-' + id.replace('f-', ''));
    if (err) err.textContent = msg || '';
    if (input) {
      input.classList.toggle('invalid', Boolean(msg));
      if (msg) input.setAttribute('aria-invalid', 'true'); else input.removeAttribute('aria-invalid');
    }
    return !msg;
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      status.textContent = ''; status.className = 'form-status';

      var name = form.elements.name.value.trim();
      var email = form.elements.email.value.trim();
      var msg = form.elements.message.value.trim();
      var rgpd = form.elements.rgpd.checked;

      var ok = true;
      var firstBad = null;
      function check(valid, id, text) {
        var r = fieldError(id, valid ? '' : text);
        if (!r && !firstBad) firstBad = document.getElementById(id);
        ok = ok && r;
      }
      check(name.length > 1, 'f-name', 'Merci d’indiquer votre nom.');
      check(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email), 'f-email', 'Merci d’indiquer une adresse e-mail valide.');
      check(msg.length > 9, 'f-msg', 'Quelques mots suffisent (10 caractères minimum).');
      check(rgpd, 'f-rgpd', 'Merci de cocher la case pour que je puisse vous répondre.');

      if (!ok) { if (firstBad) firstBad.focus(); return; }

      /* MODE DÉMO : à relier plus tard à un vrai service d'envoi (Formspree, Netlify Forms, backend…) */
      status.textContent = 'Merci ' + name.split(' ')[0] + ' ! Votre message est bien noté (version de démonstration : rien n’est encore envoyé).';
      status.classList.add('ok');
      form.reset();
    });

    form.addEventListener('input', function (e) {
      var id = e.target.id;
      if (id && e.target.classList.contains('invalid')) fieldError(id, '');
    });
  }

  /* Année du pied de page */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
