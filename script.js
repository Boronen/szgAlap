let aktualis = "";

window.onload = function () {
  const kijelzo = document.getElementsByClassName("kijelzo")[0];
  const szamok = document.getElementsByClassName("szamok")[0];

  feltolt(szamok);

  const szamokbutton = document.querySelectorAll(".szamok > button");
  const muveletek = document.querySelectorAll(".muvjelek > button");

  kezeles(szamokbutton, muveletek, kijelzo);
};

function feltolt(szamok) {
  let szoveg = "";

  for (let index = 0; index < 9; index++) {
    szoveg += `<button id='${index}'>${index}</button>`;
  }
  szoveg += `<button id='9' class="kozep">9</button>`;
  szamok.innerHTML = szoveg;
}

function kezeles(szamokbutton, muveletek, kijelzo) {

for (let i = 0; i < szamokbutton.length; i++) {
    szamokbutton[i].addEventListener("click", function () {
        aktualis += this.id;

        const kifejezes = kijelzo.querySelector(".kifejezes");
        kifejezes.innerHTML = aktualis;
    });
}


  for (let i = 0; i < muveletek.length; i++) {
    muveletek[i].addEventListener("click", function () {
      muveletKezeles(this.id, kijelzo);
    });
  }
  /*document.getElementById("osszeadas").addEventListener("click", () => muveletKezeles("osszeadas", kijelzo));
document.getElementById("kivonas").addEventListener("click", () => muveletKezeles("kivonas", kijelzo));
document.getElementById("szorzas").addEventListener("click", () => muveletKezeles("szorzas", kijelzo));
document.getElementById("osztas").addEventListener("click", () => muveletKezeles("osztas", kijelzo));
document.getElementById("egyenlo").addEventListener("click", () => muveletKezeles("egyenlo", kijelzo));
document.getElementById("torles").addEventListener("click", () => muveletKezeles("torles", kijelzo));*/

}

function muveletKezeles(id, kijelzo) {

    const kifejezes = kijelzo.querySelector(".kifejezes");
    const eredmeny = kijelzo.querySelector(".eredmeny");

    if (kifejezes.innerHTML === "" && id !== "torles") {
        return;
    }

    if (id === "osszeadas") {
        aktualis += "+";
    } else if (id === "kivonas") {
        aktualis += "-";
    } else if (id === "szorzas") {
        aktualis += "*";
    } else if (id === "osztas") {
        aktualis += "/";
    } else if (id === ".") {
        aktualis += ".";
    } else if (id === "torles") {
        aktualis = "";
        kifejezes.innerHTML = "";
        eredmeny.innerHTML= "";
        return;
    } else if (id === "egyenlo") {
        szamitas(kijelzo);
        return;
    }

    kifejezes.innerHTML = aktualis;
}


function szamitas(kijelzo) {

    // reminder: a test() egy regex ellenőrző függvény.
    // ötletem sincs mi az a regex , de true/false-t ad vissza, és ez nekem bőven elég
    if (!/^[0-9+\-*/.]+$/.test(aktualis)) {
        kijelzo.querySelector(".eredmeny").innerHTML = "Hiba";
        aktualis = "";
        return;
    }

    // ez azt nézi, hogy van-e két műveleti jel egymás után.
    // ++ = Hiba
    if (/[\+\-\*\/]{2,}/.test(aktualis)) {
        kijelzo.querySelector(".eredmeny").innerHTML = "Hiba";
        aktualis = "";
        return;
    }

    // ez azt nézi, hogy a végén nem állhat műveleti jel.
    // pl: x-" = Hiba
    if (/[+\-*/]$/.test(aktualis)) {
        kijelzo.querySelector(".eredmeny").innerHTML = "Hiba";
        aktualis = "";
        return;
    }

    let szamokStringben = aktualis.split(/[\+\-\*\/]/);

    let szamok = [];
    for (let i = 0; i < szamokStringben.length; i++) {
        // Számokká castolja a bentlévő értéket
        szamok.push(Number(szamokStringben[i]));
    }

    let muveletek = aktualis.split(/[0-9.]+/).filter(x => x !== "");

    // reminder: a számolást balról jobbra csináljuk.
    // ebből valszeg késöbb para lesz, de majd akkor ráérek aggódni miatta
    let eredmeny = szamok[0];

    for (let i = 0; i < muveletek.length; i++) {
        let op = muveletek[i];
        let kov = szamok[i + 1];

        if (op === "+") eredmeny += kov;
        else if (op === "-") eredmeny -= kov;
        else if (op === "*") eredmeny *= kov;
        else if (op === "/") eredmeny /= kov;
    }
    const eredmenySpan = kijelzo.querySelector(".eredmeny");
    eredmenySpan.innerHTML = "eredmény:"+eredmeny;

    // Stringre visszaírjuk hogy ne dobja fel a mancsát a program a castoláskor
    aktualis = "" + eredmeny;
}

