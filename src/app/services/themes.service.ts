import { Injectable } from "@angular/core";
import { Theme, Themes } from "../models/themes.model";
import { ConfigService } from "./config.service";
import { map, Observable, of } from "rxjs";

@Injectable({ providedIn: 'root' })
export class ThemesService {

    private _currentThemeName = this._getThemeFromLocalStorage();
    private _currentTheme?: Theme;

    defaults: Theme = {
        primary: '#dde4e3',
        secondary: '#a54040',
        accent: '#bbddbe',
        accentActive: '#7da67d',
        background: '#b8c7b9',
        text: '#111',
        backgroundImage: ''
    };

    constructor(private _configService: ConfigService) {}

    getCurrentTheme(): { name?: string, theme?: Theme } {
        return { name: this._currentThemeName, theme: this._currentTheme };
    }

    getThemes(theme?: Themes): Observable<{ [key: string]: Theme } | Theme> {
        return this._configService.getThemesConfig().pipe(map((themes) => {
            if (theme) {
                return themes[theme];
            }

            return themes;
        }));
    }

    changeTheme(theme: Themes): Observable<Theme> {
        if (theme === Themes.CUSTOM) {
            return this._changeCustomTheme();
        }

        return this._changeTheme(theme);
    }

    private _changeTheme(theme: Themes): Observable<Theme> {
        return this._configService.getThemesConfig().pipe(map((themes) => {
            if (!themes[theme]) {
                theme = Themes.LIGHT;
            }

            for (const property of Object.entries(themes[theme])) {
                document.documentElement.style.setProperty('--' + property[0], property[1]);
            }

            localStorage.setItem('theme', theme);

            this._currentThemeName = theme;
            this._currentTheme = themes[theme];

            return this._currentTheme;
        }));
    }

    private _changeCustomTheme(): Observable<Theme> {
        const customTheme = JSON.parse(localStorage.getItem('customTheme') || '{}');

        const theme: Theme = {
            primary: customTheme.primary || this.defaults.primary,
            secondary: customTheme.secondary || this.defaults.secondary,
            accent: customTheme.accent || this.defaults.accent,
            accentActive: customTheme.accentActive || this.defaults.accentActive,
            background: customTheme.background || this.defaults.background,
            text: customTheme.text || this.defaults.text,
            backgroundImage: customTheme.backgroundImage || this.defaults.backgroundImage
        };

        for (const [key, value] of Object.entries(theme)) {
            document.documentElement.style.setProperty('--' + key, `${key === 'backgroundImage' ? 'url("' + value + '")' : value}`);
        }

        localStorage.setItem('theme', Themes.CUSTOM);

        this._currentThemeName = Themes.CUSTOM;
        this._currentTheme = theme;

        return of(this._currentTheme);
    }

    private _getThemeFromLocalStorage(): Themes {
        if (localStorage.getItem('theme')) {
            return (localStorage.getItem('theme')!) as Themes;
        }

        return Themes.LIGHT;
    }

    setCustomProperty(prop: keyof Theme, value: string) {
        const customTheme = JSON.parse(localStorage.getItem('customTheme') || '{}');
        customTheme[prop] = value;
        localStorage.setItem('customTheme', JSON.stringify(customTheme));
    }

    getCustomProperty(prop: keyof Theme) {
        const customTheme = JSON.parse(localStorage.getItem('customTheme') || '{}');
        return customTheme[prop] || this.defaults[prop];
    }

}