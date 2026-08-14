import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
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
        const number = Math.round(Math.random() * 10000);
        return 's' + number.toString();
    }

    seededRandomWithString(seed: string, min?: number, max?: number, round?: boolean): number {
        let _min = min;
        let _max = max;

        if (!_min && !max) {
            _min = 0;
            _max = 1;
        }

        if (_min && !_max) {
            _max = _min + 1;
        }

        if (!_min && _max) {
            _min = _max - 1;
        }

        if (_min! > _max!) {
            throw new Error('[max] must be greater than [min]');
        }

        let hash = 0;

        for (let i = 0; i < seed.length; i++) {
            hash = (hash << 5) - hash + seed.charCodeAt(i);
            hash |= 0;
        }

        const normalized = (hash >>> 0) / 4294967296;

        if (round) {
            return Math.floor(normalized * (_max! - _min! + 1)) + _min!;
        }
        
        return normalized * (_max! - _min! + 1) + _min!;
    }

    seededRandom(seed: number, min?: number, max?: number, round?: boolean): number {
        let _min = min;
        let _max = max;

        if (!_min && !max) {
            _min = 0;
            _max = 1;
        }

        if (_min && !_max) {
            _max = _min + 1;
        }

        if (!_min && _max) {
            _min = _max - 1;
        }

        if (_min! > _max!) {
            throw new Error('[max] must be greater than [min]');
        }

        let x = seed >>> 0;

        x = Math.imul(x ^ (x >>> 16), 0x45d9f3b);
        x = Math.imul(x ^ (x >>> 16), 0x45d9f3b);
        x = x ^ (x >>> 16);

        const normalized = (x >>> 0) / 4294967296;

        if (round) {
            return Math.floor(normalized * (_max! - _min! + 1)) + _min!;
        }
        
        return normalized * (_max! - _min! + 1) + _min!;
    }

}