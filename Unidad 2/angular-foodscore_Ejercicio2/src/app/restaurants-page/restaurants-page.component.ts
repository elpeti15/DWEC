import { Component, computed, signal } from '@angular/core';
import { Restaurant } from '../interfaces/restaurant';
import { FormsModule } from '@angular/forms';
import { RestaurantCardComponent } from '../restaurant-card/restaurant-card.component';
import { RestaurantFormComponent } from '../restaurant-form/restaurant-form.component';

@Component({
  selector: 'restaurants-page',
  imports: [FormsModule, RestaurantCardComponent, RestaurantFormComponent],
  templateUrl: './restaurants-page.component.html',
  styleUrl: './restaurants-page.component.css'
})
export class RestaurantsPageComponent {

    restaurants = signal<Restaurant[]>([]);

    search = signal('');
    showOpen = signal(false);

    weekDay: number = new Date().getDay();
    readonly days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    restaurantsFiltered = computed(() => this.restaurants().filter((r: Restaurant) =>
      (r.name.toLowerCase().includes(this.search().toLowerCase()) ||
      r.description.toLowerCase().includes(this.search().toLowerCase()))
      && (this.showOpen() ? r.daysOpen.includes(this.days[this.weekDay]) : true)
    ));

    addRestaurant(restaurant: Restaurant) {
      this.restaurants.update(restaurants => restaurants.concat(restaurant));
    }

    deleteRestaurant(restaurant: Restaurant){
      this.restaurants.update(restaurants => restaurants.filter(r => r !== restaurant));
    }

    toggleShowOpen(){
      this.showOpen.update((showOpen) => !showOpen);
    }
}
