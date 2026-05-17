export enum ControlType {
    TITLE,
    SPACER,
    TEXT,
    PASSWORD,
    EMAIL,
    RADIO,
    CHECKBOX
}

export interface Control {
    selector: string;
    type: ControlType;
    placeholder?: string;
    value?: any;
    state?: ValidityState;
    valid?: boolean;
    required?: boolean;
    options?: { value: string | number, label: string }[];
    defaultValue?: any;
    canClear?: boolean;
}

export interface MyForm {
    controls: Control[];
    valid?: boolean;
    value?: { [key: string]: any };
}