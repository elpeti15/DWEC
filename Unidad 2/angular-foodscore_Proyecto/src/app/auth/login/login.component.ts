import { Component, DestroyRef, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { from } from 'rxjs';
import { MyGeolocation } from '../../shared/ol-maps/my-geolocation';
import { Coordinates } from '../../shared/ol-maps/coordinates';
import { UserLogin, UserLoginGoogle, UserLoginFacebook } from '../../profile/interfaces/user';
import { AlertModalComponent } from '../../shared/modals/alert-modal/alert-modal.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { GoogleLoginDirective } from '../google-login/google-login.directive';
import { ValidationClassesDirective } from '../../shared/directives/validation-classes.directive';
import { FbLoginDirective } from '../facebook-login/fb-login.directive';

@Component({
  selector: 'login',
  imports: [RouterLink, ReactiveFormsModule, ValidationClassesDirective, FaIconComponent, GoogleLoginDirective, FbLoginDirective],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  #fb = inject(NonNullableFormBuilder);
  #authService = inject(AuthService);
  #destroyRef = inject(DestroyRef);
  #router = inject(Router);
  #modalService = inject(NgbModal);

  getCoordinates = toSignal(
    from(MyGeolocation.getLocation().then((c) => c))
  );

  loginForm = this.#fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    lat: [0, Validators.required],
    lng: [0, Validators.required],
  });

  constructor() {
    //Puede que haga falta afterrendereffect o afternextrender...
    const coords: Coordinates = {
      latitude: this.getCoordinates()?.latitude ?? 0,
      longitude: this.getCoordinates()?.longitude ?? 0
    };

    if (coords) {
      this.loginForm.controls.lat.setValue(coords.latitude);
      this.loginForm.controls.lng.setValue(coords.longitude);
    }
  }

  login() {
    const userLogin: UserLogin = {
      ...this.loginForm.getRawValue(),
      lat: this.loginForm.controls.lat.value,
      lng: this.loginForm.controls.lng.value
    };

    this.#authService
      .login(userLogin)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: () => {
          this.#router.navigate(['/restaurants']);
        },
        error: (err) => {
          this.alertModal(
            'Error',
            'Error al iniciar sesión: ' + err.statusText
          );
        },
      });
  }

  loggedGoogle(resp: google.accounts.id.CredentialResponse) {
    console.log(resp.credential);

    const userLoginGoogle: UserLoginGoogle = {
      token: resp.credential,
      lat: this.loginForm.controls.lat.value,
      lng: this.loginForm.controls.lng.value,
    };
    
    this.#authService
      .postLoginGoogle(userLoginGoogle)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: () => {
          this.#router.navigate(['/restaurants']);
        },
        error: (err) => {
          this.alertModal(
            'Error',
            'Error al iniciar sesión: ' + err.statusText
          );
        },
      });
  }

  fbIcon = faFacebook;

  loggedFacebook(resp: fb.StatusResponse) {
    console.log("Primer clg con res.authresponse.accesstoken: " + resp.authResponse.accessToken);
    const UserLoginFacebook: UserLoginFacebook = {
      token: resp.authResponse.accessToken!,
      lat: this.loginForm.controls.lat.value,
      lng: this.loginForm.controls.lng.value,
    };
    this.#authService
      .postLoginFacebook(UserLoginFacebook)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: () => {
          this.#router.navigate(['/restaurants']);
        },
        error: (err) => {
          this.alertModal(
            'Error',
            'Error al iniciar sesión en facebook: ' + err.statusText
          );
        },
      });
    console.log("Token: " + resp.authResponse.accessToken);
  }

  showError(error: string) {
    console.error(error);
    this.alertModal('Error', 'Error al iniciar sesión: ' + error);
  }

  alertModal(title: string, body: string) {
    const modalRef = this.#modalService.open(AlertModalComponent);
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.body = body;
  }
}
