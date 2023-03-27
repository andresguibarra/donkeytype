const wordContainer = document.getElementById('word-container')
const inputElement = document.getElementById('input')
const timerElement = document.getElementById('timer')

const wordsList = [
  'ejemplo',
  'teclado',
  'velocidad',
  'desarrollo',
  'código',
  'guitarra',
  'computadora',
  'elefante',
  'biblioteca',
  'pantalla',
  'aventura',
  'mariposa',
  'bicicleta',
  'planeta',
  'estrella',
  'edificio',
  'jirafa',
  'entusiasmo',
  'cuaderno',
  'inteligencia',
  'pescado',
  'automóvil',
  'reloj',
  'lápiz',
  'teléfono',
  'montaña',
  'escritorio',
  'silla',
  'galleta',
  'ratón',
  'sombrero',
  'paraguas',
  'canguro',
  'murciélago',
  'piano',
  'ventana',
  'almohada',
  'espejo',
  'refrigerador',
  'tren',
  'cápsula',
  'pirámide',
  'fotografía',
  'globo',
  'cemento',
  'zoológico',
  'periscopio',
  'tortuga',
  'escarabajo',
  'colina'
]

const words = {
  original: wordsList,
  remaining: [...wordsList]
}

let currentWord = ''
let timeLeft = 60
let interval
let score = 0

function startGame() {
  clearInterval(interval)
  inputElement.disabled = false
  inputElement.value = ''
  score = 0
  updateScore()
  pickRandomWord()
  timeLeft = 60
  updateTimer()
  displayHighScore()
  inputElement.addEventListener('input', startTimer)
}

function displayWord() {
  wordContainer.innerHTML = ''
  for (let letter of currentWord) {
    const letterElement = document.createElement('span')
    letterElement.textContent = letter
    letterElement.classList.add('letter')
    wordContainer.appendChild(letterElement)
  }
}

function getHighScore() {
  const highScore = localStorage.getItem('highScore')
  return highScore ? parseInt(highScore, 10) : 0
}

function updateHighScore(newHighScore) {
  localStorage.setItem('highScore', newHighScore)
  displayHighScore()
}

function displayHighScore() {
  const highScoreElement = document.getElementById('high-score')
  highScoreElement.textContent = getHighScore()
}

function updateScore() {
  const scoreElement = document.getElementById('score')
  scoreElement.textContent = score
}

function pickRandomWord() {
  if (words.remaining.length === 0) {
    words.remaining = [...words.original]
  }

  const randomIndex = Math.floor(Math.random() * words.remaining.length)
  currentWord = words.remaining[randomIndex]
  words.remaining.splice(randomIndex, 1)
  displayWord()
}

function normalizeText(text) {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function clearLetterBackgrounds() {
  const wordLetters = wordContainer.querySelectorAll('.letter')
  for (let letter of wordLetters) {
    letter.classList.remove('correct', 'wrong')
  }
}

function checkInput() {
  const inputText = inputElement.value.trim()
  const normalizedInput = normalizeText(inputText)
  const inputLength = normalizedInput.length

  clearLetterBackgrounds()

  if (inputLength === 0) return

  const wordLetters = wordContainer.querySelectorAll('.letter')
  for (let i = 0; i < inputLength; i++) {
    if (i < currentWord.length) {
      if (normalizedInput[i] === normalizeText(currentWord[i])) {
        wordLetters[i].classList.add('correct')
        wordLetters[i].classList.remove('wrong')
      } else {
        wordLetters[i].classList.add('wrong')
        wordLetters[i].classList.remove('correct')
      }
    }
  }

  if (normalizedInput === normalizeText(currentWord)) {
    inputElement.value = ''
    pickRandomWord()
    score++
    updateScore()
  }
}

function startTimer() {
  inputElement.removeEventListener('input', startTimer)
  inputElement.addEventListener('input', checkInput)
  inputElement.addEventListener('keyup', checkInput)

  interval = setInterval(updateTimer, 1000)
}

function updateTimer() {
  timeLeft--
  timerElement.textContent = `${timeLeft}s`

  if (timeLeft <= 0) {
    clearInterval(interval)
    inputElement.disabled = true
    const highScore = getHighScore()
    let message = '¡Tiempo agotado! Tu cantidad de palabras fue: ' + score
    if (score > highScore) {
      updateHighScore(score)
      message += ' ¡Felicidades! Has establecido un nuevo puntaje más alto: ' + score
    }
    message += '\nGracias por jugar. '
    alert(message)
    startGame()
    inputElement.focus()
  }
}

startGame()
