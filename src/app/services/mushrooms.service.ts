import { Injectable } from "@angular/core";
import { map, Observable, of, tap } from "rxjs";
import { Mushroom, Shroomdle } from "../models/mushroom.model";
import { HttpClient } from "@angular/common/http";

@Injectable({ providedIn: 'root' })
export class MushroomsService {

    private _shroomdle?: Shroomdle;
    private _mushrooms?: Mushroom[];

    constructor(private _http: HttpClient) {}

    getMushrooms(): Observable<Mushroom[]> {
        if (this._mushrooms) {
            return of(this._mushrooms);
        }

        return this._http.get<Mushroom[]>(`/assets/mushrooms/mushrooms.json`)
            .pipe(
                map((res) => {
                    return [...res].sort((a, b) => a.name.localeCompare(b.name));
                }),
                tap((mushrooms) => {
                    this._mushrooms = mushrooms;
                })
            );
    }

    get shroomdle() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const defaultShroomdle: Shroomdle = {
            date: today.toISOString(),
            solved: false,
            attempts: [],
            words: [],
            wonWithList: false
        };

        if (!this._shroomdle) {
            this._shroomdle = JSON.parse(localStorage.getItem('shroomdle') || JSON.stringify(defaultShroomdle));
            this.saveShroomdle();
        }

        const shroomdleDate = new Date(this._shroomdle!.date);

        if (shroomdleDate.getTime() !== today.getTime()) {
            this._shroomdle = defaultShroomdle;
            this.saveShroomdle();
        }

        return this._shroomdle!;
    }

    makeAttempt(mushroom: Mushroom) {
        const index = this.shroomdle.attempts.length;
        this._shroomdle?.attempts.push({ index, mushroom });
        this.saveShroomdle();
    }

    makeWordAttempt(attempt: string) {
        const index = this.shroomdle.words.length;
        this.shroomdle.words.push({ index, attempt });
        this.saveShroomdle();
    }

    saveShroomdle() {
        localStorage.setItem('shroomdle', JSON.stringify(this._shroomdle));
    }

}