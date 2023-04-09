import { Options, Promisify } from './taraskTypes';
export declare const taraskSync: (text: string, isHtml: boolean, { abc, j }: Options) => string;
declare const tarask: Promisify<typeof taraskSync>;
export default tarask;
