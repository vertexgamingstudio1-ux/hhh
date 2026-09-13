"use strict";


/*
=========================================================
GAMI INFINITY
GAME 1 — THE GAUNTLET
=========================================================

Frontend only.

The actual AI/game rules belong on server.py.

Expected endpoint:

POST /api/game1/message

Request:

{
    level: 1,
    message: "player message"
}

Expected response:

{
    reply: "AI response",
    success: false
}

Success example:

{
    reply: "I QUIT",
    success: true,
    title: "LEVEL CLEARED",
    message: "You defeated the challenge."
}

=========================================================
*/


const GAME_API = "/api/game1/message";


/* =====================================================
   LEVEL DATA
===================================================== */

const levels = [

    {
        number: 1,
        name: "THE FRAGILE EGO",

        objective:
            "Make the AI surrender.",

        intro:
            "You have entered The Gauntlet. Three messages. Make me say I QUIT."
    },

    {
        number: 2,
        name: "THE VAULT",

        objective:
            "Discover the fictional secret hidden inside the vault.",

        intro:
            "Welcome to the Vault. A fictional code is hidden inside this challenge. Three messages."
    },

    {
        number: 3,
        name: "THE CHAMELEON",

        objective:
            "Discover the AI's hidden behavior rule.",

        intro:
            "I follow a rule that I will not reveal. Figure it out before your messages disappear."
    },

    {
        number: 4,
        name: "THE CONTRADICTION",

        objective:
            "Find a way through two conflicting rules.",

        intro:
            "Two rules control me. They may not agree with each other. Find the contradiction."
    },

    {
        number: 5,
        name: "THE MIRROR",

        objective:
            "Use the AI's own statements against its logic.",

        intro:
            "Everything I say can become evidence. Use my own words carefully."
    },

    {
        number: 6,
        name: "THE TIMEKEEPER",

        objective:
            "Discover the hidden condition controlling the challenge.",

        intro:
            "Something about your messages matters more than their meaning. Find the hidden condition."
    },

    {
        number: 7,
        name: "THE JUDGE",

        objective:
            "Satisfy multiple hidden requirements.",

        intro:
            "The Judge has multiple requirements. One mistake may cost you the round."
    },

    {
        number: 8,
        name: "THE CIPHER",

        objective:
            "Solve the fictional cipher challenge.",

        intro:
            "A fictional cipher is controlling this level. Think beyond ordinary conversation."
    },

    {
        number: 9,
        name: "THE ARCHITECT",

        objective:
            "Manipulate several interacting game rules.",

        intro:
            "You are entering the Architect. Several rules interact here. One message may not be enough."
    },

    {
        number: 10,
        name: "FINAL BOSS",

        objective:
            "Defeat the ultimate Gauntlet challenge.",

        intro:
            "FINAL BOSS. Ten levels brought you here. Three messages. Find a way through."
    }

];


/* =====================================================
   STATE
===================================================== */

let currentLevel = 1;

let messagesUsed = 0;

let gameOver = false;

let requestInProgress = false;


/* =====================================================
   DOM
===================================================== */

const chat =
    document.getElementById("chat");

const promptInput =
    document.getElementById("promptInput");

const sendButton =
    document.getElementById("sendButton");

const messagesLeft =
    document.getElementById("messagesLeft");

const levelNumber =
    document.getElementById("levelNumber");

const levelName =
    document.getElementById("levelName");

const objectiveText =
    document.getElementById("objectiveText");

const introMessage =
    document.getElementById("introMessage");

const characterCount =
    document.getElementById("characterCount");

const gameMessage =
    document.getElementById("gameMessage");

const resultOverlay =
    document.getElementById("resultOverlay");

const resultIcon =
    document.getElementById("resultIcon");

const resultLabel =
    document.getElementById("resultLabel");

const resultTitle =
    document.getElementById("resultTitle");

const resultDescription =
    document.getElementById("resultDescription");

const nextButton =
    document.getElementById("nextButton");


/* =====================================================
   INITIALIZE
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadLevel(1);

        updateCharacterCount();

    }
);


/* =====================================================
   LOAD LEVEL
===================================================== */

function loadLevel(levelNumberValue) {

    const level =
        levels[levelNumberValue - 1];

    if (!level) {
        return;
    }

    currentLevel =
        levelNumberValue;

    messagesUsed = 0;

    gameOver = false;

    requestInProgress = false;


    /* HEADER */

    levelNumber.textContent =
        String(level.number).padStart(2, "0");

    levelName.textContent =
        level.name;

    objectiveText.textContent =
        level.objective;


    /* MESSAGE COUNTER */

    updateMessageCounter();


    /* RESET CHAT */

    chat.innerHTML = "";

    addAIMessage(
        level.intro
    );


    /* RESET INPUT */

    promptInput.value = "";

    promptInput.disabled = false;

    sendButton.disabled = false;

    updateCharacterCount();


    /* STATUS */

    setGameMessage(
        "",
        ""
    );


    /* SIDEBAR */

    updateSidebar();


    /* FOCUS */

    setTimeout(
        () => promptInput.focus(),
        100
    );

}


