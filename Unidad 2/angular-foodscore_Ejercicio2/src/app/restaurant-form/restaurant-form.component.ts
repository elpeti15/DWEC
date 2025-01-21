import { ChangeDetectorRef, Component, inject, output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Restaurant } from '../interfaces/restaurant';

@Component({
  selector: 'restaurant-form',
  imports: [FormsModule],
  templateUrl: './restaurant-form.component.html',
  styleUrl: './restaurant-form.component.css'
})

export class RestaurantFormComponent {

  newRestaurant: Restaurant = {
    name: "",
    image: "",
    cuisine: "",
    description: "",
    phone: "",
    daysOpen: []
  }

  #changeDetector = inject(ChangeDetectorRef);

  add = output<Restaurant>();

  readonly days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  daysOpen: boolean[] = (new Array(7)).fill(true);
  weekDay: number = new Date().getDay();


  changeImage(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (!fileInput.files?.length) return;
    const reader = new FileReader();
    reader.readAsDataURL(fileInput.files[0]);
    reader.addEventListener('load', () => {
      this.newRestaurant.image = reader.result as string;
      this.#changeDetector.markForCheck();
    });
  }
   
  addRestaurant(restaurantForm: NgForm){
    //Convertimos los días abiertos a índices
    this.newRestaurant.daysOpen = this.daysOpen
      .map((isOpen, index) => isOpen ? this.days[index] : null)
      .filter(day => day !== null);
    this.add.emit({...this.newRestaurant}); //Clonamos el objeto antes de añadirlo
    restaurantForm.resetForm();
    this.newRestaurant.image = "";
    this.daysOpen.fill(true);
    //setTimeout(() => this.daysOpen = new Array(7).fill(true), 1);
  }
}
