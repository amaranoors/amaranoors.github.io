// ============================================================
//  AMARA NOORS — main.js
//  100% driven by data/data.json
//  Vanilla JS only — zero dependencies
// ============================================================
'use strict';

// ─── Global state ───────────────────────────────────────────
let DATA  = {};
let BOOKS = [];
let SITE  = {};


// ============================================================
// === MODULE 0: DATA LOADER ===
// Fetches data/data.json — everything renders from this
// ============================================================
async function loadData() {
  try {
    const res = await fetch('data/data.json');
    if (!res.ok) throw new Error('data.json not found');
    DATA  = await res.json();
    SITE  = DATA.site  || {};
    BOOKS = (DATA.books || []).filter(b => b.visible !== false);
  } catch (err) {
    console.warn('[DataLoader] Using fallback.', err.message);
    DATA  = FALLBACK;
    SITE  = FALLBACK.site;
    BOOKS = FALLBACK.books;
  }
}

// Fallback data (exact mirror of data.json — keep in sync)
const FALLBACK = {
  site: {
    author: 'Amara Noors', tagline: 'Words that rewire how you see yourself.',
    logo: 'img/AN.png', logoAlt: 'Amara Noors logo', logoWidth: 48, logoHeight: 48,
    heroHeading: 'Books That Change . . . you',
    heroSubtext: 'Words that rewire how you see yourself — and what you\'re capable of becoming.',
    formspreeEndpoint: 'https://formspree.io/f/xjgedred',
    scarcityBarText: '🔥 Limited Offer — Buy Any Book for $9.99 — Free Chapter Included',
    stats: [
      { number: '12K', label: 'Readers' },
      { number: '4.9', label: '★ Rating' },
      { number: '3',   label: 'Books'   }
    ],
    social: {
      youtube:   { url: 'https://youtube.com/@amaranoors',  handle: '@amaranoors', subscribers: '48K', videos: '120',  views: '2.4M', description: 'Deep-dives into the philosophy behind the books. New video every week.' },
      instagram: { url: 'https://instagram.com/amaranoors', handle: '@amaranoors', followers: '31K',   posts: '890',   engagement: '4.2%', description: 'Daily quotes, writing process and behind-the-scenes of the creative life.' },
     },
    bundle: {
      show: true, title: 'All 3 Books',
      description: 'The full Amara Noors library — save over 30% when you grab every title together.',
      price: '$19.99', priceOld: '$23.97',
      buyLink: 'https://www.etsy.com/shop/amaranoors',
      buyButtonText: 'Buy Bundle on Etsy', buyNewTab: true, tag: 'Complete Bundle',
      coverImages: ['img/book1.svg','img/book2.svg','img/book3.svg']
    }
  },
  books: [
    { id:1, visible:true, title:'Something Like Gravity', genre:'YA Romance · Self-Help', tag:'Bestseller',
      description:'A raw exploration of how invisible forces shape our choices.', price:'$9.99', priceOld:'',
      image:'img/book1.svg', imageAlt:'Something Like Gravity cover', imageWidth:200, imageHeight:300,
      buyLink:'https://www.etsy.com/listing/4464987485/something-like-gravity-ya-romance-book',
      buyButtonText:'Buy on Etsy — $9.99', buyNewTab:true,
      previewPdf:'preview/book1-preview.pdf', showPreview:true, previewLabel:'Free Chapter', featured:true },
    { id:2, visible:true, title:'Journey Of Success', genre:'Personal Development', tag:'New Release',
      description:'The unfiltered roadmap from where you are to where you could be.', price:'$9.99', priceOld:'',
      image:'img/book2.svg', imageAlt:'Journey Of Success cover', imageWidth:200, imageHeight:300,
      buyLink:'https://www.etsy.com/listing/4439712782/journey-success-ebook-self-development',
      buyButtonText:'Buy on Etsy — $9.99', buyNewTab:true,
      previewPdf:'preview/book2-preview.pdf', showPreview:true, previewLabel:'Free Chapter', featured:true },
    { id:3, visible:true, title:'Transform Your Mindset', genre:'Motivation · Digital Guide', tag:'Top Rated',
      description:'Dismantle the thought patterns holding you back.', price:'$9.99', priceOld:'',
      image:'img/book3.svg', imageAlt:'Transform Your Mindset cover', imageWidth:200, imageHeight:300,
      buyLink:'https://www.etsy.com/listing/4439740937/transform-your-mindset-digital-guide',
      buyButtonText:'Buy on Etsy — $9.99', buyNewTab:true,
      previewPdf:'preview/book3-preview.pdf', showPreview:true, previewLabel:'Free Chapter', featured:true }
  ]
};


