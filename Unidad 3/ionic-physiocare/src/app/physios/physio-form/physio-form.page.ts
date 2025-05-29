import { ChangeDetectorRef, Component, inject } from '@angular/core';
import {
  IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonList,
  IonItem, IonInput, IonLabel, IonButton, ToastController, NavController, IonIcon
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { Physio } from '../interfaces/physio';
import { PhysiosService } from '../services/physios.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'add-physio',
  templateUrl: './physio-form.page.html',
  styleUrls: ['./physio-form.page.scss'],
  standalone: true,
  imports: [FormsModule, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonList, IonItem, IonInput, IonButton, IonIcon]
})
export class PhysioFormPage {
  newPhysio: Physio = {
    name: '',
    surname: '',
    email: '',
    specialty: '',
    licenseNumber: ''
  };

  #physiosService = inject(PhysiosService);
  #toastCtrl = inject(ToastController);
  #nav = inject(NavController);

  addPhysio() {
    this.#physiosService.addPhysio(this.newPhysio).subscribe({
      next: async () => {
        (await this.#toastCtrl.create({
          message: 'Fisio añadido correctamente',
          color: 'success',
          duration: 2000,
        })).present();
        this.#nav.navigateRoot(['/physios']);
      },
      error: async () => {
        (await this.#toastCtrl.create({
          message: 'Error al añadir el fisio',
          color: 'danger',
          duration: 2000,
        })).present();
      }
    });
  }
}