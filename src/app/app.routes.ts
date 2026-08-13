import { Routes } from '@angular/router';

export enum Paths {
  LOGIN = 'login',
  REGISTER = 'register',
  HOME = '',
  MUSHROOM = 'm',
  SETTINGS = 'settings'
}

export const routes: Routes = [
  { path: Paths.HOME, pathMatch: 'full', loadComponent: () => import('./pages/mushrooms/mushrooms.component').then(m => m.MushroomsComponent) },
  { path: Paths.MUSHROOM, children: [
    { path: '**', loadComponent: () => import('./pages/mushrooms/mushrooms.component').then(m => m.MushroomsComponent) }
  ]},
  { path: Paths.SETTINGS, loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent) },
  { path: '**', loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent) }
];