// ============================================================
// === MODULE 1: PAGE LOADER ===
// Hides full-screen splash after window.load + 600ms
// ============================================================
function initLoader() {
  const loader = document.getElementById('page-loader');
  if (!loader) return;
  function hide() {
    setTimeout(() => {
      loader.classList.add('hidden');
      loader.addEventListener('transitionend', () => loader.remove(), { once: true });
    }, 600);
  }
  document.readyState === 'complete' ? hide() : window.addEventListener('load', hide, { once: true });
}


// ============================================================
// === MODULE 2: CUSTOM CURSOR ===
// Dot snaps; ring lerps via requestAnimationFrame
// ============================================================
function initCursor() {
  if (window.innerWidth <= 768) return;
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;
  let mx=0, my=0, rx=0, ry=0;
  document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; }, { passive:true });
  document.addEventListener('mouseleave', () => { dot.style.opacity='0'; ring.style.opacity='0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity='1'; ring.style.opacity='0.6'; });
  (function raf() {
    dot.style.left  = mx+'px'; dot.style.top  = my+'px';
    rx += (mx-rx)*0.16; ry += (my-ry)*0.16;
    ring.style.left = rx+'px'; ring.style.top = ry+'px';
    requestAnimationFrame(raf);
  })();
}


// ============================================================
// === MODULE 3: NAVIGATION ===
// .solid backdrop on scroll, hamburger, drawer, escape
// ============================================================
function initNavigation() {
  const nav        = document.getElementById('main-nav');
  const hamburger  = document.getElementById('hamburger');
  const drawer     = document.getElementById('mobile-drawer');
  const drawerClose= document.getElementById('drawer-close');
  const overlay    = document.getElementById('drawer-overlay');
  if (!nav) return;

  const onScroll = () => nav.classList.toggle('solid', window.scrollY > 30);
  window.addEventListener('scroll', onScroll, { passive:true });
  onScroll();

  function openDrawer() {
    drawer && drawer.classList.add('open');
    overlay && overlay.classList.add('active');
    hamburger && hamburger.setAttribute('aria-expanded','true');
    document.body.style.overflow = 'hidden';
    const first = drawer && drawer.querySelector('a, button');
    first && first.focus();
  }
  function closeDrawer() {
    drawer && drawer.classList.remove('open');
    overlay && overlay.classList.remove('active');
    hamburger && hamburger.setAttribute('aria-expanded','false');
    document.body.style.overflow = '';
    hamburger && hamburger.focus();
  }
  hamburger   && hamburger.addEventListener('click', openDrawer);
  drawerClose && drawerClose.addEventListener('click', closeDrawer);
  overlay     && overlay.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', e => {
    if (e.key==='Escape' && drawer && drawer.classList.contains('open')) closeDrawer();
  });
  drawer && drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));
}


