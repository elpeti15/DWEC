import { Component, DestroyRef, inject, input, signal } from '@angular/core';
import { rxResource, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router, RouterModule } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { catchError, EMPTY, tap } from 'rxjs';
import { EncodeBase64Directive } from '../../shared/directives/encode-base64.directive';
import { ValidationClassesDirective } from '../../shared/directives/validation-classes.directive';
import { AlertModalComponent } from '../../shared/modals/alert-modal/alert-modal.component';
import { OlMapDirective } from '../../shared/ol-maps/ol-map.directive';
import { OlMarkerDirective } from '../../shared/ol-maps/ol-marker.directive';
import { sameValue } from '../../shared/validators/same-value.validator';
import {
  UserPasswordEdit,
  UserPhotoEdit,
  UserProfileEdit,
} from '../interfaces/user';
import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'profile-page',
  imports: [
    OlMapDirective,
    OlMarkerDirective,
    FaIconComponent,
    RouterModule,
    EncodeBase64Directive,
    ValidationClassesDirective,
    ReactiveFormsModule,
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css',
})
export class ProfilePageComponent {
  id = input<number | null>(null);
  #profileService = inject(ProfileService);
  #title = inject(Title);
  #router = inject(Router);
  #destroyRef = inject(DestroyRef);
  #modalService = inject(NgbModal);
  #fb = inject(FormBuilder);
  editarProfile = signal(false);
  editPassword = signal(false);
  coordinates = signal<[number, number]>([-0.5, 38.5]);
  icon = { faEdit };
  imagen = signal('');
  imagenBase64 = '';
  profileResource = rxResource({
    loader: () =>
      this.#profileService.getProfile(this.id()!).pipe(
        tap((r) => {
          this.#title.setTitle(r.name + ' | Angular Foodscore');
          console.log(r);
          this.coordinates.set([r.lng, r.lat]);
          this.imagen.set(r.avatar);
        }),
        catchError(() => {
          this.#router.navigate(['/restaurants']);
          return EMPTY;
        })
      ),
  });

  profileForm = this.#fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
  });

  passwordControl = this.#fb.control('', {
    validators: [Validators.required],
  });

  passwordForm = this.#fb.group({
    password: this.passwordControl,
    passwordRep: ['', [sameValue(this.passwordControl)]],
  });

  constructor() {
    this.passwordControl.valueChanges
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => {
        this.passwordForm.controls.passwordRep.updateValueAndValidity();
      });
  }
  putImage(image: string) {
    const newAvatar: UserPhotoEdit = {
      avatar: image,
    };
    console.log(newAvatar);
    this.#profileService
      .putPhotoEdit(newAvatar)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: () => {
          this.alertModal(
            'Modificación de avatar',
            'El avatar se ha modificado correctamente'
          );
          this.imagen.set(image);
        },
        error: (e) => {
          this.alertModal(
            'Modificación de avatar',
            'Error en la modificación del avatar: ' + e
          );
        },
      });
  }

  putPassword() {
    const newPassword: UserPasswordEdit = {
      password: this.passwordForm.controls.password.value ?? '',
    };
    this.#profileService
      .putPasswordEdit(newPassword)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: () => {
          this.alertModal(
            'Modificación de contraseña',
            'La contraseña se ha modificado correctamente'
          );
          this.passwordForm.reset();
          this.changeVisibilityPassword();
        },
        error: (e) => {
          this.alertModal(
            'Modificación de contraseña',
            'Error en la modificación de contraseña: ' + e
          );
        },
      });
  }

  putProfile() {
    const newProfile: UserProfileEdit = {
      name: this.profileForm.controls.name.value ?? '',
      email: this.profileForm.controls.email.value ?? '',
    };
    this.#profileService
      .putProfile(newProfile)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: () => {
          this.alertModal(
            'Modificación del perfil',
            'El perfil se ha modificado correctamente'
          );
          this.profileForm.reset();
          this.changeVisitbilityProfile();
          this.profileResource.reload();
        },
        error: (e) => {
          this.alertModal(
            'Modificación del perfil',
            'Error en la modificación del perfil: ' + e
          );
        },
      });
  }

  alertModal(title: string, body: string) {
    const modalRef = this.#modalService.open(AlertModalComponent);
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.body = body;
  }

  changeVisitbilityProfile() {
    this.editarProfile.update((e) => !e);
    console.log(this.editarProfile());
    this.profileForm.reset();
  }
  changeVisibilityPassword() {
    this.editPassword.update((e) => !e);
    console.log(this.editPassword());
    this.passwordForm.reset();
  }
}