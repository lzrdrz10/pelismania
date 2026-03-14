// ==================== config/index.js (VERSIÓN LIMPIA) ====================

const HERO = document.getElementById("hero");
const DATA_URL = "https://raw.githubusercontent.com/lzrdrz10/pelismania/main/categoriashost/movies/index.html";
const TMDB_API_KEY = "38e497c6c1a043d1341416e80915669f";
const TMDB_LANG = "es-ES";

let currentTMDBData = null;
let currentArticleData = null;
let contenidos = [];

/* =============================
   CARGAR DATOS UNA VEZ
============================= */
fetch(DATA_URL)
  .then(res => res.text())
  .then(html => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const almacen = doc.querySelector("#almacen-datos");
    if (!almacen) return;

    contenidos = [...almacen.querySelectorAll("article.contenido")];
    if (!contenidos.length) return;

    // Hero random
    const primeros10 = contenidos.slice(0, 10);
    const selected = primeros10[Math.floor(Math.random() * primeros10.length)];
    const contentId = selected.getAttribute("data-id") || selected.querySelector("content-id")?.textContent.trim();
    if (contentId) loadTMDBData(selected, contentId);

    // Renderizar secciones
    renderTop10(primeros10);
    renderRecienAgregadas(primeros10);
  })
  .catch(console.error);

/* =============================
   TMDB DATA
============================= */
function loadTMDBData(article, id) {
  fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}&language=${TMDB_LANG}`)
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

  HERO.style.backgroundImage = `linear-gradient(to right, rgba(0,0,0,0.85), transparent 60%), url('${background}')`;

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
        <button class="btn btn-info" id="open-modal">ℹ Más información</button>
      </div>
    </div>
    <div class="fade-bottom"></div>
  `;

  document.getElementById("open-modal").onclick = openModal;
}

/* =============================
   MODAL INFO
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
        <svg viewBox="0 0 24 24"><path fill="currentColor" d="M18.3 5.71L12 12l6.3 6.29-1.42 1.42L10.59 13.41 4.29 19.71 2.87 18.29 9.17 12 2.87 5.71 4.29 4.29 10.59 10.59 16.88 4.29z"/></svg>
      </div>
      <div class="modal-body">
        <img class="modal-logo" src="${logo}" style="max-width:320px;margin-bottom:20px">
        <div class="banner-info" style="margin-bottom:16px">
          ⭐ ${currentTMDBData.vote_average?.toFixed(1)} • ${currentTMDBData.runtime} min • ${currentTMDBData.release_date?.slice(0,4)}
        </div>
        <div style="margin-bottom:16px;color:#aaa"><strong>Géneros:</strong> ${genres}</div>
        <div class="synopsis-label">Sinopsis</div>
        <div class="modal-synopsis">${currentTMDBData.overview || "Sin descripción disponible."}</div>
      </div>
    </div>
  `;
  modal.onclick = e => { if (e.target === modal) modal.remove(); };
  document.body.appendChild(modal);
}

function closeModal(el) {
  el.closest(".modal").remove();
}

/* =============================
   CONTAINER
============================= */
const MOVIES_CONTAINER = document.getElementById("movies-container");

/* =============================
   TOP 10
============================= */
function renderTop10(items) {
  const section = document.createElement("section");
  section.className = "section";
  section.innerHTML = `
    <h2 class="section-title">Top 10 en Películas</h2>
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
      <div class="top10-poster"><img src="${poster}" alt="${title}"></div>
    `;
    card.querySelector(".top10-poster").onclick = () => {
      location.href = "https://lzrdrz10.github.io/pelismania" + link;
    };
    row.appendChild(card);
  });
  MOVIES_CONTAINER.appendChild(section);
}

/* =============================
   RECIÉN AGREGADAS
============================= */
function renderRecienAgregadas(items) {
  const section = document.createElement("section");
  section.className = "section";
  section.innerHTML = `
    <h2 class="section-title">
      Recien Agregadas
      <span class="explore" onclick="location.href='categorias/movies/index.html';">Explorar todo</span>
    </h2>
    <div class="movies-row"></div>
  `;
  const row = section.querySelector(".movies-row");

  items.forEach(article => {
    const poster = article.querySelector("poster")?.textContent.trim();
    const titulo = article.querySelector("titulo")?.textContent.trim();
    const anio = article.querySelector("anio")?.textContent.trim();
    const enlace = article.querySelector("enlace-redireccionamiento")?.textContent.trim();
    if (!poster || !enlace) return;

    const card = document.createElement("div");
    card.className = "movie-card simple-card";
    card.style.width = "150px";
    card.innerHTML = `
      <img src="${poster}" alt="${titulo}">
      <div class="movie-title">
        <div>${titulo}</div>
        <div style="font-size:0.85rem;color:#aaa">${anio}</div>
      </div>
    `;
    card.onclick = () => location.href = "https://lzrdrz10.github.io/pelismania" + enlace;
    row.appendChild(card);
  });
  MOVIES_CONTAINER.appendChild(section);
}

/* =============================
   FAVORITOS
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
    card.onclick = () => location.href = item.url;
    row.appendChild(card);
  });
}

/* =============================
   INICIALIZAR
============================= */
document.addEventListener("DOMContentLoaded", () => {
  renderFavoritos();

  // ← CARGAR BUSCADOR EXTERNO (nuevo archivo)
  const searchScript = document.createElement("script");
  searchScript.src = "config/search-modal.js";
  document.body.appendChild(searchScript);
});