// ============================================================
// === MODULE 4: SITE-WIDE INJECTIONS FROM JSON ===
// Logo, hero text, stats, scarcity bar text, footer year
// ============================================================
function injectSiteData() {
  // ── Logo images ──
  document.querySelectorAll('.nav-logo-img').forEach(img => {
    img.src    = SITE.logo    || 'img/AN.png';
    img.alt    = SITE.logoAlt || 'Amara Noors logo';
    img.width  = SITE.logoWidth  || 48;
    img.height = SITE.logoHeight || 48;
  });

  // ── Loader logo ──
  const loaderLogo = document.querySelector('.loader-logo-img');
  if (loaderLogo) {
    loaderLogo.src    = SITE.logo    || 'img/AN.png';
    loaderLogo.alt    = SITE.logoAlt || '';
    loaderLogo.width  = SITE.logoWidth  || 48;
    loaderLogo.height = SITE.logoHeight || 48;
  }

  // ── Hero heading & subtext ──
  const heroH1 = document.getElementById('hero-heading');
  if (heroH1 && SITE.heroHeading) heroH1.innerHTML = SITE.heroHeading.replace('Break You Open','Break You <em>Open</em>');
  const heroSub = document.querySelector('.hero-sub-dynamic');
  if (heroSub && SITE.heroSubtext) heroSub.textContent = SITE.heroSubtext;

  // ── Stats ──
  const statsWrap = document.getElementById('hero-stats');
  if (statsWrap && SITE.stats) {
    statsWrap.innerHTML = SITE.stats.map((s, i) =>
      `${i > 0 ? '<div class="stat-divider" aria-hidden="true"></div>' : ''}
       <div class="stat" role="listitem">
         <span class="stat-num">${s.number}</span>
         <span class="stat-label">${s.label}</span>
       </div>`
    ).join('');
  }

  // ── Scarcity bar text ──
  const scarcityText = document.querySelector('.scarcity-text-inner');
  if (scarcityText && SITE.scarcityBarText) scarcityText.textContent = SITE.scarcityBarText;

  // ── Footer year ──
  const yr = new Date().getFullYear();
  document.querySelectorAll('.footer-year').forEach(el => el.textContent = yr);

  // ── Author name / tagline in footer ──
  document.querySelectorAll('.footer-author-name').forEach(el => el.textContent = SITE.author || 'Amara Noors');
  document.querySelectorAll('.footer-tagline-text').forEach(el => el.textContent = SITE.tagline || '');

  // ── Footer logo images ──
  document.querySelectorAll('.footer-logo-img').forEach(img => {
    img.src    = SITE.logo    || 'img/AN.png';
    img.alt    = SITE.logoAlt || '';
    img.width  = 40;
    img.height = 40;
  });
}


// ============================================================
// === MODULE 5: RENDER BOOKS GRID (index.html) ===
// Full book cards from JSON — Etsy buy links, preview, tag
// ============================================================
function renderBooksGrid() {
  const grid = document.getElementById('books-grid');
  if (!grid) return;

  grid.innerHTML = BOOKS.map(b => {
    const priceOldHtml = b.priceOld
      ? `<span class="price-old">${b.priceOld}</span>` : '';
    const previewHtml = b.showPreview !== false
      ? `<a href="${b.previewPdf}" class="book-preview-link"
            target="_blank" rel="noopener noreferrer"
            aria-label="Free preview of ${b.title}">${b.previewLabel || 'Preview'}</a>` : '';
    const target = b.buyNewTab ? 'target="_blank" rel="noopener noreferrer"' : '';

    return `
    <article class="book-card" role="listitem" aria-label="${b.title}">
      <div class="book-cover-wrap" data-tilt>
        <img src="${b.image}" alt="${b.imageAlt || b.title}"
             width="${b.imageWidth||200}" height="${b.imageHeight||300}"
             loading="lazy" class="book-cover-img" />
      </div>
      <span class="genre-tag">${b.genre}</span>
      ${b.tag ? `<span class="book-tag">${b.tag}</span>` : ''}
      <h3 class="book-title">${b.title}</h3>
      <p class="book-desc">${b.description}</p>
      <div class="book-footer">
        <div class="book-prices">${priceOldHtml}<span class="book-price">${b.price}</span></div>
        <div class="book-actions">
          ${previewHtml}
          <a href="${b.buyLink}" class="btn-amber btn-buy" ${target}
             aria-label="Buy ${b.title}">${b.buyButtonText || 'Buy Now'}</a>
        </div>
      </div>
    </article>`;
  }).join('');

  // Bundle card
  const bundle = SITE.bundle;
  if (bundle && bundle.show) {
    const target = bundle.buyNewTab ? 'target="_blank" rel="noopener noreferrer"' : '';
    const coversHtml = (bundle.coverImages || []).map(src =>
      `<img src="${src}" alt="" width="70" height="105" loading="lazy" />`
    ).join('');
    const bundleHtml = `
    <article class="bundle-card book-card" aria-label="Bundle offer">
      <div class="bundle-inner">
        <div class="bundle-covers" aria-hidden="true">${coversHtml}</div>
        <div class="bundle-info">
          <span class="genre-tag">${bundle.tag || 'Bundle'}</span>
          <h3 class="bundle-title">${bundle.title}</h3>
          <p class="bundle-desc">${bundle.description}</p>
          <div class="bundle-price">
            ${bundle.priceOld ? `<span class="price-old">${bundle.priceOld}</span>` : ''}
            <span class="price-new">${bundle.price}</span>
          </div>
          <a href="${bundle.buyLink}" class="btn-amber btn-pulse btn-buy" ${target}
             aria-label="Buy bundle">${bundle.buyButtonText || 'Buy Bundle'}</a>
        </div>
      </div>
    </article>`;
    grid.insertAdjacentHTML('beforeend', bundleHtml);
  }
}


