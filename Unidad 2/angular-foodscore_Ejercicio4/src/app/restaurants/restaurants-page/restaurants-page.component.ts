import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Restaurant } from '../../interfaces/restaurant';
import { RestaurantCardComponent } from '../restaurant-card/restaurant-card.component';
import { RestaurantsService } from '../services/restaurants.service';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'restaurants-page',
  imports: [FormsModule, RestaurantCardComponent],
  templateUrl: './restaurants-page.component.html',
  styleUrl: './restaurants-page.component.css',
})
export class RestaurantsPageComponent {
  #restaurantsService = new RestaurantsService();

  restaurantsResource = rxResource({
    loader: () => this.#restaurantsService.getRestaurants()
  });

  weekDay: number = new Date().getDay();

  search = signal('');
  onlyOpen = signal(false);

  filteredRestaurants = computed(() => {
    const searchLower = this.search().toLowerCase();
    const filtered = this.restaurantsResource.value()?.filter(
      (r) =>
        r.name.toLowerCase().includes(searchLower) ||
        r.description.toLowerCase().includes(searchLower)
    ) ?? [];

    return this.onlyOpen()
      ? filtered.filter((r) => r.daysOpen.includes(this.weekDay.toString()))
      : filtered;
  });

  addRestaurant(restaurant: Restaurant) {
    this.restaurantsResource.update((restaurants) => restaurants?.concat(restaurant));
  }

  deleteRestaurant(restaurant: Restaurant) {
    this.restaurantsResource.update((restaurants) =>
      restaurants?.filter((r) => r !== restaurant)
    );
  }
}
