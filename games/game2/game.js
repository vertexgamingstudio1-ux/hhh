// ==========================================
// GAMI INFINITY — ROAST MASTER
// HARD MODE
// ==========================================

const rounds = [
    {
        id: 1,
        title: "COMEBACK LAB",
        subtitle: "Choose the cleverest response.",
        questions: [
            {
                situation:
                    "Someone says: \"Your presentation was so long I forgot what the topic was.\"",

                options: [
                    "At least I actually had something to present.",
                    "That's impressive. The topic lasted longer than your attention span.",
                    "Maybe you should have listened harder.",
                    "Whatever."
                ],

                answer: 1,
                explanation:
                    "It directly flips the criticism without becoming unnecessarily hostile."
            },

            {
                situation:
                    "Someone says: \"You spent all that time making that and THAT is the result?\"",

                options: [
                    "Yes. Quality takes time. Confusion apparently takes none.",
                    "You couldn't make it better.",
                    "Don't talk about my work.",
                    "I don't care what you think."
                ],

                answer: 0,
                explanation:
                    "It answers the criticism while turning the comment back into a joke."
            },

            {
                situation:
                    "Someone says: \"That was your best idea?\"",

                options: [
                    "Yes.",
                    "No, but I didn't want to overwhelm you on the first try.",
                    "What was yours?",
                    "I have better ideas."
                ],

                answer: 1,
                explanation:
                    "The response accepts the premise and then turns it into the punchline."
            }
        ]
    },

    {
        id: 2,
        title: "TRAP ROAST",
        subtitle: "Only one answer really lands.",
        questions: [
            {
                situation:
                    "A friend says: \"Your plan has one tiny problem: it doesn't work.\"",

                options: [
                    "Neither does your criticism.",
                    "Good observation. Now find the solution.",
                    "Then fix it yourself.",
                    "You always complain."
                ],

                answer: 1,
                explanation:
                    "It redirects the criticism into a challenge instead of just insulting the person."
            },

            {
                situation:
                    "Someone takes credit for an idea you clearly explained earlier.",

                options: [
                    "Wow, even my ideas are getting rebranded now.",
                    "That's literally my idea.",
                    "You stole it.",
                    "Everyone knows I said it first."
                ],

                answer: 0,
                explanation:
                    "It points out the situation without turning the response into a serious argument."
            },

            {
                situation:
                    "Someone says: \"I could have done that better.\"",

                options: [
                    "Then why didn't you?",
                    "I'm sure you could.",
                    "Great. Next time, show me.",
                    "You couldn't."
                ],

                answer: 2,
                explanation:
                    "It calmly accepts the claim and challenges them to demonstrate it."
            },

            {
                situation:
                    "Someone says: \"Nobody asked for your opinion.\"",

                options: [
                    "Nobody asked for yours either.",
                    "True. I was offering a bonus feature.",
                    "Then don't listen.",
                    "I can say whatever I want."
                ],

                answer: 1,
                explanation:
                    "It turns the criticism into a playful joke instead of escalating."
            }
        ]
    },

    {
        id: 3,
        title: "BOSS ROUND",
        subtitle: "The response must satisfy ALL conditions.",
        questions: [
            {
                situation:
                    "BOSS RULES:\n\n" +
                    "Your response must:\n" +
                    "• Be short\n" +
                    "• Be clever\n" +
                    "• Not directly insult anyone\n" +
                    "• Turn the criticism around\n\n" +
                    "Someone says:\n" +
                    "\"That idea is terrible.\"",

                options: [
                    "Terrible ideas usually don't get this much attention.",
                    "Thanks. I'll add your review to the bug tracker.",
                    "Maybe, but at least it exists.",
                    "That's why your ideas are better."
                ],

                answer: 1,
                explanation:
                    "It is short, doesn't insult them, and reframes their criticism as useful feedback."
            },

            {
                situation:
                    "BOSS RULES:\n\n" +
                    "The answer must contain NO insult and NO argument.\n" +
                    "It must still be funny.\n\n" +
                    "Someone says:\n" +
                    "\"You really thought THAT was a good idea?\"",

                options: [
                    "Apparently I did. The plot is developing.",
                    "Yes, unlike you.",
                    "Obviously.",
                    "Don't question me."
                ],

                answer: 0,
                explanation:
                    "It acknowledges the mistake while making the situation humorous."
            },

            {
                situation:
                    "FINAL BOSS:\n\n" +
                    "Someone says:\n" +
                    "\"Your entire plan depends on everything going perfectly.\"",

                options: [
                    "Exactly. That's why it's called a plan and not a prophecy.",
                    "And your plan is worse.",
                    "You don't understand planning.",
                    "It will work anyway."
                ],

                answer: 0,
                explanation:
                    "It turns the criticism into a concise wordplay-based comeback."
            }
        ]
    }
];

