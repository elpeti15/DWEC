import { Component, input, output } from '@angular/core';
import { Restaurant } from '../interfaces/restaurant';

@Component({
  selector: 'restaurant-card',
  imports: [],
  templateUrl: './restaurant-card.component.html',
  styleUrl: './restaurant-card.component.css'
})
export class RestaurantCardComponent {
  restaurant = input.required<Restaurant>();
  deleted = output<void>();

  readonly days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  weekDay: number = new Date().getDay();

  deleteRestaurant(){
    this.deleted.emit();
  }
}
