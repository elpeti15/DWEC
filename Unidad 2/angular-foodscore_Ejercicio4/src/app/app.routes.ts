import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RestaurantsPageComponent } from './restaurants/restaurants-page/restaurants-page.component';
import { RestaurantFormComponent } from './restaurants/restaurant-form/restaurant-form.component';
import { RestaurantDetailsComponent } from './restaurants/restaurant-details/restaurant-details.component';

export const routes: Routes = [
    { path: 'auth/login', component: LoginComponent},
    { path: 'restaurants',
        children: [
            { path: '', component: RestaurantsPageComponent, title: 'Restaurants | Angular Foodscore'},
            { path: 'add', component: RestaurantFormComponent},
            { path: ':id', component: RestaurantDetailsComponent}
        ]
    },
    { path: '', redirectTo: '/auth/login', pathMatch: 'full'}
];
