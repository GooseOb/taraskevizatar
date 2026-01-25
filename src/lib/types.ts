export type PickerOption<T> = {
	label: string;
	value: T;
	note?: {
		label: string;
		include?: boolean;
		small?: boolean;
	};
};
