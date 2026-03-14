// ==================== SEARCH-MODAL.JS (Reusable) ====================

const modal = document.getElementById('search-modal');
const searchInput = document.getElementById('search-input');
const resultsContainer = document.getElementById('search-results');
const closeModalBtn = document.getElementById('close-modal');
const searchIcon = document.querySelector('.fa-magnifying-glass'); // icono de lupa

let allContent = [];
let isLoading = false;

// Normalizar texto para búsqueda inteligente
function normalizeString(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[-_]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Abrir modal
function openSearchModal() {
  modal.classList.add('active');
  searchInput.focus();

  if (allContent.length === 0 && !isLoading) {
    resultsContainer.innerHTML = `<p style="color:#777;text-align:center;padding:40px 20px;">Cargando datos...</p>`;
    loadContentFromGitHub();
  } else if (searchInput.value) {
    filterContent(searchInput.value);
  }
}

// Cerrar modal
function closeSearchModal() {
  modal.classList.remove('active');
  searchInput.value = '';
  resultsContainer.innerHTML = '';
}

// Cargar todos los contenidos desde GitHub (solo una vez)
async function loadContentFromGitHub() {
  isLoading = true;
  try {
    const response = await fetch('https://raw.githubusercontent.com/lzrdrz10/pelismania/main/search/index.html?nocache=' + Date.now());
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    allContent = Array.from(doc.querySelectorAll('article')).map(article => ({
      id: article.querySelector('content-id')?.textContent.trim() || '',
      poster: article.querySelector('poster')?.textContent.trim() || '',
      titulo: article.querySelector('titulo')?.textContent.trim() || '',
      anio: article.querySelector('anio')?.textContent.trim() || '',
      sinopsis: article.querySelector('sinopsis')?.textContent.trim() || '',
      enlace: article.querySelector('enlace-redireccionamiento')?.textContent.trim() || '',
      alternos: Array.from(article.querySelectorAll('titulos-alternos > titulo-alterno'))
        .map(el => el.textContent.trim())
        .join(' ')
    }));

    if (modal.classList.contains('active') && searchInput.value) {
      filterContent(searchInput.value);
    }
  } catch (error) {
    console.error('Error cargando buscador:', error);
    if (modal.classList.contains('active')) {
      resultsContainer.innerHTML = `<p style="color:#e50914;text-align:center;padding:20px;">Error al cargar los datos.</p>`;
    }
  } finally {
    isLoading = false;
  }
}

// Renderizar resultados
function renderResults(filtered) {
  resultsContainer.innerHTML = '';
  if (filtered.length === 0) {
    resultsContainer.innerHTML = `<p style="color:#777;text-align:center;padding:40px 20px;">No se encontraron resultados.</p>`;
    return;
  }

  filtered.forEach(item => {
    const card = document.createElement('div');
    card.className = 'result-card';
    card.innerHTML = `
      <img src="${item.poster}" alt="${item.titulo}">
      <div class="result-info">
        <h3>${item.titulo}</h3>
        <span class="year">${item.anio}</span>
      </div>
    `;
    card.addEventListener('click', () => {
      window.location.href = "https://lzrdrz10.github.io/pelismania" + item.enlace;
      closeSearchModal();
    });
    resultsContainer.appendChild(card);
  });
}

// Filtrar en tiempo real
function filterContent(query) {
  if (!query) {
    resultsContainer.innerHTML = '';
    return;
  }
  if (allContent.length === 0) return;

  const q = normalizeString(query);
  const filtered = allContent.filter(item =>
    normalizeString(item.titulo).includes(q) ||
    normalizeString(item.sinopsis).includes(q) ||
    normalizeString(item.alternos).includes(q)
  );

  renderResults(filtered);
}

// ====================== EVENTOS ======================
document.addEventListener('DOMContentLoaded', () => {
  if (!modal || !searchInput) return; // Si no existe el modal en esta página, no hacer nada

  searchIcon?.addEventListener('click', openSearchModal);
  closeModalBtn?.addEventListener('click', closeSearchModal);

  searchInput.addEventListener('input', (e) => filterContent(e.target.value));

  // Cerrar con ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeSearchModal();
    }
  });

  // Cerrar clic fuera
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeSearchModal();
  });
});