module.exports = (source) => {
	const fns = {};
	const fnRegex = (fnName) =>
		new RegExp(
			`[\\S\\s]*const\\s*(${fnName}\\s*=\\s*\\([\\S\\s]*?\\)\\s*?=>\\s*?(?:\\{[\\S\\s]*?\\n}|\\w[\\S\\s]*?;))[\\S\\s]*`
		);
	let startI;
	loop: while (~(startI = source.search(/\w+\s*?\/\*build-time\*\//))) {
		let textFromStartI = source.slice(startI);
		let bracketCount = 1;
		let fnName;
		textFromStartI = textFromStartI.replace(
			/^(\w+)\s*?\/\*build-time\*\//,
			($0, $1) => {
				fnName = $1;
				return '';
			}
		);
		for (let i = 1; ; ++i)
			switch (textFromStartI[i]) {
				case ')':
					if (textFromStartI[i - 1] === '\\' || --bracketCount) continue;
					const arr = [
						source.slice(0, startI), // before fn
						textFromStartI.slice(0, i + 1), // arguments in brackets
						textFromStartI.slice(i + 1), // after fn
					];
					if (!(fnName in fns)) eval(source.replace(fnRegex(fnName), 'fns.$1'));
					arr[1] = JSON.stringify(eval('fns.' + fnName + arr[1]));
					source = arr.join('');
					continue loop;
				case '(':
					if (source[i - 1] !== '\\') ++bracketCount;
			}
	}
	return source;
};
