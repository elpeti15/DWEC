import { Component, inject, input, numberAttribute } from '@angular/core';
import { RestaurantCardComponent } from "../restaurant-card/restaurant-card.component";
import { RestaurantsService } from '../services/restaurants.service';
import { Title } from '@angular/platform-browser';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { catchError, EMPTY, tap } from 'rxjs';

@Component({
  selector: 'restaurant-details',
  imports: [RestaurantCardComponent],
  templateUrl: './restaurant-details.component.html',
  styleUrl: './restaurant-details.component.css'
})
export class RestaurantDetailsComponent {

  id = input.required({ transform: numberAttribute})
  #restaurantService = inject(RestaurantsService);
  #title = inject(Title);
  #router = inject(Router);

  restaurantResource = rxResource({
    request: () => this.id(),
    loader: ({ request: id}) =>
      this.#restaurantService.getRestaurant(id).pipe(
        tap((r) => this.#title.setTitle(r.name + ' | Angular FoodScore')),
        catchError(() => {
          this.#router.navigate(['/restaurants']);
          return EMPTY
        })
      ),
  });

  goBack() {
    this.#router.navigate(['/restaurants']);
  }
}