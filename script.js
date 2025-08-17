const XP_PER_LEVEL = 100
const COINS_REWARD = 2

const LEVELS = [
  {
    id: 1,
    zone: "Barrio de los Fundamentos",
    title: "Clases y Objetos",
    description: "Aprende los conceptos básicos de la programación orientada a objetos",
    badge: { emoji: "🧱", name: "Constructor/a de Bases" },
    gradient: "from-blue-500 to-cyan-400",
    questions: [
      {
        question: "¿Qué define el 'molde' de un objeto?",
        options: ["Una función", "Una clase", "Una variable", "Un método"],
        correct: 1,
      },
      {
        question: "¿Cómo creas una instancia en JavaScript?",
        options: [
          "const p = Personaje()",
          "const p = new Personaje()",
          "const p = create Personaje()",
          "const p = Personaje.new()",
        ],
        correct: 1,
      },
    ],
  },
  {
    id: 2,
    zone: "Distrito del Encapsulamiento",
    title: "Encapsulamiento",
    description: "Domina la protección y control de acceso a los datos",
    badge: { emoji: "🛡️", name: "Guardián/a de Datos" },
    gradient: "from-green-500 to-emerald-400",
    questions: [
      {
        question: "¿Qué ventaja da el encapsulamiento?",
        options: ["Mayor velocidad", "Protección y control de acceso", "Menos código", "Más memoria"],
        correct: 1,
      },
      {
        question: "Convención para campo 'privado' sin # en JavaScript:",
        options: ["private saldo", "_saldo", "saldo_", "SALDO"],
        correct: 1,
      },
    ],
  },
  {
    id: 3,
    zone: "Puente de la Herencia",
    title: "Herencia",
    description: "Extiende funcionalidades con extends y super",
    badge: { emoji: "🏗️", name: "Arquitecto/a del Legado" },
    gradient: "from-purple-500 to-pink-400",
    questions: [
      {
        question: "Sintaxis de herencia en JavaScript:",
        options: [
          "class Hija inherits Padre",
          "class Hija extends Padre",
          "class Hija from Padre",
          "class Hija implements Padre",
        ],
        correct: 1,
      },
      {
        question: "¿Para qué sirve super() en constructor?",
        options: [
          "Crear una nueva clase",
          "Invocar constructor de la clase Padre",
          "Eliminar la herencia",
          "Crear un método",
        ],
        correct: 1,
      },
    ],
  },
  {
    id: 4,
    zone: "Mercado del Polimorfismo",
    title: "Polimorfismo",
    description: "Implementa comportamientos diversos con override",
    badge: { emoji: "🌀", name: "Maestro/a de las Formas" },
    gradient: "from-orange-500 to-red-400",
    questions: [
      {
        question: "El polimorfismo permite...",
        options: [
          "Crear más clases",
          "Mismo mensaje, distintas respuestas según el objeto",
          "Eliminar métodos",
          "Copiar objetos",
        ],
        correct: 1,
      },
      {
        question: "Si subclases implementan su propia versión de pagar():",
        options: ["Herencia", "Encapsulamiento", "Sobrescritura (override)", "Abstracción"],
        correct: 2,
      },
    ],
  },
  {
    id: 5,
    zone: "Torre del Código Supremo",
    title: "Desafío Final",
    description: "Integra todos los conceptos de POO en un desafío supremo",
    badge: { emoji: "🏆", name: "Maestro/a del Código" },
    gradient: "from-yellow-500 to-amber-400",
    questions: [
      {
        question: "Mejor estructura para sistema de misiones con roles distintos:",
        options: [
          "Solo funciones",
          "Clases base y subclases que sobrescriben métodos de acción",
          "Variables globales",
          "Arrays simples",
        ],
        correct: 1,
      },
      {
        question: "¿Qué principio de POO permite que diferentes objetos respondan de manera única al mismo método?",
        options: ["Encapsulamiento", "Herencia", "Polimorfismo", "Abstracción"],
        correct: 2,
      },
    ],
  },
]

let gameProgress = {
  name: "",
  xp: 0,
  coins: 0,
  completed: [],
  badges: [],
}

let currentLevel = null
let currentQuestionIndex = 0
let selectedAnswer = null
let showFeedback = false
let quizCompleted = false
let correctAnswers = 0

