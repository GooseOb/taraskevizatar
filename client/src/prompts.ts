export const prompts = {
	list: [
		'<tarL class="demo">Гэтыя часьціны</tarL> можна зьмяняць, націскаючы на іх',
		`Апошняе абнаўленьне: ${new Date(
			__BUILD_TIME__
		).toLocaleString()}. Вэрсія тарашкевізатара: ${__VERSION__}`,
	] as const,
	_i: 0,
	getNext(): string {
		const result = this.list[this._i];
		this._i = (this._i + 1) % this.list.length;
		return result;
	},
};
