import { Component, computed, effect, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SplashScreen } from '@capacitor/splash-screen';
import { IonApp, IonAvatar, IonContent, IonIcon, IonImg, IonItem, IonLabel, IonList, IonMenu, IonMenuToggle, IonRouterLink, IonRouterOutlet, IonSplitPane, Platform } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, arrowUndoCircle, camera, chatboxEllipses, checkmarkCircle, close, documentText, exit, eye, home, images, informationCircle, logIn, menu, trash, pencil, calendar, people, location, document, card, navigate, medkitOutline, person} from 'ionicons/icons';
import { User } from './auth/interfaces/user';
import { AuthService } from './auth/services/auth.service';
import { NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [RouterLink, RouterLinkActive, IonRouterLink, IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet, IonAvatar, IonImg],
})
export class AppComponent {
  user = signal<User | null>(null);

  #authService = inject(AuthService);
  #platform = inject(Platform);
  #nav = inject(NavController);
  #toast = inject(ToastController);

  /*public appPages = [
    { title: 'Citas', url: '/appointments', icon: 'home' },
    { title: 'Fisioterapeutas', url: '/physios', icon: 'information-circle' },
    { title: 'Pacientes', url: '/patients', icon: 'people' },
  ];*/

  menuPages = computed(() => {
    const u = this.user();
    const basePages = [
      { title: 'Citas', url: '/appointments', icon: 'calendar' },
      { title: 'Fisioterapeutas', url: '/physios', icon: 'medkit-outline' },
      { title: 'Pacientes', url: '/patients', icon: 'people' },
    ];

    if (!u) return basePages;

    if (u.rol === 'patient') {
      return [
        { title: 'Mi Perfil', url: `/patients/profile/${u.patient?._id}`, icon: 'person' },
        ...basePages,
      ];
    } else if (u.rol === 'physio') {
      return [
        { title: 'Mi Perfil', url: `/physios/profile/${u.physio?._id}`, icon: 'person' },
        ...basePages,
      ];
    }
    return basePages;
  });

  constructor() {
    addIcons({ exit, home, logIn, documentText, checkmarkCircle, images, camera, arrowUndoCircle, menu, add, close, eye, trash, informationCircle, chatboxEllipses, pencil, calendar, people, location, document, card, navigate, medkitOutline, person });

    effect(() => {
      if (this.#authService.logged()) {
        this.#authService.getProfile().subscribe((user) => (this.user.set(user)));
      } else {
        this.user.set(null);
      }
    });

    this.initializeApp();
  }

  async initializeApp() {
    if (this.#platform.is('capacitor')) { // o mobile?
      await this.#platform.ready();
      SplashScreen.hide();
    }
  }

  async logout() {
    await this.#authService.logout();
    this.#nav.navigateRoot(['/auth/login']);
  }

  get name(): string {
    const u = this.user();
    if (!u) return '';
    if (u.rol === 'patient') return u.patient?.name ?? u.login;
    if (u.rol === 'physio') return u.physio?.name ?? u.login;
    return 'Administrator';
  }

  get email(): string {
    const u = this.user();
    if (!u) return '';
    if (u.rol === 'patient') return u.patient?.email ?? u.login;
    if (u.rol === 'physio') return u.physio?.email ?? u.login;
    return u.login;
  }
}