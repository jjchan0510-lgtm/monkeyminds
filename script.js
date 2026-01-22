// Word database for different difficulties
const wordDatabase = {
    beginner: [
        {
            word: "beautiful",
            definition: "Pleasing to look at; attractive",
            partOfSpeech: "adjective"
        },
        {
            word: "celebrate",
            definition: "To honor a special occasion with festivities",
            partOfSpeech: "verb"
        },
        {
            word: "necessary",
            definition: "Required or needed; essential",
            partOfSpeech: "adjective"
        },
        {
            word: "question",
            definition: "Something asked to gain information",
            partOfSpeech: "noun"
        },
        {
            word: "separate",
            definition: "To divide or move apart from something",
            partOfSpeech: "verb"
        }
    ],
    intermediate: [
        {
            word: "accommodate",
            definition: "To provide lodging or adjust to meet needs",
            partOfSpeech: "verb"
        },
        {
            word: "privilege",
            definition: "A special right or advantage given to a person",
            partOfSpeech: "noun"
        },
        {
            word: "embarrass",
            definition: "To cause to feel awkward or ashamed",
            partOfSpeech: "verb"
        },
        {
            word: "rhythm",
            definition: "A pattern of sounds or movements repeated regularly",
            partOfSpeech: "noun"
        },
        {
            word: "receive",
            definition: "To take or get something offered",
            partOfSpeech: "verb"
        },
        {
            word: "maintenance",
            definition: "The process of keeping something in good condition",
            partOfSpeech: "noun"
        }
    ],
    advanced: [
        {
            word: "bureaucracy",
            definition: "A system of government with many officials and regulations",
            partOfSpeech: "noun"
        },
        {
            word: "surveillance",
            definition: "Close observation or monitoring of people or places",
            partOfSpeech: "noun"
        },
        {
            word: "parallel",
            definition: "Lines or things that never meet and are equally distant",
            partOfSpeech: "adjective"
        },
        {
            word: "miscellaneous",
            definition: "Consisting of various types; mixed",
            partOfSpeech: "adjective"
        },
        {
            word: "deliberately",
            definition: "Intentionally; on purpose with careful consideration",
            partOfSpeech: "adverb"
        },
        {
            word: "anonymous",
            definition: "Without revealing or bearing a name",
            partOfSpeech: "adjective"
        }
    ]
};

// Monkey characters with fur colors
const monkeyCharacters = {
    goldie: {
        name: "Goldie",
        emoji: "🐵",
        furColor: "Golden",
        weapon: "🔱",
        weaponName: "Trident"
    },
    shadow: {
        name: "Shadow",
        emoji: "🐒",
        furColor: "Black",
        weapon: "⚔️",
        weaponName: "Sword"
    },
    rusty: {
        name: "Rusty",
        emoji: "🦁",
        furColor: "Rust",
        weapon: "🪓",
        weaponName: "Axe"
    },
    pearl: {
        name: "Pearl",
        emoji: "🐵",
        furColor: "White",
        weapon: "🏹",
        weaponName: "Bow"
    }
};

// Game state
let gameState = {
    currentLevel: 1,
    currentWord: null,
    monstersRemaining: 3,
    currentMonsterHP: 100,
    maxMonsterHP: 100,
    score: 0,
    combo: 0,
    totalCorrect: 0,
    totalAttempts: 0,
    isPaused: false,
    levelStartCorrect: 0,
    selectedCharacter: 'goldie',
    selectedDifficulty: 'beginner',
    monsterDistance: 100,
    maxMonsterDistance: 100,
    movementSpeed: 0.5,
    movementInterval: null,
    sessionStats: {
        wordsLearned: 0,
        correct: 0,
        monsters: 0,
        highestLevel: 1
    }
};

// Initialize game
function initGame() {
    loadStats();
    selectNewWord();
    updateMonsterHealth();
    updateCharacterDisplay();
    resetMonsterDistance();
    startMonsterMovement();
}

// Load stats from localStorage
function loadStats() {
    const saved = localStorage.getItem('spellWarriorStats');
    if (saved) {
        gameState.sessionStats = JSON.parse(saved);
    }
}

// Save stats to localStorage
function saveStats() {
    localStorage.setItem('spellWarriorStats', JSON.stringify(gameState.sessionStats));
}

