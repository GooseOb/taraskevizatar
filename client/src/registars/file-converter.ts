export const fileConverter = (
	upload: HTMLInputElement,
	download: HTMLElement,
	convertText: (text: string) => string
) => {
	let textFileURL: string, fileName: string;

	const reader = new FileReader();
	reader.addEventListener('load', ({ target }) => {
		Object.assign(download, {
			href: createTextFileURL(
				convertText(target!.result as string).replace(/\s([\n\t])\s/g, '$1')
			),
			download: 'tarask-' + fileName,
		});
		download.parentElement!.classList.add('active');
		hooks.onConverted();
	});

	upload.addEventListener('change', () => {
		const [file] = upload.files!;
		fileName = file.name;
		reader.readAsText(file);
		upload.value = '';
	});

	const createTextFileURL = (text: string) => {
		if (textFileURL) URL.revokeObjectURL(textFileURL);
		textFileURL = URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
		return textFileURL;
	};

	const hooks = {
		onConverted: () => {},
	};
	return hooks;
};
