import { ChangeDetectorRef, Component, effect, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ModalController,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonItem,
  IonLabel,
  IonTextarea
} from '@ionic/angular/standalone';
import { Appointment } from 'src/app/appointments/interfaces/appointment';

@Component({
  selector: 'app-edit-appointment',
  templateUrl: './modal-content.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    IonItem,
    IonLabel,
    IonTextarea
  ],
})
export class ModalContentComponent {
  appointment!: Appointment;

  diagnosis = '';
  treatment = '';
  observations = '';

  #modal = inject(ModalController);
  #cdr = inject(ChangeDetectorRef);

  ionViewWillEnter() {
    const a = this.appointment;
    if (a) {
      this.diagnosis = a.diagnosis || '';
      this.treatment = a.treatment || '';
      this.observations = a.observations || '';
      this.#cdr.detectChanges(); // Para forzar la detección de cambios
    }
  }

  save() {
    this.#modal.dismiss({
      diagnosis: this.diagnosis,
      treatment: this.treatment,
      observations: this.observations
    });
  }

  close() {
    this.#modal.dismiss();
  }
}