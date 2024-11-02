import { RestaurantsService } from "./restaurant-service-class.js";

const restaurantsService = new RestaurantsService();
const f = document.getElementById("newRestaurant");
const imgPreview = document.getElementById("imgPreview");

f.addEventListener("submit", async e => {
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
        document.getElementById("imgPreview").classList.add("d-none");
        f.name.classList.remove("is-valid");
        f.description.classList.remove("is-valid");
        f.cuisine.classList.remove("is-valid");
        f.phone.classList.remove("is-valid");
        f.image.classList.remove("is-valid");

        //Creamos objeto restaurant
        const restaurant = {
            name: f.name.value,
            description: f.description.value,
            daysOpen: Array.from(f.days).filter(d => d.checked).map(d => d.value),
            phone: f.phone.value,
            cuisine: f.cuisine.value,
            image: imgPreview.src
        }
        try{
            await restaurantsService.post(restaurant);
            //Nos movemos al index.html
            location.assign("index.html");
        } catch (error){
            alert("Error al crear el restaurante");
        }
    }
    
});

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
f.image.addEventListener("change", event => {
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