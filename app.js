const CONTENT_URL = "data/semana-01.json";
const STORAGE_KEY = "aprenderIAStateV1";
const initialState = {
  route: "home",
  completed: [],
  favorites: [],
  lastTopic: 5,
  lastPageByTopic: {},
  theme: "system"
};

let TOPICS = [];
let state = loadState();
let activeTopic = null;
let activePage = 0;

const app = document.querySelector("#app");
const dialog = document.querySelector("#lessonDialog");
const lessonTitle = document.querySelector("#lessonTitle");
const lessonKicker = document.querySelector("#lessonKicker");
const lessonContent = document.querySelector("#lessonContent");
const favoriteLesson = document.querySelector("#favoriteLesson");
const pageIndicator = document.querySelector("#pageIndicator");
const previousPage = document.querySelector("#previousPage");
const nextPage = document.querySelector("#nextPage");
const themeMeta = document.querySelector('meta[name="theme-color"]');
const toast = document.querySelector("#toast");

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return {
      ...initialState,
      ...saved,
      completed: Array.isArray(saved.completed) ? saved.completed : [],
      favorites: Array.isArray(saved.favorites) ? saved.favorites : [],
      lastPageByTopic: saved.lastPageByTopic && typeof saved.lastPageByTopic === "object" ? saved.lastPageByTopic : {}
    };
  } catch {
    return { ...initialState };
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>'"]/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;"
  })[character]);
}

function setTheme(mode = state.theme) {
  state.theme = mode;
  const prefersDark = matchMedia("(prefers-color-scheme: dark)").matches;
  const dark = mode === "dark" || (mode === "system" && prefersDark);
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  themeMeta.content = dark ? "#111512" : "#f6f5f1";
  saveState();
}

function cycleTheme() {
  const order = ["system", "light", "dark"];
  const next = order[(order.indexOf(state.theme) + 1) % order.length];
  setTheme(next);
  showToast({ system: "Tema automático", light: "Tema claro", dark: "Tema oscuro" }[next]);
}

function progressPercent() {
  return TOPICS.length ? Math.round((state.completed.length / TOPICS.length) * 100) : 0;
}

function topicStatus(topic) {
  if (state.completed.includes(topic.id)) return "✓";
  if (state.lastTopic === topic.id && Number(state.lastPageByTopic[topic.id]) > 0) return "●";
  return "›";
}

function topicCard(topic) {
  const favorite = state.favorites.includes(topic.id);
  return `
    <button class="topic-card" data-topic="${topic.id}">
      <span class="topic-number">${topic.id}</span>
      <span class="topic-copy">
        <h3>${favorite ? "★ " : ""}${escapeHtml(topic.title)}</h3>
        <p>${topic.time} min · ${escapeHtml(topic.summary)}</p>
      </span>
      <span class="topic-status" aria-hidden="true">${topicStatus(topic)}</span>
    </button>`;
}

function homeView() {
  const continueTopic = TOPICS.find(topic => topic.id === state.lastTopic) || TOPICS[0];
  const recent = [continueTopic, ...TOPICS.filter(topic => topic.id !== continueTopic.id)].slice(0, 4);
  return `
    <section class="hero">
      <p class="eyebrow">SEMANA 1 · FUNDAMENTOS</p>
      <h2>Estudiá antes de abrir una red social.</h2>
      <p>Sesiones cortas, temas claros y progreso guardado directamente en tu iPhone.</p>
      <button class="primary-button" data-topic="${continueTopic.id}">Continuar: tema ${continueTopic.id}</button>
    </section>

    <section class="section">
      <div class="progress-card">
        <div class="progress-row">
          <div>
            <p class="eyebrow">TU AVANCE</p>
            <strong>${state.completed.length} de ${TOPICS.length} temas</strong>
          </div>
          <strong>${progressPercent()}%</strong>
        </div>
        <div class="progress-track"><div class="progress-fill" style="width:${progressPercent()}%"></div></div>
      </div>
    </section>

    <section class="section">
      <div class="section-header">
        <h2>Para seguir ahora</h2>
        <button class="text-button" data-route="topics">Ver todos</button>
      </div>
      <div class="topic-list">${recent.map(topicCard).join("")}</div>
    </section>

    <section class="section">
      <div class="info-card">
        <p class="eyebrow">MÉTODO</p>
        <h3>Un tema está aprendido cuando podés explicarlo y aplicarlo.</h3>
        <p style="color:var(--muted);margin-bottom:0;line-height:1.5">No midas el aprendizaje por páginas leídas. Marcá un tema como completo solo cuando puedas explicarlo con tus palabras.</p>
      </div>
    </section>`;
}

