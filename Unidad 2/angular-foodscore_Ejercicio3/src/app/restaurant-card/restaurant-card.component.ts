import { Component, input, output } from '@angular/core';
import { Restaurant } from '../interfaces/restaurant';

@Component({
  selector: 'restaurant-card',
  imports: [],
  templateUrl: './restaurant-card.component.html',
  styleUrl: './restaurant-card.component.css'
})
export class RestaurantCardComponent {
  weekDay: number = new Date().getDay();
  readonly days = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];

  restaurant = input.required<Restaurant>();
  deleted = output<void>();

  getOpenDayNames(daysOpen: string[]) {
    return daysOpen.map((d) => this.days[+d]).join(', ');
  }

  deleteRestaurant() {
    this.deleted.emit();
  }
}
