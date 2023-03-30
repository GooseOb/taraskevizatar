export declare const enum Alphabet {
    cyrillic = 0,
    latin = 1,
    arabic = 2
}
export declare const enum J {
    never = 0,
    random = 1,
    always = 2
}
export interface Options {
    abc: Alphabet;
    j: J;
}
export declare function toTaraskConvert(text: string, isHtml: boolean, { abc, j }: Options): string;
