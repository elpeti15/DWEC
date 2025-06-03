import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, ToastController, IonHeader, IonTitle, IonToolbar, IonCard, IonCardContent, IonCardTitle, IonCardHeader, IonCardSubtitle, IonTextarea, IonButton, IonNote, IonText } from '@ionic/angular/standalone';
import { PatientDetailPage } from '../patient-detail.page';
import { AuthService } from 'src/app/auth/services/auth.service';
import { PatientsService } from '../../services/patients.service';
import { toggle } from 'ionicons/icons';

@Component({
  selector: 'app-patient-record',
  templateUrl: './patient-record.page.html',
  styleUrls: ['./patient-record.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardContent, IonCardTitle, IonCardHeader, IonCardSubtitle, IonTextarea, IonButton, IonNote, CommonModule, FormsModule]
})
export class PatientRecordPage  {
  record = inject(PatientDetailPage).record;
  #authService = inject(AuthService);
  #patientsService = inject(PatientsService);
  #toastCtrl = inject(ToastController);

  medicalRecord = signal('');
  showInputs = signal(false);

  get canEdit() {
    const rol = this.#authService.rol();
    return rol === 'admin' || rol === 'physio';
  }

  get pastAppointments() {
    const today = new Date();
    return (this.record()?.appointments ?? [])
      .filter(a => new Date(a.date) < today)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  constructor() {
    if (this.record()) {
      this.medicalRecord.set(this.record()!.medicalRecord ?? '');
    }
  }

  toggleInputs() {
    this.showInputs.set(!this.showInputs());
    if (this.showInputs() && this.record()) {
      this.medicalRecord.set(this.record()!.medicalRecord ?? '');
    }
  }

  saveMedicalRecord() {
    const rec = this.record();
    if (!rec) return;
    this.#patientsService.updateMedicalRecord(rec._id!, this.medicalRecord()).subscribe({
      next: async pat => {
        (await this.#toastCtrl.create({
          position: 'bottom',
          duration: 3000,
          message: 'Expediente médico actualizado con éxito',
          color: 'success'
        })).present();
        this.toggleInputs();
        this.record()!.medicalRecord = this.medicalRecord();
      },
      error: async () => {
        (await this.#toastCtrl.create({
          position: 'bottom',
          duration: 3000,
          message: 'Error al actualizar el expediente médico',
          color: 'danger'
        })).present();
      }
    });
  }
}
