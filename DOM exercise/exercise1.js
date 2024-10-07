/*****
 * DOM - Exercise 1
 * 
 * Cuando un usuario haga click en un div dentro del elemento div.container, añade o quita (toggle) la clase CSS
 * "selected". 
 * El elemento button#delete borrará todos los divs seleccionados del DOM.
 */

let contenedor = document.querySelector("div");
let divs = contenedor.children;

for (let i = 0; i < divs.length; i++){
    divs[i].addEventListener("click", toglear);
}

function toglear(){
    this.classList.toggle("selected");
}

let button = document.getElementById("delete");
button.addEventListener("click", borrar);

function borrar(){
    let selecteds = document.querySelectorAll(".selected");
    for (let i = 0; i < selecteds.length; i++){
        selecteds[i].remove();
    }
}