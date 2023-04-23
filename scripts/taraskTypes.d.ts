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
export type Options = {
    abc: Alphabet;
    j: J;
};
export type Promisify<T extends (...args: any[]) => any> = (...params: Parameters<T>) => Promise<ReturnType<T>>;
export type Tarask = (text: string, isHtml: boolean, { abc, j }: Options) => string;
