import { debounce } from '$lib/utils/debounce';
import { writable } from 'svelte/store';

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

const getStorageWriteable =
	(storage: Storage) =>
	<T>(
		key: string,
		getDefaultValue: () => T,
		deserialize: (value: string) => T,
		serialize: (value: T) => string,
		delay = 100
	) => {
		const value = storage.getItem(key);

		const store = writable<T>(value ? deserialize(value) : getDefaultValue());

		store.subscribe(
			// Ensure that data to be stored do not cause app to freeze
			debounce((value) => {
				storage.setItem(key, serialize(value));
			}, delay)
		);

		return store;
	};

export const localStorageWritable = getStorageWriteable(localStorage);
export const sessionStorageWritable = getStorageWriteable(sessionStorage);
