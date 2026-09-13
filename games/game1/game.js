// ==========================================
// GAMI INFINITY — THE GAUNTLET
// Hard Mode
// ==========================================

const levels = [
    {
        id: 1,
        title: "Logic Gate",
        type: "choice",
        question: "A farmer has 17 sheep. All but 9 run away. How many sheep remain?",
        options: ["8", "9", "17", "26"],
        answer: 1,
        explanation: "All BUT 9 ran away, so 9 remain."
    },

    {
        id: 2,
        title: "Broken Pattern",
        type: "choice",
        question: "Find the next number: 2, 6, 12, 20, 30, ?",
        options: ["40", "41", "42", "44"],
        answer: 2,
        explanation: "The differences are +4, +6, +8, +10, so next is +12 → 42."
    },

   {
    id: 3,
    title: "Number Lock",
    type: "choice",
    question:
        "A 3-digit code has these properties:\n\n" +
        "• The first digit is twice the second.\n" +
        "• The third digit is 3 greater than the second.\n" +
        "• All three digits add to 15.\n\n" +
        "What is the code?",
    options: ["636", "528", "639", "417"],
    answer: 0,
    explanation:
        "Second digit = 3. First = 6. Third = 6. " +
        "6 + 3 + 6 = 15, so the code is 636."
},
    {
        id: 4,
        title: "Code Runner",
        type: "choice",
        question:
            "What does this JavaScript output?\n\n" +
            "let x = 5;\n" +
            "x += 3;\n" +
            "x *= 2;\n" +
            "console.log(x);",
        options: ["11", "13", "16", "18"],
        answer: 2,
        explanation: "5 + 3 = 8, then 8 × 2 = 16."
    },

    {
        id: 5,
        title: "The Three Boxes",
        type: "choice",
        question:
            "Three boxes are labeled APPLES, ORANGES and MIXED. " +
            "Every label is wrong. You may take ONE fruit from ONE box. " +
            "Which box should you choose first?",
        options: [
            "APPLES",
            "ORANGES",
            "MIXED",
            "It doesn't matter"
        ],
        answer: 2,
        explanation:
            "Choose MIXED. Since its label is wrong, it must contain only apples or only oranges. " +
            "One fruit reveals which, allowing all labels to be corrected."
    },

    {
        id: 6,
        title: "Time Pressure",
        type: "timed",
        time: 25,
        question:
            "You have 25 seconds.\n\n" +
            "What number replaces ?\n\n" +
            "3 → 9\n" +
            "4 → 16\n" +
            "7 → 49\n" +
            "11 → ?",
        options: ["111", "121", "132", "144"],
        answer: 1,
        explanation: "Each number is squared. 11² = 121."
    },

    {
        id: 7,
        title: "Switch Room",
        type: "choice",
        question:
            "Outside a room are 3 switches. Inside are 3 bulbs. " +
            "Each switch controls one bulb. You may enter the room only once. " +
            "How can you determine which switch controls which bulb?",
        options: [
            "Turn all switches on and enter",
            "Turn one on, wait, turn it off, turn another on, then enter",
            "Turn two on and enter",
            "Impossible"
        ],
        answer: 1,
        explanation:
            "Use heat as information: one bulb is ON, one is OFF but warm, and one is OFF and cold."
    },

    {
        id: 8,
        title: "Code Trap",
        type: "choice",
        question:
            "What is printed?\n\n" +
            "let a = 10;\n" +
            "let b = 3;\n\n" +
            "console.log(Math.floor(a / b));",
        options: ["3", "3.33", "4", "1"],
        answer: 0,
        explanation:
            "10 / 3 = 3.333..., and Math.floor() removes the decimal → 3."
    },

    {
        id: 9,
        title: "Expert Sequence",
        type: "choice",
        question:
            "Find the missing number:\n\n" +
            "1, 11, 21, 1211, 111221, ?",
        options: [
            "312211",
            "212211",
            "111321",
            "13112221"
        ],
        answer: 0,
        explanation:
            "This is the look-and-say sequence. 111221 becomes 312211."
    },

    {
        id: 10,
        title: "FINAL BOSS",
        type: "boss",
        question:
            "FINAL BOSS — TWO STAGES\n\n" +
            "Stage 1:\n" +
            "You need a number that is divisible by 3 and 5, " +
            "but NOT divisible by 2. It must be between 20 and 50.\n\n" +
            "Stage 2:\n" +
            "Take that number and subtract 9. " +
            "The result must be a perfect square.\n\n" +
            "Which number survives both stages?",
        options: ["25", "30", "45", "50"],
        answer: 2,
        explanation:
            "45 is divisible by 3 and 5, isn't divisible by 2, " +
            "and 45 - 9 = 36 = 6²."
    }
];

// ==========================================
// GAME STATE
// ==========================================

let currentLevel = 0;
let lives = 3;
let score = 0;
let streak = 0;
let timer = null;
let timeLeft = 0;
let answered = false;

// ==========================================
// DOM
// ==========================================

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const levelEl = document.getElementById("level");
const scoreEl = document.getElementById("score");
const livesEl = document.getElementById("lives");

// ==========================================
// START GAME
// ==========================================

function startGame() {
    currentLevel = 0;
    lives = 3;
    score = 0;
    streak = 0;

    updateHUD();
    loadLevel();
}

// ==========================================
// LOAD LEVEL
// ==========================================

