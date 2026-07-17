import { Component, OnInit } from '@angular/core';
import { ThemesService } from './services/themes.service';
import { TranslateService } from './services/translate.service';
import { Themes } from './models/themes.model';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { LoaderService } from './services/loader.service';
import { Paths } from './app-routing.module';
import { UtilsService } from './services/utils.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: false
})
export class AppComponent implements OnInit {

  title = 'mentino';

  loadedServices: any[] = [];

  tabs = [
    { label: 'mushrooms.tabs.home', urls: [Paths.HOME, Paths.MUSHROOM] },
    { label: 'mushrooms.tabs.settings', urls: [Paths.SETTINGS] }
  ];

  constructor(
    private _router: Router,
    private _loaderService: LoaderService,
    private _themesService: ThemesService,
    private _translateService: TranslateService,
    private _utilsService: UtilsService
  ) {}

  ngOnInit(): void {
    const servicesToLoad = [
      this._themesService.changeTheme(this._themesService.getCurrentTheme().name as Themes),
      this._translateService.setLanguage(this._translateService.getCurrentLanguageCode())
    ];

    this.loadedServices = new Array(servicesToLoad.length).fill(false);

    this._loaderService.show();

    for (let i = 0; i < servicesToLoad.length; i++) {
      const service = servicesToLoad[i];

      (service as Observable<any>).subscribe(() => {
        this.loadedServices[i] = true;
        this._checkAllServicesLoaded();
      });
    }
  }

  isFullscreen() {
    return this._utilsService.fullscreen;
  }

  getActive() {
    return this.tabs.findIndex(tt => tt.urls.includes(location.pathname.split('/')[1] as Paths));
  }

  onTabClick(urls: string[]) {
    this._router.navigate([urls[0]]);
  }

  getTranslation(message: string) {
    return this._translateService.translate(message);
  }

  private _checkAllServicesLoaded() {
    for (const loaded of this.loadedServices) {
      if (!loaded) {
        return false;
      }
    }

    const path = [...new Set(location.pathname.split('/'))];

    this._loaderService.hide();

    this._router.navigate(['randomBullshitGo'], { skipLocationChange: true, queryParamsHandling: 'preserve' }).then(() => {
      this._router.navigate([...path], { queryParamsHandling: 'preserve' });
    });

    return true;
  }

}