// ============================================================
// === MODULE 6: RENDER CHAPTERS PAGE BOOKS (chapters.html) ===
// Tab selector, PDF viewer, mini grid — all from JSON
// ============================================================
function renderChaptersPage() {
  // ── Tab buttons ──
  const tabsWrap = document.getElementById('ch-tabs-wrap');
  const chEmbed  = document.getElementById('ch-pdf-embed');
  const chTitle  = document.getElementById('ch-current-title');
  const chBuyBtn = document.getElementById('ch-buy-btn');

  if (tabsWrap && chEmbed && BOOKS.length) {
    tabsWrap.innerHTML = BOOKS.map((b, i) => `
      <button class="ch-tab${i===0?' active':''}"
        role="tab" aria-selected="${i===0}"
        data-pdf="${b.previewPdf}"
        data-title="${b.title}"
        data-price="${b.price}"
        data-buylink="${b.buyLink}"
        data-buytext="${b.buyButtonText || 'Buy Now'}"
        data-buytab="${b.buyNewTab ? '_blank' : '_self'}"
        data-book="${b.id}"
        aria-controls="ch-pdf-panel">
        <img src="${b.image}" alt="" width="48" height="72" loading="lazy" />
        <span class="ch-tab-label">${b.title}</span>
      </button>`).join('');

    function activateTab(tab) {
      tabsWrap.querySelectorAll('.ch-tab').forEach(t => {
        t.classList.remove('active'); t.setAttribute('aria-selected','false');
      });
      tab.classList.add('active'); tab.setAttribute('aria-selected','true');
      if (chEmbed)  chEmbed.src = tab.dataset.pdf;
      if (chTitle)  chTitle.textContent = tab.dataset.title;
      if (chBuyBtn) {
        chBuyBtn.href   = tab.dataset.buylink;
        chBuyBtn.textContent = tab.dataset.buytext;
        chBuyBtn.target = tab.dataset.buytab || '_blank';
      }
    }

    tabsWrap.querySelectorAll('.ch-tab').forEach(tab =>
      tab.addEventListener('click', () => activateTab(tab))
    );

    // URL param ?book=1/2/3
    const param = new URLSearchParams(location.search).get('book');
    if (param) {
      const target = tabsWrap.querySelector(`[data-book="${param}"]`);
      if (target) activateTab(target);
      else activateTab(tabsWrap.querySelector('.ch-tab'));
    } else {
      activateTab(tabsWrap.querySelector('.ch-tab'));
    }
  }

  // ── Index.html PDF tabs (3 tab buttons) ──
  const pdfTabsWrap = document.getElementById('pdf-tabs-wrap');
  const pdfEmbed    = document.getElementById('pdf-embed');
  if (pdfTabsWrap && pdfEmbed && BOOKS.length) {
    pdfTabsWrap.innerHTML = BOOKS.map((b,i) => `
      <button class="pdf-tab${i===0?' active':''}"
        role="tab" aria-selected="${i===0}"
        data-pdf="${b.previewPdf}"
        aria-controls="pdf-panel">
        Book ${i+1}
      </button>`).join('');
    pdfTabsWrap.querySelectorAll('.pdf-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        pdfTabsWrap.querySelectorAll('.pdf-tab').forEach(t => {
          t.classList.remove('active'); t.setAttribute('aria-selected','false');
        });
        tab.classList.add('active'); tab.setAttribute('aria-selected','true');
        pdfEmbed.src = tab.dataset.pdf;
      });
    });
    pdfEmbed.src = BOOKS[0].previewPdf;
  }

  // ── All Books mini grid ──
  const miniGrid = document.getElementById('ch-books-grid');
  if (miniGrid) {
    miniGrid.innerHTML = BOOKS.map(b => {
      const target = b.buyNewTab ? 'target="_blank" rel="noopener noreferrer"' : '';
      return `
      <div class="ch-book-item" role="listitem" aria-label="${b.title}">
        <img src="${b.image}" alt="${b.imageAlt||b.title}"
             width="120" height="180" loading="lazy" />
        <span class="genre-tag">${b.genre}</span>
        <h3 class="book-title">${b.title}</h3>
        <p class="book-price-sm">${b.price}</p>
        <a href="${b.buyLink}" class="btn-amber" ${target}
           aria-label="Buy ${b.title}">${b.buyButtonText||'Buy Now'}</a>
      </div>`;
    }).join('');
  }

  // ── Bundle CTA on chapters page ──
  const bundle = SITE.bundle;
  const bundleSection = document.getElementById('ch-bundle-cta');
  if (bundleSection && bundle) {
    if (!bundle.show) { bundleSection.style.display='none'; return; }
    const target = bundle.buyNewTab ? 'target="_blank" rel="noopener noreferrer"' : '';
    const coversHtml = (bundle.coverImages||[]).map(src =>
      `<img src="${src}" alt="" width="90" height="135" loading="lazy" />`).join('');
    bundleSection.innerHTML = `
      <div class="ch-bundle-inner">
        <div class="bundle-cta-text">
          <div class="section-label">— Complete Set</div>
          <h2 class="section-h2">Get the <em>Complete Bundle</em></h2>
          <p>All ${BOOKS.length} books. One price. Save over 30%.</p>
          <div class="bundle-price">
            ${bundle.priceOld?`<span class="price-old">${bundle.priceOld}</span>`:''}
            <span class="price-new">${bundle.price}</span>
          </div>
          <a href="${bundle.buyLink}" class="btn-amber btn-pulse" ${target}>${bundle.buyButtonText}</a>
        </div>
        <div class="bundle-cta-covers" aria-hidden="true">${coversHtml}</div>
      </div>`;
  }
}


