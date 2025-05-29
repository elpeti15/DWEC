import { Component, computed, effect, inject, signal } from '@angular/core';
import {
  ModalController,
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonRouterLink,
  IonToggle,
} from '@ionic/angular/standalone';
import { Appointment } from '../interfaces/appointment';
import { AppointmentsService } from '../services/appointments.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ModalContentComponent } from 'src/app/modal/modal-content/modal-content.component';

@Component({
  selector: 'appointments-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [FormsModule, IonHeader, IonToolbar, IonTitle, IonButtons, IonMenuButton, IonContent, IonRefresher, IonRefresherContent, IonList, IonItem, IonLabel, IonButton, IonIcon, IonRouterLink, IonToggle, RouterLink, DatePipe],
})
export class HomePage {
  appointments = signal<Appointment[]>([]);

  showFuture = signal(true);
  #appointmentsService = inject(AppointmentsService);
  #auth = inject(AuthService);

  #modalCtrl = inject(ModalController);

  readonly filteredAppointments = computed(() => {
    const future = this.showFuture();
    const now = new Date().getTime();

    return this.appointments().filter((a) => {
      const appointmentTime = new Date(a.date).getTime();
      const isFuture = appointmentTime > now;
      return future ? isFuture : !isFuture;
    });
  });

  // Para usar en la plantilla
  readonly isPhysio = computed(() => this.#auth.rol() === 'physio');

  ionViewWillEnter() {
    this.reloadAppointments();
  }

  reloadAppointments(refresher?: IonRefresher) {
    this.#appointmentsService.getAppointments().subscribe((apps) => {
      //console.log('Citas obtenidas:', apps);
      this.appointments.set(this.#sorted(apps));
      refresher?.complete();
    });
  }

  #sorted(apps: Appointment[]): Appointment[] {
    return apps.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async editAppointment(a: Appointment) {
    const modal = await this.#modalCtrl.create({
      component: ModalContentComponent,
      componentProps: { appointment: a },
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data) {
      this.#appointmentsService.updateAppointmentDetails(
        a.patient!._id!,
        a._id!,
        data.diagnosis,
        data.treatment,
        data.observations
      ).subscribe(() => this.reloadAppointments());
    }
  }
}