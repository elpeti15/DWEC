import { Component, DestroyRef, inject} from '@angular/core';
import { Restaurant } from '../../interfaces/restaurant';
import { FormsModule } from '@angular/forms';
import { EncodeBase64Directive } from '../../directives/encode-base64.directive';
import { RestaurantsService } from '../services/restaurants.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';

@Component({
  selector: 'restaurant-form',
  imports: [FormsModule, EncodeBase64Directive],
  templateUrl: './restaurant-form.component.html',
  styleUrl: './restaurant-form.component.css'
})
export class RestaurantFormComponent { //implements CanComponentDeactivate

  #restaurantsService = inject(RestaurantsService);
  #destroyRef = inject(DestroyRef);
  #router = inject(Router);
  
  readonly days = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
  daysOpen: boolean[] = new Array(7).fill(true);

  newRestaurant: Restaurant = {
    name: '',
      description: '',
      cuisine: '',
      image: '',
      daysOpen: [],
      phone: ''
  };

  saved = false;

  addRestaurant() {
    this.newRestaurant.daysOpen = this.daysOpen
      .map((d, i) => String(i))
      .filter((i) => this.daysOpen[+i]);
    
    this.#restaurantsService
      .addRestaurant(this.newRestaurant)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: (restaurant) => {
          this.saved = true;
          this.#router.navigate(['/restaurants', restaurant.id]);
        },
        error: () => console.log('Error')
      });
  }

  //canDeactivate()
}
