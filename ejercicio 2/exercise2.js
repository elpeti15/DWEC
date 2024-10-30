"use strict";

const f = document.getElementById("newRestaurant");

//Envio de formulario
f.addEventListener('submit', e => {
    e.preventDefault();

    const validName = validateName();
    const validDescription = validateDescription();
    const validKitchen = validateKitchen();
    const validPhone = validatePhone();
    const validDays = validateDays();
    const validImage = validateImage();

    if (validName && validDescription && validKitchen 
        && validPhone && validDays && validImage)
    {
        addRestaurant();
        f.reset();
        document.getElementById("imgPreview").classList.add("d-none");
        f.name.classList.remove("is-valid");
        f.description.classList.remove("is-valid");
        f.cuisine.classList.remove("is-valid");
        f.phone.classList.remove("is-valid");
        f.image.classList.remove("is-valid");
    }
})

//Validaciones de cada campo
function validateName(){
    const nameInput = f.name;
    const nameRegex = /^[A-Za-z][A-Za-z\s]*$/;
    if (!nameRegex.test(nameInput.value.trim())){
        nameInput.classList.add("is-invalid");
        return false;
    } else{
        nameInput.classList.remove("is-invalid");
        nameInput.classList.add("is-valid");
        return true;
    }
}

function validateDescription(){
    const descInput = f.description;
    if (descInput.value.trim() === ""){
        descInput.classList.add("is-invalid");
        return false;
    } else{
        descInput.classList.remove("is-invalid");
        descInput.classList.add("is-valid");
        return true;
    }
}

function validateKitchen(){
    const kitcInput = f.cuisine;
    if (kitcInput.value.trim() === ""){
        kitcInput.classList.add("is-invalid");
        return false;
    } else{
        kitcInput.classList.remove("is-invalid");
        kitcInput.classList.add("is-valid");
        return true;
    }
}

function validateDays(){
    const daysInputs = document.querySelectorAll("input[name='days']:checked");
    const error = document.getElementById("daysError");
    if (daysInputs.length === 0){
        error.classList.remove("d-none");
        return false;
    } else{
        error.classList.add("d-none");
        return true;
    }
}

function validatePhone(){
    const phoneInput = f.phone;
    const phoneRegex = /^\d{9}$/;
    if (!phoneRegex.test(phoneInput.value)){
        phoneInput.classList.add("is-invalid");
        return false;
    } else{
        phoneInput.classList.remove("is-invalid");
        phoneInput.classList.add("is-valid");
        return true;
    }
}

//Conversión de imagen
f.image.addEventListener('change', event => {
    let imgPreview = document.getElementById("imgPreview");

    let file = event.target.files[0];
    let reader = new FileReader();
    if (file) reader.readAsDataURL(file);
    reader.addEventListener('load', e => {
        imgPreview.classList.remove("d-none");
        imgPreview.src = reader.result;
    });
});

function validateImage(){
    const imageInput = f.image;
    if (!imageInput.files[0]){
        imageInput.classList.add("is-invalid");
        return false;
    } else{
        imageInput.classList.remove("is-invalid");
        imageInput.classList.add("is-valid");
        return true;
    }
}

//Añadimos restaurante
function addRestaurant(){

    const contenedor = document.getElementById("placesContainer");
    const template = document.getElementById("template");

    //Clonamos el contenido de la plantilla
    const htmlTemplate = template.content.cloneNode(true);

    const img = htmlTemplate.querySelector("img");
    img.src = imgPreview.src;  // se usa la de imgPreview
    
    const h4 = htmlTemplate.querySelector("h4");
    h4.textContent = f.name.value;

    const p = htmlTemplate.querySelector("p");
    p.textContent = f.description.value;

    //Usamos array auxiliar
    const weekDays = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"];
    const today = new Date().getDay();

    const selectedDays = Array.from(f.days)
        .filter((d) => d.checked)
        .map((d) => weekDays[d.value]);
        
    const strong1 = htmlTemplate.querySelector("strong");
    strong1.textContent = "Apertura: ";
    strong1.after(selectedDays.join(", "));

    const spans = htmlTemplate.querySelectorAll("span");

    if (selectedDays.indexOf(weekDays[today]) !== -1){
        spans[1].classList.add("d-none");
    } else{
        spans[0].classList.add("d-none");
    }

    const strong2 = htmlTemplate.querySelectorAll("strong")[1];
    strong2.after(f.phone.value);

    const small = htmlTemplate.querySelectorAll("small")[2];
    small.textContent = f.cuisine.value;

    contenedor.append(htmlTemplate);
}