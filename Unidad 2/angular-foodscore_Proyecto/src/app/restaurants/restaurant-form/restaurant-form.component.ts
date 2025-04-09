import { Component, DestroyRef, effect, inject, input, signal} from '@angular/core';
import { RestaurantInsert } from '../interfaces/restaurant';
import { EncodeBase64Directive } from '../../shared/directives/encode-base64.directive';
import { RestaurantsService } from '../services/restaurants.service';
import { rxResource, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { CanComponentDeactivate } from '../../shared/guards/leave-page.guard';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidationClassesDirective } from '../../shared/directives/validation-classes.directive';
import { oneCheckedValidator } from '../../shared/validators/one-checked.validator';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { catchError, EMPTY, tap } from 'rxjs';
import { OlMapDirective } from '../../shared/ol-maps/ol-map.directive';
import { OlMarkerDirective } from '../../shared/ol-maps/ol-marker.directive';
import { GaAutocompleteDirective } from '../../shared/ol-maps/ga-autocomplete.directive';
import { SearchResult } from '../../shared/ol-maps/search-result';
import { ConfirmModalComponent } from '../../shared/modals/confirm-modal/confirm-modal.component';

@Component({
  selector: 'restaurant-form',
  imports: [ReactiveFormsModule, EncodeBase64Directive, ValidationClassesDirective, OlMapDirective, OlMarkerDirective, GaAutocompleteDirective],
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
    phone: ['', [Validators.required, Validators.pattern("^([+0]?[0-9]{2} ?)?[0-9]{9}$")]],
    address: ['', [Validators.required]],
    lat: [0, [Validators.required]],
    lng: [0, [Validators.required]]
  });

  imageBase64 = '';

  #restaurantsService = inject(RestaurantsService);
  #destroyRef = inject(DestroyRef);
  #router = inject(Router);
  
  readonly days = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
  daysOpen: boolean[] = new Array(7).fill(true);

  saved = false;
  #modalService = inject(NgbModal);
  coordinates = signal<[number, number]>([-0.5, 38.5]);
  #title = inject(Title);
  id = input<number>();
  insertar = signal(false);

  restaurantResource = rxResource({
    request: () => this.id(),
    loader: ({request: id}) => this.#restaurantsService.getRestaurant(id).pipe(
      tap((r) => {
        this.coordinates.set([r.lng, r.lat]);
        this.#title.setTitle(r.name + ' | Angular Foodscore');
      }),
      catchError(() => {
        this.#router.navigate(['/restaurants']);
        return EMPTY;
      })
    )
  });

  constructor() {
    effect(() => {
      if (this.restaurantResource.value()) {
        this.restaurantForm.controls.name.setValue(
          this.restaurantResource.value()!.name
        );
        this.restaurantForm.controls.description.setValue(
          this.restaurantResource.value()!.description
        );
        this.restaurantForm.controls.cuisine.setValue(
          this.restaurantResource.value()!.cuisine
        );
        this.imageBase64 = this.restaurantResource.value()!.image;
        this.restaurantForm.controls.phone.setValue(
          this.restaurantResource.value()!.phone.toString()
        );
        this.restaurantForm.controls.address.setValue(
          this.restaurantResource.value()!.address
        );
        this.restaurantForm.controls.lat.setValue(
          this.restaurantResource.value()!.lat
        );
        this.restaurantForm.controls.lng.setValue(
          this.restaurantResource.value()!.lng
        );
        this.restaurantForm.controls.daysOpen.setValue(
          new Array(7)
            .fill(false)
            .map((_, i) =>
              this.restaurantResource.value()!.daysOpen.includes(String(i))
            )
        );
        this.changePlace({
          address: this.restaurantResource.value()!.address,
          coordinates: [
            this.restaurantResource.value()!.lng,
            this.restaurantResource.value()!.lat,
          ],
        });
        this.insertar.set(false);
      } else {
        this.insertar.set(true);
      }
    });
  }

  addRestaurant() {
    const newRestaurant: RestaurantInsert = {
      ...this.restaurantForm.getRawValue(),
      image: this.imageBase64,
      daysOpen: this.days
        .map((d, i) => String(i))
        .filter((i) => this.restaurantForm.value.daysOpen?.[+i]),
      phone: this.restaurantForm.controls.phone.value.toString(),
    };

    if (this.restaurantResource.value()) {
      this.#restaurantsService
        .putRestaurant(newRestaurant, this.restaurantResource.value()!.id)
        .pipe(takeUntilDestroyed(this.#destroyRef))
        .subscribe({
          next: () => {
            this.saved = true;
            this.#router.navigate([
              '/restaurants',
              this.restaurantResource.value()!.id,
            ]);
          },
          error: (err) => {
            console.error(err);
          },
        });
    } else {
      this.#restaurantsService
        .addRestaurant(newRestaurant)
        .pipe(takeUntilDestroyed(this.#destroyRef))
        .subscribe({
          next: (restaurant) => {
            this.saved = true;
            this.#router.navigate(['/restaurants', restaurant.id]);
          },
          error: (err) => console.log('Error: ' + err)
        });
    }
  }

  changePlace(result: SearchResult) {
    this.coordinates.set(result.coordinates);
    this.restaurantForm.controls.lng.setValue(result.coordinates[0]);
    this.restaurantForm.controls.lat.setValue(result.coordinates[1]);
    this.restaurantForm.controls.address.setValue(result.address);
  }

  canDeactivate() {
    return (
      this.saved || this.restaurantForm.pristine ||
      this.confirmModal('¿Quieres abandonar la página?', 'Los cambios se perderán...')
    );
  }

  confirmModal(title: string, body: string) {
    const modalRef = this.#modalService.open(ConfirmModalComponent);
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.body = body;
    return modalRef.result.catch(() => false);
  }
}
