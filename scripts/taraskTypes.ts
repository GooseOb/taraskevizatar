export const enum Alphabet {cyrillic, latin, arabic}
export const enum J {never, random, always}
export type Options = {abc: Alphabet, j: J}
export type Promisify<T extends (...args: any[])=>any> = (...params: Parameters<T>) => Promise<ReturnType<T>>;
export type Tarask = (text: string, isHtml: boolean, {abc, j}: Options) => string;