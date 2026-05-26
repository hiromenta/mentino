type stringish = string | string[];

export interface Mushroom {
    name: string;
    capColors: stringish;
    capMargin: stringish;
    stipeColors: stringish;
    hymeniumStructure: string;
    hymeniumColors: stringish;
    cap: stringish;
    hymenium: stringish;
    stipe: stringish;
    spores: stringish;
    near: stringish;
    flesh: stringish;
    smell: stringish;
    taste: stringish;
    safety: Safety;
    extra?: string;
    cookingTime?: number;
    info?: string;
    warnMessage?: string;
    peculiarity?: stringish;
    wikipedia: string;
}

export type Safety = 'E' | 'EB' | 'I' | 'P';