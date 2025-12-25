import JSZip from 'jszip';

const download = (name: string) => (blob: Blob) => {
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = name;
	document.body.appendChild(a);
	a.click();
	a.remove();
	URL.revokeObjectURL(url);
};

export const getOnDownload = (name: string, value: string) => () => {
	download(name)(
		new Blob([value], {
			type: 'text/plain;charset=utf-8',
		})
	);
};

export const getOnDownloadMany = (files: { name: string; value: string }[]) => () => {
	const zip = new JSZip();

	for (const { name, value } of files) {
		zip.file(name, value);
	}

	zip.generateAsync({ type: 'blob' }).then(download(`tarask-${Date.now()}.zip`));
};
