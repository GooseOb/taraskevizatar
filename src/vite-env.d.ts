/// <reference types="vite/client" />
interface Array<T> {
	includes(searchElement: any, fromIndex?: number): searchElement is T;
}

declare const __BUILD_TIME__: number,
	__VERSION__: string,
	__SW_SCOPE__: string,
	__DEFAULT_TEXT__: string,
	__CURRENT_YEAR__: number;
