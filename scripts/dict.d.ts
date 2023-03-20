type rawDict = {
    [key: string]: RegExp | string;
};
type dict = {
    [key: string]: RegExp;
};
declare const wordlist: rawDict;
declare const softers: rawDict;
declare const latinLetters: rawDict;
declare const latinLettersUpCase: dict;
declare const arabLetters: rawDict;
declare const gobj: ({
    [key: string]: string;
});
export { wordlist, softers, arabLetters, latinLetters, latinLettersUpCase, gobj };
