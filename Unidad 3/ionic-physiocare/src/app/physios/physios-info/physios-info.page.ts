import { Component, inject, input, computed, ChangeDetectorRef, numberAttribute } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonButtons, IonBackButton, IonTitle, NavController, IonCol, IonGrid, IonRow, IonList, IonHeader, IonToolbar, IonContent, IonCard, IonCardContent, IonCardTitle, IonCardSubtitle, IonButton, IonIcon, IonLabel, IonItem } from '@ionic/angular/standalone';
import { PhysiosService } from '../services/physios.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

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
  #changeDetector = inject(ChangeDetectorRef);

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

  async takePhoto() {;
    const photo = await Camera.getPhoto({
      source: CameraSource.Camera,
      quality: 90,
      height: 400,
      width: 400,
      // allowEditing: true,
      resultType: CameraResultType.DataUrl // Base64 (url encoded)
    });

    const physio = this.physio();
    if (physio && photo.dataUrl) {
      this.#physiosService.updateAvatar(physio._id!, photo.dataUrl).subscribe(() => {
        this.physioResource.reload();
      });
    }
  }

  async pickFromGallery() {
    const photo = await Camera.getPhoto({
      source: CameraSource.Photos,
      height: 400,
      width: 400,
      // allowEditing: true,
      resultType: CameraResultType.DataUrl // Base64 (url encoded)
    });

    const physio = this.physio();
    if (physio && photo.dataUrl){
      this.#physiosService.updateAvatar(physio._id!, photo.dataUrl).subscribe(() => {
        this.physioResource.reload();
      });
    }
  }
}