const elements = {
  playerName: document.getElementById("player-name"),
  xpDisplay: document.getElementById("xp-display"),
  coinsDisplay: document.getElementById("coins-display"),
  badgesDisplay: document.getElementById("badges-display"),
  levelsGrid: document.getElementById("levels-grid"),
  badgesSection: document.getElementById("badges-section"),
  badgesContainer: document.getElementById("badges-container"),
  nameDialog: document.getElementById("name-dialog"),
  configDialog: document.getElementById("config-dialog"),
  missionDialog: document.getElementById("mission-dialog"),
  finalResults: document.getElementById("final-results"),
  studentNameInput: document.getElementById("student-name"),
  startBtn: document.getElementById("start-btn"),
  configBtn: document.getElementById("config-btn"),
  resultsBtn: document.getElementById("results-btn"),
  closeConfig: document.getElementById("close-config"),
  resetProgress: document.getElementById("reset-progress"),
  addCoins: document.getElementById("add-coins"),
  changeName: document.getElementById("change-name"),
  closeMission: document.getElementById("close-mission"),
  missionTitle: document.getElementById("mission-title"),
  missionPlayerName: document.getElementById("mission-player-name"),
  missionContent: document.getElementById("mission-content"),
  closeResults: document.getElementById("close-results"),
  confettiContainer: document.getElementById("confetti-container"),
  finalLevels: document.getElementById("final-levels"),
  finalXp: document.getElementById("final-xp"),
  progressBar: document.getElementById("progress-bar"),
  completionText: document.getElementById("completion-text"),
  finalBadges: document.getElementById("final-badges"),
  masterAchievement: document.getElementById("master-achievement"),
}

function init() {
  loadProgress()
  setupEventListeners()

  if (!gameProgress.name) {
    showModal("nameDialog")
  } else {
    updateUI()
  }
}

function loadProgress() {
  const saved = localStorage.getItem("codecity_progress_v1")
  if (saved) {
    gameProgress = JSON.parse(saved)
  }
}

function saveProgress() {
  localStorage.setItem("codecity_progress_v1", JSON.stringify(gameProgress))
  updateUI()
}

function setupEventListeners() {
  elements.studentNameInput.addEventListener("input", (e) => {
    elements.startBtn.disabled = !e.target.value.trim()
  })

  elements.studentNameInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      handleNameSubmit()
    }
  })

  elements.startBtn.addEventListener("click", handleNameSubmit)

  elements.configBtn.addEventListener("click", () => showModal("configDialog"))
  elements.closeConfig.addEventListener("click", () => hideModal("configDialog"))
  elements.resetProgress.addEventListener("click", resetProgress)
  elements.addCoins.addEventListener("click", addTestCoins)
  elements.changeName.addEventListener("click", changeName)

  elements.resultsBtn.addEventListener("click", () => showFinalResults())
  elements.closeResults.addEventListener("click", () => hideModal("finalResults"))

  elements.closeMission.addEventListener("click", () => hideModal("missionDialog"))

  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("show")
      }
    })
  })
}

function showModal(modalName) {
  elements[modalName].classList.add("show")
}

function hideModal(modalName) {
  elements[modalName].classList.remove("show")
}

function handleNameSubmit() {
  const name = elements.studentNameInput.value.trim()
  if (name) {
    gameProgress.name = name
    saveProgress()
    hideModal("nameDialog")
    elements.studentNameInput.value = ""
  }
}

function resetProgress() {
  localStorage.removeItem("codecity_progress_v1")
  gameProgress = { name: "", xp: 0, coins: 0, completed: [], badges: [] }
  hideModal("configDialog")
  showModal("nameDialog")
  updateUI()
}

function addTestCoins() {
  gameProgress.coins += 5
  saveProgress()
}

function changeName() {
  elements.studentNameInput.value = gameProgress.name
  hideModal("configDialog")
  showModal("nameDialog")
}

function updateUI() {
  elements.playerName.textContent = gameProgress.name
  elements.xpDisplay.textContent = gameProgress.xp
  elements.coinsDisplay.textContent = gameProgress.coins
  elements.badgesDisplay.textContent = gameProgress.badges.length

  renderLevels()

  renderBadges()
}

