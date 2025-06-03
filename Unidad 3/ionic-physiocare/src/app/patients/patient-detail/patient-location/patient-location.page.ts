import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent,IonFab, IonFabButton, IonIcon, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { OlMapDirective } from 'src/app/ol-maps/ol-map.directive';
import { OlMarkerDirective } from 'src/app/ol-maps/ol-marker.directive';
import { PatientDetailPage } from '../patient-detail.page';

@Component({
  selector: 'app-patient-location',
  templateUrl: './patient-location.page.html',
  styleUrls: ['./patient-location.page.scss'],
  standalone: true,
  imports: [IonContent, IonFab, IonFabButton, IonIcon, IonHeader, IonTitle, IonToolbar, OlMapDirective, OlMarkerDirective, CommonModule, FormsModule]
})
export class PatientLocationPage {
  record = inject(PatientDetailPage).record;

  // Devuelve las coordenadas del paciente o [0,0] si no existen
  coordinates(): [number, number] {
    const patient = this.record()?.patient;
    if (typeof patient?.lat === 'number' && typeof patient?.lng === 'number') {
      return [patient.lng, patient.lat];
    }
    return [0, 0];
  }

  openNavigation() {
    const patient = this.record()?.patient;
    if (patient?.lat && patient?.lng) {
      // Google Maps URL scheme (funciona en Android/iOS)
      const url = `https://www.google.com/maps/dir/?api=1&destination=${patient.lat},${patient.lng}`;
      window.open(url, '_system'); // _system abre la app nativa si está disponible (en Cordova/Capacitor)
    }
  }
}