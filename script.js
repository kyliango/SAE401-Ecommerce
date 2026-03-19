// ================================================
//  AURA – Main Script (localStorage cart)
// ================================================

// ── CART HELPERS ───────────────────────────────
const CART_KEY = 'aura_cart';

function cartGet() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}

function cartSave(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

function cartAdd(item) {
  const items = cartGet();
  // We consider an item "identical" if it has the same id, size AND engraving
  const existing = items.find(i => i.id === item.id && i.size === item.size && i.engraving === item.engraving);
  if (existing) {
    existing.qty += 1;
  } else {
    items.push({ ...item, qty: 1 });
  }
  cartSave(items);
  updateCartBadge();
}

function cartRemoveIndex(idx) {
  const items = cartGet();
  if (idx >= 0 && idx < items.length) {
    items.splice(idx, 1);
    cartSave(items);
    updateCartBadge();
  }
}

function cartSetQtyIndex(idx, qty) {
  const items = cartGet();
  if (idx < 0 || idx >= items.length) return;
  if (qty < 1) { 
    cartRemoveIndex(idx); 
    return; 
  }
  items[idx].qty = qty;
  cartSave(items);
  updateCartBadge();
}

function cartClear() {
  localStorage.removeItem(CART_KEY);
  updateCartBadge();
}

function updateCartBadge() {
  const items = cartGet();
  const total = items.reduce((a, i) => a + i.qty, 0);
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = total;
    el.classList.toggle('visible', total > 0);
  });
}

// ── SEARCH OVERLAY ─────────────────────────────
const PRODUCTS = [
  { name: 'Onyx',           url: 'product-onyx.html',      tags: ['boisé', 'épicé', 'fumé', 'oud'] },
  { name: 'Aura Charnelle', url: 'product-charnelle.html', tags: ['floral', 'poudré', 'jasmin', 'iris'] },
  { name: 'Rose Incarnée',  url: 'product-rose.html',      tags: ['rose', 'floral', 'oriental', 'santal'] },
  { name: 'Élixir Prohibé', url: 'product-elixir.html',    tags: ['oriental', 'épicé', 'safran', 'vanille'] },
  { name: 'Le Prélude',     url: 'product-coffret.html',   tags: ['coffret', 'découverte', 'cadeau'] },
  { name: 'La Collection',  url: 'collection.html',        tags: ['collection', 'parfums'] },
  { name: "L'Esprit AURA",  url: 'esprit-aura.html',       tags: ['histoire', 'marque', 'aura'] },
];

