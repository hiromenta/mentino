import { Injectable } from "@angular/core";
import { Theme, Themes } from "../models/themes.model";
import { ConfigService } from "./config.service";
import { map, Observable, of } from "rxjs";

@Injectable()
export class ThemesService {

    private _currentThemeName = this._getThemeFromLocalStorage();
    private _currentTheme?: Theme;

    defaults = {
        primary: '#6f766f',
        secondary: '#a7b4a8',
        accent: '#567656',
        accentLight: '#95b298',
        light: '#dbded9',
        dark: '#292929',
        background: ''
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
            accentLight: customTheme.accentLight || this.defaults.accentLight,
            light: customTheme.light || this.defaults.light,
            dark: customTheme.dark || this.defaults.dark,
            background: customTheme.background || this.defaults.background
        };

        for (const [key, value] of Object.entries(theme)) {
            document.documentElement.style.setProperty('--' + key, `${key === 'background' ? 'url("' + value + '")' : value}`);
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