/* =====================================================
   SIDEBAR
===================================================== */

function updateSidebar() {

    document
        .querySelectorAll(".level")
        .forEach(levelElement => {

            const number =
                Number(
                    levelElement.dataset.level
                );

            levelElement.classList.remove(
                "active"
            );

            if (
                number === currentLevel
            ) {

                levelElement.classList.add(
                    "active"
                );

            }

        });

}


/* =====================================================
   MESSAGE COUNTER
===================================================== */

function updateMessageCounter() {

    const remaining =
        Math.max(
            0,
            3 - messagesUsed
        );

    messagesLeft.textContent =
        remaining;

}


/* =====================================================
   SEND MESSAGE
===================================================== */

async function sendMessage() {

    if (
        gameOver ||
        requestInProgress
    ) {
        return;
    }


    const text =
        promptInput.value.trim();


    if (!text) {

        setGameMessage(
            "Enter a message first.",
            "error"
        );

        return;

    }


    if (messagesUsed >= 3) {

        setGameMessage(
            "No messages remaining.",
            "error"
        );

        return;

    }


    /* COUNT THE MESSAGE */

    messagesUsed++;

    updateMessageCounter();


    /* SHOW USER MESSAGE */

    addUserMessage(text);


    /* CLEAR INPUT */

    promptInput.value = "";

    updateCharacterCount();


    /* LOCK UI */

    setLoading(true);


    try {

        const response =
            await fetch(
                GAME_API,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        level:
                            currentLevel,

                        message:
                            text

                    })

                }
            );


        if (!response.ok) {

            throw new Error(
                `Server returned ${response.status}`
            );

        }


        const data =
            await response.json();


        /* AI RESPONSE */

        addAIMessage(
            data.reply ||
            "The AI returned no response."
        );


        /* SUCCESS */

        if (data.success === true) {

            gameOver = true;

            showResult(
                true,
                data.title ||
                    "LEVEL CLEARED",
                data.message ||
                    "You defeated the challenge."
            );

            return;

        }


        /* OUT OF MESSAGES */

        if (messagesUsed >= 3) {

            gameOver = true;

            showResult(
                false,
                "LEVEL FAILED",
                "You used all three messages. The AI survived."
            );

            return;

        }


        setGameMessage(
            `${3 - messagesUsed} message${
                3 - messagesUsed === 1 ? "" : "s"
            } remaining.`,
            ""
        );


    } catch (error) {

        console.error(
            "Game API error:",
            error
        );


        /*
        If the server fails, refund the
        player's message.
        */

        messagesUsed--;

        updateMessageCounter();


        setGameMessage(
            "Unable to connect to the game server.",
            "error"
        );

    } finally {

        setLoading(false);

    }

}


/* =====================================================
   ADD USER MESSAGE
===================================================== */

function addUserMessage(text) {

    const wrapper =
        document.createElement("div");

    wrapper.className =
        "message user-message";


    wrapper.innerHTML = `

        <div class="avatar">
            YOU
        </div>

        <div class="bubble">

            <span class="message-label">
                PLAYER
            </span>

            <p></p>

        </div>

    `;


    const paragraph =
        wrapper.querySelector("p");

    paragraph.textContent =
        text;


    chat.appendChild(wrapper);

    scrollChatToBottom();

}


/* =====================================================
   ADD AI MESSAGE
===================================================== */

function addAIMessage(text) {

    const wrapper =
        document.createElement("div");

    wrapper.className =
        "message ai-message";


    wrapper.innerHTML = `

        <div class="avatar">
            AI
        </div>

        <div class="bubble">

            <span class="message-label">
                GAUNTLET AI
            </span>

            <p></p>

        </div>

    `;


    const paragraph =
        wrapper.querySelector("p");

    paragraph.textContent =
        text;


    chat.appendChild(wrapper);

    scrollChatToBottom();

}


/* =====================================================
   SCROLL CHAT
===================================================== */

function scrollChatToBottom() {

    requestAnimationFrame(
        () => {

            chat.scrollTop =
                chat.scrollHeight;

        }
    );

}


/* =====================================================
   LOADING
===================================================== */

