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
    
    const colDiv = document.createElement("div");
    colDiv.classList.add("col");
    contenedor.append(colDiv);

    const cardDiv = document.createElement("div");
    cardDiv.classList.add("card");
    cardDiv.classList.add("h-100");
    cardDiv.classList.add("shadow");
    colDiv.append(cardDiv);

    const img = document.createElement("img");
    img.classList.add("card-img-top");
    img.src = imgPreview.src;  // se usa la de imgPreview
    cardDiv.append(img);

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    cardDiv.append(cardBody);

    const h4 = document.createElement("h4");
    h4.classList.add("card-title");
    h4.textContent = f.name.value;
    cardBody.append(h4);

    const p = document.createElement("p");
    p.classList.add("card-text");
    p.textContent = f.description.value;
    cardBody.append(p);

    const textDiv1 = document.createElement("div");
    textDiv1.classList.add("card-text");
    cardBody.append(textDiv1);

    const small1 = document.createElement("small");
    small1.classList.add("text-muted");
    textDiv1.append(small1);

    const strong1 = document.createElement("strong");
    strong1.textContent = "Apertura: "
    small1.append(strong1);
    
    //Usamos array auxiliar
    const weekDays = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"];
    const today = new Date().getDay();

    const selectedDays = Array.from(f.days)
        .filter((d) => d.checked)
        .map((d) => weekDays[d.value]);
        
    small1.append(selectedDays.join(", "));

    const openSpan = document.createElement("span");
    openSpan.classList.add("badge");
    openSpan.classList.add("ms-2");
    openSpan.classList.add("bg-success");
    openSpan.textContent = "Abierto";

    const closedSpan = document.createElement("span");
    closedSpan.classList.add("badge");
    closedSpan.classList.add("ms-2");
    closedSpan.classList.add("bg-danger");
    closedSpan.textContent = "Cerrado";

    if (selectedDays.indexOf(weekDays[today]) !== -1){
        small1.append(openSpan);
    } else{
        small1.append(closedSpan);
    }

    const textDiv2 = document.createElement("div");
    textDiv2.classList.add("card-text");
    cardBody.append(textDiv2);

    const small2 = document.createElement("small");
    small2.classList.add("text-muted");
    textDiv2.append(small2);

    const strong2 = document.createElement("strong");
    strong2.textContent = "Teléfono: ";
    small2.append(strong2);
    small2.append(f.phone.value);

    const footerDiv = document.createElement("div");
    footerDiv.classList.add("card-footer");
    cardDiv.append(footerDiv);

    const small3 = document.createElement("small");
    small3.classList.add("text-muted");
    small3.textContent = f.cuisine.value;
    footerDiv.append(small3);
}