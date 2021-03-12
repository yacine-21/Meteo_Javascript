// DECLARATION DE MES VARIABLES ICI

let tableauJourDeLaSemaine = document.querySelectorAll(".jour")
let bouton = document.querySelector(".btn")
let input = document.querySelector(".input")
let index = 0
let champ = document.getElementById("champ");
let btn = document.getElementById("btn");
let ville = document.getElementById("titre");
let villeSave = document.getElementById("save")
const api_key = 'ddef234bffdb94e0b9b8358c6d653348'
let url = "http://api.openweathermap.org/geo/1.0/direct?q=";
let city;
let cities = JSON.parse(localStorage.getItem('cities')) || [];
let dateDuJour;


// EVENT LISTENER

input.addEventListener("input",rentrezLeNomDeLaVille)
bouton.addEventListener("click",rechercheTemp)


// FONCTIONS CUSTOMScity

function rentrezLeNomDeLaVille(){
    city = input.value;
}

// Save dans le local storage le renvoie de l'api meteo
function SaveCity(){
    localStorage.setItem("cities",JSON.stringify(cities))
}

function createCity(ville){
        
        // ICI JE CRÉER MES VILLES SAUVERGARDEES
        let p1 = document.createElement("p")
        let button = document.createElement("button");
        button.innerHTML = "Delete me";

        // quand on click on supprime la ville saved
        button.addEventListener("click",function(){
            cities = cities.filter(e => e.id !== ville.id)
            SaveCity();
            p1.remove();
            button.remove();
        })
        p1.addEventListener("click",function(){
            // permet d'affiche quand on click sur la ville saved
            show(ville)
        })
        villeSave.appendChild(p1)
        villeSave.appendChild(button)
        p1.innerHTML = ville.nomDeLaVille + " " + ville.daily[0].temp.day;
        // permet d'afficher sur la main page
        show(ville)
        
}

function show(ville){
    tableauJourDeLaSemaine.forEach((p) => {

        dt = ville.daily[index].dt;
        let date = new Date(dt * 1000).getDay()
        switch (date) {
            case 0:
                dateDuJour = "Lundi"
                break;
            case 1:
                dateDuJour = "Mardi"
                break;
            case 2:
                dateDuJour = "Mercredi"
                break;
            case 3:
                dateDuJour = "Jeudi"
                break;
            case 4:
                dateDuJour = "Vendredi"
                break;
            case 5:
                dateDuJour = "Samedi"
                break;
            case 6:
                dateDuJour = "Dimanche"
                break;
        
            default:
                break;
        }

        p.innerHTML = dateDuJour + " : "+ville.daily[index].temp.day + "° ==> " + ville.daily[0].weather[0].description + " ==> le soleil se leve à  ==>  : " + new Date(ville.daily[0].sunrise * 1000).getHours() + "h" + "  le soleil se couche à :  ==> " + new Date(ville.daily[0].sunset * 1000).getHours() + "h";
        index ++
        if(index > 6){
            index = 0
        }
    })
}

cities.forEach(city => {
    createCity(city)
});


// Requetes FETCH
function rechercheTemp(){
    fetch(url+city+"&limit=5&appid="+api_key)
    .then(res => res.json())
    .then(r => {
        let latitude = r[0].lat; // je récupere la latitude de la ville
        let longitude = r[0].lon; // je récupere la longitude de la ville
        fetch("https://api.openweathermap.org/data/2.5/onecall?lat="+latitude+"&lon="+longitude+"&appid="+api_key+"&units=metric&exclude=current,hourly,alert,minutely&lang=fr")
        .then(res => res.json())
        .then(r => {
            r.nomDeLaVille = input.value;
            r.id = new Date().getTime();
            cities.push(r)
            SaveCity();
            createCity(r);
        })
    })
}

