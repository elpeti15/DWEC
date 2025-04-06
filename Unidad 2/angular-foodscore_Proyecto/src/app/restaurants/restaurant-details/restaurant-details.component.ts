import { Component, DestroyRef, inject, input, numberAttribute, signal } from '@angular/core';
import { RestaurantCardComponent } from "../restaurant-card/restaurant-card.component";
import { RestaurantsService } from '../services/restaurants.service';
import { Title } from '@angular/platform-browser';
import { rxResource, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { catchError, EMPTY, tap } from 'rxjs';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Comment } from '../interfaces/comment';
import { ConfirmModalComponent } from '../../shared/modals/confirm-modal/confirm-modal.component';
import { OlMapDirective } from '../../shared/ol-maps/ol-map.directive';
import { OlMarkerDirective } from '../../shared/ol-maps/ol-marker.directive';
import { StarRatingComponent } from '../../shared/star-rating/star-rating.component';
import { ValidationClassesDirective } from '../../shared/directives/validation-classes.directive';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'restaurant-details',
  imports: [RestaurantCardComponent, OlMapDirective, OlMarkerDirective, RouterLink, StarRatingComponent, ReactiveFormsModule, ValidationClassesDirective, DatePipe],
  templateUrl: './restaurant-details.component.html',
  styleUrl: './restaurant-details.component.css'
})
export class RestaurantDetailsComponent {

  id = input.required({ transform: numberAttribute})
  #restaurantService = inject(RestaurantsService);
  #title = inject(Title);
  #router = inject(Router);

  coordinates = signal<[number, number]>([-0.5, 38.5]);
  #fb = inject(FormBuilder);
  #destroyRef = inject(DestroyRef);
  #modalService = inject(NgbModal);
  message = 'No hay comentarios';
  commented = signal(false);

  restaurantResource = rxResource({
    request: () => this.id(),
    loader: ({ request: id}) =>
      this.#restaurantService.getRestaurant(id).pipe(
        tap((r) => {
          this.#title.setTitle(r.name + ' | FoodScore');
          this.coordinates.set([r.lng, r.lat]);
        }),
        catchError(() => {
          this.#router.navigate(['/restaurants']);
          return EMPTY
        })
      ),
  });

  commentsResource = rxResource({
    request: () => this.id(),
    loader: ({ request: id}) =>
      this.#restaurantService.getCommentById(id).pipe(
        tap((r) => {console.log(r.comments);}),
        catchError(() => {
          this.message = 'Error cogiendo los comentarios';
          return EMPTY;
        })
      )
  })

  commentForm = this.#fb.group({
    text: ['', [Validators.required, Validators.minLength(3)]],
    stars: [1, [Validators.required]]
  });

  addComment() {
    const newComment: Comment = {
      stars: this.commentForm.controls.stars.value!,
      text: this.commentForm.controls.text.value!
    };

    this.#restaurantService
      .postComment(newComment, this.id())
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: () => {
          this.commentForm.reset();
          this.commentsResource.reload();
          this.commented.set(true);
        },
        error: () => {
          const modalRef = this.#modalService.open(ConfirmModalComponent);
          modalRef.componentInstance.title = 'Error';
          modalRef.componentInstance.body = 'Error al publicar el comentario'
        }
      });
  }

  changeRating(rating: number) {
    this.commentForm.controls.stars.setValue(rating);
    console.log(this.commentForm.controls.stars.value);
  }
}