function topicsView() {
  return `
    <section>
      <p class="eyebrow">SEMANA 1</p>
      <h2>Elegí un tema</h2>
      <div class="filter-bar" role="group" aria-label="Filtros de temas">
        <button class="filter-chip is-active" data-filter="all">Todos</button>
        <button class="filter-chip" data-filter="pending">Pendientes</button>
        <button class="filter-chip" data-filter="completed">Completados</button>
      </div>
    </section>
    <section class="section">
      <div id="filteredTopics" class="topic-list">${TOPICS.map(topicCard).join("")}</div>
    </section>`;
}

function favoritesView() {
  const favorites = TOPICS.filter(topic => state.favorites.includes(topic.id));
  return `
    <section>
      <p class="eyebrow">REPASO</p>
      <h2>Tus favoritos</h2>
    </section>
    <section class="section">
      ${favorites.length
        ? `<div class="topic-list">${favorites.map(topicCard).join("")}</div>`
        : `<div class="empty-state"><strong>Todavía no guardaste temas</strong>Tocá la estrella dentro de una lección para agregarla acá.</div>`}
    </section>`;
}

function progressView() {
  const remaining = Math.max(TOPICS.length - state.completed.length, 0);
  return `
    <section>
      <p class="eyebrow">SEMANA 1</p>
      <h2>Tu progreso</h2>
    </section>
    <section class="section stats-grid">
      <div class="stat-card"><strong>${progressPercent()}%</strong><span>completado</span></div>
      <div class="stat-card"><strong>${state.completed.length}</strong><span>temas listos</span></div>
      <div class="stat-card"><strong>${remaining}</strong><span>por estudiar</span></div>
      <div class="stat-card"><strong>${TOPICS.reduce((sum, topic) => sum + topic.time, 0)}</strong><span>minutos totales</span></div>
    </section>
    <section class="section">
      <div class="progress-card">
        <div class="progress-row"><strong>Semana 1</strong><strong>${progressPercent()}%</strong></div>
        <div class="progress-track"><div class="progress-fill" style="width:${progressPercent()}%"></div></div>
      </div>
    </section>
    <section class="section">
      <button id="resetProgress" class="ghost-button" style="width:100%">Reiniciar progreso</button>
    </section>`;
}

function loadingView() {
  return `<div class="empty-state"><strong>Cargando contenido…</strong>Preparando la Semana 1.</div>`;
}

function errorView() {
  return `<div class="empty-state"><strong>No se pudo cargar el contenido</strong>Recargá la aplicación cuando tengas conexión. Después seguirá disponible sin conexión.</div>`;
}

function render() {
  if (!TOPICS.length) {
    app.innerHTML = loadingView();
    return;
  }
  const views = { home: homeView, topics: topicsView, favorites: favoritesView, progress: progressView };
  app.innerHTML = (views[state.route] || homeView)();
  document.querySelectorAll(".nav-item").forEach(button => {
    button.classList.toggle("is-active", button.dataset.route === state.route);
  });
  app.focus({ preventScroll: true });
}

function navigate(route) {
  state.route = route;
  saveState();
  render();
  scrollTo({ top: 0, behavior: "smooth" });
}

function openTopic(id) {
  activeTopic = TOPICS.find(topic => topic.id === Number(id));
  if (!activeTopic) return;
  activePage = Math.min(Number(state.lastPageByTopic[activeTopic.id] || 0), activeTopic.pages.length - 1);
  state.lastTopic = activeTopic.id;
  saveState();
  dialog.showModal();
  renderLessonPage();
}

function renderList(items, ordered = false) {
  const tag = ordered ? "ol" : "ul";
  return `<${tag}>${(items || []).map(item => `<li>${escapeHtml(item)}</li>`).join("")}</${tag}>`;
}

function renderBlock(block) {
  if (!block || !block.type) return "";

  switch (block.type) {
    case "paragraph":
      return `<p>${escapeHtml(block.text)}</p>`;
    case "definition":
      return `<div class="content-block definition-block"><strong>${escapeHtml(block.term || "Definición")}</strong><p>${escapeHtml(block.text)}</p></div>`;
    case "bullets":
      return `<div class="content-block">${renderList(block.items)}</div>`;
    case "steps":
      return `<div class="content-block steps-block">${renderList(block.items, true)}</div>`;
    case "comparison":
      return `<div class="comparison-grid">${(block.items || []).map(item => `<div class="comparison-item"><strong>${escapeHtml(item.label)}</strong><p>${escapeHtml(item.text)}</p></div>`).join("")}</div>`;
    case "example":
      return `<div class="content-block example-block"><strong>Ejemplo</strong><p>${escapeHtml(block.text)}</p></div>`;
    case "companyExample":
      return `<div class="content-block company-example-block"><strong>Ejemplo en tu empresa</strong><p>${escapeHtml(block.text)}</p></div>`;
    case "warning":
      return `<div class="lesson-callout warning-block"><strong>Atención:</strong> ${escapeHtml(block.text)}</div>`;
    case "keyIdea":
      return `<div class="lesson-callout"><strong>Clave:</strong> ${escapeHtml(block.text)}</div>`;
    case "image": {
      const src = escapeHtml(block.src);
      const alt = escapeHtml(block.alt || "Imagen educativa");
      const caption = block.caption ? `<figcaption>${escapeHtml(block.caption)}</figcaption>` : "";
      return `<figure class="lesson-image"><img src="${src}" alt="${alt}" loading="lazy">${caption}</figure>`;
    }
    default:
      return "";
  }
}

