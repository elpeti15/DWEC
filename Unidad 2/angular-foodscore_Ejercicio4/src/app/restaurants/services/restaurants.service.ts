import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RestaurantsResponse, SingleRestaurantResponse } from '../interfaces/responses';
import { map, Observable } from 'rxjs';
import { Restaurant } from '../interfaces/restaurant';

@Injectable({
  providedIn: 'root'
})
export class RestaurantsService {

  #urlRestaurants = 'restaurants';
  #http = inject(HttpClient);
  
  getRestaurants(): Observable<Restaurant[]> {
    return this.#http
      .get<RestaurantsResponse>(this.#urlRestaurants)
      .pipe(map(r => r.restaurants));
  }

  getRestaurant(id: number): Observable<Restaurant>{
    return this.#http
      .get<SingleRestaurantResponse>(`${this.#urlRestaurants}/${id}`)
      .pipe(map(r => r.restaurant));
  }

  addRestaurant(restaurant: Restaurant): Observable<Restaurant> {
    return this.#http
      .post<SingleRestaurantResponse>(this.#urlRestaurants, restaurant)
      .pipe(map(r => r.restaurant));
  }

  deleteRestaurant(id: number): Observable<void> {
    return this.#http
      .delete<void>(`${this.#urlRestaurants}/${id}`);
  }
}
