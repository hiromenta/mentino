import { Injectable } from "@angular/core";
import { Observable, of, tap } from "rxjs";
import { Mushroom } from "../models/mushroom.model";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class MushroomsService {

    private _mushrooms?: Mushroom[];

    constructor(private _http: HttpClient) {}

    getMushrooms(): Observable<Mushroom[]> {
        if (this._mushrooms) {
            return of(this._mushrooms);
        }

        return this._http.get<Mushroom[]>(`/assets/mushrooms/mushrooms.json`).pipe(tap((res) => {
            this._mushrooms = res;
        }));
    }

}