function renderLevels() {
  elements.levelsGrid.innerHTML = ""

  LEVELS.forEach((level) => {
    const unlocked = isLevelUnlocked(level.id)
    const completed = isLevelCompleted(level.id)

    const levelCard = document.createElement("div")
    levelCard.className = `card ${!unlocked ? "opacity-50" : ""}`

    levelCard.innerHTML = `
            <div class="h-32 bg-gradient-to-br ${level.gradient} relative overflow-hidden">
               
                <div class="absolute inset-0" style="background-color: rgba(0,0,0,0.2);"></div>
                <div class="absolute top-4 right-4">
                    ${
                      completed
                        ? '<svg class="w-6 h-6 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>'
                        : !unlocked
                          ? '<svg class="w-6 h-6 text-white drop-shadow-lg" style="opacity: 0.7;" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1a4 4 0 0 0-4 4v1a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2V5a4 4 0 0 0-4-4zM8 5a4 4 0 1 1 8 0v1H8V5z"/></svg>'
                          : ""
                    }
                </div>
                <div class="absolute bottom-4 left-4 text-4xl drop-shadow-lg">${level.badge.emoji}</div>
            </div>
            <div class="p-6">
                <h3 class="text-lg text-white font-bold mb-2">${level.zone}</h3>
                <p class="text-slate-300 mb-1">${level.title}</p>
                <p class="text-sm text-slate-400 mb-4">${level.description}</p>
                <button class="btn flex-1 bg-gradient-to-r ${level.gradient} hover:opacity-90 transition-opacity ${!unlocked ? "disabled:opacity-50 disabled:cursor-not-allowed" : ""}" 
                        ${!unlocked ? "disabled" : ""} 
                        onclick="openMission(${level.id})">
                    ${completed ? "Revisar misión" : "Abrir misión"}
                </button>
            </div>
        `

    elements.levelsGrid.appendChild(levelCard)
  })
}

function renderBadges() {
  if (gameProgress.badges.length > 0) {
    elements.badgesSection.classList.remove("hidden")
    elements.badgesContainer.innerHTML = ""

    gameProgress.badges.forEach((badge) => {
      const badgeElement = document.createElement("div")
      badgeElement.className = "badge text-lg p-3"
      badgeElement.innerHTML = `${badge.emoji} ${badge.name}`
      elements.badgesContainer.appendChild(badgeElement)
    })
  } else {
    elements.badgesSection.classList.add("hidden")
  }
}

function isLevelUnlocked(levelId) {
  if (levelId === 1) return true
  return gameProgress.completed.includes(levelId - 1)
}

function isLevelCompleted(levelId) {
  return gameProgress.completed.includes(levelId)
}

function openMission(levelId) {
  currentLevel = LEVELS.find((level) => level.id === levelId)
  currentQuestionIndex = 0
  selectedAnswer = null
  showFeedback = false
  quizCompleted = false
  correctAnswers = 0

  elements.missionTitle.innerHTML = `<span class="text-3xl">${currentLevel.badge.emoji}</span> ${currentLevel.zone}`
  elements.missionPlayerName.textContent = gameProgress.name

  renderMissionContent()
  showModal("missionDialog")
}

function renderMissionContent() {
  if (!quizCompleted) {
    const question = currentLevel.questions[currentQuestionIndex]

    elements.missionContent.innerHTML = `
            <div class="space-y-6">
                <div class="bg-slate-700/50 p-4 rounded-lg">
                    <div class="flex justify-between items-center mb-4">
                        <span class="text-sm text-slate-400">
                            Pregunta ${currentQuestionIndex + 1} de ${currentLevel.questions.length}
                        </span>
                    </div>
                    <h3 class="text-lg font-semibold mb-4">${question.question}</h3>
                    <div class="space-y-2" id="options-container">
                        ${question.options
                          .map(
                            (option, index) => `
                            <button class="option-btn w-full p-3 text-left rounded-lg border transition-colors bg-slate-700 border-slate-600 hover:bg-slate-600" 
                                    data-index="${index}" onclick="handleAnswerSelect(${index})">
                                ${option}
                            </button>
                        `,
                          )
                          .join("")}
                    </div>
                    <div id="feedback-container" class="mt-4 hidden"></div>
                    <button id="submit-answer" class="btn btn-primary w-full mt-4" onclick="submitAnswer()" disabled>
                        Confirmar respuesta
                    </button>
                </div>
            </div>
        `
  } else {
    const allCorrect = correctAnswers === currentLevel.questions.length
    const alreadyCompleted = gameProgress.completed.includes(currentLevel.id)

    elements.missionContent.innerHTML = `
            <div class="text-center space-y-4">
                <div class="text-6xl mb-4 bounce-in">${currentLevel.badge.emoji}</div>
                <h3 class="text-2xl font-bold">
                    ${allCorrect ? "¡Misión Completada!" : "Misión Terminada"}
                </h3>
                <p class="text-slate-300">
                    Respondiste correctamente ${correctAnswers} de ${currentLevel.questions.length} preguntas.
                </p>
                
                ${
                  allCorrect && !alreadyCompleted
                    ? `
                    <div class="bg-green-600/20 p-4 rounded-lg border border-green-500/30">
                        <p class="text-green-300 font-semibold">¡Recompensas obtenidas!</p>
                        <p class="text-sm text-green-200">
                            +${XP_PER_LEVEL} XP, +${COINS_REWARD} CodeCoins, Insignia: ${currentLevel.badge.name}
                        </p>
                    </div>
                `
                    : ""
                }
                
                ${
                  alreadyCompleted
                    ? `
                    <p class="text-slate-400 text-sm">Recompensa ya otorgada anteriormente.</p>
                `
                    : ""
                }
                
                <button class="btn btn-primary w-full" onclick="closeMissionDialog()">
                    Continuar
                </button>
            </div>
        `
  }
}

