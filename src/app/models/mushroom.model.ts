export interface Mushroom {
    name: string;
    class: string;
    order: string;
    family: string;
    genus: string;
    species: string;
    capColors: string[];
    capMargin: string[];
    stipeColors: string[];
    hymeniumStructure: string;
    hymeniumColors: string[];
    cap: string[];
    hymenium: string[];
    stipe: string[];
    spores: string[];
    near: string[];
    flesh: string;
    smell: string[];
    taste: string[];
    safety: Safety;
    extra?: string;
    cookingTime?: number;
    info?: string;
    warnMessage?: string;
    peculiarity?: string;
    wikipedia: string;
}

export type Safety = 'E' | 'EB' | 'I' | 'P';

export interface Shroomdle {
    date: string;
    solved: boolean;
    attempts: { index: number; mushroom: Mushroom }[];
    words: { index: number; attempt: string }[];
    wonWithList: boolean;
}