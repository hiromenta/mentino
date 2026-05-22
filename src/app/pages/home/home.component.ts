import { Component, OnInit } from "@angular/core";
import { MushroomsService } from "../../services/mushrooms.service";
import { Mushroom } from "../../models/mushroom.model";
import { ControlType, MyForm } from "../../models/form.model";
import { UtilsService } from "../../services/utils.service";

@Component({
    selector: 'my-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    standalone: false
})
export class HomeComponent implements OnInit {

    mushrooms: Mushroom[] = [];
    mushroom?: Mushroom;

    form: MyForm = {
        controls: [
            { type: ControlType.TITLE, selector: 'home.filters.capColors.title' },
            {
                selector: 'capColors',
                type: ControlType.RADIO,
                options: []
            },
            { type: ControlType.SPACER, selector: this._utilsService.getRandomSelector() },
            { type: ControlType.TITLE, selector: 'home.filters.fleshColors.title' },
            {
                selector: 'fleshColors',
                type: ControlType.RADIO,
                options: []
            },
            { type: ControlType.SPACER, selector: this._utilsService.getRandomSelector() },
            { type: ControlType.TITLE, selector: 'home.filters.hymeniumStructure.title' },
            {
                selector: 'hymeniumStructure',
                type: ControlType.RADIO,
                canClear: true,
                options: []
            },
            { type: ControlType.SPACER, selector: this._utilsService.getRandomSelector() },
            { type: ControlType.TITLE, selector: 'home.filters.cap.title' },
            {
                selector: 'cap',
                type: ControlType.RADIO,
                options: []
            },
            { type: ControlType.SPACER, selector: this._utilsService.getRandomSelector() },
            { type: ControlType.TITLE, selector: 'home.filters.hymenium.title' },
            {
                selector: 'hymenium',
                type: ControlType.RADIO,
                canClear: true,
                options: []
            },
            { type: ControlType.SPACER, selector: this._utilsService.getRandomSelector() },
            { type: ControlType.TITLE, selector: 'home.filters.stipe.title' },
            {
                selector: 'stipe',
                type: ControlType.RADIO,
                options: []
            },
            { type: ControlType.SPACER, selector: this._utilsService.getRandomSelector() },
            { type: ControlType.TITLE, selector: 'home.filters.spores.title' },
            {
                selector: 'spores',
                type: ControlType.RADIO,
                options: []
            },
            { type: ControlType.SPACER, selector: this._utilsService.getRandomSelector() },
            { type: ControlType.TITLE, selector: 'home.filters.near.title' },
            {
                selector: 'near',
                type: ControlType.RADIO,
                options: []
            },
            { type: ControlType.SPACER, selector: this._utilsService.getRandomSelector() },
            { type: ControlType.TITLE, selector: 'home.filters.flesh.title' },
            {
                selector: 'flesh',
                type: ControlType.RADIO,
                canClear: true,
                options: []
            },
            { type: ControlType.SPACER, selector: this._utilsService.getRandomSelector() },
            { type: ControlType.TITLE, selector: 'home.filters.safety.title' },
            {
                selector: 'safety',
                type: ControlType.RADIO,
                options: [
                    { value: 'E', label: 'E' },
                    { value: 'EB', label: 'EB' },
                    { value: 'I', label: 'I' },
                    { value: 'P', label: 'P' }
                ]
            }
        ]
    };

    constructor(private _mushroomsService: MushroomsService, private _utilsService: UtilsService) {}

    ngOnInit(): void {
        this._mushroomsService.getMushrooms().subscribe((mushrooms) => {
            this.mushrooms = mushrooms;
            this._buildFilters();
        });
    }

    getMushrooms() {
        if (!this.mushrooms.length || !this.form?.value) {
            return [];
        }

        const { capColors, fleshColors, hymeniumStructure, cap, hymenium, stipe, spores, near, flesh, safety } = this.form.value;

        return this.mushrooms
            .filter(m => !this._buildFiltersArray(capColors)?.length || this._hasProperty(m.capColors, this._buildFiltersArray(capColors)))
            .filter(m => !this._buildFiltersArray(fleshColors)?.length || this._hasProperty(m.fleshColors, this._buildFiltersArray(fleshColors)))
            .filter(m => !this._buildFiltersArray(hymeniumStructure)?.length || this._hasProperty(m.hymeniumStructure, this._buildFiltersArray(hymeniumStructure)))
            .filter(m => !this._buildFiltersArray(cap)?.length || this._hasProperty(m.cap, this._buildFiltersArray(cap)))
            .filter(m => !this._buildFiltersArray(hymenium)?.length || this._hasProperty(m.hymenium, this._buildFiltersArray(hymenium)))
            .filter(m => !this._buildFiltersArray(stipe)?.length || this._hasProperty(m.stipe, this._buildFiltersArray(stipe)))
            .filter(m => !this._buildFiltersArray(spores)?.length || this._hasProperty(m.spores, this._buildFiltersArray(spores)))
            .filter(m => !this._buildFiltersArray(near)?.length || this._hasProperty(m.near, this._buildFiltersArray(near)))
            .filter(m => !this._buildFiltersArray(flesh)?.length || this._hasProperty(m.flesh, this._buildFiltersArray(flesh)))
            .filter(m => !this._buildFiltersArray(safety)?.length || this._hasProperty(m.safety, this._buildFiltersArray(safety)));
    }

    private _buildFiltersArray(arrayString: string) {
        const array = [];

        if (arrayString.includes(',')) {
            const splitArray = arrayString.split(',');
            array.push(...splitArray);
        } else {
            array.push(arrayString);
        }

        const parsed = [];

        for (const el of array) {
            if (el.includes('_')) {
                parsed.push(el.split('_')[1]);
            } else {
                parsed.push(el);
            }
        }

        return parsed.filter(p => !!p);
    }

    private _hasProperty(value: string | string[], property: string | string[]) {
        if (typeof value === 'string') {
            if (typeof property === 'string') {
                return property === value;
            }

            return property?.includes(value);
        }

        if (typeof property === 'string') {
            return value?.includes(property);
        }

        return property?.some((f: string) => value.includes(f));
    }

    getImgName(name: string) {
        return name.replaceAll(' ', '');
    }

    private _buildFilters() {
        for (const control of this.form.controls) {
            control!.options = [...new Set(this.mushrooms.map(m => m[control.selector as keyof Mushroom]).flat())].map(el => ({ value: `${control.selector}_${el}`, label: `home.filters.${control.selector}.${el}` }));
        }
    }

}