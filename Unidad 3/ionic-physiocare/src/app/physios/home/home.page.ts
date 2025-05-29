import { Component, computed, effect, inject, signal } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonMenuButton,
  IonContent,
  IonRefresher,
  IonRefresherContent,
  IonList,
  IonItem,
  IonLabel,
  IonFab,
  IonFabButton,
  IonIcon,
  ActionSheetController,
  NavController,
  IonButton,
  ActionSheetButton
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { Physio } from '../interfaces/physio';
import { PhysiosService } from '../services/physios.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'physios-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonMenuButton,
    IonContent,
    IonRefresher,
    IonRefresherContent,
    IonList,
    IonItem,
    IonLabel,
    IonFab,
    IonFabButton,
    IonIcon,
    RouterLink,
    IonButton
  ],
})
export class HomePage {
  physios = signal<Physio[]>([]);
  #physiosService = inject(PhysiosService);
  #auth = inject(AuthService);
  #navController = inject(NavController);
  #actionSheetCtrl =inject(ActionSheetController);

  // Para usar en la plantilla
  readonly isAdmin = computed(() => this.#auth.rol() === 'admin');
  readonly isPatient = computed(() => this.#auth.rol() === 'patient');

  ionViewWillEnter() {
    this.reloadPhysios();
  }

  reloadPhysios(refresher?: IonRefresher) {
    this.#physiosService.getPhysios().subscribe((list) => {
      console.log('Fisios cargados:', list);
      this.physios.set(list);
      refresher?.complete();
    });
  }

  async showOptions(physio: Physio) {
    const buttons: ActionSheetButton[] = [
      {
        text: 'Ver perfil',
        icon: 'eye',
        handler: () => {
          this.#navController.navigateForward([`/physios/${physio._id}`]); // O ruta real cuando esté hecha //Esto falta por implementar
        }
      }
    ];

    if (this.isPatient()) {
      buttons.unshift({
        text: 'Pedir cita',
        icon: 'calendar',
        handler: () => {
          // Lógica para pedir cita (redirigimos a la página de solicitud de cita)  //Falta por implementar
          this.#navController.navigateForward([`/appointments/add/${physio._id}`]);
        }
      });
    }

    if (this.isAdmin()) {
      buttons.unshift({
        text: 'Eliminar',
        icon: 'trash',
        role: 'destructive',
        handler: () => {
          this.#physiosService.deletePhysio(physio._id!).subscribe(() => {
            this.physios.update(arr => arr.filter(p => p._id !== physio._id));
          });
        }
      });
    }

    buttons.push({
      text: 'Cancelar',
      icon: 'close',
      role: 'cancel'
    });

    const actSheet = await this.#actionSheetCtrl.create({
      header: `${physio.name} ${physio.surname}`,
      buttons
    });

    await actSheet.present();
  }
}
