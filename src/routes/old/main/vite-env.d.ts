/// <reference types="vite/client" />
interface Array<T> {
	includes(searchElement: any, fromIndex?: number): searchElement is T;
}

type VoidFn = () => void;

type ThemeId = 0 | 1 | 2;

declare const __BUILD_TIME__: number,
	__VERSION__: string,
	__SW_SCOPE__: string,
	__DEFAULT_TEXT__: string;
