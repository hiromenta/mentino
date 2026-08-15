import { Component, OnInit } from "@angular/core";
import { ControlType, MyForm } from "../../models/form.model";
import { LanguageCode } from "../../models/language.model";
import { Theme, Themes } from "../../models/themes.model";
import { TranslateService } from "../../services/translate.service";
import { of, switchMap } from "rxjs";
import { ThemesService } from "../../services/themes.service";
import { UtilsService } from "../../services/utils.service";
import { LoaderService } from "../../services/loader.service";
import { FormComponent } from "../../shared/form/form.component";

@Component({
    selector: 'my-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
    standalone: true,
    imports: [
        FormComponent
    ]
})
export class SettingsComponent implements OnInit {

    form: MyForm = {
        controls: [
            { type: ControlType.TITLE, selector: 'settings.language.title' },
            {
                selector: 'language',
                type: ControlType.RADIO,
                required: true,
                options: [
                    { value: LanguageCode.ENGLISH, label: 'settings.language.languages.english' },
                    { value: LanguageCode.ITALIAN, label: 'settings.language.languages.italian' }
                ],
                defaultValue: localStorage.getItem('language') || LanguageCode.ENGLISH
            },
            { type: ControlType.SPACER, selector: this._utilsService.getRandomSelector() },
            { type: ControlType.TITLE, selector: 'settings.options.title' },
            {
                selector: 'fullscreen',
                type: ControlType.CHECKBOX,
                required: true,
                options: [
                    { value: LanguageCode.ENGLISH, label: 'settings.options.fullscreen' }
                ],
                defaultValue: JSON.parse(localStorage.getItem('fullscreen') || 'false')
            },
            { type: ControlType.SPACER, selector: this._utilsService.getRandomSelector() },
            { type: ControlType.TITLE, selector: 'settings.theme.title' },
            {
                selector: 'theme',
                type: ControlType.RADIO,
                required: true,
                options: [
                    { value: Themes.LIGHT, label: 'settings.theme.themes.light' },
                    { value: Themes.DARK, label: 'settings.theme.themes.dark' },
                    { value: Themes.CUSTOM, label: 'settings.theme.themes.custom' }
                ],
                defaultValue: localStorage.getItem('theme') || Themes.DARK
            },
            { type: ControlType.COLOR, selector: 'primary', label: 'settings.theme.colors.primary', defaultValue: this._themesService.getCustomProperty('primary') },
            { type: ControlType.COLOR, selector: 'secondary', label: 'settings.theme.colors.secondary', defaultValue: this._themesService.getCustomProperty('secondary') },
            { type: ControlType.COLOR, selector: 'accent', label: 'settings.theme.colors.accent', defaultValue: this._themesService.getCustomProperty('accent') },
            { type: ControlType.COLOR, selector: 'accentActive', label: 'settings.theme.colors.accentActive', defaultValue: this._themesService.getCustomProperty('accentActive') },
            { type: ControlType.COLOR, selector: 'background', label: 'settings.theme.colors.background', defaultValue: this._themesService.getCustomProperty('background') },
            { type: ControlType.COLOR, selector: 'text', label: 'settings.theme.colors.text', defaultValue: this._themesService.getCustomProperty('text') },
            { type: ControlType.TEXT, selector: 'backgroundImage', placeholder: 'settings.theme.colors.backgroundImage', defaultValue: this._themesService.getCustomProperty('backgroundImage') }
        ]
    }

    canChangeForm = false;

    constructor(private _loaderService: LoaderService, private _translateService: TranslateService, private _themesService: ThemesService, private _utilsService: UtilsService) {}

    ngOnInit(): void {
        this._loaderService.show();

        setTimeout(() => {
            this.canChangeForm = true;
            this._loaderService.hide();
        }, 500);
    }

    formChanged(ev: MyForm) {
        if (!this.canChangeForm) {
            return;
        }

        switch (ev.lastControlChanged) {
            case 'language':
                this.changeLanguage();
                break;
            case 'fullscreen':
                this.changeFullscreen();
                break;
            case 'theme':
                this.changeTheme();
                break;
            case 'primary':
            case 'secondary':
            case 'accent':
            case 'accentActive':
            case 'background':
            case 'backgroundImage':
                this.setCustomTheme();
                break;
        }
    }

    changeLanguage() {
        const language = this.form.value?.['language'];

        this._translateService.getCurrentLanguage()
            .pipe(
                switchMap((currentLanguage) => {
                    if (currentLanguage.code !== language) {
                        return this._translateService.setLanguage(language);
                    }

                    return of(null);
                })
            )
            .subscribe((data) => {
                if (data) {
                    location.reload();
                }
            });
    }

    changeFullscreen() {
        this._utilsService.setFullscreen(this.form.value?.['fullscreen'])
    }

    changeTheme() {
        const theme = this.form.value?.['theme'];
        this._themesService.changeTheme(theme).subscribe();
    }

    setCustomTheme() {
        this._themesService.setCustomProperty(this.form.lastControlChanged! as keyof Theme, this.form.value?.[this.form.lastControlChanged!]);
        this._themesService.changeTheme(Themes.CUSTOM).subscribe();
    }

}