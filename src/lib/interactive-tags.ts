import { createInteractiveTags } from 'taraskevizer';
import { outputText } from './store/text';

const interactiveTags = createInteractiveTags();

export const initInteractiveTags = (node: Element) => {
	outputText.subscribe(() => {
		// make sure the DOM is updated
		queueMicrotask(() => {
			interactiveTags.update(node);
		});
	});

	node.addEventListener('click', (e) => {
		interactiveTags.tryAlternate(e.target as Element);
	});
};