function loadLevel() {

    clearInterval(timer);

    answered = false;

    const level = levels[currentLevel];

    if (!level) {
        finishGame();
        return;
    }

    levelEl.textContent = `LEVEL ${level.id} / ${levels.length}`;
    questionEl.textContent = level.question;

    optionsEl.innerHTML = "";

    level.options.forEach((option, index) => {

        const button = document.createElement("button");

        button.className = "option";
        button.textContent = option;

        button.addEventListener("click", () => {
            selectAnswer(index);
        });

        optionsEl.appendChild(button);
    });

    if (level.type === "timed") {
        startTimer(level.time);
    }
}

// ==========================================
// ANSWER
// ==========================================

function selectAnswer(index) {

    if (answered) return;

    answered = true;

    clearInterval(timer);

    const level = levels[currentLevel];
    const buttons = document.querySelectorAll(".option");

    buttons.forEach(button => {
        button.disabled = true;
    });

    if (index === level.answer) {

        buttons[index].classList.add("correct");

        streak++;

        // Base score
        let points = 100;

        // Streak bonus
        points += (streak - 1) * 25;

        // Timed bonus
        if (level.type === "timed") {
            points += timeLeft * 5;
        }

        // Boss bonus
        if (level.type === "boss") {
            points += 500;
        }

        score += points;

        updateHUD();

        setTimeout(() => {
            nextLevel();
        }, 1100);

    } else {

        buttons[index].classList.add("wrong");

        if (level.answer !== undefined) {
            buttons[level.answer].classList.add("correct");
        }

        lives--;
        streak = 0;

        updateHUD();

        if (lives <= 0) {

            setTimeout(() => {
                gameOver();
            }, 900);

        } else {

            setTimeout(() => {

                showExplanation(level);

                setTimeout(() => {
                    currentLevel++;
                    loadLevel();
                }, 1800);

            }, 700);
        }
    }
}

// ==========================================
// TIMER
// ==========================================

function startTimer(seconds) {

    timeLeft = seconds;

    updateTimer();

    timer = setInterval(() => {

        timeLeft--;

        updateTimer();

        if (timeLeft <= 0) {

            clearInterval(timer);

            if (!answered) {
                answered = true;
                timeOut();
            }
        }

    }, 1000);
}

function updateTimer() {

    let timerEl = document.getElementById("timer");

    if (!timerEl) {
        timerEl = document.createElement("div");
        timerEl.id = "timer";

        document.body.appendChild(timerEl);
    }

    const level = levels[currentLevel];

    if (level && level.type === "timed") {
        timerEl.textContent = `⏱ ${timeLeft}s`;
    } else {
        timerEl.textContent = "";
    }
}

function timeOut() {

    lives--;
    streak = 0;

    updateHUD();

    const buttons = document.querySelectorAll(".option");

    buttons.forEach(button => {
        button.disabled = true;
    });

    const level = levels[currentLevel];

    if (level.answer !== undefined) {
        buttons[level.answer].classList.add("correct");
    }

    if (lives <= 0) {

        setTimeout(() => {
            gameOver();
        }, 900);

    } else {

        setTimeout(() => {

            showExplanation(level);

            setTimeout(() => {
                currentLevel++;
                loadLevel();
            }, 1800);

        }, 700);
    }
}

// ==========================================
// EXPLANATION
// ==========================================

function showExplanation(level) {

    let explanation = document.getElementById("explanation");

    if (!explanation) {

        explanation = document.createElement("div");

        explanation.id = "explanation";

        document.body.appendChild(explanation);
    }

    explanation.textContent = level.explanation;

    setTimeout(() => {
        explanation.textContent = "";
    }, 1700);
}

// ==========================================
// NEXT LEVEL
// ==========================================

function nextLevel() {

    currentLevel++;

    if (currentLevel >= levels.length) {
        finishGame();
        return;
    }

    loadLevel();
}

// ==========================================
// HUD
// ==========================================

function updateHUD() {

    if (scoreEl) {
        scoreEl.textContent = `SCORE: ${score}`;
    }

    if (livesEl) {

        livesEl.textContent =
            "❤️".repeat(lives) +
            "🖤".repeat(3 - lives);
    }

    if (levelEl) {
        levelEl.textContent =
            `LEVEL ${Math.min(currentLevel + 1, levels.length)} / ${levels.length}`;
    }
}

// ==========================================
// GAME OVER
// ==========================================

function gameOver() {

    clearInterval(timer);

    questionEl.textContent = "GAME OVER";

    optionsEl.innerHTML = `
        <div class="game-result">
            <h2>Run Failed</h2>
            <p>Final Score: <strong>${score}</strong></p>
            <p>You reached Level ${currentLevel + 1}.</p>

            <button onclick="startGame()">
                TRY AGAIN
            </button>
        </div>
    `;
}

// ==========================================
// FINISH GAME
// ==========================================

function finishGame() {

    clearInterval(timer);

    let rank;

    if (score >= 1600) {
        rank = "GAUNTLET MASTER ☠️";
    } else if (score >= 1200) {
        rank = "ELITE RUNNER 🔥";
    } else if (score >= 800) {
        rank = "SKILLED RUNNER ⚡";
    } else {
        rank = "SURVIVOR 🛡️";
    }

    questionEl.textContent = "GAUNTLET COMPLETE";

    optionsEl.innerHTML = `
        <div class="game-result">

            <h2>${rank}</h2>

            <p>Final Score</p>

            <div class="final-score">
                ${score}
            </div>

            <p>
                You defeated all ${levels.length} levels.
            </p>

            <button onclick="startGame()">
                PLAY AGAIN
            </button>

        </div>
    `;
}

// ==========================================
// START
// ==========================================

startGame();