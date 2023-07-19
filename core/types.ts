export const enum Alphabet {
	cyrillic,
	latin,
	arabic,
}
export const enum J {
	never,
	random,
	always,
}
export type HtmlOptions = { g: boolean };
export type Options = { abc: Alphabet; j: J; html: false | HtmlOptions };
export type Promisify<T> = T extends (...args: infer TArgs) => infer TReturn
	? (...args: TArgs) => Promise<TReturn>
	: never;
export type Tarask = (text: string, options: Options) => string;
export type TaraskAsync = Promisify<Tarask>;
export type Dict = Record<string, RegExp>;
