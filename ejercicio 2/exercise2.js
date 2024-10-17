"use strict";

const f = document.getElementById("newRestaurant");

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
        this.reset();
        document.getElementById("imgPreview").classList.add("d-none");
        f.name.classList.remove("is-valid");
        f.description.classList.remove("is-valid");
        f.cuisine.classList.remove("is-valid");
        f.phone.classList.remove("is-valid");
        f.image.classList.remove("is-valid");
    }
})

function validateName(){
    const nameInput = f.name;
    const nameRegex = /^[A-Za-z][A-Za-z\s]*$/;
    if (!nameRegex.test(nameInput.ariaValueMax.trim())){
        nameInput.classList.add("is-invalid");
    } else{
        nameInput.classList.remove("is-invalid");
        nameInput.classList.add("is-valid");
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
    const phoneRegex = /^d{9}$/;
    if (!phoneRegex.test(phoneInput.value)){
        phoneInput.classList.add("is-invalid");
        return false;
    } else{
        phoneInput.classList.remove("is-invalid");
        phoneInput.classList.add("is-valid");
        return true;
    }
}

newProdForm.image.addEventListener('change', event => {
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

function addRestaurant(){
    const contenedor = document.getElementById("placesContainer");

    const colDiv = document.createElement("div");
    colDiv.classList.add("col");

    const cardDdiv = document.createElement("div");
    cardDdiv.classList.add("card h-100 shadow");

    const img = document.createElement("img");
    img.classList.add("card-img-top");
    img.src = imgPreview.src;  // se usa la de imgPreview

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    const h4 = document.createElement("h4");
    h4.classList.add("card-title");
    h4.textContent = f.name.value;

    const p = document.createElement("p");
    p.classList.add("card-text");
    p.textContent = f.description.value;

    const textDiv1 = document.createElement("div");
    textDiv.classList.add("card-text");

    const small1 = document.createElement("small");
    small1.classList.add("text-muted");

    const strong1 = document.createElement("strong");
    strong1.textContent = "Apertura: "

    const selectedDays = Array.from(f.days)
        .filter((d) => d.checked)
        .map((d) => d.value)
        .join(", ");
        
        //Añadir append después.

    const openSpan = document.createElement("span");
    openSpan.classList.add("badge ms-2 bg-success");
    openSpan.textContent = "Abierto";

    const closedSpan = document.createElement("span");
    closedSpan.classList.add("badge ms-2 bg-danger");
    closedSpan.textContent = "Cerrado";

    const textDiv2 = document.createElement("div");
    textDiv2.classList.add("card-text");

    const small2 = document.createElement("small");
    small2.classList.add("text-muted");

    const strong2 = document.createElement("strong");
    strong2.textContent = "Teléfono: ";
    //Añadir append después.

    const footerDiv = document.createElement("div");
    footerDiv.classList.add("card-footer");

    const small3 = document.createElement("small");
    small3.classList.add("text-muted");
    small3.textContent = f.cuisine.value;

    //falta añadir los apend


}