// ============================================================
// === MODULE 7: RENDER SOCIAL PAGE ===
// Platform blocks + community section from JSON
// ============================================================
function renderSocialPage() {
  const soc = SITE.social;
  if (!soc) return;

  // ── YouTube stats ──
  const ytSubs  = document.querySelector('.yt-subscribers');
  const ytVids  = document.querySelector('.yt-videos');
  const ytViews = document.querySelector('.yt-views');
  const ytDesc  = document.querySelector('.yt-description');
  const ytLink  = document.querySelector('.yt-follow-link');
  if (soc.youtube) {
    if (ytSubs)  ytSubs.textContent  = soc.youtube.subscribers;
    if (ytVids)  ytVids.textContent  = soc.youtube.videos;
    if (ytViews) ytViews.textContent = soc.youtube.views;
    if (ytDesc)  ytDesc.textContent  = soc.youtube.description;
    if (ytLink)  { ytLink.href = soc.youtube.url; ytLink.querySelector('.soc-handle-text') && (ytLink.querySelector('.soc-handle-text').textContent = soc.youtube.handle); }
    document.querySelectorAll('.yt-handle').forEach(el => el.textContent = soc.youtube.handle);
    document.querySelectorAll('.yt-url').forEach(a => a.href = soc.youtube.url);
  }

  // ── Instagram stats ──
  const igFollowers  = document.querySelector('.ig-followers');
  const igPosts      = document.querySelector('.ig-posts');
  const igEngagement = document.querySelector('.ig-engagement');
  const igDesc       = document.querySelector('.ig-description');
  if (soc.instagram) {
    if (igFollowers)  igFollowers.textContent  = soc.instagram.followers;
    if (igPosts)      igPosts.textContent      = soc.instagram.posts;
    if (igEngagement) igEngagement.textContent = soc.instagram.engagement;
    if (igDesc)       igDesc.textContent       = soc.instagram.description;
    document.querySelectorAll('.ig-handle').forEach(el => el.textContent = soc.instagram.handle);
    document.querySelectorAll('.ig-url').forEach(a => a.href = soc.instagram.url);
  }

  // ── X stats ──
  const xFollowers = document.querySelector('.x-followers');
  const xLikes     = document.querySelector('.x-likes');
  const xThreads   = document.querySelector('.x-threads');
  const xDesc      = document.querySelector('.x-description');
  if (soc.x) {
    if (xFollowers) xFollowers.textContent = soc.x.followers;
    if (xLikes)     xLikes.textContent     = soc.x.likes;
    if (xThreads)   xThreads.textContent   = soc.x.threads;
    if (xDesc)      xDesc.textContent      = soc.x.description;
    document.querySelectorAll('.x-handle').forEach(el => el.textContent = soc.x.handle);
    document.querySelectorAll('.x-url').forEach(a => a.href = soc.x.url);
  }
}


