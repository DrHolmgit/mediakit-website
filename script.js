// ===== LOAD CONTENT FROM content.json =====
fetch('content.json')
  .then(r => r.json())
  .then(data => {
    applyTheme(data.theme);
    buildHero(data.profile);
    buildGallery(data.gallery);
    buildApps(data.apps);
    buildContact(data.contact);
    buildFooter(data.profile);
    initAnimations();
    initLightbox();
  })
  .catch(err => {
    console.error('Kunne ikke laste content.json:', err);
  });

// ===== THEME =====
function applyTheme(theme) {
  if (!theme) return;
  if (theme.accentColor) {
    document.documentElement.style.setProperty('--accent', theme.accentColor);
    // Lighten accent for accent-light
    document.documentElement.style.setProperty('--accent-light', lightenColor(theme.accentColor, 25));
  }
}

function lightenColor(hex, pct) {
  const num = parseInt(hex.replace('#',''), 16);
  const r = Math.min(255, (num >> 16) + pct * 2);
  const g = Math.min(255, ((num >> 8) & 0xff) + pct * 2);
  const b = Math.min(255, (num & 0xff) + pct * 2);
  return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
}

// ===== HERO =====
function buildHero(profile) {
  if (!profile) return;

  document.title = profile.name || 'Media Kit';
  setText('nav-name', profile.name);
  setText('hero-name', profile.name);
  setText('hero-title', profile.title);
  setText('hero-bio', profile.bio);

  // Profile image
  const img = document.getElementById('profile-img');
  const placeholder = document.getElementById('profile-placeholder');
  if (profile.profileImage) {
    img.src = profile.profileImage;
    img.style.display = 'block';
    img.onerror = () => {
      img.style.display = 'none';
      if (placeholder) {
        placeholder.textContent = (profile.name || '?')[0].toUpperCase();
        placeholder.style.display = 'flex';
      }
    };
    if (placeholder) placeholder.style.display = 'none';
  } else {
    img.style.display = 'none';
    if (placeholder) {
      placeholder.textContent = (profile.name || '?')[0].toUpperCase();
    }
  }

  // Social links
  const socials = document.getElementById('social-links');
  if (profile.socials && socials) {
    socials.innerHTML = profile.socials.map(s => `
      <a href="${s.url}" target="_blank" rel="noopener" class="social-link">
        ${getSocialIcon(s.icon)}
        ${s.name}
      </a>
    `).join('');
  }

  // CTA button
  const cta = document.getElementById('cta-btn');
  if (cta && profile.email) {
    cta.href = '#contact';
  }
}

// ===== GALLERY =====
function buildGallery(gallery) {
  if (!gallery) return;
  setText('gallery-title', gallery.title);
  setText('gallery-desc', gallery.description);

  const grid = document.getElementById('gallery-grid');
  const filterBar = document.getElementById('filter-bar');
  if (!grid || !gallery.items) return;

  // Collect categories
  const categories = ['Alle', ...new Set(gallery.items.map(i => i.category).filter(Boolean))];

  // Build filter buttons
  if (filterBar && categories.length > 1) {
    filterBar.innerHTML = categories.map((cat, i) => `
      <button class="filter-btn ${i === 0 ? 'active' : ''}" data-cat="${cat}">${cat}</button>
    `).join('');

    filterBar.addEventListener('click', e => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;
      filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.cat;
      grid.querySelectorAll('.gallery-item').forEach(item => {
        item.style.display = (cat === 'Alle' || item.dataset.cat === cat) ? '' : 'none';
      });
    });
  }

  // Build gallery items
  grid.innerHTML = gallery.items.map((item, i) => `
    <div class="gallery-item fade-in" data-cat="${item.category || ''}" data-index="${i}">
      ${item.image
        ? `<img src="${item.image}" alt="${item.caption || ''}" loading="lazy" onerror="this.parentElement.querySelector('.gallery-placeholder').style.display='flex'; this.style.display='none'" />`
        : ''}
      <div class="gallery-placeholder" style="${item.image ? 'display:none' : ''}">
        <span>Bilde ikke funnet</span>
      </div>
      <div class="gallery-item-info">
        ${item.category ? `<div class="gallery-category">${item.category}</div>` : ''}
        ${item.caption ? `<div class="gallery-caption">${item.caption}</div>` : ''}
      </div>
    </div>
  `).join('');
}

