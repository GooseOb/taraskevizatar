import { htmlConfigOptions, TaraskConfig } from 'taraskevizer';
import { getConfig } from './localStorage';

export const taraskConfig = new TaraskConfig({
	...htmlConfigOptions,
	...getConfig(),
});
