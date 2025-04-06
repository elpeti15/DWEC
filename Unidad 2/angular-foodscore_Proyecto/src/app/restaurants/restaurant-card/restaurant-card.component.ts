import { Component, DestroyRef, inject, input, output } from '@angular/core';
import { Restaurant } from '../interfaces/restaurant';
import { RestaurantsService } from '../services/restaurants.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faTrash, faPen } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from '../../shared/modals/confirm-modal/confirm-modal.component';
import { StarRatingComponent } from '../../shared/star-rating/star-rating.component';

@Component({
  selector: 'restaurant-card',
  imports: [RouterLink, FaIconComponent, StarRatingComponent],
  templateUrl: './restaurant-card.component.html',
  styleUrl: './restaurant-card.component.css'
})
export class RestaurantCardComponent {
  #restaurantsService = inject(RestaurantsService);
  #destroyRef = inject(DestroyRef);
  #router = inject(Router);

  weekDay: number = new Date().getDay();
  readonly days = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];

  restaurant = input.required<Restaurant>();
  deleted = output<void>();
  creator = input<string>();

  icons = { faTrash, faPen};
  #modalService = inject(NgbModal);

  getOpenDayNames(daysOpen: string[]) {
    return daysOpen.map((d) => this.days[+d]).join(', ');
  }

  deleteRestaurant() {
    this.#restaurantsService
      .deleteRestaurant(this.restaurant().id!)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => {
        this.deleted.emit();
        this.#router.navigate(['/restaurants']);
      });
  }

  edit() {
    this.#router.navigate(['/restaurants', 'edit', this.restaurant().id]);
  }

  deleteModal() {
    const modalRef = this.#modalService.open(ConfirmModalComponent);
    modalRef.componentInstance.title = 'Borrar restaurante';
    modalRef.componentInstance.body = '¿Estás seguro de borrar este restaurante?';
    modalRef.result.then((result) => {
      if (result)
        this.deleteRestaurant();
    })
  }
}
