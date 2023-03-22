declare const enum Abc {
    cyrillic = 0,
    latin = 1,
    arabic = 2
}
declare const enum J {
    never = 0,
    random = 1,
    always = 2
}
interface Options {
    abc: Abc;
    j: J;
}
export declare function toTaraskConvert(text: string, isHtml: boolean, { abc, j }: Options): string;
export {};
