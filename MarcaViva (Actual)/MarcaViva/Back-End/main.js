// Lógica da página main.html (navbar e animações de scroll)

function toggleLogoMenu() {
  const menu = document.getElementById('logo-menu-content');
  if (menu) menu.classList.toggle('aberto');
}

document.addEventListener('click', function (event) {
  const container = document.querySelector('.logo-container');
  if (container && !container.contains(event.target)) {
    const menu = document.getElementById('logo-menu-content');
    if (menu) menu.classList.remove('aberto');
  }
});

// Revela elementos com a classe .reveal conforme entram na viewport
const observador = new IntersectionObserver((entradas) => {
  entradas.forEach((entrada) => {
    if (entrada.isIntersecting) entrada.target.classList.add('active');
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach((el) => observador.observe(el));
