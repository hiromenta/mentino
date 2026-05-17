export interface Mushroom {
    name: string;
    capColors: string | string[];
    fleshColors: string | string[];
    hymeniumStructure: string;
    cap: string | string[];
    hymenium: string | string[];
    stipe: string | string[];
    spores: string | string[];
    trees: string | string[];
    flesh: string | string[];
    safety: Safety;
    wikipedia: string;
    cookingTime?: number;
}

export type Safety = 'E' | 'EB' | 'I' | 'P';