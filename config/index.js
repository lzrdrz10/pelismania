/* ===============================
   HEADER SCROLL
================================ */
window.addEventListener('scroll', () => {
  const header = document.getElementById('header');
  header.classList.toggle('scrolled', window.scrollY > 100);
});

/* ===============================
   INIT (contenido dinámico después)
================================ */
window.onload = () => {
  // Aquí se cargará el contenido dinámico
  // desde otra carpeta / scripts
};
