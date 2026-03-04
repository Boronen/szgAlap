window.onload = function() {
    const kijelzo=document.getElementsByClassName("kijelzo")[0]
    const szamok = document.getElementsByClassName("szamok")[0];
    feltolt(szamok);
    const szamokbutton=document.querySelectorAll(".szamok > button")
    kezeles(szamokbutton,kijelzo);
};

function feltolt(szamok) {
    
    let szoveg = "";

    for (let index = 0; index < 9; index++) {
        szoveg += `<button id='${index}'>${index}</button>`;
    }
    szoveg += `<button id='9' class="kozep">9</button>`;
    szamok.innerHTML = szoveg;
}
function kezeles(szamokbutton,kijelzo){

    for (let index = 0; index < szamokbutton.length; index++) {
        szamokbutton[index].addEventListener("click",function()
        {
            kijelzo.innerHTML+=szamokbutton[index].id
        })
        
    }

}
function kezelesoperandusokvagymiez(){
        const kijelzo=document.getElementsByClassName("kijelzo")[0]
        
    
}