function buildSearchOverlay() {
  const overlay = document.createElement('div');
  overlay.id = 'searchOverlay';
  overlay.innerHTML = `
    <div class="search-overlay__backdrop"></div>
    <div class="search-overlay__panel">
      <div class="search-overlay__header">
        <input type="search" class="search-overlay__input" id="searchInput"
          placeholder="Rechercher un parfum…" autocomplete="off" aria-label="Recherche">
        <button class="search-overlay__close" id="searchClose" aria-label="Fermer">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
      <ul class="search-overlay__results" id="searchResults"></ul>
    </div>
  `;

  // Inject styles once
  if (!document.getElementById('searchStyle')) {
    const style = document.createElement('style');
    style.id = 'searchStyle';
    style.textContent = `
      #searchOverlay { position:fixed;inset:0;z-index:9999;display:none; }
      #searchOverlay.open { display:flex;align-items:flex-start;justify-content:center; }
      .search-overlay__backdrop { position:absolute;inset:0;background:rgba(26,10,15,0.55);backdrop-filter:blur(4px); }
      .search-overlay__panel { position:relative;z-index:1;background:var(--cream);width:min(600px,95vw);margin-top:80px;border-radius:4px;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,0.25); }
      .search-overlay__header { display:flex;align-items:center;gap:0;border-bottom:1px solid rgba(61,12,30,0.1); }
      .search-overlay__input { flex:1;border:none;background:none;padding:20px 24px;font-family:var(--font-serif);font-size:1rem;color:var(--text-dark);outline:none; }
      .search-overlay__close { background:none;border:none;padding:20px;cursor:pointer;font-size:18px;color:var(--text-light);transition:color .2s; }
      .search-overlay__close:hover { color:var(--burgundy); }
      .search-overlay__results { list-style:none;max-height:360px;overflow-y:auto;margin:0;padding:8px 0; }
      .search-result { padding:14px 24px;cursor:pointer;display:flex;align-items:center;gap:12px;transition:background .15s; }
      .search-result:hover { background:var(--cream-2); }
      .search-result__name { font-family:var(--font-serif);font-size:0.95rem;color:var(--text-dark); }
      .search-result__tag { font-size:10px;color:var(--text-light);letter-spacing:.05em; }
      .search-no-result { padding:20px 24px;color:var(--text-light);font-size:0.9rem;font-family:var(--font-serif); }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(overlay);

  const input = overlay.querySelector('#searchInput');
  const results = overlay.querySelector('#searchResults');
  const closeBtn = overlay.querySelector('#searchClose');
  const backdrop = overlay.querySelector('.search-overlay__backdrop');

  function renderResults(q) {
    results.innerHTML = '';
    if (!q) return;
    const filtered = PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(q) || p.tags.some(t => t.includes(q))
    );
    if (filtered.length === 0) {
      results.innerHTML = `<li class="search-no-result">Aucun résultat pour « ${q} »</li>`;
      return;
    }
    filtered.forEach(p => {
      const li = document.createElement('li');
      li.className = 'search-result';
      li.innerHTML = `<div><div class="search-result__name">${p.name}</div><div class="search-result__tag">${p.tags.join(' · ')}</div></div>`;
      li.addEventListener('click', () => { window.location.href = p.url; });
      results.appendChild(li);
    });
  }

  input.addEventListener('input', e => renderResults(e.target.value.toLowerCase().trim()));

  function closeSearch() {
    overlay.classList.remove('open');
    input.value = '';
    results.innerHTML = '';
  }

  closeBtn.addEventListener('click', closeSearch);
  backdrop.addEventListener('click', closeSearch);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSearch(); });

  return overlay;
}

// ── DOM READY ──────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  /* ── Nav scroll ── */
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  /* ── Burger menu ── */
  const burger = document.querySelector('.nav__burger');
  const mobileMenu = document.querySelector('.nav__mobile');
  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── Cart badge ── */
  updateCartBadge();

  /* ── Add to cart buttons ── */
  document.querySelectorAll('.js-add-to-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const name  = btn.dataset.name  || 'Produit';
      const price = parseFloat(btn.dataset.price) || 190;
      const img   = btn.dataset.img   || '';
      const size  = btn.dataset.size  || '50ml';
      const id    = (name + '-' + size).toLowerCase().replace(/\s+/g, '-');

      const engInput = document.getElementById('engravingText');
      const engraving = engInput ? engInput.value.trim() : '';

      cartAdd({ id, name, size, price, img, engraving });

      const originalHTML = btn.innerHTML;
      btn.innerHTML = '<i class="fa-solid fa-check" style="margin-right:6px;"></i> Ajouté !';
      btn.disabled = true;
      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.disabled = false;
      }, 1500);
    });
  });

  /* ── Search loupe ── */
  const searchOverlay = buildSearchOverlay();
  document.querySelectorAll('.nav__icon').forEach(icon => {
    if (icon.querySelector('.fa-magnifying-glass')) {
      icon.style.cursor = 'pointer';
      icon.addEventListener('click', (e) => {
        e.preventDefault();
        searchOverlay.classList.add('open');
        setTimeout(() => document.getElementById('searchInput').focus(), 50);
      });
    }
  });

  /* ── Scroll reveal ── */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  }

  /* ── Active nav link ── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href && currentPage.includes(href.replace('.html', ''))) link.classList.add('active');
  });

  /* ── Page transitions ── */
  document.querySelectorAll('a[data-transition]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('http')) return;
      e.preventDefault();
      document.body.style.opacity = '0';
      document.body.style.transition = 'opacity 0.3s ease';
      setTimeout(() => { window.location.href = href; }, 300);
    });
  });
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  requestAnimationFrame(() => { requestAnimationFrame(() => { document.body.style.opacity = '1'; }); });

  /* ── Size selector on product pages ── */
  document.querySelectorAll('.size-selector__btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.closest('.size-selector');
      group.querySelectorAll('.size-selector__btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      // Update price display
      const price = btn.dataset.price;
      const size  = btn.dataset.size;
      const priceEl = document.querySelector('.prod-hero__price');
      const sizeEl  = document.querySelector('.prod-hero__size');
      if (priceEl) priceEl.textContent = price + ' €';
      if (sizeEl)  sizeEl.textContent  = size + ' ml – Huile de Parfum';
      // Update all add-to-cart buttons on the page
      document.querySelectorAll('.js-add-to-cart').forEach(ab => {
        ab.dataset.price = price;
        ab.dataset.size  = size + 'ml';
      });
    });
  });

});