// Select a random word from current difficulty
function selectNewWord() {
    const difficultyWords = wordDatabase[gameState.selectedDifficulty];
    gameState.currentWord = difficultyWords[Math.floor(Math.random() * difficultyWords.length)];
    
    document.getElementById('definition').textContent = gameState.currentWord.definition;
    document.getElementById('partOfSpeech').textContent = `(${gameState.currentWord.partOfSpeech})`;
    
    clearFeedback();
    document.getElementById('spellInput').value = '';
    document.getElementById('spellInput').classList.remove('correct', 'incorrect');
    document.getElementById('spellInput').focus();
}

// Start the game
function startGame() {
    gameState = {
        currentLevel: 1,
        currentWord: null,
        monstersRemaining: 3,
        currentMonsterHP: 100,
        maxMonsterHP: 100,
        score: 0,
        combo: 0,
        totalCorrect: 0,
        totalAttempts: 0,
        isPaused: false,
        levelStartCorrect: 0,
        selectedCharacter: gameState.selectedCharacter,
        selectedDifficulty: gameState.selectedDifficulty,
        sessionStats: gameState.sessionStats
    };
    
    hideAllMenus();
    document.getElementById('gameScreen').classList.remove('hidden');
    
    initGame();
    updateUI();
}

// Update UI elements
function updateUI() {
    document.getElementById('currentLevel').textContent = gameState.currentLevel;
    document.getElementById('score').textContent = gameState.score;
    document.getElementById('combo').textContent = gameState.combo;
    document.getElementById('monstersRemaining').textContent = gameState.monstersRemaining;
    
    const hpPercent = (gameState.currentMonsterHP / gameState.maxMonsterHP) * 100;
    document.getElementById('monsterHealth').style.width = hpPercent + '%';
    document.getElementById('monsterHPText').textContent = 
        `${Math.max(0, gameState.currentMonsterHP)}/${gameState.maxMonsterHP}`;
}

// Update character display
function updateCharacterDisplay() {
    const character = monkeyCharacters[gameState.selectedCharacter];
    document.getElementById('playerCharacter').textContent = character.emoji;
    document.getElementById('playerWeapon').textContent = character.weapon;
    document.getElementById('playerName').textContent = character.name;
    document.getElementById('playerDisplay').textContent = `${character.emoji} ${character.name}`;
    document.getElementById('weaponName').textContent = character.weaponName;
    
    // Display difficulty
    const difficultyNames = {
        'beginner': 'Beginner',
        'intermediate': 'Intermediate',
        'advanced': 'Advanced'
    };
    document.getElementById('difficultyDisplay').textContent = difficultyNames[gameState.selectedDifficulty];
}

// Update monster health bar
function updateMonsterHealth() {
    updateUI();
}

// Reset monster distance for new monster
function resetMonsterDistance() {
    gameState.monsterDistance = gameState.maxMonsterDistance;
    updateMonsterDistance();
}

// Update monster distance display
function updateMonsterDistance() {
    const distancePercent = (gameState.monsterDistance / gameState.maxMonsterDistance) * 100;
    document.getElementById('monsterDistance').style.width = distancePercent + '%';
}

// Start monster movement towards player
function startMonsterMovement() {
    // Clear any existing interval
    if (gameState.movementInterval) {
        clearInterval(gameState.movementInterval);
    }
    
    gameState.movementInterval = setInterval(() => {
        if (!gameState.isPaused) {
            gameState.monsterDistance -= gameState.movementSpeed;
            updateMonsterDistance();
            
            // Check if monster reached the player
            if (gameState.monsterDistance <= 0) {
                clearInterval(gameState.movementInterval);
                triggerGameOver();
            }
        }
    }, 100);
}

// Trigger game over
function triggerGameOver() {
    clearInterval(gameState.movementInterval);
    document.getElementById('gameScreen').classList.add('hidden');
    document.getElementById('gameOverScreen').classList.remove('hidden');
    
    const difficultyNames = {
        'beginner': 'Beginner',
        'intermediate': 'Intermediate',
        'advanced': 'Advanced'
    };
    
    document.getElementById('gameOverMessage').textContent = 
        `Game Over! The monster caught you! You were playing on ${difficultyNames[gameState.selectedDifficulty]} level.`;
    document.getElementById('finalScore').textContent = gameState.score;
    document.getElementById('finalLevel').textContent = gameState.currentLevel;
}
function submitSpelling() {
    const input = document.getElementById('spellInput').value.trim().toLowerCase();
    const correct = gameState.currentWord.word.toLowerCase();
    
    gameState.totalAttempts++;
    
    if (input === correct) {
        handleCorrectSpelling();
    } else {
        handleIncorrectSpelling(input, correct);
    }
}

