import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';

@Component({
  selector: 'menu',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  title = 'FoodScore';
  #authService = inject(AuthService);
  #router = inject(Router);

  isLogged = this.#authService.getLogged();

  logout() {
    this.#authService.logout();
    this.#router.navigate(['/auth/login']);
  }
}