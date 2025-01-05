import { Component } from '@angular/core';
import { Restaurant } from '../interfaces/restaurant';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'restaurants-page',
  imports: [FormsModule],
  templateUrl: './restaurants-page.component.html',
  styleUrl: './restaurants-page.component.css'
})
export class RestaurantsPageComponent {

    restaurants: Restaurant[] = [];

    newRestaurant: Restaurant = {
      name: "",
      image: "",
      cuisine: "",
      description: "",
      phone: "",
      daysOpen: []
    }

    readonly days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    daysOpen: boolean[] = (new Array(7)).fill(true);
    weekDay: number = new Date().getDay();


    changeImage(event: Event) {
      const fileInput = event.target as HTMLInputElement;
      if (!fileInput.files || fileInput.files.length === 0) { return; }
      const reader: FileReader = new FileReader();
      reader.readAsDataURL(fileInput.files[0]);
      reader.addEventListener('loadend', () => {
      this.newRestaurant.image = reader.result as string;
      });
    }
     
    addRestaurant(restaurantForm: NgForm){
      //Convertimos los días abiertos a índices
      this.newRestaurant.daysOpen = this.daysOpen
        .map((isOpen, index) => isOpen ? this.days[index] : null)
        .filter(day => day !== null);
      this.restaurants.push({...this.newRestaurant}); //Clonamos el objeto antes de añadirlo
      restaurantForm.resetForm();
      this.newRestaurant.image = "";
      setTimeout(() => this.daysOpen = new Array(7).fill(true), 1);
        
      /* No me funciona bien la recarga de la página con el fill(true)
       ya que se me quedan los checkbox de los días sin marcar al enviar el formulario con todos los checkbox marcados.
       He revisado la página con el inspector del navegador y me muestra que están a true pero no se marcan.
       En cambio, si desmarco algún checkbox si me funciona correctamente. El error solo pasa para cuando se 
       envía el formulario con todos los checkbox marcados.
       He probado muchas formas para solucionarlo y la que he visto por ahí es poner un setTimeout. De esta forma,
       si que funciona correctamente. No se si estará bien o es "trampa".
      */
    }

    deleteRestaurant(index: number){
      this.restaurants.splice(index, 1);
    }
}
