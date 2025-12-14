import { localStorageWritableString } from './localStorage';

export const theme = localStorageWritableString<'0' | '1' | '2'>('theme', () => '0', 10);

theme.subscribe((value) => {
	document.documentElement.className =
		value === '0'
			? 'light'
			: value === '2'
				? 'dark'
				: window.matchMedia?.('(prefers-color-scheme: dark)').matches
					? 'dark'
					: 'light';
});
