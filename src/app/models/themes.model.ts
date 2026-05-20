export enum Themes {
    LIGHT = 'light',
    DARK = 'dark',
    CUSTOM = 'custom'
};

export interface Theme {
    primary: string;
    secondary: string;
    accent: string;
    accentLight: string;
    light: string;
    dark: string;
    background: string;
}