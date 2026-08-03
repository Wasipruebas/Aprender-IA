const STORAGE_KEY = "aprenderIAStateV2";

const initialState = {
  route: "home",
  completedLessons: [],
  favorites: [],
  lastLesson: 1,
  lastPageByLesson: {},
  lessonChecks: {},
  practice: { answers: {}, reflection: "", evaluated: false, completed: false, score: 0 },
  finalQuiz: { answers: {}, evaluated: false, completed: false, score: 0 },
  theme: "system"
};

let course = null;
let state = loadState();
let activeLesson = null;
let activePage = 0;
let pointerStart = null;
let toastTimer;

const app = document.querySelector("#app");
const dialog = document.querySelector("#lessonDialog");
const lessonTitle = document.querySelector("#lessonTitle");
const lessonKicker = document.querySelector("#lessonKicker");
const lessonContent = document.querySelector("#lessonContent");
const favoriteLesson = document.querySelector("#favoriteLesson");
const pageIndicator = document.querySelector("#pageIndicator");
const previousPage = document.querySelector("#previousPage");
const nextPage = document.querySelector("#nextPage");
const storyProgress = document.querySelector("#storyProgress");
const themeMeta = document.querySelector('meta[name="theme-color"]');
const themeIcon = document.querySelector("#themeIcon");
const toast = document.querySelector("#toast");

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return {
      ...initialState,
      ...saved,
      completedLessons: Array.isArray(saved.completedLessons) ? saved.completedLessons : [],
      favorites: Array.isArray(saved.favorites) ? saved.favorites : [],
      lastPageByLesson: { ...initialState.lastPageByLesson, ...(saved.lastPageByLesson || {}) },
      lessonChecks: { ...initialState.lessonChecks, ...(saved.lessonChecks || {}) },
      practice: { ...initialState.practice, ...(saved.practice || {}) },
      finalQuiz: { ...initialState.finalQuiz, ...(saved.finalQuiz || {}) }
    };
  } catch {
    return structuredClone(initialState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalize(value = "") {
  return String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function setTheme(mode = state.theme) {
  state.theme = mode;
  const prefersDark = matchMedia("(prefers-color-scheme: dark)").matches;
  const useDark = mode === "dark" || (mode === "system" && prefersDark);
  document.documentElement.dataset.theme = useDark ? "dark" : "light";
  themeMeta.content = useDark ? "#0d151f" : "#f6f2e8";
  themeIcon.textContent = { system: "◐", light: "☀", dark: "☾" }[mode];
  saveState();
}

function cycleTheme() {
  const order = ["system", "light", "dark"];
  const next = order[(order.indexOf(state.theme) + 1) % order.length];
  setTheme(next);
  showToast({ system: "Apariencia automática", light: "Modo claro", dark: "Modo oscuro" }[next]);
}

function completedCount() {
  return state.completedLessons.filter(id => course.lessons.some(lesson => lesson.id === id)).length;
}

function lessonPercent() {
  return Math.round((completedCount() / course.lessons.length) * 100);
}

function overallPercent() {
  const lessons = (completedCount() / course.lessons.length) * 70;
  const practice = state.practice.completed ? 15 : 0;
  const quiz = state.finalQuiz.completed ? 15 : 0;
  return Math.round(lessons + practice + quiz);
}

function firstIncompleteLesson() {
  return course.lessons.find(lesson => !state.completedLessons.includes(lesson.id)) || course.lessons.at(-1);
}

function continueLesson() {
  const saved = course.lessons.find(lesson => lesson.id === Number(state.lastLesson));
  if (saved && !state.completedLessons.includes(saved.id)) return saved;
  return firstIncompleteLesson();
}

function lessonStatus(lesson) {
  if (state.completedLessons.includes(lesson.id)) return "✓";
  if ((state.lastPageByLesson[lesson.id] || 0) > 0 || state.lessonChecks[lesson.id]?.draft) return "●";
  return "›";
}

function lessonCard(lesson) {
  const passed = state.completedLessons.includes(lesson.id);
  const favorite = state.favorites.includes(lesson.id);
  return `
    <button class="topic-card ${passed ? "is-passed" : ""}" data-lesson="${lesson.id}">
      <span class="topic-number" aria-hidden="true">${lesson.icon}</span>
      <span class="topic-copy">
        <h3>${lesson.id}. ${escapeHtml(lesson.shortTitle)}${favorite ? " · ★" : ""}</h3>
        <p>${lesson.minutes} min · ${escapeHtml(lesson.summary)}</p>
      </span>
      <span class="topic-status" aria-hidden="true">${lessonStatus(lesson)}</span>
    </button>`;
}

function progressCard() {
  return `
    <div class="progress-card">
      <div class="progress-row">
        <div>
          <p class="eyebrow">CONOCIMIENTO DEMOSTRADO</p>
          <strong>${completedCount()} de ${course.lessons.length} temas</strong>
        </div>
        <strong>${overallPercent()}%</strong>
      </div>
      <div class="progress-track" aria-label="${overallPercent()} por ciento de la semana completado">
        <div class="progress-fill" style="width:${overallPercent()}%"></div>
      </div>
      <p class="progress-caption">Los temas suman progreso después de explicar y responder, no por abrir una pantalla.</p>
    </div>`;
}

function homeView() {
  const next = continueLesson();
  const pending = course.lessons.filter(lesson => !state.completedLessons.includes(lesson.id)).slice(0, 3);
  return `
    <section class="hero">
      <p class="eyebrow">SEMANA 1 · FUNDAMENTOS</p>
      <h1>Una idea útil antes de abrir una red social.</h1>
      <p>${escapeHtml(course.description)}</p>
      <div class="hero-meta">
        <span class="hero-chip">13 microlecciones</span>
        <span class="hero-chip">Práctica real</span>
        <span class="hero-chip">Evaluación final</span>
      </div>
      <button class="primary-button" data-lesson="${next.id}">Continuar: tema ${next.id}</button>
    </section>

    <section class="section">${progressCard()}</section>

    <section class="section">
      <div class="section-header">
        <h2>Tu próxima jugada</h2>
        <button class="text-button" data-route="path">Ver ruta</button>
      </div>
      <div class="topic-list">${(pending.length ? pending : course.lessons.slice(-3)).map(lessonCard).join("")}</div>
    </section>

    <section class="section">
      <div class="section-header"><h2>Cómo se aprende acá</h2></div>
      <div class="method-grid">
        <div class="method-card"><span>📖</span><strong>Entendé</strong><small>Una idea breve por pantalla.</small></div>
        <div class="method-card"><span>🏪</span><strong>Aplicá</strong><small>Casos de la distribuidora.</small></div>
        <div class="method-card"><span>✍️</span><strong>Explicá</strong><small>Escribí sin copiar la teoría.</small></div>
        <div class="method-card"><span>✓</span><strong>Comprobá</strong><small>Corregí antes de avanzar.</small></div>
      </div>
    </section>`;
}

function pathView() {
  const favorites = course.lessons.filter(lesson => state.favorites.includes(lesson.id));
  return `
    <section class="path-intro">
      <p class="eyebrow">TU RUTA</p>
      <h1>Mapa general de la IA</h1>
      <p>Seguí el orden recomendado o abrí un tema para repasarlo. Cada lección dura entre 7 y 13 minutos.</p>
    </section>
    <section class="section">
      <div class="topic-list">${course.lessons.map(lessonCard).join("")}</div>
    </section>
    ${favorites.length ? `
      <section class="section">
        <div class="section-header"><h2>Guardados para repasar</h2></div>
        <div class="topic-list">${favorites.map(lessonCard).join("")}</div>
      </section>` : ""}`;
}

function practiceView() {
  const practice = course.practice;
  return `
    <section class="page-intro">
      <p class="eyebrow">HACER PARA APRENDER</p>
      <h1>Laboratorio y evaluación</h1>
      <p>Primero resolvé los casos de tu empresa. Después comprobá si podés defender el mapa completo sin ayuda.</p>
    </section>

    <section class="section practice-card" id="practiceLab">
      <p class="eyebrow">DESAFÍO APLICADO</p>
      <h2>${escapeHtml(practice.title)}</h2>
      <p>${escapeHtml(practice.description)}</p>
      <img class="practice-visual" src="${practice.visual}" alt="Aplicaciones prácticas de IA en una distribuidora" loading="lazy">
      <div class="case-list">
        ${practice.cases.map((item, index) => practiceCase(item, index)).join("")}
      </div>
      <div class="reflection-card section">
        <label class="check-prompt" for="practiceReflection">${escapeHtml(practice.reflectionPrompt)}</label>
        <textarea id="practiceReflection" placeholder="${escapeHtml(practice.reflectionPlaceholder)}">${escapeHtml(state.practice.reflection)}</textarea>
        <p class="char-hint">Escribí al menos ${practice.minReflectionLength} caracteres. Tu respuesta queda guardada en este dispositivo.</p>
      </div>
      <button class="primary-button wide-button" id="evaluatePractice">Comprobar laboratorio</button>
      ${practiceResult()}
    </section>

    <section class="section quiz-card" id="finalQuiz">
      <p class="eyebrow">CIERRE DE SEMANA</p>
      <h2>${escapeHtml(course.finalQuiz.title)}</h2>
      <p>${escapeHtml(course.finalQuiz.description)}</p>
      <div class="section">
        ${course.finalQuiz.questions.map((question, index) => quizQuestion(question, index)).join("")}
      </div>
      <button class="primary-button wide-button" id="evaluateQuiz">Corregir evaluación</button>
      ${quizResult()}
    </section>`;
}

function practiceCase(item, index) {
  const selected = state.practice.answers[item.id] || "";
  const correct = item.answers.includes(selected);
  const status = state.practice.evaluated ? (correct ? "is-correct" : "is-wrong") : "";
  return `
    <div class="case-row ${status}" data-practice-case="${item.id}">
      <p>${index + 1}. ${escapeHtml(item.text)}</p>
      <select aria-label="Clasificación para: ${escapeHtml(item.text)}">
        <option value="">Elegí una solución…</option>
        ${course.practice.choices.map(choice => `<option value="${choice.id}" ${selected === choice.id ? "selected" : ""}>${escapeHtml(choice.label)}</option>`).join("")}
      </select>
      <p class="case-result">${correct ? "Bien." : "Revisá esta decisión."} ${escapeHtml(item.why)}</p>
    </div>`;
}

function practiceResult() {
  if (!state.practice.evaluated) return '<div class="practice-score" id="practiceScore"></div>';
  const missingReflection = state.practice.reflection.trim().length < course.practice.minReflectionLength;
  const className = state.practice.completed ? "is-pass" : "is-fail";
  const message = state.practice.completed
    ? `Laboratorio aprobado con ${state.practice.score}%. Defendiste tus prioridades y elegiste bien las herramientas.`
    : `Resultado: ${state.practice.score}%. ${missingReflection ? "Completá la justificación de tus prioridades. " : ""}Revisá los casos marcados y volvé a comprobar.`;
  return `<div class="practice-score is-visible ${className}" id="practiceScore">${message}</div>`;
}

function quizQuestion(question, index) {
  const selected = Number(state.finalQuiz.answers[index]);
  const hasSelection = state.finalQuiz.answers[index] !== undefined;
  const correct = hasSelection && selected === question.answer;
  const status = state.finalQuiz.evaluated ? (correct ? "is-correct" : "is-wrong") : "";
  return `
    <fieldset class="quiz-question ${status}" data-quiz-question="${index}" style="border:0;padding-left:0;padding-right:0">
      <h3>${index + 1}. ${escapeHtml(question.text)}</h3>
      <div class="option-list">
        ${question.options.map((option, optionIndex) => `
          <label class="option-label">
            <input type="radio" name="quiz-${index}" value="${optionIndex}" ${selected === optionIndex && hasSelection ? "checked" : ""}>
            <span>${escapeHtml(option)}</span>
          </label>`).join("")}
      </div>
    </fieldset>`;
}

function quizResult() {
  if (!state.finalQuiz.evaluated) return '<div class="quiz-result" id="quizResult"></div>';
  const className = state.finalQuiz.completed ? "is-pass" : "is-fail";
  const message = state.finalQuiz.completed
    ? `Aprobaste con ${state.finalQuiz.score}%. La Semana 1 queda completada cuando también apruebes las 13 lecciones y el laboratorio.`
    : `Obtuviste ${state.finalQuiz.score}%. Revisá las preguntas marcadas y repetí la evaluación hasta llegar al 80%.`;
  return `<div class="quiz-result is-visible ${className}" id="quizResult">${message}</div>`;
}

function progressView() {
  const reflections = Object.values(state.lessonChecks).filter(check => check?.draft?.trim()).length;
  const weekComplete = overallPercent() === 100;
  return `
    <section class="page-intro">
      <p class="eyebrow">EVIDENCIAS</p>
      <h1>Tu progreso real</h1>
      <p>Acá cuenta lo que explicaste, aplicaste y aprobaste. Abrir una pantalla no suma dominio.</p>
    </section>
    <section class="section">${progressCard()}</section>
    <section class="section stats-grid">
      <div class="stat-card"><strong>${lessonPercent()}%</strong><span>microlecciones</span></div>
      <div class="stat-card"><strong>${reflections}</strong><span>explicaciones guardadas</span></div>
      <div class="stat-card"><strong>${state.practice.completed ? "✓" : "—"}</strong><span>laboratorio</span></div>
      <div class="stat-card"><strong>${state.finalQuiz.evaluated ? `${state.finalQuiz.score}%` : "—"}</strong><span>evaluación final</span></div>
    </section>
    <section class="section">
      <div class="section-header"><h2>Condiciones de cierre</h2></div>
      <div class="milestone-list">
        <div class="milestone-card"><span class="milestone-icon">${completedCount() === course.lessons.length ? "✓" : "1"}</span><div><h3>13 explicaciones aprobadas</h3><p>${completedCount()} de ${course.lessons.length} temas demostrados.</p></div></div>
        <div class="milestone-card"><span class="milestone-icon">${state.practice.completed ? "✓" : "2"}</span><div><h3>Laboratorio empresarial</h3><p>${state.practice.completed ? `Aprobado con ${state.practice.score}%.` : "Clasificar procesos y defender prioridades."}</p></div></div>
        <div class="milestone-card"><span class="milestone-icon">${state.finalQuiz.completed ? "✓" : "3"}</span><div><h3>Evaluación final</h3><p>${state.finalQuiz.completed ? `Aprobada con ${state.finalQuiz.score}%.` : "Alcanzar al menos 16 respuestas correctas."}</p></div></div>
      </div>
    </section>
    ${weekComplete ? `
      <section class="section info-card">
        <p class="eyebrow">SEMANA COMPLETADA</p>
        <h2>Ya tenés un mapa general defendible.</h2>
        <p style="margin-bottom:0;color:var(--muted);line-height:1.5">Tu evidencia quedó guardada en este iPhone. El siguiente paso será comprender cómo funciona un modelo de lenguaje.</p>
      </section>` : ""}
    <section class="section"><button class="danger-button wide-button" id="resetProgress">Reiniciar progreso de la Semana 1</button></section>`;
}

function render() {
  const views = { home: homeView, path: pathView, practice: practiceView, progress: progressView };
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

function openLesson(id) {
  activeLesson = course.lessons.find(lesson => lesson.id === Number(id));
  if (!activeLesson) return;
  activePage = Math.min(Number(state.lastPageByLesson[activeLesson.id] || 0), activeLesson.pages.length - 1);
  state.lastLesson = activeLesson.id;
  saveState();
  dialog.showModal();
  renderLessonPage();
}

function bodyParagraphs(page) {
  const paragraphs = Array.isArray(page.body) ? page.body : [page.body];
  return paragraphs.filter(Boolean).map(text => `<p>${escapeHtml(text)}</p>`).join("");
}

function renderConceptPage(page) {
  return `
    <article class="lesson-page">
      <div class="lesson-card">
        <span class="page-label">${escapeHtml(page.kicker || "Idea clave")}</span>
        <h3>${escapeHtml(page.title)}</h3>
        ${bodyParagraphs(page)}
        ${page.callout ? `<div class="lesson-callout"><strong>Clave:</strong> ${escapeHtml(page.callout)}</div>` : ""}
      </div>
    </article>`;
}

function renderStepsPage(page) {
  return `
    <article class="lesson-page">
      <div class="lesson-card">
        <span class="page-label">${escapeHtml(page.kicker || "Paso a paso")}</span>
        <h3>${escapeHtml(page.title)}</h3>
        <div class="step-list">
          ${page.items.map((item, index) => `
            <div class="step-item">
              <span class="step-index">${index + 1}</span>
              <div><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.text)}</p></div>
            </div>`).join("")}
        </div>
      </div>
    </article>`;
}

function renderComparePage(page) {
  return `
    <article class="lesson-page">
      <div class="lesson-card">
        <span class="page-label">${escapeHtml(page.kicker || "Comparación")}</span>
        <h3>${escapeHtml(page.title)}</h3>
        <div class="compare-grid">
          ${page.columns.map(item => `<div class="compare-item"><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.text)}</p></div>`).join("")}
        </div>
      </div>
    </article>`;
}

