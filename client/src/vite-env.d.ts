/// <reference types="vite/client" />
interface Array<T extends string> {
	includes(searchElement: string, fromIndex?: number): boolean;
}

namespace process {
	type EnvVariable = 'API_URL';
	export const env: Record<EnvVariable | string, string>;
}
declare const __BUILD_DATE__: number,
	__VERSION__: string,
	__DEFAULT_TEXT__: string,
	__SW_SCOPE__: string;
