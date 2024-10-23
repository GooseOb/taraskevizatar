/// <reference types="vite/client" />
interface Array {
	includes(searchElement: string, fromIndex?: number): boolean;
}

type VoidFn = () => void;

type ThemeId = 0 | 1 | 2;
declare const themeSetters: [VoidFn, VoidFn, VoidFn],
	setDark: VoidFn,
	setLight: VoidFn,
	setAuto: VoidFn,
	initialTheme: ThemeId;

declare const __BUILD_TIME__: number,
	__VERSION__: string,
	__DEFAULT_TEXT__: string,
	__SW_SCOPE__: string;