function renderLessonPage() {
  const page = activeTopic.pages[activePage];
  lessonKicker.textContent = `TEMA ${activeTopic.id} · ${activeTopic.time} MIN`;
  lessonTitle.textContent = activeTopic.title;
  favoriteLesson.textContent = state.favorites.includes(activeTopic.id) ? "★" : "☆";
  favoriteLesson.setAttribute("aria-label", state.favorites.includes(activeTopic.id) ? "Quitar de favoritos" : "Agregar a favoritos");
  lessonContent.innerHTML = `
    <article class="lesson-page">
      <div class="lesson-text-card">
        <span class="page-label">Idea ${activePage + 1}</span>
        <h3>${escapeHtml(page.title)}</h3>
        ${(page.blocks || []).map(renderBlock).join("")}
      </div>
    </article>`;
  pageIndicator.textContent = `${activePage + 1}/${activeTopic.pages.length}`;
  previousPage.disabled = activePage === 0;
  previousPage.style.opacity = activePage === 0 ? ".4" : "1";
  nextPage.textContent = activePage === activeTopic.pages.length - 1 ? "Completar" : "Siguiente";
  state.lastPageByTopic[activeTopic.id] = activePage;
  saveState();
  lessonContent.scrollTo({ top: 0 });
}

function nextLessonPage() {
  if (activePage < activeTopic.pages.length - 1) {
    activePage += 1;
    renderLessonPage();
    return;
  }
  if (!state.completed.includes(activeTopic.id)) state.completed.push(activeTopic.id);
  state.lastPageByTopic[activeTopic.id] = 0;
  const nextTopic = TOPICS.find(topic => topic.id > activeTopic.id && !state.completed.includes(topic.id));
  if (nextTopic) state.lastTopic = nextTopic.id;
  saveState();
  dialog.close();
  render();
  showToast("Tema completado");
}

function previousLessonPage() {
  if (activePage > 0) {
    activePage -= 1;
    renderLessonPage();
  }
}

function toggleFavorite() {
  const id = activeTopic.id;
  state.favorites = state.favorites.includes(id)
    ? state.favorites.filter(item => item !== id)
    : [...state.favorites, id];
  saveState();
  renderLessonPage();
  showToast(state.favorites.includes(id) ? "Guardado en favoritos" : "Quitado de favoritos");
}

function filterTopics(filter) {
  const filtered = TOPICS.filter(topic => {
    if (filter === "completed") return state.completed.includes(topic.id);
    if (filter === "pending") return !state.completed.includes(topic.id);
    return true;
  });
  document.querySelector("#filteredTopics").innerHTML = filtered.length
    ? filtered.map(topicCard).join("")
    : `<div class="empty-state"><strong>No hay temas en esta vista</strong>Probá con otro filtro.</div>`;
  document.querySelectorAll(".filter-chip").forEach(chip => chip.classList.toggle("is-active", chip.dataset.filter === filter));
}

let toastTimer;
function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 1800);
}

async function loadContent() {
  try {
    const response = await fetch(CONTENT_URL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const content = await response.json();
    if (!content || !Array.isArray(content.topics) || !content.topics.length) throw new Error("Contenido inválido");
    TOPICS = content.topics;
    render();
  } catch (error) {
    console.error("No se pudo cargar el contenido educativo", error);
    app.innerHTML = errorView();
  }
}

document.addEventListener("click", event => {
  const topicButton = event.target.closest("[data-topic]");
  if (topicButton) openTopic(topicButton.dataset.topic);

  const routeButton = event.target.closest("[data-route]");
  if (routeButton) navigate(routeButton.dataset.route);

  const filterButton = event.target.closest("[data-filter]");
  if (filterButton) filterTopics(filterButton.dataset.filter);

  if (event.target.closest("#resetProgress")) {
    const keepTheme = state.theme;
    state = { ...initialState, theme: keepTheme };
    saveState();
    render();
    showToast("Progreso reiniciado");
  }
});

document.querySelector("#themeButton").addEventListener("click", cycleTheme);
document.querySelector("#closeLesson").addEventListener("click", () => dialog.close());
favoriteLesson.addEventListener("click", toggleFavorite);
previousPage.addEventListener("click", previousLessonPage);
nextPage.addEventListener("click", nextLessonPage);

dialog.addEventListener("cancel", event => {
  event.preventDefault();
  dialog.close();
});

dialog.addEventListener("close", render);
matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
  if (state.theme === "system") setTheme("system");
});

setTheme();
render();
loadContent();

if ("serviceWorker" in navigator) {
  addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
}