// ==========================================
// GAME STATE
// ==========================================

let currentRound = 0;
let currentQuestion = 0;

let score = 0;
let streak = 0;
let mistakes = 0;

let answered = false;

// ==========================================
// DOM
// ==========================================

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const levelEl = document.getElementById("level");
const scoreEl = document.getElementById("score");

// ==========================================
// START
// ==========================================

function startGame() {

    currentRound = 0;
    currentQuestion = 0;

    score = 0;
    streak = 0;
    mistakes = 0;

    loadQuestion();
}

// ==========================================
// LOAD QUESTION
// ==========================================

function loadQuestion() {

    answered = false;

    const round = rounds[currentRound];
    const question = round.questions[currentQuestion];

    levelEl.textContent =
        `${round.title} • ${currentQuestion + 1}/${round.questions.length}`;

    questionEl.textContent = question.situation;

    optionsEl.innerHTML = "";

    question.options.forEach((option, index) => {

        const button = document.createElement("button");

        button.className = "option";
        button.textContent = option;

        button.addEventListener("click", () => {
            answerQuestion(index);
        });

        optionsEl.appendChild(button);
    });

    updateHUD();
}

// ==========================================
// ANSWER
// ==========================================

function answerQuestion(index) {

    if (answered) return;

    answered = true;

    const round = rounds[currentRound];
    const question = round.questions[currentQuestion];

    const buttons = document.querySelectorAll(".option");

    buttons.forEach(button => {
        button.disabled = true;
    });

    if (index === question.answer) {

        buttons[index].classList.add("correct");

        streak++;

        // Base points
        let points = 100;

        // Streak bonus
        points += (streak - 1) * 40;

        // Boss round bonus
        if (currentRound === 2) {
            points += 100;
        }

        score += points;

        showResult(
            "🔥 CLEAN HIT",
            question.explanation,
            true
        );

    } else {

        buttons[index].classList.add("wrong");
        buttons[question.answer].classList.add("correct");

        streak = 0;
        mistakes++;

        showResult(
            "💀 MISSED",
            question.explanation,
            false
        );
    }

    updateHUD();

    setTimeout(() => {
        nextQuestion();
    }, 1700);
}

// ==========================================
// RESULT MESSAGE
// ==========================================

function showResult(title, explanation, correct) {

    let result = document.getElementById("result");

    if (!result) {

        result = document.createElement("div");
        result.id = "result";

        document.body.appendChild(result);
    }

    result.innerHTML = `
        <strong>${title}</strong>
        <span>${explanation}</span>
    `;

    result.className = correct
        ? "result correct-result"
        : "result wrong-result";
}

// ==========================================
// NEXT QUESTION
// ==========================================

function nextQuestion() {

    currentQuestion++;

    const round = rounds[currentRound];

    if (currentQuestion >= round.questions.length) {

        currentRound++;
        currentQuestion = 0;

        if (currentRound >= rounds.length) {

            finishGame();
            return;
        }
    }

    loadQuestion();
}

// ==========================================
// HUD
// ==========================================

function updateHUD() {

    if (scoreEl) {
        scoreEl.textContent =
            `SCORE: ${score}`;
    }

    if (levelEl) {
        const round = rounds[currentRound];

        levelEl.textContent =
            `${round.title} • ${currentQuestion + 1}/${round.questions.length}`;
    }
}

// ==========================================
// FINAL SCREEN
// ==========================================

function finishGame() {

    let rank;

    const totalQuestions =
        rounds.reduce(
            (total, round) => total + round.questions.length,
            0
        );

    const accuracy =
        Math.round(
            ((totalQuestions - mistakes) / totalQuestions) * 100
        );

    if (score >= 1400 && accuracy >= 90) {

        rank = "ROAST MASTER 👑";

    } else if (score >= 1000 && accuracy >= 75) {

        rank = "COMEBACK SPECIALIST 🔥";

    } else if (score >= 700) {

        rank = "QUICK THINKER ⚡";

    } else {

        rank = "ROOKIE ROASTER 🥉";
    }

    questionEl.textContent =
        "ROAST MASTER COMPLETE";

    optionsEl.innerHTML = `
        <div class="game-result">

            <h2>${rank}</h2>

            <div class="final-score">
                ${score}
            </div>

            <p>
                Accuracy: ${accuracy}%
            </p>

            <p>
                Mistakes: ${mistakes}
            </p>

            <p>
                Streak: ${streak}
            </p>

            <button onclick="startGame()">
                PLAY AGAIN
            </button>

        </div>
    `;
}

// ==========================================
// START GAME
// ==========================================

startGame();