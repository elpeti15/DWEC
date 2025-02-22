import { Component, DestroyRef, inject, ViewChild } from '@angular/core';
import { Restaurant } from '../../interfaces/restaurant';
import { FormsModule, NgForm } from '@angular/forms';
import { EncodeBase64Directive } from '../../shared/directives/encode-base64.directive';
import { RestaurantsService } from '../services/restaurants.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { CanComponentDeactivate } from '../../shared/guards/leave-page.guard';
import { ValidationClassesDirective } from '../../shared/directives/validation-classes.directive';
import { OneCheckedDirective } from '../../shared/directives/one-checked.directive';

@Component({
  selector: 'restaurant-form',
  imports: [FormsModule, EncodeBase64Directive, ValidationClassesDirective, OneCheckedDirective],
  templateUrl: './restaurant-form.component.html',
  styleUrl: './restaurant-form.component.css'
})
export class RestaurantFormComponent implements CanComponentDeactivate{ //implements CanComponentDeactivate

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
  @ViewChild('addForm') addForm!: NgForm;

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

  canDeactivate() {
    return ( 
      this.saved ||
      this.addForm.pristine ||
      confirm('¿Quieres abandonar la página?. Los cambios se perderán...')
    );
  }
}
