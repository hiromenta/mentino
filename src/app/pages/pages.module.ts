import { NgModule } from "@angular/core";
import { DirectivesModule } from "../directives/directives.module";
import { PipesModule } from "../pipes/pipes.module";
import { HomeComponent } from "./home/home.component";
import { NotFoundComponent } from "./not-found/not-found.component";
import { SharedModule } from "../shared/shared.module";
import { BrowserModule } from "@angular/platform-browser";
import { SettingsComponent } from "./settings/settings.component";
import { AppRoutingModule } from "../app-routing.module";

const COMPONENTS = [
    HomeComponent,
    NotFoundComponent,
    SettingsComponent
];

@NgModule({
    declarations: [...COMPONENTS],
    exports: [...COMPONENTS],
    imports: [DirectivesModule, PipesModule, SharedModule, BrowserModule, AppRoutingModule]
})
export class PagesModule {}