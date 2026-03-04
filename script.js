let aktualis = "";
let voltEredmeny = false;

window.onload = function () {
  const kijelzo = document.getElementsByClassName("kijelzo")[0];
  const szamok = document.getElementsByClassName("szamok")[0];
  const core = document.getElementById("core"); 
  const header = document.querySelectorAll("header")[1];
  const footer= document.querySelectorAll("footer")[0];
  const kifejezes = document.querySelector(".kifejezes");
  const eredmeny= document.querySelector(".eredmeny")
  const headerspan=document.querySelectorAll("span")[0]

  feltolt(szamok);
  colorpaletta(core,header,footer,kifejezes,eredmeny,kijelzo,headerspan); //erre biztos van jobb megoldás

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


function muveletKezeles(id, kijelzo) {
  const kifejezes = kijelzo.querySelector(".kifejezes");
  const eredmeny = kijelzo.querySelector(".eredmeny");

  if (voltEredmeny && id !== "torles" && id !== "egyenlo") {
    kifejezes.innerHTML = aktualis;
    voltEredmeny = false;
  }  if (kifejezes.innerHTML === "" && id !== "torles") {
    return;

    
  } if (id === "osszeadas") {
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
    eredmeny.innerHTML = "";
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
    kijelzo.querySelector(".eredmeny").innerHTML = "Error code:1";
    aktualis = "";
    return;
  }

  // ez azt nézi, hogy van-e két műveleti jel egymás után.
  // ++ = Hiba
  if (/[\+\-\*\/]{2,}/.test(aktualis)) {
    kijelzo.querySelector(".eredmeny").innerHTML = "Error code:2";
    aktualis = "";
    return;
  }

  // ez azt nézi, hogy a végén nem állhat műveleti jel.
  // pl: x-" = Hiba
  if (/[+\-*/]$/.test(aktualis)) {
    kijelzo.querySelector(".eredmeny").innerHTML = "Error code:3";
    aktualis = "";
    return;
  }

  let szamokStringben = aktualis.split(/[\+\-\*\/]/);

  let szamok = [];
  for (let i = 0; i < szamokStringben.length; i++) {
    // Számokká castolja a bentlévő értéket
    szamok.push(Number(szamokStringben[i]));
  }

  let muveletek = aktualis.split(/[0-9.]+/).filter((x) => x !== "");

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
  eredmenySpan.innerHTML = "eredmény: " + eredmeny;

  // Stringre visszaírjuk hogy ne dobja fel a mancsát a program a castoláskor
  aktualis = "" + eredmeny;
  voltEredmeny = true;
}


//szép hunglish
function colorpaletta(core,header,footer,kifejezes,eredmeny,kijelzo,headerspan){
    document.getElementById("themeSelector").addEventListener("change", function () {
    const val = this.value;

    if (val === "default") {
        document.body.style.background = "white";
        core.style.background = "white";
        headerspan.style.color = "black"
                header.style.color = "#000000";
        footer.style.color="#000000"
    }

    if (val === "blue") {
        document.body.style.background = "#95b9e0";   
        core.style.background = "#ffffff"; 
                header.style.color = "#000000";
        footer.style.color="#000000"
    }

    if (val === "dark") {
        
        document.body.style.background = "#444";       
        core.style.background = "#222"
        header.style.color = "#ffffff";
        footer.style.color="#ffffff"
        kijelzo.style.background="#ffffff"
        headerspan.style.color="white"
        
    }
    if (val === "gamervibes"){
        document.body.style.background = "black"
        core.style.background ="white"
                headerspan.style.color="white"
                        header.style.color = "#000000";
        footer.style.color="#000000"
    }

    if (val === "sunset") {
        document.body.style.background = "#f7c08a";    
        core.style.background = "#8b4513"; 
    }
});

}