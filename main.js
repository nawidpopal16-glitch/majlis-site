(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scrollBehavior = reduceMotion ? 'auto' : 'smooth';

  /* ── nav background ── */
  const nav = $('#nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── reveal on scroll ── */
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal').forEach(el => revealObs.observe(el));

  /* ── scroll-spy: underline the section in view ── */
  const navLinks = $$('.nav-links a');
  const spyObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      navLinks.forEach(a => {
        if (a.getAttribute('href') === '#' + e.target.id) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  ['top', 'about', 'venue', 'services', 'gallery', 'reviews', 'contact'].forEach(id => {
    const el = document.getElementById(id);
    if (el) spyObs.observe(el);
  });

  /* ── mobile menu ── */
  const menu = $('#menu');
  $('.nav-toggle').addEventListener('click', () => menu.showModal());
  $('.menu-close').addEventListener('click', () => menu.close());
  menu.addEventListener('click', e => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    e.preventDefault();
    menu.close();
    const hash = link.getAttribute('href');
    history.pushState(null, '', hash);
    requestAnimationFrame(() => document.querySelector(hash)?.scrollIntoView({ behavior: scrollBehavior }));
  });
  matchMedia('(min-width: 961px)').addEventListener('change', e => { if (e.matches && menu.open) menu.close(); });

  /* ── hero video: pause control, reduced motion, off-screen pause ── */
  const video = $('#heroVideo');
  const motionBtn = $('#heroMotion');
  let userPaused = reduceMotion || Boolean(navigator.connection?.saveData);
  const syncVideo = playIfAllowed => {
    motionBtn.setAttribute('aria-pressed', String(userPaused));
    motionBtn.setAttribute('aria-label', userPaused ? 'Play background video' : 'Pause background video');
    if (userPaused || !playIfAllowed) video.pause();
    else video.play().catch(() => {});
  };
  if (userPaused) video.removeAttribute('autoplay');
  syncVideo(true);
  motionBtn.addEventListener('click', () => { userPaused = !userPaused; syncVideo(true); });

  /* ── mobile action bar: shown between the hero and the enquiry form ── */
  const actionBar = $('#actionBar');
  const inView = { hero: true, contact: false, footer: false };
  const updateBar = () => actionBar.classList.toggle('show', !inView.hero && !inView.contact && !inView.footer);
  const barObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      const key = e.target.dataset.watch;
      inView[key] = e.isIntersecting;
      if (key === 'hero') syncVideo(e.isIntersecting);
    });
    updateBar();
  }, { threshold: 0.05 });
  $('.hero').dataset.watch = 'hero';
  $('.contact-card').dataset.watch = 'contact';
  $('.footer').dataset.watch = 'footer';
  [$('.hero'), $('.contact-card'), $('.footer')].forEach(el => barObs.observe(el));

  /* ── enquiry form ── */
  const form = $('#enquiryForm');
  const success = $('#formSuccess');
  const status = $('#formStatus');
  const submitBtn = $('.form-submit', form);
  const dateInput = $('#event-date');
  form.noValidate = true;

  const pad = n => String(n).padStart(2, '0');
  const now = new Date();
  const todayISO = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  dateInput.min = todayISO;

  // any link marked data-event preselects that occasion in the form
  document.addEventListener('click', e => {
    const link = e.target.closest('[data-event]');
    if (!link) return;
    const radio = $$('input[name="event_type"]', form).find(r => r.value === link.dataset.event);
    if (!radio) return;
    radio.checked = true;
    const chip = radio.closest('.chip');
    chip.classList.remove('pulse');
    void chip.offsetWidth;
    chip.classList.add('pulse');
  });

  const rules = {
    name: v => v.trim().length >= 2 ? '' : 'Please tell us your name.',
    email: v => {
      if (!v.trim()) return 'Please add your email so we can reply.';
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'That email doesn’t look quite right.';
    },
    event_date: v => (!v || v >= todayISO) ? '' : 'Please choose a date that hasn’t passed.',
  };
  let attempted = false;

  const check = input => {
    const msg = rules[input.name](input.value);
    const errorEl = document.getElementById(input.id + '-error');
    input.setAttribute('aria-invalid', String(Boolean(msg)));
    if (errorEl) errorEl.textContent = msg;
    return !msg;
  };
  const checked = Object.keys(rules).map(name => form.elements[name]);
  checked.forEach(input => {
    input.addEventListener('blur', () => { if (attempted || input.value) check(input); });
    input.addEventListener('input', () => { if (input.getAttribute('aria-invalid') === 'true') check(input); });
  });

  const occasionPhrase = {
    'Wedding / Walima': 'wedding or walima',
    'Nikkah': 'Nikkah',
    'Engagement': 'engagement',
    'Eid gathering': 'Eid gathering',
    'Aqeeqah': 'Aqeeqah',
    'Birthday': 'birthday',
    'Corporate': 'corporate event',
  };
  const describe = data => {
    const parts = [];
    const event = occasionPhrase[data.get('event_type')];
    const guests = data.get('guests');
    const date = data.get('event_date');
    if (event) parts.push(`your ${event}`);
    if (date) {
      const [y, m, d] = date.split('-').map(Number);
      parts.push('on ' + new Date(y, m - 1, d).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }));
    }
    if (guests) parts.push(`for ${guests} guests`);
    const about = parts.length ? ` about ${parts.join(' ')}` : '';
    return `We've received your enquiry${about}. Our team will reply to ${data.get('email').trim()} soon to arrange your viewing.`;
  };

  form.addEventListener('submit', async e => {
    e.preventDefault();
    attempted = true;
    status.textContent = '';
    const invalid = checked.filter(input => !check(input));
    if (invalid.length) { invalid[0].focus(); return; }

    const data = new FormData(form);
    submitBtn.disabled = true;
    submitBtn.classList.add('is-sending');
    $('.form-submit-text', submitBtn).textContent = 'Sending…';
    try {
      const res = await fetch(form.getAttribute('action') || '/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data).toString(),
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      // a plain static server answers the POST by echoing this page back; nothing was captured
      if ((await res.text()).includes('id="enquiryForm"')) throw new Error('No form handler on this host');
      const first = data.get('name').trim().split(/\s+/)[0];
      $('#successName').textContent = first ? `, ${first}` : '';
      $('#successSummary').textContent = describe(data);
      form.hidden = true;
      success.hidden = false;
      success.focus();
      success.scrollIntoView({ behavior: scrollBehavior, block: 'center' });
    } catch {
      status.innerHTML = 'Sorry, your enquiry didn’t go through. Please try again, or message us on Instagram at <a href="https://www.instagram.com/majlisuc/" target="_blank" rel="noopener">@majlisuc</a>.';
    } finally {
      submitBtn.disabled = false;
      submitBtn.classList.remove('is-sending');
      $('.form-submit-text', submitBtn).textContent = 'Send Enquiry';
    }
  });

  $('#sendAnother').addEventListener('click', () => {
    form.reset();
    attempted = false;
    checked.forEach(input => { input.removeAttribute('aria-invalid'); const err = document.getElementById(input.id + '-error'); if (err) err.textContent = ''; });
    success.hidden = true;
    form.hidden = false;
    form.querySelector('input[name="event_type"]').focus();
  });

  /* ── gallery lightbox ── */
  const lightbox = $('#lightbox');
  const lbImg = $('#lbImg');
  const lbCaption = $('#lbCaption');
  const lbCount = $('#lbCount');
  const shots = $$('.g-open').map(btn => {
    const img = $('img', btn);
    return { src: img.getAttribute('src'), alt: img.alt, caption: btn.dataset.caption };
  });
  let current = 0;

  const show = i => {
    current = (i + shots.length) % shots.length;
    const shot = shots[current];
    lbImg.style.animation = 'none';
    void lbImg.offsetWidth;
    lbImg.style.animation = '';
    lbImg.src = shot.src;
    lbImg.alt = shot.alt;
    lbCaption.textContent = shot.caption;
    lbCount.textContent = `${current + 1} / ${shots.length}`;
  };
  $$('.g-open').forEach((btn, i) => btn.addEventListener('click', () => { show(i); lightbox.showModal(); }));
  $('.lb-close').addEventListener('click', () => lightbox.close());
  $('.lb-prev').addEventListener('click', () => show(current - 1));
  $('.lb-next').addEventListener('click', () => show(current + 1));
  lightbox.addEventListener('click', e => { if (e.target === lightbox) lightbox.close(); });
  lightbox.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); show(current - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); show(current + 1); }
  });
  let touchX = null;
  lightbox.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') touchX = e.clientX; });
  lightbox.addEventListener('pointerup', e => {
    if (touchX === null) return;
    const dx = e.clientX - touchX;
    touchX = null;
    if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
  });

  /* ── footer year ── */
  $('#year').textContent = new Date().getFullYear();
})();
