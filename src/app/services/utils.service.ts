import { Injectable } from "@angular/core";

@Injectable()
export class UtilsService {

    private _fullscreen = JSON.parse(localStorage.getItem('fullscreen') || 'false');

    shownImageUrl?: string;

    constructor() {}

    get fullscreen() {
        return this._fullscreen;
    }

    setTitle(title: string) {
        document.title = this.toTitleCase(title);
    }

    resetTitle() {
        document.title = 'Mentino';
    }

    toTitleCase(string: string) {
        const array = string.split(' ');
        const titleCaseArray = [];

        for (let s of array) {
            titleCaseArray.push(s[0].toUpperCase() + s.slice(1));
        }

        return titleCaseArray.join(' ');
    }

    setFullscreen(fullscreen: boolean) {
        this._fullscreen = fullscreen;
        this._updateFullscreen();
    }

    toggleFullscreen() {
        this.setFullscreen(!this._fullscreen);
    }

    private _updateFullscreen() {
        localStorage.setItem('fullscreen', JSON.stringify(this._fullscreen));
    }

    getRandomSelector() {
        const number = Math.random() * 100;
        return 's' + number.toString().split('.')[1];
    }

}