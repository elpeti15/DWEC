import { Component, computed, inject, input, numberAttribute, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { rxResource } from '@angular/core/rxjs-interop';

import { FormsModule } from '@angular/forms';
import { IonBackButton, IonButtons, IonHeader, IonIcon, IonLabel, IonTabBar, IonTabButton, IonTabs, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { PatientsService } from '../services/patients.service';

@Component({
  selector: 'app-patient-detail',
  templateUrl: './patient-detail.page.html',
  styleUrls: ['./patient-detail.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel]
})
export class PatientDetailPage {
  #patientsService = inject(PatientsService);

  id = input.required();
  recordResource = rxResource({
    request: () => this.id(),
    loader: ({request: id}) => this.#patientsService.getRecordProfile(id as string)
  });
  record = computed(() => this.recordResource.value());
}
