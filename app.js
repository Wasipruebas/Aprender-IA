const TOPICS = [
  {
    id: 5,
    slug: "machine-learning",
    title: "Machine learning",
    time: 4,
    summary: "Cómo una máquina aprende patrones a partir de ejemplos.",
    pages: [
      { title: "Aprender desde datos", body: "Machine learning es una rama de la inteligencia artificial en la que un sistema aprende patrones a partir de datos, en vez de depender solamente de reglas escritas para cada caso.", callout: "No aprende como una persona: ajusta parámetros para mejorar una tarea definida." },
      { title: "Entrenar, evaluar, usar", body: "Primero se entrena el modelo con datos. Después se evalúa con casos que no vio. Finalmente se usa para procesar entradas nuevas, etapa llamada inferencia.", bullets: ["Entrenamiento: aprende patrones.", "Evaluación: medimos si generaliza.", "Inferencia: produce un resultado nuevo."] },
      { title: "Ejemplo en tu empresa", body: "Con ventas históricas, un modelo podría estimar qué clientes tienen mayor probabilidad de comprar o qué productos podrían venderse la semana siguiente.", callout: "Los saldos y el stock actual deben seguir calculándose con datos exactos, no con una predicción." }
    ]
  },
  {
    id: 6,
    slug: "deep-learning",
    title: "Deep learning",
    time: 4,
    summary: "Redes neuronales profundas y por qué impulsaron la IA moderna.",
    pages: [
      { title: "Una rama de machine learning", body: "Deep learning es machine learning basado en redes neuronales con muchas capas. Es especialmente útil para trabajar con lenguaje, imágenes, audio y patrones complejos." },
      { title: "Capas y representaciones", body: "Cada capa transforma la información y aprende representaciones cada vez más útiles para la tarea. En visión, por ejemplo, puede pasar de bordes a formas y luego a objetos." },
      { title: "Potente, pero exigente", body: "Suele requerir muchos datos, capacidad de cómputo y controles. Puede ser excelente sin que resulte fácil explicar cada decisión interna.", bullets: ["Alta capacidad.", "Mayor costo de entrenamiento.", "Explicabilidad limitada.", "Necesidad de pruebas rigurosas."] }
    ]
  },
  {
    id: 7,
    slug: "ia-generativa",
    title: "IA generativa",
    time: 5,
    summary: "Sistemas que producen texto, imágenes, audio, código y más.",
    pages: [
      { title: "Crear contenido nuevo", body: "La IA generativa produce salidas nuevas a partir de patrones aprendidos. Puede generar texto, imágenes, audio, video, código o datos estructurados." },
      { title: "Probable no significa verdadero", body: "Un modelo puede escribir una respuesta clara y convincente que sea incorrecta. La calidad de la redacción no demuestra que el dato sea verdadero.", callout: "Para cálculos, regulaciones o información crítica, hay que usar fuentes y validaciones." },
      { title: "Uso aplicado", body: "Puede interpretar pedidos escritos de manera variable, redactar mensajes comerciales o ayudar a programar Rodo 2.0. Las reglas exactas deben controlar precios, stock, crédito y totales." }
    ]
  },
  {
    id: 8,
    slug: "predictiva-generativa",
    title: "Predictiva y generativa",
    time: 4,
    summary: "Predecir un resultado versus crear contenido.",
    pages: [
      { title: "Dos objetivos distintos", body: "La IA predictiva estima una categoría, un valor o una probabilidad. La IA generativa crea contenido nuevo." },
      { title: "Ejemplos rápidos", body: "Predecir demanda o riesgo de atraso es predictivo. Redactar un mensaje, resumir un documento o crear una imagen es generativo." },
      { title: "La combinación más útil", body: "Un sistema puede predecir qué clientes probablemente compren, generar un mensaje para cada segmento y aplicar reglas de stock, margen y descuentos.", callout: "Predicción decide a quién o cuánto; generación produce el contenido." }
    ]
  },
  {
    id: 9,
    slug: "modelos-aplicaciones-herramientas",
    title: "Modelos, aplicaciones y herramientas",
    time: 5,
    summary: "Diferenciar el motor, el producto y las capacidades auxiliares.",
    pages: [
      { title: "El modelo", body: "Un modelo es el componente entrenado que transforma entradas en predicciones, clasificaciones o contenido. Es el motor de la capacidad de IA." },
      { title: "La aplicación", body: "La aplicación es el producto o interfaz con la que interactúa el usuario. Puede usar uno o varios modelos, una base de datos y reglas tradicionales." },
      { title: "Las herramientas", body: "Las herramientas permiten que el sistema haga algo fuera del modelo: buscar información, calcular, consultar una base de datos, enviar un correo o ejecutar código.", callout: "ChatGPT es una aplicación; el modelo es uno de sus componentes." }
    ]
  },
  {
    id: 10,
    slug: "modelos-abiertos-cerrados",
    title: "Modelos abiertos y cerrados",
    time: 5,
    summary: "Control, acceso, licencias, costos y responsabilidades.",
    pages: [
      { title: "No es una división absoluta", body: "Un modelo puede ser abierto en algunos aspectos y cerrado en otros. Hay que revisar si ofrece pesos, código, datos de entrenamiento, licencia y permiso de uso comercial." },
      { title: "Modelos abiertos", body: "Pueden dar más control, personalización y posibilidad de ejecutarlos en infraestructura propia. También exigen mantenimiento, seguridad y capacidad técnica." },
      { title: "Modelos cerrados", body: "Suelen ser más fáciles de usar como servicio y reciben mejoras administradas por el proveedor. A cambio, hay mayor dependencia y menos control sobre el funcionamiento interno.", callout: "La elección depende del riesgo, costo, privacidad y capacidad de mantenimiento." }
    ]
  },
  {
    id: 11,
    slug: "sistemas-multimodales",
    title: "Sistemas multimodales",
    time: 4,
    summary: "Combinar texto, imágenes, audio, video y herramientas.",
    pages: [
      { title: "Más de una modalidad", body: "Un sistema multimodal puede procesar o generar más de un tipo de contenido: texto, imagen, audio, video o datos estructurados." },
      { title: "Ejemplos cotidianos", body: "Puede mirar una factura y extraer campos, escuchar un audio de WhatsApp y convertirlo en un pedido, o recibir una foto junto con instrucciones escritas." },
      { title: "No elimina la validación", body: "Que un sistema entienda varias modalidades no garantiza precisión. Una imagen borrosa, un audio confuso o una instrucción ambigua pueden producir errores.", callout: "La multimodalidad amplía la entrada; los controles siguen siendo necesarios." }
    ]
  },
  {
    id: 12,
    slug: "cuando-usar-ia",
    title: "Cómo elegir si un problema necesita IA",
    time: 6,
    summary: "Elegir la solución más simple y confiable para cada tarea.",
    pages: [
      { title: "Primero, definir el problema", body: "No hay que empezar preguntando qué IA usar. Primero hay que definir qué resultado se necesita, cómo se mide y qué pasa cuando hay un error." },
      { title: "Señales de que podría servir", body: "La IA puede aportar cuando hay lenguaje libre, imágenes, audios, patrones difíciles de expresar con reglas o muchos casos repetitivos que requieren interpretación." },
      { title: "Señales de que no hace falta", body: "Si la regla es exacta, simple y comprobable, suele convenir software tradicional. Sumar facturas, aplicar un porcentaje o bloquear una venta sin stock no necesita IA." },
      { title: "Soluciones híbridas", body: "En muchos procesos la mejor respuesta combina IA para interpretar, reglas para calcular, bases de datos para verificar y personas para decidir excepciones.", callout: "Usá IA solamente donde aporte una ventaja concreta." }
    ]
  },
  {
    id: 13,
    slug: "riesgos-limitaciones",
    title: "Riesgos y limitaciones básicas",
    time: 6,
    summary: "Errores, privacidad, dependencia, costos y automatización excesiva.",
    pages: [
      { title: "Alucinaciones y omisiones", body: "Un sistema generativo puede inventar datos, omitir información o responder con seguridad aunque esté equivocado. Por eso la salida debe poder comprobarse." },
      { title: "Datos y privacidad", body: "La calidad depende de los datos disponibles. También hay que definir qué información puede enviarse a un proveedor y cómo se protege la información sensible." },
      { title: "Automatización excesiva", body: "Una respuesta incorrecta se vuelve más peligrosa cuando ejecuta acciones automáticamente. Las decisiones críticas necesitan límites y aprobación humana." },
      { title: "Costo y dependencia", body: "Hay costos de uso, integración, mantenimiento y revisión. Además, depender de un único proveedor puede dificultar una migración futura.", callout: "La pregunta no es solo si funciona, sino si es confiable, controlable y rentable." }
    ]
  }
];

