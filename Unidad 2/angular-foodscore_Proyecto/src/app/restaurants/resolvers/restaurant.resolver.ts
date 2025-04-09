import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { catchError, EMPTY } from 'rxjs';
import { Restaurant } from '../interfaces/restaurant';
import { RestaurantsService } from '../services/restaurants.service';

export const restaurantResolver: ResolveFn<Restaurant> = (route) => {
  const restaurantsService = inject(RestaurantsService);
  const router = inject(Router);
  return restaurantsService.getRestaurant(+route.params['id']).pipe(
    catchError(() => {
      router.navigate(['/restaurants']);
      return EMPTY;
    })
  );
};