function handleAnswerSelect(answerIndex) {
  if (showFeedback) return

  selectedAnswer = answerIndex

  document.querySelectorAll(".option-btn").forEach((btn, index) => {
    btn.classList.remove("bg-blue-600", "border-blue-500")
    if (index === answerIndex) {
      btn.classList.add("bg-blue-600", "border-blue-500")
    }
  })

  document.getElementById("submit-answer").disabled = false
}

function submitAnswer() {
  if (selectedAnswer === null || !currentLevel) return

  const isCorrect = selectedAnswer === currentLevel.questions[currentQuestionIndex].correct
  if (isCorrect) {
    correctAnswers++
  }

  showFeedback = true

  document.querySelectorAll(".option-btn").forEach((btn, index) => {
    btn.disabled = true
    if (index === selectedAnswer) {
      if (isCorrect) {
        btn.className = "option-btn w-full p-3 text-left rounded-lg border bg-green-600 border-green-500"
      } else {
        btn.className = "option-btn w-full p-3 text-left rounded-lg border bg-red-600 border-red-500"
      }
    } else if (index === currentLevel.questions[currentQuestionIndex].correct) {
      btn.className = "option-btn w-full p-3 text-left rounded-lg border bg-green-600 border-green-500"
    }
  })

  const feedbackContainer = document.getElementById("feedback-container")
  feedbackContainer.className = `mt-4 p-3 rounded-lg ${isCorrect ? "bg-green-600/20 text-green-300" : "bg-red-600/20 text-red-300"}`
  feedbackContainer.textContent = isCorrect
    ? "¡Correcto! Excelente trabajo."
    : "Incorrecto. La respuesta correcta se muestra en verde."
  feedbackContainer.classList.remove("hidden")

  document.getElementById("submit-answer").style.display = "none"

  setTimeout(() => {
    if (currentQuestionIndex < currentLevel.questions.length - 1) {
      currentQuestionIndex++
      selectedAnswer = null
      showFeedback = false
      renderMissionContent()
    } else {
      quizCompleted = true

      if (correctAnswers === currentLevel.questions.length && !isLevelCompleted(currentLevel.id)) {
        gameProgress.xp += XP_PER_LEVEL
        gameProgress.coins += COINS_REWARD
        gameProgress.completed.push(currentLevel.id)
        gameProgress.badges.push(currentLevel.badge)
        saveProgress()

        if (currentLevel.id === 5) {
          setTimeout(() => {
            hideModal("missionDialog")
            showFinalResults()
          }, 3000)
        }
      }

      renderMissionContent()
    }
  }, 2000)
}

function closeMissionDialog() {
  hideModal("missionDialog")
  currentLevel = null
}

function showFinalResults() {
  const completionPercentage = (gameProgress.completed.length / LEVELS.length) * 100

  elements.finalLevels.textContent = gameProgress.completed.length
  elements.finalXp.textContent = gameProgress.xp
  elements.progressBar.style.width = `${completionPercentage}%`
  elements.completionText.textContent = `${completionPercentage.toFixed(0)}% de CodeCity Completado`

  elements.finalBadges.innerHTML = ""
  gameProgress.badges.forEach((badge) => {
    const badgeElement = document.createElement("div")
    badgeElement.className = "bg-slate-700/50 p-3 rounded-lg border border-slate-600"
    badgeElement.innerHTML = `
            <div class="text-2xl mb-1">${badge.emoji}</div>
            <div class="text-xs text-slate-300">${badge.name}</div>
        `
    elements.finalBadges.appendChild(badgeElement)
  })

  if (gameProgress.completed.length === LEVELS.length) {
    elements.masterAchievement.classList.remove("hidden")
    showConfetti()
  } else {
    elements.masterAchievement.classList.add("hidden")
  }

  showModal("finalResults")
}

function showConfetti() {
  elements.confettiContainer.classList.remove("hidden")
  elements.confettiContainer.innerHTML = ""

  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement("div")
    confetti.className = "confetti"
    confetti.style.left = `${Math.random() * 100}%`
    confetti.style.animationDelay = `${i * 0.1}s`
    confetti.style.animationDuration = `${3 + Math.random() * 2}s`
    elements.confettiContainer.appendChild(confetti)
  }

  setTimeout(() => {
    elements.confettiContainer.classList.add("hidden")
  }, 5000)
}

document.addEventListener("DOMContentLoaded", init)
