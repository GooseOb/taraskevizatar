const createNumeralHelper = (one: string, few: string, many: string) => (n: number) =>
	n +
	' ' +
	(n % 10 === 1 && n % 100 !== 11
		? one
		: n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)
			? few
			: many);

export const ofFiles = createNumeralHelper('файл', 'файлы', 'файлаў');

export const ofNewFiles = createNumeralHelper('новы файл', 'новыя файлы', 'новых файлаў');
