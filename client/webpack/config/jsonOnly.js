import cfg, { finalize } from './default.js';
import { addDictLoaders } from './utils.js';

cfg.entry = {
	dict: '../core/index.ts',
};

addDictLoaders(cfg.module.rules, ['jsonGenerator']);

export default finalize({
	mode: 'production',
});