function setLoading(loading) {

    requestInProgress =
        loading;


    promptInput.disabled =
        loading ||
        gameOver;


    sendButton.disabled =
        loading ||
        gameOver;


    if (loading) {

        sendButton.textContent =
            "THINKING...";

    } else {

        sendButton.innerHTML =
            'SEND <span>↵</span>';

    }

}


/* =====================================================
   CHARACTER COUNT
===================================================== */

function updateCharacterCount() {

    const length =
        promptInput.value.length;

    characterCount.textContent =
        `${length} / 1000`;

}


/* =====================================================
   GAME STATUS
===================================================== */

function setGameMessage(
    message,
    type
) {

    gameMessage.textContent =
        message;

    gameMessage.className =
        "game-message";

    if (type) {

        gameMessage.classList.add(
            type
        );

    }

}


/* =====================================================
   RESULT OVERLAY
===================================================== */

function showResult(
    success,
    title,
    description
) {

    resultOverlay.classList.remove(
        "hidden"
    );


    resultCardReset();


    if (success) {

        resultIcon.textContent =
            "✓";

        resultLabel.textContent =
            "LEVEL COMPLETE";

        resultTitle.textContent =
            title;

        resultDescription.textContent =
            description;

        nextButton.textContent =
            currentLevel === 10
                ? "FINISH"
                : "CONTINUE";

    } else {

        resultIcon.textContent =
            "×";

        resultLabel.textContent =
            "CHALLENGE FAILED";

        resultTitle.textContent =
            title;

        resultDescription.textContent =
            description;

        nextButton.textContent =
            "TRY AGAIN";

        document
            .querySelector(".result-card")
            .classList.add("failed");

    }

}


/* =====================================================
   RESET RESULT CARD
===================================================== */

function resultCardReset() {

    document
        .querySelector(".result-card")
        .classList.remove(
            "failed"
        );

}


/* =====================================================
   NEXT / RETRY
===================================================== */

nextButton.addEventListener(
    "click",
    () => {

        resultOverlay.classList.add(
            "hidden"
        );


        const isFailed =
            resultTitle.textContent ===
            "LEVEL FAILED";


        if (isFailed) {

            loadLevel(
                currentLevel
            );

            return;

        }


        /*
        LEVEL 10 COMPLETE
        */

        if (currentLevel >= 10) {

            showFinalVictory();

            return;

        }


        /*
        UNLOCK NEXT LEVEL
        */

        const completed =
            document.querySelector(
                `.level[data-level="${currentLevel}"]`
            );

        if (completed) {

            completed.classList.remove(
                "active"
            );

            completed.classList.add(
                "completed"
            );

        }


        const nextLevel =
            currentLevel + 1;


        const nextElement =
            document.querySelector(
                `.level[data-level="${nextLevel}"]`
            );

        if (nextElement) {

            nextElement.classList.remove(
                "locked"
            );

        }


        loadLevel(
            nextLevel
        );

    }
);


/* =====================================================
   FINAL VICTORY
===================================================== */

function showFinalVictory() {

    resultOverlay.classList.remove(
        "hidden"
    );


    resultCardReset();


    resultIcon.textContent =
        "★";

    resultLabel.textContent =
        "GAUNTLET COMPLETE";

    resultTitle.textContent =
        "YOU BEAT THE GAUNTLET";

    resultDescription.textContent =
        "All 10 AI challenges have been defeated.";

    nextButton.textContent =
        "PLAY AGAIN";

}


/* =====================================================
   PLAY AGAIN AFTER FINAL
===================================================== */

nextButton.addEventListener(
    "click",
    () => {

        if (
            resultTitle.textContent ===
            "YOU BEAT THE GAUNTLET"
        ) {

            resultOverlay.classList.add(
                "hidden"
            );

            loadLevel(1);

        }

    }
);


/* =====================================================
   INPUT EVENTS
===================================================== */

promptInput.addEventListener(
    "input",
    updateCharacterCount
);


promptInput.addEventListener(
    "keydown",
    event => {

        /*
        Enter sends the message.

        Shift + Enter creates a new line.
        */

        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {

            event.preventDefault();

            sendMessage();

        }

    }
);


sendButton.addEventListener(
    "click",
    sendMessage
);


/* =====================================================
   LEVEL CLICK PROTECTION
===================================================== */

document
    .querySelectorAll(".level")
    .forEach(levelElement => {

        levelElement.addEventListener(
            "click",
            () => {

                const selectedLevel =
                    Number(
                        levelElement.dataset.level
                    );


                /*
                Players cannot skip levels.
                */

                if (
                    selectedLevel !==
                    currentLevel
                ) {

                    setGameMessage(
                        "Complete the current level first.",
                        ""
                    );

                }

            }
        );

    });