// ============================================================
// === MODULE 8: SCROLL ANIMATIONS ===
// IntersectionObserver adds .revealed with staggered delay
// ============================================================
function initScrollAnimations() {
  const targets = document.querySelectorAll('.book-card, .social-card, .benefit-item, .ch-book-item, .anim-fade-up');
  if (!('IntersectionObserver' in window)) {
    targets.forEach(el => el.classList.add('revealed')); return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const siblings = Array.from(el.parentElement.children);
      el.style.transitionDelay = (siblings.indexOf(el) * 0.1) + 's';
      el.classList.add('revealed');
      io.unobserve(el);
    });
  }, { threshold: 0.1 });
  targets.forEach(el => io.observe(el));
}


// ============================================================
// === MODULE 9: BOOK TILT ===
// 3D perspective tilt on mousemove
// ============================================================
function initBookTilt() {
  document.querySelectorAll('[data-tilt]').forEach(wrap => {
    wrap.addEventListener('mousemove', e => {
      const r = wrap.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width/2)  / (r.width/2);
      const dy = (e.clientY - r.top  - r.height/2) / (r.height/2);
      wrap.style.transform = `perspective(600px) rotateY(${dx*14}deg) rotateX(${-dy*10}deg) scale(1.03)`;
    });
    wrap.addEventListener('mouseleave', () => {
      wrap.style.transform = 'perspective(600px) rotateY(0deg) rotateX(0deg) scale(1)';
    });
  });
}


// ============================================================
// === MODULE 10: EMAIL FORMS ===
// fetch() POST to Formspree, validation, loading state, success
// ============================================================
function initEmailForms() {
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const endpoint = SITE.formspreeEndpoint || 'https://formspree.io/f/xjgedred';

  document.querySelectorAll('.js-email-form').forEach(form => {
    // Inject correct action from JSON
    form.action = endpoint;

    form.addEventListener('submit', async e => {
      e.preventDefault();
      const emailInput = form.querySelector('input[type="email"]');
      const submitBtn  = form.querySelector('button[type="submit"]');
      const successDiv = form.querySelector('.form-success');
      if (!emailInput || !submitBtn) return;

      const email = emailInput.value.trim();
      if (!EMAIL_RE.test(email)) {
        showToast('Please enter a valid email address.', 'warn');
        emailInput.focus(); return;
      }

      const orig = submitBtn.textContent;
      submitBtn.textContent = 'Sending…'; submitBtn.disabled = true;

      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          successDiv && (successDiv.removeAttribute('hidden'), successDiv.style.display='block');
          emailInput.value = '';
          showToast('✓ Chapter sent! Check your inbox.', 'success');
          if (typeof gtag === 'function') gtag('event', 'form_submit', { event_category: 'Lead' });
        } else {
          showToast('Something went wrong. Please try again.', 'warn');
        }
      } catch {
        showToast('Network error. Check your connection.', 'warn');
      } finally {
        submitBtn.textContent = orig; submitBtn.disabled = false;
      }
    });
  });
}


// ============================================================
// === MODULE 11: BUY BUTTON HANDLER ===
// All buy buttons open Etsy (or any link) in correct tab
// GA event on click
// ============================================================
function initBuyButtons() {
  document.querySelectorAll('.btn-buy, .ch-buy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (typeof gtag === 'function') {
        gtag('event', 'begin_checkout', { event_category: 'Ecommerce', event_label: btn.href });
      }
    });
  });
}


// ============================================================
// === MODULE 12: TOAST ===
// success (amber) / warn (rose) / info (blue)
// ============================================================
function showToast(message, type = 'info', duration = 4000) {
  let toast = document.getElementById('app-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'app-toast';
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    document.body.appendChild(toast);
  }
  toast.className = 'toast-' + type;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove('show'), duration);
}
window.showToast = showToast;


