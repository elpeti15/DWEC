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
  AlertController,
  NavController,
  IonButton,
  ActionSheetButton,
  IonImg,
  IonThumbnail,
  IonSearchbar
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
    IonButton,
    IonImg,
    IonThumbnail,
    IonSearchbar
  ],
})
export class HomePage {
  physios = signal<Physio[]>([]);
  #physiosService = inject(PhysiosService);
  #authService = inject(AuthService);
  #navController = inject(NavController);
  #actionSheetCtrl =inject(ActionSheetController);
  #alertCtrl = inject(AlertController);

  searchTerm = '';
  filteredPhysios = signal<Physio[]>([]);

  // Para usar en la plantilla
  readonly isAdmin = computed(() => this.#authService.rol() === 'admin');
  readonly isPatient = computed(() => this.#authService.rol() === 'patient');

  ionViewWillEnter() {
    this.reloadPhysios();
  }

  reloadPhysios(refresher?: IonRefresher) {
    this.#physiosService.getPhysios().subscribe({
      next: (physios) => {
        this.physios.set(physios);
        this.filterPhysiosByNameOrSurname();
        refresher?.complete();
      },
      error: (err) => {
        console.error('Error loading physios:', err);
        refresher?.complete();
      }
    });
  }

  async showOptions(physio: Physio) {
    const buttons: ActionSheetButton[] = [
      {
        text: 'Ver Perfil',
        icon: 'eye',
        handler: () => {
          this.#navController.navigateForward([`/physios/profile/${physio._id}`]); 
        }
      }
    ];

    if (this.isPatient()) {
      buttons.unshift({
        text: 'Pedir cita',
        icon: 'calendar',
        handler: () => {
          // Lógica para pedir cita (redirigimos a la página de solicitud de cita) 
          this.#navController.navigateForward([`/appointments/add/${physio._id}`]);
        }
      });
    }

    if (this.isAdmin()) {
    buttons.push({
      text: 'Eliminar fisio',
      icon: 'trash',
      role: 'destructive',
      handler: async () => {
        const alert = await this.#alertCtrl.create({
          header: 'Eliminar Fisio',
          message: '¿Estás seguro de que quieres eliminar este fisioterapeuta?',
          buttons: [
            {
              text: 'Ok',
              handler: () => {
                this.#physiosService.deletePhysio(physio._id!).subscribe(() => {
                  this.physios.update(arr => arr.filter(p => p._id !== physio._id));
                  this.filterPhysiosByNameOrSurname();
                });
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

  filterPhysiosByNameOrSurname() {
    const physiosArr = this.physios();
    //console.log('physios signal value:', physiosArr, Array.isArray(physiosArr));
    if (this.searchTerm.trim() === '') {
      this.filteredPhysios.set(physiosArr ?? []);
    } else {
      this.searchTerm = this.searchTerm.trim().toLowerCase();
      this.filteredPhysios.set((physiosArr ?? []).filter(physio =>
        physio.name.toLowerCase().includes(this.searchTerm) ||
        (physio.surname?.toLowerCase().includes(this.searchTerm) ?? false)
      ));
    }
  }
}
