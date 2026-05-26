import { Component, OnInit } from "@angular/core";
import { MushroomsService } from "../../services/mushrooms.service";
import { Mushroom } from "../../models/mushroom.model";
import { ControlType, MyForm } from "../../models/form.model";
import { UtilsService } from "../../services/utils.service";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: 'my-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    standalone: false
})
export class HomeComponent implements OnInit {

    mushrooms: Mushroom[] = [];
    mushroom?: Mushroom;

    form: MyForm = { controls: [] };

    details: (keyof Mushroom)[] = [
        'capColors',
        'capMargin',
        'stipeColors',
        'hymeniumStructure',
        'hymeniumColors',
        'cap',
        'hymenium',
        'stipe',
        'spores',
        'near',
        'flesh',
        'smell',
        'taste'
    ];
    allDetails: (keyof Mushroom)[] = [
        ...this.details,
        'safety'
    ];

    constructor(private _route: ActivatedRoute, private _mushroomsService: MushroomsService, private _utilsService: UtilsService) {}

    ngOnInit(): void {
        this._buildControls();

        this._mushroomsService.getMushrooms().subscribe((mushrooms) => {
            this.mushrooms = mushrooms;
            this._buildFilters();

            // const queryMushroom = this._route.snapshot.queryParams['m'].toLowerCase();
            const queryMushroom = this._route.snapshot.url?.[0]?.path?.toLowerCase();

            if (queryMushroom) {
                this.mushroom = this.mushrooms.find(m => m.name.replace(' ', '').toLowerCase() === queryMushroom);
            }
        });
    }

    private _buildControls() {
        for (const detail of this.allDetails) {
            this.form.controls.push(
                { type: ControlType.TITLE, selector: `home.filters.${detail}.title` },
                {
                    selector: detail,
                    type: ControlType.RADIO,
                    canClear: true,
                    options: []
                },
                { type: ControlType.SPACER, selector: this._utilsService.getRandomSelector() }
            );
        }
    }

    getSanifiedValue(value?: string | string[] | number) {
        if (!value) {
            return [];
        }

        if (['string', 'number'].includes(typeof value)) {
            return [value.toString()];
        }

        return value as string[];
    }

    getMushrooms() {
        if (!this.mushrooms.length || !this.form?.value) {
            return [];
        }

        return this.mushrooms.filter(m => {
            for (const detail of this.allDetails) {
                const value = this.form.value?.[detail];

                if (value) {
                    const array = this._buildFiltersArray(value);

                    if (array?.length) {
                        if (!this._hasProperty(m[detail]!, array)) {
                            return false;
                        }
                    }
                }
            }

            return true;
        });
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

    private _hasProperty(value: string | string[] | number, property: string | string[]) {
        if (['string', 'number'].includes(typeof value)) {
            if (typeof property === 'string') {
                return property === value.toString();
            }

            return property?.includes(value.toString());
        }

        if (typeof property === 'string') {
            return value.toString()?.includes(property);
        }

        return property?.some((f: string) => value.toString().includes(f));
    }

    getImgName(name: string) {
        const mushroomName = name.replaceAll(' ', '');
        const folderName = name.split(' ')[0];
        return `${folderName}/${mushroomName}/${mushroomName}`;
    }

    private _buildFilters() {
        for (const control of this.form.controls) {
            control!.options = [...new Set(this.mushrooms.map(m => m[control.selector as keyof Mushroom]).flat())]?.filter(el => !!el)?.map(el => ({ value: `${control.selector}_${el}`, label: `home.filters.${control.selector}.${el}` }));
        }
    }

}