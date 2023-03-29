const wordContainer = document.getElementById('word-container')
const inputElement = document.getElementById('input')
const timerElement = document.getElementById('timer')
const nextWordElement = document.getElementById('next-word')

const words = {
  original: wordsList,
  remaining: [...wordsList]
}

let currentWord = ''
let timeLeft = 60
let interval
let score = 0
let nextWord = ''

checkFirstTime()

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

function hideInstructions() {
  const instructionsElement = document.getElementById('instructions')
  instructionsElement.classList.add('fade-out')
}

function showInstructions() {
  const instructionsElement = document.getElementById('instructions')
  instructionsElement.classList.add('fade-in')
}

function checkFirstTime() {
  const firstTime = localStorage.getItem('firstTime')
  if (firstTime !== 'false') {
    showInstructions()
    localStorage.setItem('firstTime', 'false')
  }
  inputElement.addEventListener('input', hideInstructions)
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
  // La siguiente palabra se convierte en la palabra actual
  currentWord = nextWord;
  displayWord();

  if (words.remaining.length === 1) {
    // Si solo queda una palabra en la lista de palabras restantes, reinicia la lista
    words.remaining = [...words.original];
  } else {
    // Elimina la palabra actual de las palabras restantes
    const currentWordIndex = words.remaining.indexOf(currentWord);
    words.remaining.splice(currentWordIndex, 1);
  }

  // Selecciona y muestra la siguiente palabra
  const nextWordIndex = Math.floor(Math.random() * words.remaining.length);
  nextWord = words.remaining[nextWordIndex];
  nextWordElement.textContent = nextWord;

}
pickRandomWord();

function normalizeText(text) {
  return text
    .toLocaleLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
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
      message += '\n ¡Felicidades! Has establecido un nuevo puntaje más alto: ' + score
    }
    message += '\nGracias por jugar. '
    alert(message)
    startGame()
    inputElement.focus()
  }
}

startGame()
