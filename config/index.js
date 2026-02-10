const HERO = document.getElementById("hero");

const DATA_URL =
  "https://raw.githubusercontent.com/lzrdrz10/pelismania/main/categoriashost/movies/index.html";

const TMDB_API_KEY = "38e497c6c1a043d1341416e80915669f";
const TMDB_LANG = "es-ES";

let currentTMDBData = null;
let currentArticleData = null;

/* =============================
   HERO ALEATORIO
============================= */
fetch(DATA_URL)
  .then(res => res.text())
  .then(html => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const almacen = doc.querySelector("#almacen-datos");
    if (!almacen) return;

    const contenidos = [...almacen.querySelectorAll("article.contenido")].slice(0, 10);
    if (!contenidos.length) return;

    const selected = contenidos[Math.floor(Math.random() * contenidos.length)];

    const contentId =
      selected.getAttribute("data-id") ||
      selected.querySelector("content-id")?.textContent.trim();

    if (!contentId) return;

    loadTMDBData(selected, contentId);
  })
  .catch(console.error);

/* =============================
   TMDB DATA
============================= */
function loadTMDBData(article, id) {
  fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}&language=${TMDB_LANG}`
  )
    .then(res => res.json())
    .then(tmdb => {
      currentTMDBData = tmdb;
      currentArticleData = article;
      renderHero(article, tmdb);
    })
    .catch(console.error);
}

/* =============================
   HERO
============================= */
function renderHero(article, tmdb) {
  const background = article.querySelector("poster-background")?.textContent.trim();
  const logo = article.querySelector("logo")?.textContent.trim();
  const link = article.querySelector("enlace-redireccionamiento")?.textContent.trim();

  HERO.style.backgroundImage = `
    linear-gradient(to right, rgba(0,0,0,0.85), transparent 60%),
    url('${background}')
  `;

  HERO.innerHTML = `
    <div class="banner-content">
      <img class="banner-logo" src="${logo}" alt="${tmdb.title}">
      <div class="banner-info">
        ⭐ ${tmdb.vote_average?.toFixed(1)} • ${tmdb.runtime} min • ${tmdb.release_date?.slice(0,4)}
      </div>

      <div class="banner-buttons">
        <button class="btn btn-play" onclick="location.href='https://lzrdrz10.github.io/pelismania${link}'">
          ▶ Reproducir
        </button>
        <button class="btn btn-info" id="open-modal">
          ℹ Más información
        </button>
      </div>
    </div>
    <div class="fade-bottom"></div>
  `;

  document.getElementById("open-modal").onclick = openModal;
}

/* =============================
   MODAL
============================= */
function openModal() {
  if (!currentTMDBData || !currentArticleData) return;

  const logo = currentArticleData.querySelector("logo")?.textContent.trim();
  const genres = currentTMDBData.genres.map(g => g.name).join(", ");

  const modal = document.createElement("div");
  modal.className = "modal open";

  modal.innerHTML = `
    <div class="modal-content">
      <div class="close-modal" onclick="closeModal(this)">
        <svg viewBox="0 0 24 24">
          <path fill="currentColor" d="M18.3 5.71L12 12l6.3 6.29-1.42 1.42L10.59 13.41 4.29 19.71 2.87 18.29 9.17 12 2.87 5.71 4.29 4.29 10.59 10.59 16.88 4.29z"/>
        </svg>
      </div>

      <div class="modal-body">
        <img class="modal-logo" src="${logo}" style="max-width:320px;margin-bottom:20px">

        <div class="banner-info" style="margin-bottom:16px">
          ⭐ ${currentTMDBData.vote_average?.toFixed(1)} • 
          ${currentTMDBData.runtime} min • 
          ${currentTMDBData.release_date?.slice(0,4)}
        </div>

        <div style="margin-bottom:16px;color:#aaa">
          <strong>Géneros:</strong> ${genres}
        </div>

        <div class="synopsis-label">Sinopsis</div>
        <div class="modal-synopsis">
          ${currentTMDBData.overview || "Sin descripción disponible."}
        </div>
      </div>
    </div>
  `;

  modal.onclick = e => {
    if (e.target === modal) modal.remove();
  };

  document.body.appendChild(modal);
}

/* =============================
   CLOSE MODAL
============================= */
function closeModal(el) {
  el.closest(".modal").remove();
}


const MOVIES_CONTAINER = document.getElementById("movies-container");

/* =============================
   TOP 10 SECTION
============================= */
fetch(DATA_URL)
  .then(res => res.text())
  .then(html => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const almacen = doc.querySelector("#almacen-datos");
    if (!almacen) return;
    const contenidos = [...almacen.querySelectorAll("article.contenido")].slice(0, 10);
    if (!contenidos.length) return;
    renderTop10(contenidos);
  })
  .catch(err => console.error("Error cargando Top 10:", err));
/* =============================
   RENDER TOP 10
============================= */
function renderTop10(items) {
  const section = document.createElement("section");
  section.className = "section";
  section.innerHTML = `
    <h2 class="section-title">
      Top 10 en Películas
      <span class="explore">Explorar todo</span>
    </h2>
    <div class="movies-row"></div>
  `;
  const row = section.querySelector(".movies-row");
  items.forEach((article, index) => {
    const poster = article.querySelector("poster")?.textContent.trim();
    const title = article.querySelector("titulo")?.textContent.trim();
    const link = article.querySelector("enlace-redireccionamiento")?.textContent.trim();
    if (!poster || !link) return;
    const card = document.createElement("div");
    card.className = "top10-card";
    card.innerHTML = `
      <div class="top10-number">${index + 1}</div>
      <div class="top10-poster">
        <img src="${poster}" alt="${title}">
      </div>
    `;
    card.querySelector(".top10-poster").onclick = () => {
      location.href = "https://lzrdrz10.github.io/pelismania" + link;
    };
    row.appendChild(card);
  });
  MOVIES_CONTAINER.appendChild(section);
}

/* =============================
   MI LISTA (FAVORITOS)
============================= */
function renderFavoritos() {
  const favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
  if (!favoritos.length) return;

  const section = document.getElementById("favoritos-section");
  const row = document.getElementById("favoritos-row");

  if (!section || !row) return;

  section.style.display = "block";
  row.innerHTML = "";

  favoritos.forEach(item => {
    if (!item.id || !item.background || !item.url) return;

    const card = document.createElement("div");
    card.className = "movie-card";
    card.style.width = "420px";
    card.style.height = "235px";

    card.innerHTML = `
      <img src="${item.background}" alt="${item.titulo}">
      <div class="movie-title">
        <img src="${item.logo}" style="max-width:160px;margin-bottom:6px">
        <div style="font-size:0.85rem;color:#aaa">${item.año}</div>
      </div>
    `;

    card.onclick = () => {
      location.href = item.url;
    };

    row.appendChild(card);
  });
}



document.addEventListener("DOMContentLoaded", renderFavoritos);

// ====================== BUSCADOR CON MODAL ======================
const searchIcon = document.querySelector('.fa-magnifying-glass'); // tu icono de lupa
const modal = document.getElementById('search-modal');
const searchInput = document.getElementById('search-input');
const resultsContainer = document.getElementById('search-results');
const closeModalBtn = document.getElementById('close-modal');
let allContent = []; // Aquí guardaremos todos los artículos

// Función para normalizar strings: quita acentos, guiones (uniendo palabras), espacios extras, etc.
function normalizeString(str) {
  return str
    .normalize("NFD")             // Descompone acentos
    .replace(/[\u0300-\u036f]/g, "") // Quita acentos
    .toLowerCase()                // Minúsculas
    .replace(/[-_]/g, "")         // Elimina guiones y underscores (une palabras como "spider-man" → "spiderman")
    .replace(/\s+/g, " ")         // Quita espacios múltiples
    .trim();                      // Quita espacios al inicio/final
}

// Abrir modal
function openSearchModal() {
  modal.classList.add('active');
  searchInput.focus();
  if (allContent.length === 0) loadContentFromGitHub();
}

// Cerrar modal
function closeSearchModal() {
  modal.classList.remove('active');
  searchInput.value = '';
  resultsContainer.innerHTML = '';
}

// Cargar contenido desde GitHub raw
async function loadContentFromGitHub() {
  try {
    const response = await fetch('https://raw.githubusercontent.com/lzrdrz10/pelismania/main/search/index.html');
    const html = await response.text();
  
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
  
    const articles = doc.querySelectorAll('article');
  
    allContent = Array.from(articles).map(article => {
      return {
        id: article.querySelector('content-id')?.textContent.trim() || '',
        poster: article.querySelector('poster')?.textContent.trim() || '',
        titulo: article.querySelector('titulo')?.textContent.trim() || '',
        anio: article.querySelector('anio')?.textContent.trim() || '',
        sinopsis: article.querySelector('sinopsis')?.textContent.trim() || '',
        enlace: article.querySelector('enlace-redireccionamiento')?.textContent.trim() || '',
        alternos: Array.from(article.querySelectorAll('titulos-alternos > titulo-alterno'))
          .map(el => el.textContent.trim())
          .join(' ')
      };
    });
  } catch (error) {
    console.error('Error al cargar buscador:', error);
    resultsContainer.innerHTML = `<p style="color:#e50914;text-align:center;padding:20px;">Error al cargar los datos. Inténtalo más tarde.</p>`;
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
      window.location.href = item.enlace;
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
  const q = normalizeString(query);
 
  const filtered = allContent.filter(item =>
    normalizeString(item.titulo).includes(q) ||
    normalizeString(item.sinopsis).includes(q) ||
    normalizeString(item.alternos).includes(q)
  );
  renderResults(filtered);
}

// Eventos
searchIcon.addEventListener('click', openSearchModal);
closeModalBtn.addEventListener('click', closeSearchModal);
searchInput.addEventListener('input', (e) => filterContent(e.target.value));
// Cerrar con ESC o clic fuera
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('active')) {
    closeSearchModal();
  }
});
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeSearchModal();
});
