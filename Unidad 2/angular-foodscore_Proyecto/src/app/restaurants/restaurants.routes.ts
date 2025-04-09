import { Routes } from "@angular/router";
import { leavePageGuard } from "../shared/guards/leave-page.guard";
import { numericIdGuard } from "../shared/guards/numeric-id.guard";
import { restaurantResolver } from "./resolvers/restaurant.resolver";

export const restaurantsRoutes: Routes = [
    { 
        path: '',
        loadComponent: () =>
            import('./restaurants-page/restaurants-page.component').then(
                m => m.RestaurantsPageComponent
            ),
        title: 'Restaurantes | Angular Foodscore'
    },
    { 
        path: 'add',
        canDeactivate: [leavePageGuard],
        loadComponent: () =>
            import('./restaurant-form/restaurant-form.component').then(
                m => m.RestaurantFormComponent
            ),
        title: 'Añadir restaurante | Angular Foodscore'
    },
    { 
        path: ':id',
        loadComponent: () =>
            import('./restaurant-details/restaurant-details.component').then(
                m => m.RestaurantDetailsComponent
            ),
        resolve: { restaurant: restaurantResolver}, //Probar si funciona
        canActivate: [numericIdGuard]
    },
    {
        path: 'edit/:id',
        loadComponent: () => 
            import('./restaurant-form/restaurant-form.component').then(
                m => m.RestaurantFormComponent
            ),
        canActivate: [numericIdGuard],
        canDeactivate: [leavePageGuard],
        title: 'Editar restaurante | Angular Foodscore'
    }
];