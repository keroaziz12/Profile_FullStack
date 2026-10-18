(() => {
  const root = document.documentElement;
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const themeToggle = document.getElementById('themeToggle');
  const year = document.getElementById('year');
  const emailDialog = document.getElementById('emailDialog');
  const emailForm = document.getElementById('emailForm');
  const emailFormStatus = document.getElementById('emailFormStatus');
  const emailFallbackLink = document.getElementById('emailFallbackLink');
  const sendEmailButton = document.getElementById('sendEmailButton');
  if (window.emailjs) window.emailjs.init({ publicKey: 'IZG6gUVaufWZ5a6ll' });
  if (year) year.textContent = new Date().getFullYear();

  document.getElementById('openEmailDialog')?.addEventListener('click', () => emailDialog?.showModal());
  document.getElementById('closeEmailDialog')?.addEventListener('click', () => emailDialog?.close());
  document.getElementById('cancelEmailDialog')?.addEventListener('click', () => emailDialog?.close());
  emailDialog?.addEventListener('close', () => {
    if (emailFormStatus) {
      emailFormStatus.textContent = '';
      emailFormStatus.removeAttribute('data-state');
    }
    if (emailFallbackLink) {
      emailFallbackLink.hidden = true;
      emailFallbackLink.removeAttribute('href');
    }
  });
  emailForm?.addEventListener('submit', async event => {
    event.preventDefault();
    if (!emailForm.reportValidity()) return;

    sendEmailButton.disabled = true;
    sendEmailButton.textContent = 'Sending...';
    emailFormStatus.removeAttribute('data-state');
    emailFormStatus.textContent = 'Sending your message...';
    emailFallbackLink.hidden = true;
    emailFallbackLink.removeAttribute('href');

    try {
      if (!window.emailjs) throw new Error('Email service unavailable');
      await window.emailjs.sendForm('service_pb1dtfx', 'template_3sn7g48', emailForm);
      emailFormStatus.dataset.state = 'success';
      emailFormStatus.textContent = 'Message sent successfully!';
      emailForm.reset();
    } catch (_) {
      emailFormStatus.dataset.state = 'error';
      emailFormStatus.textContent = 'Failed to send message. Please try again or use your email app.';
      const formData = new FormData(emailForm);
      const body = `From: ${formData.get('name')}\nReply-to: ${formData.get('email')}\n\n${formData.get('message')}`;
      emailFallbackLink.href = `mailto:Kerilesaziz12@gmail.com?subject=${encodeURIComponent(formData.get('subject'))}&body=${encodeURIComponent(body)}`;
      emailFallbackLink.hidden = false;
    } finally {
      sendEmailButton.disabled = false;
      sendEmailButton.innerHTML = 'Send message <span>↗</span>';
    }
  });

  menuToggle?.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
    navLinks?.classList.toggle('open', !isOpen);
  });
  navLinks?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', 'Open navigation');
  }));

  let savedTheme = null;
  try { savedTheme = localStorage.getItem('keroles-theme'); } catch (_) {}
  if (savedTheme === 'light' || savedTheme === 'dark') root.dataset.theme = savedTheme;
  const updateThemeLabel = () => {
    const isLight = root.dataset.theme === 'light';
    themeToggle?.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
    themeToggle?.setAttribute('title', isLight ? 'Switch to dark theme' : 'Switch to light theme');
    const glyph = themeToggle?.querySelector('.theme-glyph');
    if (glyph) glyph.textContent = isLight ? '☾' : '☼';
  };
  updateThemeLabel();
  themeToggle?.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
    try { localStorage.setItem('keroles-theme', root.dataset.theme); } catch (_) {}
    updateThemeLabel();
  });

  const filters = [...document.querySelectorAll('.filter-btn')];
  const projects = [...document.querySelectorAll('.project-card[data-category]')];
  filters.forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filters.forEach(item => item.classList.toggle('active', item === button));
    projects.forEach(project => {
      const show = filter === 'all' || project.dataset.category === filter;
      project.hidden = !show;
      if (show) project.classList.add('is-visible');
    });
  }));

  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
    revealEls.forEach(el => observer.observe(el));
  } else revealEls.forEach(el => el.classList.add('is-visible'));
})();
