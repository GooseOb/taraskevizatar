/// <reference types="vite/client" />
type EnvVariable = 'API_URL';
declare const __BUILD_DATE__: number;
declare const __DEFAULT_TEXT__: string;
declare const __SW_SCOPE__: string;
declare const process: { env: Record<EnvVariable | string, string> };
