import { ChangeDetectorRef, Component, inject, output } from '@angular/core';
import { FormsModule} from '@angular/forms';
import { Restaurant } from '../interfaces/restaurant';

@Component({
  selector: 'restaurant-form',
  imports: [FormsModule],
  templateUrl: './restaurant-form.component.html',
  styleUrl: './restaurant-form.component.css'
})

export class RestaurantFormComponent {

  newRestaurant!: Restaurant;

  filename = '';

  #changeDetector = inject(ChangeDetectorRef);

  add = output<Restaurant>();

  readonly days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  daysOpen: boolean[] = (new Array(7)).fill(true);
  weekDay: number = new Date().getDay();

  constructor(){
    this.resetForm();
  }

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
   
  addRestaurant(){
    //Convertimos de boleano a días abiertos
    this.newRestaurant.daysOpen = this.daysOpen
      .map((isOpen, index) => isOpen ? this.days[index] : null)
      .filter(day => day !== null);
    this.add.emit({...this.newRestaurant}); //Clonamos el objeto antes de añadirlo
    this.resetForm();
  }

  resetForm() {
    this.newRestaurant = {
      name: '',
      description: '',
      cuisine: '',
      image: '',
      daysOpen: [],
      phone: '',
    };
    this.filename = '';
    this.daysOpen = new Array(7).fill(true);
  }
}