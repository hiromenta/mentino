export interface Mushroom {
    name: string;
    capColors: string | string[];
    fleshColors: string | string[];
    hymeniumStructure: string;
    cap: string | string[];
    hymenium: string | string[];
    stipe: string | string[];
    spores: string | string[];
    near: string | string[];
    flesh: string | string[];
    safety: Safety;
    wikipedia: string;
    cookingTime?: number;
    extra?: string;
}

export type Safety = 'E' | 'EB' | 'I' | 'P';