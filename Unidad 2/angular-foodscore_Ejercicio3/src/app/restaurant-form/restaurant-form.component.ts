import { Component, DestroyRef, inject, output } from '@angular/core';
import { Restaurant } from '../interfaces/restaurant';
import { FormsModule } from '@angular/forms';
import { EncodeBase64Directive } from '../directives/encode-base64.directive';
import { RestaurantsService } from '../services/restaurants.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'restaurant-form',
  imports: [FormsModule, EncodeBase64Directive],
  templateUrl: './restaurant-form.component.html',
  styleUrl: './restaurant-form.component.css'
})
export class RestaurantFormComponent {

  #restaurantsService = inject(RestaurantsService);
  #destroyRef = inject(DestroyRef);
  
  readonly days = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
  newRestaurant!: Restaurant;
  add = output<Restaurant>();
  daysOpen!: boolean[];

  constructor() {
    this.resetForm();
  }

  addRestaurant(input: HTMLInputElement) {
    this.newRestaurant.daysOpen = this.daysOpen
      .map((d, i) => String(i))
      .filter((i) => this.daysOpen[+i]);
    
    this.#restaurantsService
      .addRestaurant(this.newRestaurant)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((restaurant) => {
        this.add.emit(restaurant);
        this.resetForm();
        input.value = '';
      })
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
    this.newRestaurant.image = '';
    this.daysOpen = new Array(7).fill(true);
  }
}
