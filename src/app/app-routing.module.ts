import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { MushroomsComponent } from './pages/mushrooms/mushrooms.component';

export enum Paths {
  LOGIN = 'login',
  REGISTER = 'register',
  SETTINGS = 'settings',
  HOME = '',
  MUSHROOM = 'm'
}

const routes: Routes = [
  { path: Paths.SETTINGS, component: SettingsComponent },
  { path: Paths.HOME, pathMatch: 'full', component: MushroomsComponent },
  { path: Paths.MUSHROOM, children: [
    { path: '**', component: MushroomsComponent }
  ]},
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
