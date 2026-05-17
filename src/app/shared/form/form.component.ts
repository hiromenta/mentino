import { AfterContentInit, AfterViewInit, Component, EventEmitter, Input, Output } from "@angular/core";
import { Control, ControlType, MyForm } from "../../models/form.model";

@Component({
    selector: 'my-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
    standalone: false
})
export class FormComponent implements AfterViewInit, AfterContentInit {

    @Input('form') form?: MyForm;

    @Output() formChanged: EventEmitter<MyForm> = new EventEmitter();

    radioValue: string = '';
    checkboxValues: string[] = [];

    constructor() {}

    ngAfterContentInit(): void {
        // this._updateValueAfterInit();
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this._updateValueAfterInit();
        }, 100);
    }

    private _updateValueAfterInit() {
        for (const control of (this.form?.controls || [])) {
            this.updateValue(control, document.querySelector('#' + control.selector) as HTMLInputElement);
        }
    }

    toggleRadio(value: string | number) {
        const parsedValue = value.toString();

        if (this.radioValue === parsedValue) {
            this.radioValue = '';
        } else {
            this.radioValue = parsedValue;
        }

        return this.radioValue;
    }

    toggleCheckbox(value: string | number) {
        const parsedValue = value.toString();

        if (this.checkboxValues.includes(parsedValue)) {
            const index = this.checkboxValues.indexOf(parsedValue);
            this.checkboxValues.splice(index, 1);
        } else {
            this.checkboxValues.push(parsedValue);
        }

        return this.checkboxValues.join(',');
    }

    checkboxSelected(value: string | number) {
        return this.checkboxValues.includes(value.toString());
    }

    getControlType() {
        return ControlType;
    }

    updateValue(control: Control, input: HTMLInputElement) {
        const selectedControl = this.form!.controls.find(c => c.selector === control.selector);

        selectedControl!.value = input?.value;
        selectedControl!.state = input?.validity;
        selectedControl!.valid = selectedControl!.state?.valid;

        this._updateFormValueAndValidity();
    }

    private _updateFormValueAndValidity() {
        const value: { [key: string]: any } = {};

        for (const control of (this.form?.controls || [])) {
            value[control.selector] = control.value;
        }

        this.form!.value = value;

        for (const control of (this.form?.controls || [])) {
            if (!control.valid) {
                this.form!.valid = false;
                return;
            }
        }

        this.form!.valid = true;

        this.formChanged.emit(this.form);
    }

}