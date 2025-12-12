export const parentUse =
	<T>(fn: (el: T) => void) =>
	(el: { parentElement?: T | null }) => {
		if (el.parentElement) {
			fn(el.parentElement);
		}
	};
