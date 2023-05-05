export const enum Alphabet {cyrillic, latin, arabic}
export const enum J {never, random, always}
export type Options = {abc: Alphabet, j: J}
export type Promisify<T> = T extends (...args: infer TArgs) => infer TReturn
    ? (...args: TArgs) => Promise<TReturn> : never;
export type Tarask = (text: string, isHtml: boolean, {abc, j}: Options) => string;
export type TaraskAsync = Promisify<Tarask>;