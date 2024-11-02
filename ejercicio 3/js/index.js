import { RestaurantsService } from "./restaurant-service-class.js";

const restaurantsService = new RestaurantsService();
let restaurants = [];
const template = document.getElementById("restaurantTemplate");

async function getAllRestaurants(){
    try{
        restaurants = await restaurantsService.getAll();
        showRestaurants(restaurants);
    } catch (error){
        console.error("Error al cargar los restaurantes");
    }
}

function showRestaurants(restaurants){
    const container = document.getElementById("placesContainer");
    container.replaceChildren();

    //Usamos array auxiliar
    const weekDays = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"];
    const today = new Date().getDay();

    restaurants.forEach( r => {
        const htmlTemplate = template.content.cloneNode(true);
        htmlTemplate.querySelector(".card-title").textContent = r.name;
        htmlTemplate.querySelector(".card-text").textContent = r.description;
        htmlTemplate.querySelector(".card-img-top").src = r.image;

        //Mostramos días de apertura: 
        const selectedDays = r.daysOpen.map(d => weekDays[d]);
        htmlTemplate.querySelector("strong").textContent = "Apertura: ";
        htmlTemplate.querySelector("strong").after(selectedDays.join(", "));
        
        //Controlamos la etiqueta de "abierto/cerrado"
        const spans = htmlTemplate.querySelectorAll("span");
        if (selectedDays.indexOf(weekDays[today]) !== -1){
            spans[1].classList.add("d-none");
        } else{
            spans[0].classList.add("d-none");
        }

        htmlTemplate.querySelectorAll("strong")[1].after(r.phone);
        htmlTemplate.querySelectorAll("small")[2].textContent = r.cuisine;

        //Añadimos el evento al botón de eliminar
        const deleteButton = htmlTemplate.querySelector(".delete");
        deleteButton.addEventListener("click", () => deleteRestaurant(r.id));

        container.append(htmlTemplate);
    });
}

async function deleteRestaurant(id){
    const confirmDelete = confirm("¿Estás seguro de eliminar este restaurante?");
    if (!confirmDelete) return;

    try {
        await restaurantsService.delete(id);
        //Eliminamos el restaurante del array y actualizamos el DOM
        restaurants = restaurants.filter( r => r.id !== id);
        showRestaurants(restaurants);
    } catch (error){
        console.error("Error al eliminar el restaurante");
    }
}

//Evento de búsqueda
const search = document.getElementById("search");
search.addEventListener("input", e => {
    const busqueda = e.target.value.toLowerCase();
    const filteredRestaurants = restaurants.filter( r => 
        r.name.toLowerCase().includes(busqueda) ||
        r.description.toLowerCase().includes(busqueda)
    );
    showRestaurants(filteredRestaurants);
})

getAllRestaurants();