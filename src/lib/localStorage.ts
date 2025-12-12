import { writable } from 'svelte/store';
import { debounce } from './debounce';

export const localStorageWritableString = <T extends string>(
	key: string,
	getDefaultValue: () => T,
	delay?: number
) =>
	localStorageWritable<T>(
		key,
		getDefaultValue,
		(value) => value as T,
		(value) => value,
		delay
	);

export const localStorageWritable = <T>(
	key: string,
	getDefaultValue: () => T,
	deserialize: (value: string) => T,
	serialize: (value: T) => string,
	delay = 100
) => {
	const value = localStorage.getItem(key);

	const store = writable<T>(value ? deserialize(value) : getDefaultValue());

	store.subscribe(
		// Ensure that data to be stored do not cause app to freeze
		debounce((value) => {
			localStorage.setItem(key, serialize(value));
		}, delay)
	);

	return store;
};
