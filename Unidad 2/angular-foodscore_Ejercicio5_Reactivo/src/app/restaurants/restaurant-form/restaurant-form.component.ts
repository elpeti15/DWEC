import { Component, DestroyRef, inject} from '@angular/core';
import { Restaurant } from '../../interfaces/restaurant';
import { EncodeBase64Directive } from '../../shared/directives/encode-base64.directive';
import { RestaurantsService } from '../services/restaurants.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { CanComponentDeactivate } from '../../shared/guards/leave-page.guard';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidationClassesDirective } from '../../shared/directives/validation-classes.directive';
import { oneCheckedValidator } from '../../shared/validators/one-checked.validator';

@Component({
  selector: 'restaurant-form',
  imports: [ReactiveFormsModule, EncodeBase64Directive, ValidationClassesDirective],
  templateUrl: './restaurant-form.component.html',
  styleUrl: './restaurant-form.component.css'
})
export class RestaurantFormComponent implements CanComponentDeactivate{ 

  #fb = inject(NonNullableFormBuilder);

  restaurantForm = this.#fb.group({
    name: ['', [Validators.required, Validators.pattern("^[a-zA-Z][a-zA-Z ]*$")]],
    description: ['', Validators.required],
    cuisine: ['', Validators.required],
    image: ['', Validators.required],
    daysOpen: this.#fb.array(new Array(7).fill(true), {
      validators: [oneCheckedValidator]
    }),
    phone: ['', [Validators.required, Validators.pattern("^([+0]?[0-9]{2} ?)?[0-9]{9}$")]]
  });

  imageBase64 = '';

  #restaurantsService = inject(RestaurantsService);
  #destroyRef = inject(DestroyRef);
  #router = inject(Router);
  
  readonly days = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
  daysOpen: boolean[] = new Array(7).fill(true);

  saved = false;

  addRestaurant() {
    const newRestaurant: Restaurant = {
      ...this.restaurantForm.getRawValue(),
      image: this.imageBase64,
      daysOpen: this.days
        .map((d, i) => String(i))
        .filter((i) => this.restaurantForm.value.daysOpen?.[+i])
    };

    this.#restaurantsService
      .addRestaurant(newRestaurant)
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
      this.saved || this.restaurantForm.pristine ||
      confirm('¿Quieres abandonar la página?. Los cambios se perderán...')
    );
  }
}
