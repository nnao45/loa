declare type ISemanticType = "quantitative" | "nominal" | "ordinal" | "temporal";
declare type IDataType = "number" | "integer" | "boolean" | "date" | "string";
declare type IAnalyticType = "dimension" | "measure";
interface IRow {
    [key: string]: any;
}
declare type IGeoRole = 'longitude' | 'latitude' | 'none';
interface IFieldBase {
    fid: string;
    name?: string;
    analyticType: IAnalyticType;
    semanticType: ISemanticType;
    geoRole: IGeoRole;
}
/**
 * ImuteFieldBase 是未来替换IRawField的新interface，其扩展了'?'类型，方便告诉后续的类型推断机制来做。
 */
interface IMuteFieldBase {
    fid: string;
    name?: string;
    analyticType: 'dimension' | 'measure' | '?';
    semanticType: 'nominal' | 'temporal' | 'ordinal' | 'quantitative' | '?';
    disable?: boolean | '?';
    geoRole: IGeoRole | '?';
}
interface IFieldMeta extends IFieldBase {
    /**
     * 性质上是计算属性，只读。
     */
    features: {
        entropy: number;
        maxEntropy: number;
        unique: number;
        [key: string]: any;
    };
    distribution: Array<{
        memberName: string;
        count: number;
    }>;
    disable?: boolean;
}
declare type IFilter = {
    fid: string;
    disable?: boolean;
    type: 'set';
    values: any[];
} | {
    fid: string;
    disable?: boolean;
    type: 'range';
    range: [number, number];
};
interface IFieldEncode {
    field?: string;
    title?: string;
    type?: ISemanticType;
    aggregate?: string;
    bin?: boolean;
    scale?: any;
    stack?: any;
}
interface IPattern {
    fields: IFieldMeta[];
    imp: number;
    filters?: IFilter[];
    encodes?: IFieldEncode[];
}

declare function applyFilters(dataSource: IRow[], filters?: IFilter[]): IRow[];
declare class NextVICore {
    BIN_SIZE: number;
    dataSource: IRow[];
    fields: IFieldMeta[];
    patterns: IPattern[];
    constructor(dataSource: IRow[], fields: IFieldMeta[]);
    init(dataSource: IRow[], fields: IFieldMeta[]): void;
    recommandFilter(view: IPattern): IPattern[];
    searchPatterns(): IPattern[];
    createHighOrderPatterns(pattern: IPattern): IPattern[];
    firstPattern(): number[][];
    fewatureSelectionForSecondPatternWithSpecifiedViews(patt1: IPattern, patt2: IPattern): {
        features: IFieldMeta[];
        score: number;
    } | null;
    pureFeatureRecommand(pattern: IPattern): IPattern[];
}

declare function getCombination(elements: string[], start?: number, end?: number): string[][];
declare function liteGroupBy(values: any[], by: any[]): Map<any, any[]>;

declare function getRange(values: number[]): [number, number];
declare function entropy(pl: number[]): number;
declare function l1Dis(p1: number[], p2: number[]): number;
declare function l1Dis2(p1: number[][], p2: number[][]): number;
declare function l2Dis2(p1: number[][], p2: number[][]): number;
declare function w2dis(): void;
declare const BIN_SIZE = 16;
declare function bin(nums: number[]): number[];
declare function binShareRange(nums: number[], _min: number, _max: number): number[];
declare function binMap(nums: number[]): number[];
declare function binMapShareRange(nums: number[], _min: number, _max: number): number[];
declare function rangeNormilize(fl: number[]): number[];
declare function mic(T: number[], X: number[]): number;
declare function generalMic(T: string[], X: number[]): number;
/**
 * generalMic without noise
 * @param T
 * @param X
 * @returns
 */
declare function pureGeneralMic(T: string[], X: number[]): number;
declare function pureGeneralConditionH(T: string[], X: number[]): number;
declare function normalizeScatter(points: [number, number][]): number[][];
declare function incSim(TX: string[], pointsX: [number, number][], TY: string[], pointsY: [number, number][], TSize: number): number;
declare function initRanges(vals: number[][], order: number): [number, number][];
declare function matrixBinShareRange(values: [number, number][], ranges: [number, number][]): number[][];
declare function generalMatMic(T: string[], X: [number, number][]): number;

declare function vecAdd(mutVec: number[], inc: number[]): void;

interface ILoaView {
    fields: (IFieldMeta | '*')[];
    locked?: boolean;
}
declare function uniqueArrValue(arr: number[]): number[];
declare function autoSet(dataSource: IRow[], fields: IFieldMeta[], views: ILoaView[], linkGraph?: number[][]): ILoaView[];
declare function getFieldRelationMatrix(dataSource: IRow[], fields: IFieldMeta[]): number[][];
declare function getFreqMap(values: any[]): Map<any, number>;
/**
 * 返回一个BIN_SIZE大小的元素数组，包含了freq前16
 */
declare function getFreqRange(values: any[]): [any, number][];
/**
 * 返回一个BIN_SIZE大小的元素数组，包含了freq前16
 */
declare function getTemporalFreqRange(values: any[]): [any, number][];
declare function binGroupByShareFreqRange(Y: any[], range: any[]): number[];
declare function inverseGeneralMic(X: number[], Y: any[], FR?: (values: any[]) => any[] | undefined): number;
declare function nnMic(X: any[], Y: any[], FR?: (values: any[]) => any[] | undefined): number;
/**
 * no noise
 * @param X
 * @param Y
 * @param FR
 * @returns
 */
declare function purennMic(X: any[], Y: any[], FR?: (values: any[]) => any[] | undefined): number;

export { BIN_SIZE, IAnalyticType, IDataType, IFieldEncode, IFieldMeta, IFilter, IGeoRole, ILoaView, IMuteFieldBase, IPattern, IRow, ISemanticType, NextVICore, applyFilters, autoSet, bin, binGroupByShareFreqRange, binMap, binMapShareRange, binShareRange, entropy, generalMatMic, generalMic, getCombination, getFieldRelationMatrix, getFreqMap, getFreqRange, getRange, getTemporalFreqRange, incSim, initRanges, inverseGeneralMic, l1Dis, l1Dis2, l2Dis2, liteGroupBy, matrixBinShareRange, mic, nnMic, normalizeScatter, pureGeneralConditionH, pureGeneralMic, purennMic, rangeNormilize, uniqueArrValue, vecAdd, w2dis };
