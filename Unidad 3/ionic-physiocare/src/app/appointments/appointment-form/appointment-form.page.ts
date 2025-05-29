import { ChangeDetectorRef, Component, inject, signal } from '@angular/core';
import {
  IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonList,
  IonItem, IonInput, IonLabel, IonButton, ToastController, NavController, IonIcon
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AppointmentsService } from '../services/appointments.service';
import { PhysiosService } from 'src/app/physios/services/physios.service';
import { Physio } from 'src/app/physios/interfaces/physio';

@Component({
  selector: 'appointment-form',
  templateUrl: './appointment-form.page.html',
  styleUrls: ['./appointment-form.page.scss'],
  standalone: true,
  imports: [
    FormsModule,
    IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle,
    IonContent, IonList, IonItem, IonInput, IonLabel, IonButton, IonIcon
  ]
})
export class AppointmentFormPage {
  date: string = '';
  physio = signal<Physio | null>(null);

  #appointmentsService = inject(AppointmentsService);
  #physiosService = inject(PhysiosService);
  #toastCtrl = inject(ToastController);
  #nav = inject(NavController);
  #route = inject(ActivatedRoute);

  async ionViewWillEnter() {
    const physioId = this.#route.snapshot.paramMap.get('physioId');
    console.log('Parámetro recibido:', physioId);
    if (!physioId) {
      (await this.#toastCtrl.create({
        message: 'No se ha especificado ningún fisio',
        color: 'danger',
        duration: 2000
      })).present();
      this.#nav.navigateRoot(['/physios']);
      return;
    }

    this.#physiosService.getPhysioById(physioId).subscribe({
      next: (p) => {
        console.log('Fisio recibido:', p);
        this.physio.set(p);
      },
      error: async () => {
        console.error('Error al cargar el fisio');
        (await this.#toastCtrl.create({
          message: 'Fisio no encontrado',
          color: 'danger',
          duration: 2000
        })).present();
        this.#nav.navigateRoot(['/physios']);
      }
    });
  }

  async addAppointment() {
    if (!this.physio || !this.date) return;

    const fecha = new Date(this.date);
    const ahora = new Date();

    if (fecha < ahora) {
      (await this.#toastCtrl.create({
        message: 'La fecha debe ser posterior a la actual',
        color: 'danger',
        duration: 2000
      })).present();
      return;
    }

    const physioId = this.physio()?._id!;
    const isoDate = fecha.toISOString();
    console.log('Enviando cita con:');
    console.log('Physio ID:', physioId);
    console.log('Fecha ISO:', isoDate);
    
    this.#appointmentsService.addAppointment(physioId, isoDate).subscribe({
      next: async (resp) => {
        console.log('Respuesta del servidor:', resp);
        (await this.#toastCtrl.create({
          message: 'Cita solicitada correctamente',
          color: 'success',
          duration: 2000
        })).present();
        this.#nav.navigateRoot(['/appointments']);
      },
      error: async (err) => {
        console.error('Error al solicitar cita:', err);
        (await this.#toastCtrl.create({
          message: 'Error al solicitar la cita',
          color: 'danger',
          duration: 2000
        })).present();
      }
    });
  }
}