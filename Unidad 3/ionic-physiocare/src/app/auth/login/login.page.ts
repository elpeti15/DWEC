import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AlertController, IonButton, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonList, IonRow, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { AuthService } from '../services/auth.service';
import { NavController, Platform } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonInput, IonGrid, IonRow, IonCol, IonButton, IonIcon]
})
export class LoginPage {
  email = '';
  password = '';

  #authService = inject(AuthService);
  #alertCtrl = inject(AlertController);
  #navCtrl = inject(NavController);

  async login() {
    try {
      await this.#authService.login(this.email, this.password);

      const rol = (await Preferences.get({ key: 'fs-rol' })).value;

      switch (rol) {
        case 'admin':
          this.#navCtrl.navigateRoot(['/patients']);
          break;
        case 'physio':
        case 'patient':
          this.#navCtrl.navigateRoot(['/appointments']);
          break;
        default:
          throw new Error('Unknown role');
      }
    } catch {
      (await this.#alertCtrl.create({
        header: 'Login error',
        message: 'Incorrect email and/or password',
        buttons: ['Ok'],
      })).present();
    }
  }
}
