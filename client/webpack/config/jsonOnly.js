import cfg, { addDictLoaders, finalize } from './default.js';

cfg.entry = {
	dict: '../core/index.ts',
};

addDictLoaders(['jsonGenerator']);

export default finalize({
	mode: 'production',
});
