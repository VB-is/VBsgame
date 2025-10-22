// Гульня ВаджыЦыфры - беларускі JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const guessInput = document.getElementById('guess-input');
    const submitBtn = document.getElementById('submit-btn');
    const restartBtn = document.getElementById('restart-btn');
    const resultMessage = document.getElementById('result-message');
    const hintMessage = document.getElementById('hint-message');
    const attemptsLeft = document.getElementById('attempts-left');
    const previousGuesses = document.getElementById('previous-guesses');
    const gameOverSection = document.getElementById('game-over');
    const gameOverTitle = document.getElementById('game-over-title');
    const gameOverMessage = document.getElementById('game-over-message');

    // Зменныя гульні
    let randomNumber = Math.floor(Math.random() * 100) + 1;
    let guessCount = 1;
    let maxGuesses = 10;
    let userGuesses = [];

    // Паведамленні па-беларуску
    const messages = {
        start: "Пачніце гульню! Увядзіце вашу першую здагадку.",
        tooHigh: "Занадта высока! Паспрабуйце яшчэ раз.",
        tooLow: "Занадта нізка! Паспрабуйце яшчэ раз.",
        correct: "🎉 Віншуем! Вы адгадалі лічбу!",
        invalid: "Калі ласка, увядзіце лічбу ад 1 да 100!",
        gameOver: "😔 На жаль, вы не адгадалі!",
        attempts: "спроб",
        previousGuesses: "Папярэднія здагадкі",
        newGame: "🔄 Пачаць новую гульню"
    };

    // Ініцыялізацыя
    function initGame() {
        guessInput.focus();
        updateAttemptsDisplay();
    }

    // Абнавіць адлюстраванне спробаў
    function updateAttemptsDisplay() {
        attemptsLeft.textContent = maxGuesses - guessCount + 1;
    }

    // Праверыць здагадку
    function checkGuess() {
        const userGuess = parseInt(guessInput.value);

        // Валідацыя
        if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
            showMessage(messages.invalid, 'error');
            guessInput.classList.add('shake');
            setTimeout(() => guessInput.classList.remove('shake'), 500);
            return;
        }

        // Дадаць здагадку ў спіс
        userGuesses.push(userGuess);
        updatePreviousGuesses();

        // Праверыць здагадку
        if (userGuess === randomNumber) {
            // Перамога!
            showMessage(messages.correct, 'success');
            showHint(`Вы адгадалі за ${guessCount} ${messages.attempts}!`);
            gameOver(true);
        } else if (guessCount === maxGuesses) {
            // Параза
            showMessage(messages.gameOver, 'error');
            showHint(`Правільная лічба была: ${randomNumber}`);
            gameOver(false);
        } else {
            // Працяг гульні
            if (userGuess < randomNumber) {
                showMessage(messages.tooLow, 'warning');
                showHint("Паспрабуйце большую лічбу");
            } else {
                showMessage(messages.tooHigh, 'warning');
                showHint("Паспрабуйце меншую лічбу");
            }
            
            guessCount++;
            updateAttemptsDisplay();
            guessInput.value = '';
            guessInput.focus();
        }
    }

    // Паказаць паведамленне
    function showMessage(message, type) {
        resultMessage.textContent = message;
        resultMessage.className = `result-message ${type}`;
        
        // Дадаць анімацыю
        resultMessage.classList.add('bounce');
        setTimeout(() => resultMessage.classList.remove('bounce'), 600);
    }

    // Паказаць падказку
    function showHint(hint) {
        hintMessage.textContent = hint;
    }

    // Абнавіць папярэднія здагадкі
    function updatePreviousGuesses() {
        if (userGuesses.length > 0) {
            previousGuesses.textContent = userGuesses.join(', ');
        }
    }

    // Канец гульні
    function gameOver(won) {
        guessInput.disabled = true;
        submitBtn.disabled = true;
        
        if (won) {
            gameOverTitle.textContent = "🎉 Перамога!";
            gameOverMessage.textContent = `Вы выдатна справіліся! Лічба ${randomNumber} была адгадана за ${guessCount} спроб.`;
            gameOverSection.style.background = "linear-gradient(135deg, #10b981, #059669)";
        } else {
            gameOverTitle.textContent = "😔 Гульня скончана";
            gameOverMessage.textContent = `На жаль, вы не адгадалі. Правільны адказ: ${randomNumber}`;
            gameOverSection.style.background = "linear-gradient(135deg, #ef4444, #dc2626)";
        }
        
        gameOverSection.classList.remove('hidden');
        gameOverSection.classList.add('bounce');
    }

    // Перазапусціць гульню
    function restartGame() {
        // Скід усіх зменных
        randomNumber = Math.floor(Math.random() * 100) + 1;
        guessCount = 1;
        userGuesses = [];
        
        // Ачыстка інтэрфейсу
        guessInput.value = '';
        guessInput.disabled = false;
        submitBtn.disabled = false;
        
        // Ачыстка паведамленняў
        showMessage(messages.start, 'normal');
        showHint('');
        
        // Скід адлюстравання
        updateAttemptsDisplay();
        previousGuesses.textContent = '-';
        
        // Схаваць блок канца гульні
        gameOverSection.classList.add('hidden');
        
        // Фокус на ўвод
        guessInput.focus();
    }

    // Падзеі
    submitBtn.addEventListener('click', checkGuess);
    restartBtn.addEventListener('click', restartGame);
    
    // Падтрымка Enter
    guessInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !guessInput.disabled) {
            checkGuess();
        }
    });

    // Ініцыялізацыя
    initGame();
});
