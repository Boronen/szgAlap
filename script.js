let aktualis = "";
let voltEredmeny = false;
let loggedInUser = null; 

window.onload = function () {
    const kijelzo = document.querySelector(".kijelzo");
    const szamok = document.querySelector(".szamok");
    const core = document.getElementById("core");
    const header = document.querySelectorAll("header")[1];
    const footer = document.querySelector("footer");
    const kifejezes = document.querySelector(".kifejezes");
    const eredmeny = document.querySelector(".eredmeny");
    const headerspan = document.querySelector("#mainheader span");

    feltolt(szamok);
    colorpaletta(core, header, footer, kifejezes, eredmeny, kijelzo, headerspan);

    const szamokbutton = document.querySelectorAll(".szamok > button");
    const muveletek = document.querySelectorAll(".muvjelek > button");

    kezeles(szamokbutton, muveletek, kijelzo);

    loginInit();
    updateLeaderboard();
};

//////////////////////////////////////////////////////////
// SZÁMOK FELTÖLTÉSE
//////////////////////////////////////////////////////////

function feltolt(szamok) {
    let szoveg = "";

    for (let index = 0; index < 9; index++) {
        szoveg += `<button id='${index}'>${index}</button>`;
    }
    szoveg += `<button id='9' class="kozep">9</button>`;
    szamok.innerHTML = szoveg;
}

//////////////////////////////////////////////////////////
// GOMBKEZELÉS
//////////////////////////////////////////////////////////

function kezeles(szamokbutton, muveletek, kijelzo) {
    for (let i = 0; i < szamokbutton.length; i++) {
        szamokbutton[i].addEventListener("click", function () {
            const kifejezes = kijelzo.querySelector(".kifejezes");
            const eredmeny = kijelzo.querySelector(".eredmeny");

            if (voltEredmeny) {
                aktualis = "";
                kifejezes.innerHTML = "";
                eredmeny.innerHTML = "";
                voltEredmeny = false;
            }

            aktualis += this.id;
            kifejezes.innerHTML = aktualis;
        });
    }

    for (let i = 0; i < muveletek.length; i++) {
        muveletek[i].addEventListener("click", function () {
            muveletKezeles(this.id, kijelzo);
        });
    }
}

//////////////////////////////////////////////////////////
// MŰVELETEK
//////////////////////////////////////////////////////////

function muveletKezeles(id, kijelzo) {
    const kifejezes = kijelzo.querySelector(".kifejezes");
    const eredmeny = kijelzo.querySelector(".eredmeny");

    if (voltEredmeny && id !== "torles" && id !== "egyenlo") {
        kifejezes.innerHTML = aktualis;
        voltEredmeny = false;
    }

    if (kifejezes.innerHTML === "" && id !== "torles") {
        return;
    }

    if (id === "osszeadas") aktualis += "+";
    else if (id === "kivonas") aktualis += "-";
    else if (id === "szorzas") aktualis += "*";
    else if (id === "osztas") aktualis += "/";
    else if (id === ".") aktualis += ".";
    else if (id === "torles") {
        aktualis = "";
        kifejezes.innerHTML = "";
        eredmeny.innerHTML = "";
        return;
    } else if (id === "egyenlo") {
        szamitas(kijelzo);
        return;
    }

    kifejezes.innerHTML = aktualis;
}

//////////////////////////////////////////////////////////
// SZÁMÍTÁS
//////////////////////////////////////////////////////////

