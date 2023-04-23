export const debounce = (callback: Function, cooldown: number) => {
    let timeout: number;
    return (e?) => {
        clearTimeout(timeout);
        timeout = window.setTimeout(() => {
            callback(e);
        }, cooldown);
    };
};

export const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;