// Handle correct spelling
function handleCorrectSpelling() {
    gameState.totalCorrect++;
    gameState.combo++;
    gameState.score += 10 + (gameState.combo * 5);
    gameState.sessionStats.correct++;
    gameState.sessionStats.wordsLearned++;
    gameState.levelStartCorrect++;
    
    const damage = 20 + (gameState.combo * 5);
    gameState.currentMonsterHP -= damage;
    
    // Show feedback
    document.getElementById('spellInput').classList.add('correct');
    showFeedback(`✓ Correct! +${damage} damage (Combo x${gameState.combo})`, 'success');
    
    // Monster hit animation
    const monsterBody = document.getElementById('monster').querySelector('.monster-body');
    monsterBody.classList.add('hit');
    setTimeout(() => monsterBody.classList.remove('hit'), 300);
    
    // Combo flash
    const combo = document.getElementById('combo');
    combo.classList.add('combo-flash');
    setTimeout(() => combo.classList.remove('combo-flash'), 300);
    
    updateUI();
    
    // Check if monster defeated
    if (gameState.currentMonsterHP <= 0) {
        defeatMonster();
    } else {
        setTimeout(() => {
            selectNewWord();
        }, 1500);
    }
}

// Handle incorrect spelling
function handleIncorrectSpelling(input, correct) {
    gameState.combo = 0;
    
    document.getElementById('spellInput').classList.add('incorrect');
    showFeedback(`✗ Incorrect. The spelling is "${correct}"`, 'error');
    
    setTimeout(() => {
        document.getElementById('spellInput').classList.remove('incorrect');
    }, 1000);
    
    updateUI();
}

// Defeat current monster
function defeatMonster() {
    gameState.monstersRemaining--;
    gameState.sessionStats.monsters++;
    gameState.combo = 0;
    
    // Monster defeated animation
    const monsterBody = document.getElementById('monster').querySelector('.monster-body');
    monsterBody.classList.add('defeated');
    
    // Stop monster movement
    if (gameState.movementInterval) {
        clearInterval(gameState.movementInterval);
    }
    
    setTimeout(() => {
        monsterBody.classList.remove('defeated');
        document.getElementById('monster').querySelector('.monster-body').textContent = '👹';
        
        if (gameState.monstersRemaining > 0) {
            // Reset for next monster
            gameState.currentMonsterHP = gameState.maxMonsterHP;
            gameState.maxMonsterHP += 20;
            gameState.currentMonsterHP = gameState.maxMonsterHP;
            resetMonsterDistance();
            selectNewWord();
            startMonsterMovement();
            updateUI();
        } else {
            // Level complete
            completeLevel();
        }
    }, 600);
}

// Complete level
function completeLevel() {
    gameState.currentLevel++;
    gameState.sessionStats.highestLevel = Math.max(gameState.sessionStats.highestLevel, gameState.currentLevel);
    saveStats();
    
    // Show level complete screen
    document.getElementById('gameScreen').classList.add('hidden');
    document.getElementById('levelCompleteScreen').classList.remove('hidden');
    
    document.getElementById('levelCompleteMessage').textContent = 
        `You completed Level ${gameState.currentLevel - 1}!`;
    document.getElementById('levelStats').textContent = gameState.levelStartCorrect;
    document.getElementById('levelScore').textContent = gameState.score;
}

// Go to next level
function nextLevel() {
    if (gameState.currentLevel > 3) {
        gameState.currentLevel = 3; // Max level is 3
    }
    
    // Reset for next level
    gameState.monstersRemaining = 3;
    gameState.currentMonsterHP = 100;
    gameState.maxMonsterHP = 100;
    gameState.combo = 0;
    gameState.levelStartCorrect = 0;
    
    document.getElementById('levelCompleteScreen').classList.add('hidden');
    document.getElementById('gameScreen').classList.remove('hidden');
    
    initGame();
    updateUI();
}

// Show feedback message
function showFeedback(message, type) {
    const feedback = document.getElementById('feedback');
    feedback.textContent = message;
    feedback.className = `feedback ${type}`;
}

// Clear feedback
function clearFeedback() {
    const feedback = document.getElementById('feedback');
    feedback.textContent = '';
    feedback.className = 'feedback';
}

// Pronounce word (using Web Speech API)
function pronounceWord() {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(gameState.currentWord.word);
        utterance.rate = 0.9;
        speechSynthesis.cancel();
        speechSynthesis.speak(utterance);
    }
}