function szamitas(kijelzo) {
    if (!/^[0-9+\-*/.]+$/.test(aktualis)) {
        kijelzo.querySelector(".eredmeny").innerHTML = "Error code:1";
        aktualis = "";
        return;
    }

    if (/[\+\-\*\/]{2,}/.test(aktualis)) {
        kijelzo.querySelector(".eredmeny").innerHTML = "Error code:2";
        aktualis = "";
        return;
    }

    if (/[+\-*/]$/.test(aktualis)) {
        kijelzo.querySelector(".eredmeny").innerHTML = "Error code:3";
        aktualis = "";
        return;
    }

    let szamokStringben = aktualis.split(/[\+\-\*\/]/);
    let szamok = szamokStringben.map(Number);
    let muveletek = aktualis.split(/[0-9.]+/).filter(x => x !== "");

    let eredmeny = szamok[0];

    for (let i = 0; i < muveletek.length; i++) {
        let op = muveletek[i];
        let kov = szamok[i + 1];

        if (op === "+") eredmeny += kov;
        else if (op === "-") eredmeny -= kov;
        else if (op === "*") eredmeny *= kov;
        else if (op === "/") eredmeny /= kov;
    }

    kijelzo.querySelector(".eredmeny").innerHTML = "eredmény: " + eredmeny;

    aktualis = "" + eredmeny;
    voltEredmeny = true;

    if (loggedInUser) {
        fetch("backend/log.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `user=${loggedInUser}`
        }).then(() => updateLeaderboard());
    }
}

//////////////////////////////////////////////////////////
// LOGIN RENDSZER
//////////////////////////////////////////////////////////

function loginInit() {
    document.getElementById("loginBtn").addEventListener("click", function () {
        const user = document.getElementById("username").value;
        const pass = document.getElementById("password").value;

        fetch("backend/login.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `user=${user}&pass=${pass}`
        })
        .then(r => r.text())
        .then(res => {
            if (res === "ok") {
                loggedInUser = user;
                document.getElementById("loginPanel").style.display = "none";
                updateLeaderboard();
            } else {
                document.getElementById("loginMessage").innerText = "Hibás adatok!";
            }
        });
    });

    document.getElementById("registerBtn").addEventListener("click", function () {
        const user = document.getElementById("username").value;
        const pass = document.getElementById("password").value;

        fetch("backend/register.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `user=${user}&pass=${pass}`
        })
        .then(r => r.text())
        .then(res => {
            if (res === "ok") {
                document.getElementById("loginMessage").innerText = "Sikeres regisztráció!";
            } else {
                document.getElementById("loginMessage").innerText = "A felhasználó már létezik!";
            }
        });
    });
}

//////////////////////////////////////////////////////////
// LEADERBOARD
//////////////////////////////////////////////////////////

function updateLeaderboard() {
    fetch("backend/leaderboard.php")
        .then(r => r.json())
        .then(data => {
            let html = "";
            for (let user in data) {
                html += `<li>${user}: ${data[user]} pont</li>`;
            }
            document.getElementById("leaderboardList").innerHTML = html;
        });
}

//////////////////////////////////////////////////////////
// TÉMAVÁLTÓ
//////////////////////////////////////////////////////////

function colorpaletta(core, header, footer, kifejezes, eredmeny, kijelzo, headerspan) {
    document.getElementById("themeSelector").addEventListener("change", function () {
        const val = this.value;

        if (val === "default") {
            document.body.style.background = "white";
            core.style.background = "white";
            headerspan.style.color = "black";
            header.style.color = "#000000";
            footer.style.color = "#000000";
        }

        if (val === "blue") {
            document.body.style.background = "#95b9e0";
            core.style.background = "#ffffff";
            header.style.color = "#000000";
            footer.style.color = "#000000";
        }

        if (val === "dark") {
            document.body.style.background = "#444";
            core.style.background = "#222";
            header.style.color = "#ffffff";
            footer.style.color = "#ffffff";
            kijelzo.style.background = "#ffffff";
            headerspan.style.color = "white";
        }

        if (val === "gamervibes") {
            document.body.style.background = "black";
            core.style.background = "white";
            headerspan.style.color = "white";
            header.style.color = "#000000";
            footer.style.color = "#000000";
        }

        if (val === "sunset") {
            document.body.style.background = "#f7c08a";
            core.style.background = "#8b4513";
        }
    });
}
