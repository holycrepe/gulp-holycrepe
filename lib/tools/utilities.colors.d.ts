///<reference path="../../typings/index.d.ts"/>

import {ChalkChain} from "chalk";
import {ChalkStyle} from "chalk";
// export type ChalkStyleDefinitions1 = {[style: string]: ChalkChain};
// export interface ChalkStyleMappingExtended1 {
//     get(style:string):ChalkChain;
// }
// interface ChalkStylesX<T extends ChalkChain> {
//     [style: string]: T;
// }
// interface ChalkStylesY {
//     [style: string]: any;
// }
interface ChalkStyleMappingExtended {
    brightRed?: ChalkChain
    heading?: ChalkChain
    banner?: ChalkChain
}
interface ChalkStylesExtended extends ChalkStyle, ChalkStyleMappingExtended {
    add<T extends ChalkChain>(extendedColors:ChalkStyleDefinitions<T>):ChalkStylesExtended;
}
// export type ChalkStyleDefinitions = {[style: string]: ChalkChain};
interface ChalkStyleDefinitions<T extends ChalkChain> {
    [style: string]: T;
}
export = ChalkStylesExtended;