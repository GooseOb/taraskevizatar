module.exports = (source) => {
    const fns = {};
    source = source.replace(/\/\/ buildTimeFn([\S\s]+?)\/\/ buildTimeFn/g, ($0, $1) => {
        eval($1.replace(/const /, 'fns.'));
        return '';
    });
    for (const key in fns) {
        let startI;
        loop: while (~(startI = source.indexOf(key))) {
            let bracketCount = 1;
            for (let i = startI + key.length + 1;; ++i)
                switch (source[i]) {
                    case ')':
                        if (source[i-1] === '\\' || --bracketCount) continue;
                        const arr = [
                            source.slice(0, startI),
                            source.slice(startI, i+1),
                            source.slice(i+1)
                        ];
                        arr[1] = JSON.stringify(eval('fns.' + arr[1]));
                        source = arr.join('');
                        continue loop;
                    case '(':
                        if (source[i-1] !== '\\') ++bracketCount;
                }
        }
    }
    return source;
};