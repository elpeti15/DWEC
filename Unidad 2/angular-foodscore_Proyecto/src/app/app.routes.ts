import { Routes } from '@angular/router';

export const routes: Routes = [
    { 
        path: 'auth',
        loadChildren: () => import('./auth/auth.routes').then(m => m.authRoutes)
    },
    { 
        path: 'restaurants',
        loadChildren: () => import('./restaurants/restaurants.routes').then(m => m.restaurantsRoutes)
    },
    { path: '', redirectTo: '/auth/login', pathMatch: 'full'},
    { path: '**', redirectTo: '/auth/login'}
];
