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
export type Promisify<T> = T extends (...args: infer TArgs) => infer TReturn ? (...args: TArgs) => Promise<TReturn> : never;
export type Tarask = (text: string, isHtml: boolean, { abc, j }: Options) => string;
export type TaraskPromise = Promisify<Tarask>;
