import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastController, NavController, IonRouterLink, IonNote, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonList, IonItem, IonIcon, IonButton, IonImg, IonGrid, IonRow, IonCol, IonInput, IonLabel } from '@ionic/angular/standalone';
import { Patient } from '../interfaces/patient';
import { PatientsService } from '../services/patients.service';
import { RouterLink } from '@angular/router';
import { OlMapDirective } from 'src/app/ol-maps/ol-map.directive';
import { OlMarkerDirective } from 'src/app/ol-maps/ol-marker.directive';
import { SearchResult } from 'src/app/ol-maps/search-result';
import { GaAutocompleteDirective } from 'src/app/ol-maps/ga-autocomplete.directive';

@Component({
  selector: 'app-patients-form',
  templateUrl: './patients-form.page.html',
  styleUrls: ['./patients-form.page.scss'],
  standalone: true,
  imports: [FormsModule, GaAutocompleteDirective, OlMapDirective, OlMarkerDirective, RouterLink, IonRouterLink, IonHeader, IonNote, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonList, IonItem, IonIcon, IonButton, IonGrid, IonRow, IonCol, IonInput]
})
export class PatientsFormPage {

  newPatient: Patient = {
    name: '',
    surname: '',
    birthDate: '',
    address: '',
    email: '',
    insuranceNumber: ''
  }
  coordinates = signal<[number, number]>([0, 0]);
  address = signal<string>('');

  #patientsService = inject(PatientsService);
  #toastCtrl = inject(ToastController);
  #nav = inject(NavController);
  #changeDetector = inject(ChangeDetectorRef);

  addPatient() {
    const [lng, lat] = this.coordinates(); // Recuerda: [lng, lat]

    const patientToSend: Patient & { lat: number, lng: number } = {
      ...this.newPatient,
      lat,
      lng
    };
    this.#patientsService.addPatient(patientToSend).subscribe({
      next: async pat => {
        (await this.#toastCtrl.create({
          position: 'bottom',
          duration: 3000,
          message: 'Patient added succesfully',
          color: 'success'
        })).present();
        this.#nav.navigateRoot(['/patients']);
      },
      error: async error => (await this.#toastCtrl.create({
        position: 'bottom',
        duration: 3000,
        message: 'Error adding patient'
      })).present()
    });
  }

  changePlace(result: SearchResult) {
    this.coordinates.set(result.coordinates);
    this.address.set(result.address);
    this.newPatient.address = result.address;
    console.log('Dirección:', this.address());
    console.log('Coordenadas:', this.coordinates());
  }
}