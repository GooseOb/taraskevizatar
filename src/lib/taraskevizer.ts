import { init, tarask as taraskSync, type TaraskConfig } from 'taraskevizer';

let initPromise: Promise<unknown> | null = null;
export const ensureInit = () => (initPromise ||= init());

export type Pipeline = (text: string, config: TaraskConfig) => Promise<string>;

export const tarask = async (text: string, config: TaraskConfig): Promise<string> => {
	await ensureInit();
	return taraskSync(text, config);
};
