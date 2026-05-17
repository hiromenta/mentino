import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { SettingsComponent } from './pages/settings/settings.component';

export enum Paths {
  LOGIN = 'login',
  REGISTER = 'register',
  SETTINGS = 'settings',
  HOME = ''
}

const routes: Routes = [
  { path: Paths.SETTINGS, component: SettingsComponent },
  { path: '', pathMatch: 'full', component: HomeComponent },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