const STORAGE_KEY = "aprenderIAStateV1";
const initialState = {
  route: "home",
  completed: [],
  favorites: [],
  lastTopic: 5,
  lastPageByTopic: {},
  theme: "system"
};

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
    return { ...initialState, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") };
  } catch {
    return { ...initialState };
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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
  return Math.round((state.completed.length / TOPICS.length) * 100);
}

function topicStatus(topic) {
  if (state.completed.includes(topic.id)) return "✓";
  if (state.lastTopic === topic.id && state.lastPageByTopic[topic.id] > 0) return "●";
  return "›";
}

function topicCard(topic) {
  const favorite = state.favorites.includes(topic.id);
  return `
    <button class="topic-card" data-topic="${topic.id}">
      <span class="topic-number">${topic.id}</span>
      <span class="topic-copy">
        <h3>${favorite ? "★ " : ""}${topic.title}</h3>
        <p>${topic.time} min · ${topic.summary}</p>
      </span>
      <span class="topic-status" aria-hidden="true">${topicStatus(topic)}</span>
    </button>`;
}

function homeView() {
  const continueTopic = TOPICS.find(t => t.id === state.lastTopic) || TOPICS[0];
  const recent = [continueTopic, ...TOPICS.filter(t => t.id !== continueTopic.id)].slice(0, 4);
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
  const favorites = TOPICS.filter(t => state.favorites.includes(t.id));
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
  const remaining = TOPICS.length - state.completed.length;
  return `
    <section>
      <p class="eyebrow">SEMANA 1</p>
      <h2>Tu progreso</h2>
    </section>
    <section class="section stats-grid">
      <div class="stat-card"><strong>${progressPercent()}%</strong><span>completado</span></div>
      <div class="stat-card"><strong>${state.completed.length}</strong><span>temas listos</span></div>
      <div class="stat-card"><strong>${remaining}</strong><span>por estudiar</span></div>
      <div class="stat-card"><strong>${TOPICS.reduce((sum,t) => sum + t.time, 0)}</strong><span>minutos totales</span></div>
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

function render() {
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
        <h3>${page.title}</h3>
        <p>${page.body}</p>
        ${page.bullets ? `<ul>${page.bullets.map(item => `<li>${item}</li>`).join("")}</ul>` : ""}
        ${page.callout ? `<div class="lesson-callout"><strong>Clave:</strong> ${page.callout}</div>` : ""}
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
  const nextTopic = TOPICS.find(t => t.id > activeTopic.id && !state.completed.includes(t.id));
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

if ("serviceWorker" in navigator) {
  addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
}
