/* =========================================
   GAMI INFINITY
   GLOBAL JAVASCRIPT
========================================= */


/* =========================================
   USER SESSION
========================================= */

let gamiUserId =
    localStorage.getItem("gami_user_id");


/* =========================================
   START SESSION
========================================= */

async function startSession() {

    try {

        /*
         * If this browser already has a session,
         * reuse it.
         */

        if (!gamiUserId) {

            const response =
                await fetch("/api/session", {
                    method: "POST"
                });


            if (!response.ok) {

                throw new Error(
                    "Session request failed"
                );

            }


            const data =
                await response.json();


            gamiUserId =
                data.user_id;


            localStorage.setItem(
                "gami_user_id",
                gamiUserId
            );

        }


        /*
         * Send the first heartbeat.
         */

        await heartbeat();


    } catch (error) {

        console.log(
            "Gami session unavailable:",
            error
        );

    }

}


/* =========================================
   HEARTBEAT
========================================= */

async function heartbeat() {

    if (!gamiUserId) {
        return;
    }


    try {

        const response =
            await fetch("/api/heartbeat", {

                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    user_id:
                        gamiUserId

                })

            });


        if (!response.ok) {
            return;
        }


        const data =
            await response.json();


        updateActiveUsers(
            data.active_users
        );


    } catch (error) {

        /*
         * Do not break the page if
         * the server temporarily disappears.
         */

        console.log(
            "Heartbeat failed"
        );

    }

}


/* =========================================
   ACTIVE USER COUNT
========================================= */

function updateActiveUsers(count) {

    const counter =
        document.getElementById(
            "activeUsers"
        );


    if (!counter) {
        return;
    }


    if (
        typeof count === "number"
    ) {

        counter.textContent =
            count.toLocaleString();

    }

}


/* =========================================
   GET ACTIVE USERS
========================================= */

async function getActiveUsers() {

    try {

        const response =
            await fetch(
                "/api/stats"
            );


        if (!response.ok) {
            return;
        }


        const data =
            await response.json();


        updateActiveUsers(
            data.active_users
        );


    } catch (error) {

        console.log(
            "Stats unavailable"
        );

    }

}


/* =========================================
   OPEN GAME
========================================= */

function openGame(gameNumber) {

    /*
     * Make sure the requested game
     * is one of the four official slots.
     */

    if (
        gameNumber < 1 ||
        gameNumber > 4
    ) {

        console.log(
            "Invalid game number"
        );

        return;

    }


    /*
     * Game 4 is currently a placeholder.
     */

    if (gameNumber === 4) {

        return;

    }


    /*
     * Open the game's own folder.
     */

    window.location.href =
        `/games/game${gameNumber}/`;

}


/* =========================================
   SCROLL TO GAMES
========================================= */

function scrollToGames() {

    const games =
        document.getElementById(
            "games"
        );


    if (!games) {
        return;
    }


    games.scrollIntoView({

        behavior: "smooth",

        block: "start"

    });

}


/* =========================================
   SERVER STATUS CHECK
========================================= */

async function checkServer() {

    try {

        const response =
            await fetch(
                "/api/stats",
                {
                    method: "GET"
                }
            );


        if (
            response.ok
        ) {

            document.body.classList.add(
                "server-online"
            );

        } else {

            document.body.classList.remove(
                "server-online"
            );

        }


    } catch (error) {

        document.body.classList.remove(
            "server-online"
        );

    }

}


/* =========================================
   INITIALIZATION
========================================= */

async function initializeGami() {

    await startSession();

    await getActiveUsers();

    await checkServer();

}


/* =========================================
   START
========================================= */

initializeGami();


/* =========================================
   HEARTBEAT LOOP
========================================= */

setInterval(
    heartbeat,
    20000
);


/* =========================================
   ACTIVE USER REFRESH
========================================= */

setInterval(
    getActiveUsers,
    10000
);


/* =========================================
   SERVER CHECK
========================================= */

setInterval(
    checkServer,
    30000
);