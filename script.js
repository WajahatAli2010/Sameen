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
const products = document.querySelectorAll('.product-card');
const applyFilter = (selected) => {
  filters.forEach(item => item.classList.toggle('active', item.dataset.filter === selected));
  products.forEach(product => {
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