// ===== APPS =====
function buildApps(apps) {
  if (!apps) return;
  setText('apps-title', apps.title);
  setText('apps-desc', apps.description);

  const grid = document.getElementById('apps-grid');
  if (!grid || !apps.items) return;

  grid.innerHTML = apps.items.map(app => `
    <a href="${app.link || '#'}" target="${app.link ? '_blank' : '_self'}" rel="noopener" class="app-card fade-in">
      ${app.icon
        ? `<img src="${app.icon}" alt="${app.name}" class="app-icon" onerror="this.outerHTML='<div class=\\'app-icon-placeholder\\'>📱</div>'" />`
        : `<div class="app-icon-placeholder">📱</div>`}
      <div class="app-info">
        <div class="app-header">
          <span class="app-name">${app.name}</span>
          ${app.badge ? `<span class="app-badge">${app.badge}</span>` : ''}
        </div>
        ${app.platform ? `<div class="app-platform">${app.platform}</div>` : ''}
        <div class="app-desc">${app.description || ''}</div>
        ${app.link ? `<div class="app-arrow">Se mer →</div>` : ''}
      </div>
    </a>
  `).join('');
}

// ===== CONTACT =====
function buildContact(contact) {
  if (!contact) return;
  setText('contact-title', contact.title);
  setText('contact-desc', contact.description);

  const btn = document.getElementById('contact-btn');
  if (btn && contact.email) {
    btn.textContent = contact.buttonText || 'Send E-post';
    btn.href = `mailto:${contact.email}`;

    // Show email address as visible text below the button
    const emailDisplay = document.createElement('p');
    emailDisplay.className = 'contact-email-display';
    emailDisplay.textContent = contact.email;
    emailDisplay.title = 'Klikk for å kopiere';
    emailDisplay.style.cursor = 'pointer';
    emailDisplay.addEventListener('click', () => {
      navigator.clipboard.writeText(contact.email).then(() => {
        emailDisplay.textContent = '✓ Kopiert!';
        setTimeout(() => { emailDisplay.textContent = contact.email; }, 2000);
      });
    });
    btn.parentNode.insertBefore(emailDisplay, btn.nextSibling);
  }
}

// ===== FOOTER =====
function buildFooter(profile) {
  const el = document.getElementById('footer-name');
  if (el && profile) el.textContent = `© ${new Date().getFullYear()} ${profile.name}`;
}

// ===== LIGHTBOX =====
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  const lbCaption = document.getElementById('lightbox-caption');
  const lbClose = document.getElementById('lightbox-close');

  document.getElementById('gallery-grid').addEventListener('click', e => {
    const item = e.target.closest('.gallery-item');
    if (!item) return;
    const img = item.querySelector('img');
    if (!img || img.style.display === 'none') return;
    lbImg.src = img.src;
    lbCaption.textContent = item.querySelector('.gallery-caption')?.textContent || '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  const closeLightbox = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  };

  lbClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
}

// ===== SCROLL ANIMATIONS =====
function initAnimations() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

// ===== UTILS =====
function setText(id, text) {
  const el = document.getElementById(id);
  if (el && text) el.textContent = text;
}

function getSocialIcon(name) {
  const icons = {
    instagram: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>`,
    youtube: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none"/></svg>`,
    tiktok: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.28 6.28 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.73a8.18 8.18 0 0 0 4.79 1.52V6.79a4.85 4.85 0 0 1-1.02-.1z"/></svg>`,
    twitter: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
    facebook: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>`,
    linkedin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>`,
    globe: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
  };
  return icons[name?.toLowerCase()] || icons['globe'];
}
