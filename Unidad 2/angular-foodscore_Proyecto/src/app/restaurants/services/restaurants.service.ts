import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CommentsResponse, RestaurantsResponse, SingleCommentResponse, SingleRestaurantResponse } from '../interfaces/responses';
import { Comment } from '../interfaces/comment';
import { map, Observable } from 'rxjs';
import { Restaurant, RestaurantInsert } from '../interfaces/restaurant';

@Injectable({
  providedIn: 'root'
})
export class RestaurantsService {

  #urlRestaurants = 'restaurants';
  #http = inject(HttpClient);
  
  getRestaurants(
    search = '',
    page = 1,
    open = 0,
    creator?: string
  ): Observable<RestaurantsResponse> {
    let urlParams;
    if (creator) {
      urlParams = new URLSearchParams({
        search: search,
        page: page.toString(),
        open: open.toString(),
        creator: creator,
      });
    } else {
      urlParams = new URLSearchParams({
        search: search,
        page: page.toString(),
        open: open.toString(),
      });
    }
    console.log(search + ' ' + page + ' ' + open + ' ' + creator);
    return this.#http
      .get<RestaurantsResponse>(`${this.#urlRestaurants}?${urlParams}`)
      .pipe(map((r) => r));
  }

  getRestaurant(id: number): Observable<Restaurant>{
    return this.#http
      .get<SingleRestaurantResponse>(`${this.#urlRestaurants}/${id}`)
      .pipe(map(r => r.restaurant));
  }

  addRestaurant(restaurant: RestaurantInsert): Observable<Restaurant> {
    return this.#http
      .post<SingleRestaurantResponse>(this.#urlRestaurants, restaurant)
      .pipe(map(r => r.restaurant));
  }

  putRestaurant(restaurant: RestaurantInsert, id: number): Observable<Restaurant> {
    return this.#http
      .put<Restaurant>(`${this.#urlRestaurants}/${id}`, restaurant) //quizás hay que arreglarlo
  }

  deleteRestaurant(id: number): Observable<void> {
    return this.#http
      .delete<void>(`${this.#urlRestaurants}/${id}`);
  }

  getCommentById(id: number): Observable<CommentsResponse> {
    return this.#http.get<CommentsResponse>(
      `${this.#urlRestaurants}/${id}/comments`
    );
  }

  postComment(comment: Comment, id: number): Observable<Comment> {
    return this.#http
      .post<SingleCommentResponse>(
        `${this.#urlRestaurants}/${id}/comments`,
        comment
      )
      .pipe(map((res) => res.comment));
  }
}