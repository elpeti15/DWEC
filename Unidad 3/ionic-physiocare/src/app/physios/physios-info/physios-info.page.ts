import { Component, inject, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonButtons, IonBackButton, IonTitle, NavController, IonCol, IonGrid, IonRow, IonList, IonHeader, IonToolbar, IonContent, IonCard, IonCardContent, IonCardTitle, IonCardSubtitle, IonButton, IonIcon, IonLabel, IonItem } from '@ionic/angular/standalone';
import { PhysiosService } from '../services/physios.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-physios-info',
  templateUrl: './physios-info.page.html',
  styleUrls: ['./physios-info.page.scss'],
  standalone: true,
  imports: [CommonModule, IonCol, IonGrid, IonRow, IonButtons, IonBackButton, IonTitle, IonHeader, IonList, IonToolbar, IonContent, IonCard, IonCardContent, IonCardTitle, IonCardSubtitle, IonButton, IonIcon, IonLabel, IonItem, FormsModule]
})
export class PhysiosInfoPage {
  #physiosService = inject(PhysiosService);
  #alertCtrl = inject(AlertController);
  #navController = inject(NavController);
  #authService = inject(AuthService);

  id = input.required();
  physioResource = rxResource({
    request: () => this.id(),
    loader: ({ request: id }) => this.#physiosService.getPhysioById(id as string)
  });
  physio = computed(() => this.physioResource.value());

  get isAdmin() {
    return this.#authService.rol() === 'admin';
  }

  get isPatient() {
    return this.#authService.rol() === 'patient';
  }

  get isOwner() {
    return this.physio()?._id === this.#authService.id();
  }

  async delete() {
    const alert = await this.#alertCtrl.create({
      header: 'Eliminar fisio',
      message: '¿Estás seguro de que quieres eliminar este fisioterapeuta?',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.#physiosService
              .deletePhysio(this.physio()!._id!)
              .subscribe(() => this.#navController.navigateBack(['/physios']));
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
        },
      ],
    });
    alert.present();
  }

  bookAppointment() {
    this.#navController.navigateForward([`/appointments/add/${this.physio()?._id}`]);
  }

  selectPhoto() {
    throw new Error('Method not implemented.');
  }

  takePhoto() {
    throw new Error('Method not implemented.');
  }
}