import { Component, computed, effect, signal } from '@angular/core';
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

    restaurantsFiltered = computed(() => this.restaurants().filter((r) =>
      r.name.toLowerCase().includes(this.search().toLowerCase()) ||
      r.description.toLowerCase().includes(this.search().toLowerCase())
    ));

    constructor(){
      effect(() => 
        !this.showOpen()
      );
    }

    addRestaurant(restaurant: Restaurant) {
      this.restaurants.update(restaurants => restaurants.concat(restaurant));
    }

    deleteRestaurant(restaurant: Restaurant){
      this.restaurants.update(restaurants => restaurants.filter(r => r !== restaurant));
    }
}