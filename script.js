const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');

const setMenu = (open) => {
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  mobileMenu.classList.toggle('open', open);
  mobileMenu.setAttribute('aria-hidden', String(!open));
  menuToggle.querySelectorAll('span')[0].style.transform = open ? 'translateY(3.25px) rotate(45deg)' : '';
  menuToggle.querySelectorAll('span')[1].style.transform = open ? 'translateY(-3.25px) rotate(-45deg)' : '';
};

menuToggle?.addEventListener('click', () => setMenu(!mobileMenu.classList.contains('open')));
mobileMenu?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('click', (event) => {
  if (mobileMenu.classList.contains('open') && !mobileMenu.contains(event.target) && !menuToggle.contains(event.target)) setMenu(false);
});

const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 20);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px' });
  revealItems.forEach(item => observer.observe(item));
} else revealItems.forEach(item => item.classList.add('is-visible'));

const filters = document.querySelectorAll('.filter');
const products = () => document.querySelectorAll('.product-card');

const SAMEEN_PRODUCTS_KEY = 'sameen-admin-products-v1';
const escapeProductText = (value) => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
function renderAdminProducts() {
  const grid = document.getElementById('product-grid');
  if (!grid) return;
  grid.querySelectorAll('[data-admin-product="true"]').forEach(card => card.remove());
  let catalog = [];
  try {
    const parsed = JSON.parse(localStorage.getItem(SAMEEN_PRODUCTS_KEY) || '[]');
    if (Array.isArray(parsed)) catalog = parsed;
  } catch { catalog = []; }
  catalog.forEach((product, index) => {
    if (!product || !product.name || !product.image) return;
    const card = document.createElement('article');
    card.className = 'product-card reveal is-visible';
    card.dataset.adminProduct = 'true';
    card.dataset.category = product.category === 'occasion' ? 'occasion girls' : (product.category || 'all');
    const label = product.categoryLabel || ({girls:'Girls',boys:'Boys',baby:'Baby & Toddler',occasion:'Occasion'})[product.category] || 'Kids';
    const sizeText = product.sizes ? ' · Sizes: ' + escapeProductText(product.sizes) : '';
    card.innerHTML = '<div class="product-image"><img src="' + escapeProductText(product.image) + '" alt="' + escapeProductText(product.name) + '" loading="lazy"><span>' + String(index + 9).padStart(2, '0') + '</span><b class="product-badge">New</b></div><div class="product-meta"><div><p>' + escapeProductText(label) + escapeProductText(sizeText) + '</p><h3>' + escapeProductText(product.name) + '</h3>' + (product.description ? '<p>' + escapeProductText(product.description) + '</p>' : '') + '</div><strong>Rs. ' + Number(product.price || 0).toLocaleString('en-PK') + '</strong></div>';
    grid.appendChild(card);
  });
}
renderAdminProducts();
window.addEventListener('storage', event => {
  if (event.key === SAMEEN_PRODUCTS_KEY) { renderAdminProducts(); applyFilter(document.querySelector('.filter.active')?.dataset.filter || 'all'); }
});
const applyFilter = (selected) => {
  filters.forEach(item => item.classList.toggle('active', item.dataset.filter === selected));
  products().forEach(product => {
    const visible = selected === 'all' || product.dataset.category.split(' ').includes(selected);
    product.classList.toggle('hide', !visible);
  });
};
filters.forEach(filter => filter.addEventListener('click', () => applyFilter(filter.dataset.filter)));

document.querySelectorAll('[data-jump-filter]').forEach(card => {
  card.addEventListener('click', () => applyFilter(card.dataset.jumpFilter));
});

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', event => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    const offset = header.offsetHeight + 12;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
  });
});