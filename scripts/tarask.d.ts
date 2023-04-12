import { Options, Promisify } from './taraskTypes';
export declare const taraskSync: (text: string, isHtml: boolean, { abc, j }: Options) => string;
export declare const tarask: Promisify<typeof taraskSync>;
