export type Dict = {
    [key: string]: RegExp;
};
declare const latinLetters: Dict;
declare const latinLettersUpCase: Dict;
declare const gobj: ({
    [key: string]: string;
});
declare const wordlist: Dict, softers: Dict, arabLetters: Dict;
export { wordlist, softers, arabLetters, latinLetters, latinLettersUpCase, gobj };