function renderExamplePage(page) {
  return `
    <article class="lesson-page">
      <div class="lesson-card">
        <span class="page-label">${escapeHtml(page.kicker || "Ejemplo")}</span>
        <h3>${escapeHtml(page.title)}</h3>
        ${bodyParagraphs(page)}
        ${page.items ? `<ul class="example-list">${page.items.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : ""}
        ${page.callout ? `<div class="lesson-callout"><strong>Aplicación:</strong> ${escapeHtml(page.callout)}</div>` : ""}
      </div>
    </article>`;
}

function renderVisualPage(page) {
  return `
    <article class="lesson-page">
      <div class="lesson-card visual-card">
        <header><span class="page-label">${escapeHtml(page.kicker || "Resumen visual")}</span><h3>${escapeHtml(page.title)}</h3></header>
        <img src="${activeLesson.visual}" alt="Resumen visual de ${escapeHtml(activeLesson.title)}">
        <p class="visual-hint">Deslizá o tocá Siguiente cuando termines de observarla.</p>
      </div>
    </article>`;
}

function renderCheckPage(page) {
  const check = state.lessonChecks[activeLesson.id] || {};
  const selected = check.selected;
  const feedback = check.feedback || "";
  const feedbackClass = check.passed ? "is-success" : "is-error";
  return `
    <article class="lesson-page">
      <div class="lesson-card check-card">
        <span class="page-label">COMPROBACIÓN</span>
        <h3>${escapeHtml(page.title)}</h3>
        <label class="check-prompt" for="lessonReflection">${escapeHtml(page.prompt)}</label>
        <textarea id="lessonReflection" placeholder="${escapeHtml(page.placeholder)}">${escapeHtml(check.draft || "")}</textarea>
        <p class="char-hint">Escribí al menos ${page.minLength} caracteres. No copies la definición.</p>
        <p class="micro-question">${escapeHtml(page.question)}</p>
        <div class="option-list">
          ${page.options.map((option, index) => `
            <label class="option-label">
              <input type="radio" name="lesson-question" value="${index}" ${Number(selected) === index && selected !== undefined ? "checked" : ""}>
              <span>${escapeHtml(option)}</span>
            </label>`).join("")}
        </div>
        <div class="check-feedback ${feedback ? `is-visible ${feedbackClass}` : ""}" id="checkFeedback">${escapeHtml(feedback)}</div>
      </div>
    </article>`;
}

function renderLessonPage() {
  const page = activeLesson.pages[activePage];
  lessonKicker.textContent = `TEMA ${activeLesson.id} · ${activeLesson.minutes} MIN`;
  lessonTitle.textContent = activeLesson.title;
  favoriteLesson.textContent = state.favorites.includes(activeLesson.id) ? "★" : "☆";
  favoriteLesson.setAttribute("aria-label", state.favorites.includes(activeLesson.id) ? "Quitar de favoritos" : "Guardar en favoritos");

  const renderers = {
    concept: renderConceptPage,
    steps: renderStepsPage,
    compare: renderComparePage,
    example: renderExamplePage,
    visual: renderVisualPage,
    check: renderCheckPage
  };
  lessonContent.innerHTML = (renderers[page.type] || renderConceptPage)(page);
  storyProgress.innerHTML = activeLesson.pages.map((_, index) => `
    <span class="story-segment ${index < activePage ? "is-done" : ""} ${index === activePage ? "is-current" : ""}"><span></span></span>`).join("");
  pageIndicator.textContent = `${activePage + 1}/${activeLesson.pages.length}`;
  previousPage.disabled = activePage === 0;
  previousPage.style.opacity = activePage === 0 ? ".38" : "1";

  if (page.type === "check") {
    nextPage.textContent = state.lessonChecks[activeLesson.id]?.passed ? "Terminar tema" : "Evaluar";
  } else {
    nextPage.textContent = "Siguiente";
  }

  state.lastPageByLesson[activeLesson.id] = activePage;
  saveState();
  lessonContent.scrollTo({ top: 0 });
}

function captureCheckDraft() {
  if (!activeLesson || activeLesson.pages[activePage]?.type !== "check") return;
  const current = state.lessonChecks[activeLesson.id] || {};
  const reflection = document.querySelector("#lessonReflection");
  const selected = document.querySelector('input[name="lesson-question"]:checked');
  state.lessonChecks[activeLesson.id] = {
    ...current,
    draft: reflection?.value || current.draft || "",
    selected: selected ? Number(selected.value) : current.selected
  };
  saveState();
}

function evaluateLessonCheck(page) {
  captureCheckDraft();
  const check = state.lessonChecks[activeLesson.id] || {};
  const draft = check.draft?.trim() || "";
  const normalizedDraft = normalize(draft);
  const matched = page.concepts.filter(concept => concept.terms.some(term => normalizedDraft.includes(normalize(term))));
  const missing = page.concepts.filter(concept => !matched.includes(concept));
  const enoughLength = draft.length >= page.minLength;
  const enoughConcepts = matched.length >= page.minConcepts;
  const correctChoice = Number(check.selected) === page.answer;
  const passed = enoughLength && enoughConcepts && correctChoice;

  let feedback;
  if (passed) {
    feedback = `Bien encaminado: detecté ${matched.map(item => item.label).join(", ")}. ${page.explanation} Esta comprobación busca ideas clave; tu proyecto práctico dará la evidencia más profunda.`;
    if (!state.completedLessons.includes(activeLesson.id)) state.completedLessons.push(activeLesson.id);
    const next = course.lessons.find(lesson => !state.completedLessons.includes(lesson.id));
    if (next) state.lastLesson = next.id;
  } else {
    const notes = [];
    if (!enoughLength) notes.push(`desarrollá un poco más la explicación (${draft.length}/${page.minLength} caracteres)`);
    if (!enoughConcepts) notes.push(`incluí con tus palabras estas ideas: ${missing.map(item => item.label).join(", ")}`);
    if (!correctChoice) notes.push(`revisá la pregunta: ${page.explanation}`);
    feedback = `Todavía no alcanza para aprobar: ${notes.join("; ")}.`;
  }

  state.lessonChecks[activeLesson.id] = { ...check, draft, passed, feedback };
  saveState();
  renderLessonPage();
  showToast(passed ? "Comprensión demostrada" : "Revisá la devolución");
}

function nextLessonPage() {
  const page = activeLesson.pages[activePage];
  if (page.type === "check") {
    if (state.lessonChecks[activeLesson.id]?.passed) {
      dialog.close();
      render();
      showToast("Tema aprobado");
    } else {
      evaluateLessonCheck(page);
    }
    return;
  }
  if (activePage < activeLesson.pages.length - 1) {
    activePage += 1;
    renderLessonPage();
  }
}

function previousLessonPage() {
  captureCheckDraft();
  if (activePage > 0) {
    activePage -= 1;
    renderLessonPage();
  }
}

function toggleFavorite() {
  const id = activeLesson.id;
  state.favorites = state.favorites.includes(id)
    ? state.favorites.filter(item => item !== id)
    : [...state.favorites, id];
  saveState();
  renderLessonPage();
  showToast(state.favorites.includes(id) ? "Guardado para repasar" : "Quitado de guardados");
}

function evaluatePractice() {
  const total = course.practice.cases.length;
  const correct = course.practice.cases.filter(item => item.answers.includes(state.practice.answers[item.id])).length;
  const score = Math.round((correct / total) * 100);
  const reflectionReady = state.practice.reflection.trim().length >= course.practice.minReflectionLength;
  state.practice.score = score;
  state.practice.evaluated = true;
  state.practice.completed = score >= course.practice.passScore && reflectionReady;
  saveState();
  const scrollYBefore = scrollY;
  render();
  scrollTo({ top: scrollYBefore });
  showToast(state.practice.completed ? "Laboratorio aprobado" : "Revisá los casos marcados");
}

function evaluateQuiz() {
  const questions = course.finalQuiz.questions;
  const correct = questions.filter((question, index) => Number(state.finalQuiz.answers[index]) === question.answer).length;
  const score = Math.round((correct / questions.length) * 100);
  state.finalQuiz.score = score;
  state.finalQuiz.evaluated = true;
  state.finalQuiz.completed = score >= course.finalQuiz.passScore;
  saveState();
  const scrollYBefore = scrollY;
  render();
  scrollTo({ top: scrollYBefore });
  showToast(state.finalQuiz.completed ? "Evaluación aprobada" : "Revisá las respuestas marcadas");
}

function resetProgress() {
  const confirmed = confirm("¿Querés borrar las respuestas y el progreso de la Semana 1 en este dispositivo?");
  if (!confirmed) return;
  const theme = state.theme;
  state = structuredClone(initialState);
  state.theme = theme;
  saveState();
  render();
  showToast("Progreso reiniciado");
}

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2100);
}

document.addEventListener("click", event => {
  const lessonButton = event.target.closest("[data-lesson]");
  if (lessonButton) openLesson(lessonButton.dataset.lesson);

  const routeButton = event.target.closest("[data-route]");
  if (routeButton) navigate(routeButton.dataset.route);

  if (event.target.closest("#evaluatePractice")) evaluatePractice();
  if (event.target.closest("#evaluateQuiz")) evaluateQuiz();
  if (event.target.closest("#resetProgress")) resetProgress();
});

document.addEventListener("change", event => {
  const caseRow = event.target.closest("[data-practice-case]");
  if (caseRow && event.target.matches("select")) {
    state.practice.answers[caseRow.dataset.practiceCase] = event.target.value;
    state.practice.evaluated = false;
    saveState();
  }

  const quizQuestionElement = event.target.closest("[data-quiz-question]");
  if (quizQuestionElement && event.target.matches('input[type="radio"]')) {
    state.finalQuiz.answers[quizQuestionElement.dataset.quizQuestion] = Number(event.target.value);
    state.finalQuiz.evaluated = false;
    saveState();
  }

  if (event.target.matches('input[name="lesson-question"]')) captureCheckDraft();
});

document.addEventListener("input", event => {
  if (event.target.id === "practiceReflection") {
    state.practice.reflection = event.target.value;
    state.practice.evaluated = false;
    saveState();
  }
  if (event.target.id === "lessonReflection") captureCheckDraft();
});

document.querySelector("#themeButton").addEventListener("click", cycleTheme);
document.querySelector("#closeLesson").addEventListener("click", () => {
  captureCheckDraft();
  dialog.close();
});
favoriteLesson.addEventListener("click", toggleFavorite);
previousPage.addEventListener("click", previousLessonPage);
nextPage.addEventListener("click", nextLessonPage);

dialog.addEventListener("cancel", event => {
  event.preventDefault();
  captureCheckDraft();
  dialog.close();
});
dialog.addEventListener("close", render);

lessonContent.addEventListener("pointerdown", event => {
  if (event.target.closest("textarea, input, button, label")) return;
  pointerStart = { x: event.clientX, y: event.clientY };
});
lessonContent.addEventListener("pointerup", event => {
  if (!pointerStart) return;
  const dx = event.clientX - pointerStart.x;
  const dy = event.clientY - pointerStart.y;
  pointerStart = null;
  if (Math.abs(dx) < 65 || Math.abs(dy) > 70) return;
  if (dx < 0) nextLessonPage();
  else previousLessonPage();
});

document.addEventListener("keydown", event => {
  if (!dialog.open || event.target.matches("textarea, input, select")) return;
  if (event.key === "ArrowRight") nextLessonPage();
  if (event.key === "ArrowLeft") previousLessonPage();
});

matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
  if (state.theme === "system") setTheme("system");
});

async function init() {
  setTheme();
  try {
    const response = await fetch("data/week-1.json?v=3");
    if (!response.ok) throw new Error(`No se pudo cargar el contenido (${response.status})`);
    course = await response.json();
    render();
  } catch (error) {
    app.innerHTML = `
      <section class="info-card">
        <p class="eyebrow">NO PUDIMOS CARGAR LA SEMANA</p>
        <h2>Probá actualizar la página.</h2>
        <p style="color:var(--muted);line-height:1.5">${escapeHtml(error.message)}</p>
        <button class="primary-button" onclick="location.reload()">Volver a intentar</button>
      </section>`;
  }
}

init();

if ("serviceWorker" in navigator) {
  addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register("sw.js?v=3");
      await registration.update();
    } catch {
      // La aplicación sigue funcionando online aunque el modo offline no esté disponible.
    }
  });

  let refreshing = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (refreshing) return;
    refreshing = true;
    location.reload();
  });
}
