/*****
 * DOM - Exercise 2
 * 
 * Cuando un usuario haga click sobre un div dentro del elemento div.container, añade o quita la clase CSS "selected".
 * Esta vez SOLO 1 div puede tener esa clase al mismo tiempo (quitala de otros elmentos cuando sea necesario)
 * 
 * El elemento button#insert-before creará un div NUEVO con el texto del elemento input#text antes 
 * del div seleccionado o al principio del elemento div.container si no hay nada selccionado (no 
 * olvides el evento de click del nuevo div).
 * 
 * El elemento button#insert-after hará lo mismo que el anterior pero lo insertará después del elemento seleccionado
 * o al principio de div.container si no hay nada selccionado.
 * 
 * El elemento button#replace, creará un NUEVO div con el texto y lo reemplazará por el seleccionado. Si no hay ninguno
 * seleccionado no hagas nada.
 * 
 * El elemento button#delete borrará el div seleccionado (si hay alguno)
 * 
 * El elemento button#clear borrará todo dentro de div.container.
 * 
 * NO USES innerHTML!!!!
 */

function divClick(e){
    let divSelected = document.querySelector(".selected");
    if (divSelected && divSelected !== this){
        divSelected.classList.remove("selected");
    }
    this.classList.toggle("selected");
}

let container = document.querySelector(".container");
let input = document.querySelector("input");
let insBeforeB = document.getElementById("insert-before");
let insAfterB = document.getElementById("insert-after");
let replaceB = document.getElementById("replace");
let deleteB = document.getElementById("delete");
let clearB = document.getElementById("clear");

container.querySelectorAll("div").forEach(div => {
    div.addEventListener("click", divClick);
})

function createDiv(){
    let div = document.createElement("div");
    div.textContent = input.value;
    div.addEventListener("click", divClick);
    return div;
}

insBeforeB.addEventListener("click", e => {
    let div = createDiv();
    let selected = document.querySelector(".selected");
    if (selected){
        selected.before(div);
    } else{
        container.prepend(div);
    }
})

insAfterB.addEventListener("click", e => {
    let div = createDiv();
    let selected = document.querySelector(".selected");
    if (selected){
        selected.after(div);
    } else{
        container.append(div);
    }
})

replaceB.addEventListener("click", e => {
    let div = createDiv();
    let selected = document.querySelector(".selected");
    if (selected){
        selected.replaceWith(div);
    } 
})

deleteB.addEventListener("click", e => {
    let selected = document.querySelector(".selected");
    if (selected){
        selected.remove();
    } 
})

clearB.addEventListener("click", e => {
    container.replaceChildren();
})
