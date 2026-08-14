export enum Themes {
    LIGHT = 'light',
    DARK = 'dark',
    CUSTOM = 'custom'
};

export interface Theme {
    primary: string;
    secondary: string;
    accent: string;
    accentActive: string;
    background: string;
    text: string;
    backgroundImage: string;
}