import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, NavController, IonCol, IonGrid, IonRow, IonList ,IonHeader, IonToolbar, IonContent, IonCard, IonCardContent, IonCardTitle, IonCardSubtitle, IonButton, IonIcon, IonLabel, IonItem, IonAvatar } from '@ionic/angular/standalone';
import { PatientDetailPage } from 'src/app/patients/patient-detail/patient-detail.page';
import { PatientsService } from 'src/app/patients/services/patients.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-patient-info',
  templateUrl: './patient-info.page.html',
  styleUrls: ['./patient-info.page.scss'],
  standalone: true,
  imports: [CommonModule, IonCol, IonGrid, IonRow, IonHeader, IonList, IonToolbar, IonContent, IonCard, IonCardContent, IonCardTitle, IonCardSubtitle, IonButton, IonIcon, IonLabel, IonItem],
})
export class PatientInfoPage {
  record = inject(PatientDetailPage).record;
  patientResource = inject(PatientDetailPage).recordResource;

  #alertCtrl = inject(AlertController);
  #patientsService = inject(PatientsService);
  #nav = inject(NavController);
  #authService = inject(AuthService);

  //Para usar en plantilla
  get isAdmin() {
    return this.#authService.rol() === 'admin';
  }

  get isOwner() {
    return this.record()?.patient._id === this.#authService.id();
  }

  async delete() {
    const alert = await this.#alertCtrl.create({
      header: 'Borrar Paciente',
      message: '¿Estás seguro de que quieres borrar este paciente?',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.#patientsService
              .deletePatient(this.record()!.patient._id!)
              .subscribe(() => this.#nav.navigateBack(['/patients']));
          },
        },
        {
          text: 'Cancelar',
          role: 'cancel',
        },
      ],
    });
    alert.present();
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

    const patient = this.record()?.patient;
    if (patient && photo.dataUrl) {
      this.#patientsService.updateAvatar(patient._id!, photo.dataUrl).subscribe(() => {
        this.patientResource.reload();
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

    const patient = this.record()?.patient;
    if (patient && photo.dataUrl){
      this.#patientsService.updateAvatar(patient._id!, photo.dataUrl).subscribe(() => {
        this.patientResource.reload();
      });
    }
  }
}