import { afterRenderEffect, Component, DestroyRef, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ValidationClassesDirective } from '../../shared/directives/validation-classes.directive';
import { CanComponentDeactivate } from '../../shared/guards/leave-page.guard';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MyGeolocation } from '../../shared/ol-maps/my-geolocation';
import { from } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { sameValue } from '../../shared/validators/same-value.validator';
import { Coordinates } from '../../shared/ol-maps/coordinates';
import { User } from '../../profile/interfaces/user';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertModalComponent } from '../../shared/modals/alert-modal/alert-modal.component';
import { ConfirmModalComponent } from '../../shared/modals/confirm-modal/confirm-modal.component';
import { EncodeBase64Directive } from '../../shared/directives/encode-base64.directive';

@Component({
  selector: 'register',
  imports: [RouterLink, ReactiveFormsModule, ValidationClassesDirective, EncodeBase64Directive],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements CanComponentDeactivate{

  #fb = inject(NonNullableFormBuilder);
  #authService = inject(AuthService);
  #destroyRef = inject(DestroyRef);
  #router = inject(Router);
  imageBase64 = '';
  saved = false;
  #modalService = inject(NgbModal);

  getCoordinates = toSignal(
    from(MyGeolocation.getLocation().then((c) => c))
  );

  emailControl = this.#fb.control('', {validators: [Validators.required, Validators.email]});

  registerForm = this.#fb.group({
    name: ['', Validators.required],
    email: this.emailControl,
    emailConfirm: ['', [sameValue(this.emailControl)]],
    password: ['', [Validators.required, Validators.minLength(4)]],
    lat: [0, Validators.required],
    lng: [0, Validators.required],
    avatar: ['', Validators.required]
  });

  constructor() {
    afterRenderEffect(async () => {
      const coords: Coordinates = {
        latitude: this.getCoordinates()?.latitude ?? 0,
        longitude: this.getCoordinates()?.longitude ?? 0
      };

      if (coords) {
        this.registerForm.controls.lat.setValue(coords.latitude);
        this.registerForm.controls.lng.setValue(coords.longitude);
      }
    });

    this.emailControl.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      this.registerForm.controls.emailConfirm.updateValueAndValidity();
    });
  }

  register() {
    const newUser: User = {
      ...this.registerForm.getRawValue(),
      avatar: this.imageBase64
    }

    this.#authService
      .register(newUser)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: () => {
          this.saved = true;
          this.#router.navigate(['/auth/login']);
        },
        error: (err) => {
          this.alertModal(
            'Error',
            'Error al registrar el usuario, por favor inténtelo de nuevo: ' +
              err.statusText
          );
        }
      });
  }

  canDeactivate() {
    return (
      this.saved || this.registerForm.pristine ||
      this.confirmModal('¿Quieres abandonar la página?', 'Los cambios se perderán...')
    );
  }

  alertModal(title: string, body: string) {
    const modalRef = this.#modalService.open(AlertModalComponent);
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.body = body;
  }

  confirmModal(title: string, body: string) {
    const modalRef = this.#modalService.open(ConfirmModalComponent);
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.body = body;
    return modalRef.result.catch(() => false);
  }
}