// ============================================================
// === MODULE 13: GOOGLE ANALYTICS ===
// Dynamic inject with anonymize_ip — replace G-XXXXXXXXXX
// ============================================================
function initGA() {
  const GA_ID = 'G-XXXXXXXXXX'; // ← Replace with your GA4 ID
  if (!GA_ID || GA_ID === 'G-XXXXXXXXXX') return;
  const s = document.createElement('script');
  s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  function gtag(){ window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date()); gtag('config', GA_ID, { anonymize_ip: true });
}


// ============================================================
// === MODULE 14: COUNTDOWN TIMER ===
// localStorage-persisted 24h countdown in scarcity bar
// ============================================================
function initCountdown() {
  const display = document.getElementById('countdown-display');
  const bar     = document.getElementById('scarcity-bar');
  const close   = document.getElementById('scarcity-close');
  if (!bar) return;

  if (localStorage.getItem('an_bar_closed') === '1') { bar.style.display='none'; return; }

  close && close.addEventListener('click', () => {
    bar.style.display = 'none';
    localStorage.setItem('an_bar_closed', '1');
  });

  if (!display) return;

  const KEY = 'an_countdown_end';
  let end = parseInt(localStorage.getItem(KEY), 10);
  if (!end || end < Date.now()) {
    end = Date.now() + 24*3600*1000;
    localStorage.setItem(KEY, end);
  }

  const pad = n => String(n).padStart(2,'0');
  (function tick() {
    const left = end - Date.now();
    if (left <= 0) { display.textContent='00:00:00'; bar.style.display='none'; return; }
    const h = Math.floor(left/3600000);
    const m = Math.floor((left%3600000)/60000);
    const s = Math.floor((left%60000)/1000);
    display.textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;
    setTimeout(tick, 1000);
  })();
}


// ============================================================
// === MODULE 15: KEYBOARD A11Y ===
// Focus trap in drawer, skip link, escape handler
// ============================================================
function initA11y() {
  const drawer = document.getElementById('mobile-drawer');
  if (drawer) {
    const sel = 'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])';
    drawer.addEventListener('keydown', e => {
      if (!drawer.classList.contains('open')) return;
      const els = Array.from(drawer.querySelectorAll(sel)).filter(el => !el.disabled);
      if (!els.length) return;
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === els[0]) { e.preventDefault(); els[els.length-1].focus(); }
        else if (!e.shiftKey && document.activeElement === els[els.length-1]) { e.preventDefault(); els[0].focus(); }
      }
    });
  }
  const skip = document.querySelector('.skip-link');
  if (skip) {
    skip.addEventListener('click', e => {
      const main = document.getElementById('main-content');
      if (main) { e.preventDefault(); main.setAttribute('tabindex','-1'); main.focus(); }
    });
  }
}


// ============================================================
// === MODULE 16: LAZY LOAD POLYFILL ===
// Falls back if native loading="lazy" isn't supported
// ============================================================
function initLazyLoad() {
  if ('loading' in HTMLImageElement.prototype) return;
  if (!('IntersectionObserver' in window)) return;
  const imgs = document.querySelectorAll('img[loading="lazy"]');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.src = e.target.dataset.src || e.target.src; io.unobserve(e.target); } });
  });
  imgs.forEach(img => io.observe(img));
}


// ============================================================
// === BOOTSTRAP ===
// Load data → inject → render → init all interactions
// ============================================================
async function bootstrap() {
  // 1. Start loader immediately
  initLoader();

  // 2. Load JSON data
  await loadData();

  // 3. Inject site-wide data (logo, hero, stats, social links)
  injectSiteData();

  // 4. Render dynamic content
  renderBooksGrid();       // books-grid on index.html
  renderChaptersPage();    // tabs + pdf + grid on chapters.html
  renderSocialPage();      // stats on social.html

  // 5. Init all interactions
  initGA();
  initCursor();
  initNavigation();
  initScrollAnimations();  // first pass
  initBookTilt();
  initEmailForms();
  initBuyButtons();
  initLazyLoad();
  initCountdown();
  initA11y();

  // 6. Second scroll-animation pass (after dynamic cards rendered)
  requestAnimationFrame(initScrollAnimations);
}

// Run
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
