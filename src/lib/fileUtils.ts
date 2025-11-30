export const getCreateUniqueTextFileURL = () => {
	let url: string;

	return (text: string) => {
		if (url) URL.revokeObjectURL(url);
		url = URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
		return url;
	};
};

export const readFileAsText = (file: File): Promise<string> =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			resolve(reader.result as string);
		};
		reader.onerror = () => {
			reject(reader.error);
		};
		reader.readAsText(file);
	});