// Show hint
function showHint() {
    const word = gameState.currentWord.word;
    const hintLength = Math.ceil(word.length / 2);
    const hint = word.substring(0, hintLength) + '*'.repeat(word.length - hintLength);
    showFeedback(`Hint: ${hint}`, 'hint');
}

// Pause game
function pauseGame() {
    gameState.isPaused = true;
    if (gameState.movementInterval) {
        clearInterval(gameState.movementInterval);
    }
    document.getElementById('gameScreen').classList.add('hidden');
    document.getElementById('pauseScreen').classList.remove('hidden');
}

// Resume game
function resumeGame() {
    gameState.isPaused = false;
    document.getElementById('pauseScreen').classList.add('hidden');
    document.getElementById('gameScreen').classList.remove('hidden');
    startMonsterMovement();
    document.getElementById('spellInput').focus();
}

// Quit game
function quitGame() {
    if (confirm('Are you sure you want to quit? Your progress will be saved.')) {
        if (gameState.movementInterval) {
            clearInterval(gameState.movementInterval);
        }
        document.getElementById('gameScreen').classList.add('hidden');
        document.getElementById('mainMenu').classList.remove('hidden');
    }
}

// Menu functions
function showDifficultySelection() {
    document.getElementById('mainMenu').classList.add('hidden');
    document.getElementById('difficultySelectionMenu').classList.remove('hidden');
}

function selectDifficulty(difficulty) {
    gameState.selectedDifficulty = difficulty;
    document.getElementById('difficultySelectionMenu').classList.add('hidden');
    document.getElementById('characterSelectionMenu').classList.remove('hidden');
}

function showCharacterSelection() {
    document.getElementById('mainMenu').classList.add('hidden');
    document.getElementById('characterSelectionMenu').classList.remove('hidden');
}

function selectCharacter(characterId) {
    gameState.selectedCharacter = characterId;
    startGame();
}

function showInstructions() {
    document.getElementById('mainMenu').classList.add('hidden');
    document.getElementById('instructionsMenu').classList.remove('hidden');
}

function hideInstructions() {
    document.getElementById('instructionsMenu').classList.add('hidden');
    document.getElementById('mainMenu').classList.remove('hidden');
}

function showStats() {
    document.getElementById('mainMenu').classList.add('hidden');
    document.getElementById('statsMenu').classList.remove('hidden');
    updateStatsDisplay();
}

function hideStats() {
    document.getElementById('statsMenu').classList.add('hidden');
    document.getElementById('mainMenu').classList.remove('hidden');
}

function updateStatsDisplay() {
    const accuracy = gameState.sessionStats.correct + gameState.totalCorrect;
    const attempts = gameState.totalAttempts;
    const accuracyPercent = attempts > 0 ? Math.round((accuracy / attempts) * 100) : 0;
    
    document.getElementById('statsWordsLearned').textContent = gameState.sessionStats.wordsLearned;
    document.getElementById('statsCorrect').textContent = accuracy;
    document.getElementById('statsAccuracy').textContent = accuracyPercent + '%';
    document.getElementById('statsMonsters').textContent = gameState.sessionStats.monsters;
    document.getElementById('statsLevel').textContent = gameState.sessionStats.highestLevel;
}

function resetStats() {
    if (confirm('Are you sure you want to reset all statistics?')) {
        gameState.sessionStats = {
            wordsLearned: 0,
            correct: 0,
            monsters: 0,
            highestLevel: 1
        };
        gameState.totalCorrect = 0;
        gameState.totalAttempts = 0;
        saveStats();
        updateStatsDisplay();
    }
}

function backToMenu() {
    hideAllMenus();
    document.getElementById('mainMenu').classList.remove('hidden');
    gameState.isPaused = false;
}

function hideAllMenus() {
    document.getElementById('mainMenu').classList.add('hidden');
    document.getElementById('difficultySelectionMenu').classList.add('hidden');
    document.getElementById('characterSelectionMenu').classList.add('hidden');
    document.getElementById('instructionsMenu').classList.add('hidden');
    document.getElementById('statsMenu').classList.add('hidden');
    document.getElementById('gameScreen').classList.add('hidden');
    document.getElementById('levelCompleteScreen').classList.add('hidden');
    document.getElementById('pauseScreen').classList.add('hidden');
    document.getElementById('gameOverScreen').classList.add('hidden');
}

// Keyboard support
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('spellInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            submitSpelling();
        }
    });
});
