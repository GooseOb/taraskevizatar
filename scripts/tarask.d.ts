import { Options, Promisify } from './taraskTypes';
declare const processText: (text: string, isHtml: boolean, { abc, j }: Options) => string;
declare const tarask: Promisify<typeof processText>;
export default tarask;
export declare const taraskSync: (text: string, isHtml: boolean, { abc, j }: Options) => string;
