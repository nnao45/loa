"use strict";

function getCombination(n, t = 1, r = n.length) {
    let i = [];
    const l = (e, t, r) => {
        t.length === r ? i.push([...t]) : e >= n.length || (l(e + 1, [...t, n[e]], r), l(e + 1, t, r))
    };
    for (let e = t; e <= r; e++) l(0, [], e);
    return i
}

function liteGroupBy(r, n) {
    const i = new Map;
    for (let t = 0; t < r.length; t++) {
        let e = i.get(n[t]) || [];
        e.push(r[t]), i.set(n[t], e)
    }
    return i
}

function vecAdd(t, r) {
    var n = Math.min(t.length, r.length);
    for (let e = 0; e < n; e++) t[e] += r[e]
}

function getRange(t) {
    let r = 1 / 0,
        n = -1 / 0;
    for (let e = 0; e < t.length; e++) t[e] > n && (n = t[e]), t[e] < r && (r = t[e]);
    return [r, n]
}

function entropy(e) {
    let t = 0,
        r = 0;
    for (r = 0; r < e.length; r++) t += e[r] * Math.log2(e[r]);
    return -t
}

function l1Dis(t, r) {
    let n = 0;
    var i = Math.min(t.length, r.length);
    for (let e = 0; e < i; e++) n += Math.abs(t[e] - r[e]);
    return n / 2
}

function l1Dis2(r, n) {
    let i = 0;
    for (let t = 0; t < r.length; t++)
        for (let e = 0; e < r[t].length; e++) i += Math.abs(r[t][e] - n[t][e]);
    return i / 2
}

function l2Dis2(r, n) {
    let i = 0;
    for (let t = 0; t < r.length; t++)
        for (let e = 0; e < r[t].length; e++) i += (r[t][e] - n[t][e]) ** 2;
    return i / 2
}

function w2dis() {}
Object.defineProperty(exports, "__esModule", {
    value: !0
});
const BIN_SIZE = 16;

function bin(t) {
    var [r, e] = getRange(t), n = (e - r) / BIN_SIZE;
    if (0 == n) return new Array(BIN_SIZE).fill(t.length / BIN_SIZE);
    let i = new Array(BIN_SIZE + 1).fill(0);
    for (let e = 0; e < t.length; e++) {
        var l = Math.floor((t[e] - r) / n);
        i[l % (BIN_SIZE + 1)]++
    }
    return i[BIN_SIZE - 1] += i[BIN_SIZE], i.slice(0, BIN_SIZE)
}

function binShareRange(t, r, e) {
    var n = (e - r) / BIN_SIZE;
    if (0 == n) return new Array(BIN_SIZE).fill(t.length / BIN_SIZE);
    let i = new Array(BIN_SIZE + 1).fill(0);
    for (let e = 0; e < t.length; e++) {
        var l = Math.floor((t[e] - r) / n);
        i[l % (BIN_SIZE + 1)]++
    }
    return i[BIN_SIZE - 1] += i[BIN_SIZE], i.slice(0, BIN_SIZE)
}

function binMap(r) {
    var [n, e] = getRange(r), i = (e - n) / BIN_SIZE;
    if (0 == i) return r.map(e => Math.round(Math.random() * (r.length - 1)));
    let l = [];
    for (let t = 0; t < r.length; t++) {
        let e = Math.floor((r[t] - n) / i);
        e === BIN_SIZE && (e = BIN_SIZE - 1), l.push(e)
    }
    return l
}

function binMapShareRange(r, n, e) {
    var i = (e - n) / BIN_SIZE;
    if (0 == i) return r.map(e => Math.round(Math.random() * (r.length - 1)));
    let l = [];
    for (let t = 0; t < r.length; t++) {
        let e = Math.floor((r[t] - n) / i);
        e === BIN_SIZE && (e = BIN_SIZE - 1), l.push(e)
    }
    return l
}

function rangeNormilize(t) {
    let r = 0;
    const n = [];
    for (let e = 0; e < t.length; e++) r += t[e];
    for (let e = 0; e < t.length; e++) n.push(t[e] / r);
    return n
}

function mic(e, t) {
    let r = 0;
    var n, [i, l] = getRange(t),
        e = liteGroupBy(t, binMap(e)),
        a = entropy(rangeNormilize(binShareRange(t, i, l).filter(e => 0 < e)));
    for (n of e) {
        var o = n[1],
            f = entropy(rangeNormilize(binShareRange(o, i, l).filter(e => 0 < e))),
            o = o.length / t.length;
        r += o * f
    }
    return (a - r) / a
}

function generalMic(e, n) {
    let i = 0;
    var [l, a] = getRange(n), e = liteGroupBy(n, e), o = Array.from(e).sort((e, t) => t[1].length - e[1].length), f = Math.min(BIN_SIZE - 1, o.length);
    let s = new Array(BIN_SIZE).fill(0);
    for (let e = 0; e < f; e++) {
        var [, t] = o[e];
        const p = binShareRange(t, l, a);
        var r = entropy(rangeNormilize(p.filter(e => 0 < e))),
            t = t.length / n.length;
        i += t * r, vecAdd(s, p)
    }
    if (o.length > BIN_SIZE) {
        let t = new Array(BIN_SIZE).fill(0),
            r = 0;
        for (let e = f; e < o.length; e++) {
            var [, g] = o[e];
            vecAdd(t, binShareRange(g, l, a)), r += g.length
        }
        var e = entropy(rangeNormilize(t.filter(e => 0 < e))),
            h = r / n.length;
        i += h * e, vecAdd(s, t)
    }
    return (entropy(rangeNormilize(s.filter(e => 0 < e))) - i) / Math.log2(BIN_SIZE)
}

function pureGeneralMic(e, t) {
    let r = 0;
    var [n, i] = getRange(t), e = liteGroupBy(t, e), l = Array.from(e).sort((e, t) => t[1].length - e[1].length);
    let a = new Array(BIN_SIZE).fill(0);
    for (let e = 0; e < l.length; e++) {
        var [, o] = l[e];
        const s = binShareRange(o, n, i);
        var f = entropy(rangeNormilize(s.filter(e => 0 < e))),
            o = o.length / t.length;
        r += o * f, vecAdd(a, s)
    }
    return (entropy(rangeNormilize(a.filter(e => 0 < e))) - r) / Math.log2(BIN_SIZE)
}

function pureGeneralConditionH(e, t) {
    let r = 0;
    var [n, i] = getRange(t), e = liteGroupBy(t, e), l = Array.from(e).sort((e, t) => t[1].length - e[1].length);
    for (let e = 0; e < l.length; e++) {
        var [, a] = l[e];
        const f = binShareRange(a, n, i);
        var o = entropy(rangeNormilize(f.filter(e => 0 < e))),
            a = a.length / t.length;
        r += a * o
    }
    return r
}

function normalizeScatter(r) {
    let t = -1 / 0,
        n = -1 / 0,
        i = 1 / 0,
        l = 1 / 0;
    for (let e = 0; e < r.length; e++) t = Math.max(r[e][0], t), n = Math.max(r[e][1], n), i = Math.min(r[e][0], i), l = Math.min(r[e][1], l);
    var a = (t - i) / BIN_SIZE,
        o = (n - l) / BIN_SIZE;
    const f = new Array(BIN_SIZE + 1).fill(0).map(() => new Array(BIN_SIZE + 1).fill(0));
    for (let e = 0; e < r.length; e++) {
        var s = Math.floor((r[e][0] - i) / a),
            g = Math.floor((r[e][1] - l) / o);
        f[s][g]++
    }
    for (let e = 0; e <= BIN_SIZE; e++) f[e][BIN_SIZE - 1] += f[e][BIN_SIZE], f[BIN_SIZE - 1][e] += f[BIN_SIZE][e];
    let h = new Array(BIN_SIZE).fill(0).map(() => new Array(BIN_SIZE).fill(0));
    for (let t = 0; t < BIN_SIZE; t++)
        for (let e = 0; e < BIN_SIZE; e++) h[t][e] = f[t][e] / r.length;
    return h
}

function incSim(t, r, n, i, e) {
    var l, a, o, f, s = l2Dis2(normalizeScatter(r), normalizeScatter(i));
    let g = new Map,
        h = new Map;
    for (let e = 0; e < t.length; e++) g.has(t[e]) || g.set(t[e], []), g.get(t[e]).push(r[e]);
    for (let e = 0; e < n.length; e++) h.has(n[e]) || h.set(n[e], []), h.get(n[e]).push(i[e]);
    let p = 0;
    for ([l, a] of g.entries()) {
        var c, u = a.length / e;
        0 != u && (!(a.length < BIN_SIZE ** 2) && h.has(l) ? (c = h.get(l), p += u * l2Dis2(normalizeScatter(a), normalizeScatter(c))) : p += u)
    }
    for ([o, f] of h.entries()) {
        var d = f.length / e;
        0 == d || g.has(o) || (p += d)
    }
    return s - p
}

function initRanges(e, r) {
    const n = [];
    for (let t = 0; t < r; t++) n.push(getRange(e.map(e => e[t])));
    return n
}
const BIN_SIZE_FOR_MAT = BIN_SIZE / 2;

function matrixBinShareRange(t, r) {
    const n = new Array(BIN_SIZE_FOR_MAT + 1).fill(0).map(() => new Array(BIN_SIZE_FOR_MAT + 1).fill(0));
    var i = (r[0][1] - r[0][0]) / BIN_SIZE_FOR_MAT,
        l = (r[1][1] - r[1][0]) / BIN_SIZE_FOR_MAT;
    for (let e = 0; e < t.length; e++) {
        var a = Math.floor((t[e][0] - r[0][0]) / i),
            o = Math.floor((t[e][1] - r[1][0]) / l);
        n[o][a]++
    }
    for (let e = 0; e < BIN_SIZE_FOR_MAT + 1; e++) n[e][BIN_SIZE_FOR_MAT - 1] += n[e][BIN_SIZE_FOR_MAT];
    for (let e = 0; e < BIN_SIZE_FOR_MAT; e++) n[BIN_SIZE_FOR_MAT - 1][e] += n[BIN_SIZE_FOR_MAT][e];
    return n.slice(0, BIN_SIZE_FOR_MAT).map(e => e.slice(0, BIN_SIZE_FOR_MAT))
}

function generalMatMic(e, n) {
    let i = 0;
    var l = initRanges(n, 2),
        e = liteGroupBy(n, e),
        a = Array.from(e).sort((e, t) => t[1].length - e[1].length),
        o = Math.min(BIN_SIZE - 1, a.length);
    let f = new Array(BIN_SIZE_FOR_MAT * BIN_SIZE_FOR_MAT).fill(0);
    for (let e = 0; e < o; e++) {
        var [, t] = a[e];
        const h = matrixBinShareRange(t, l).flatMap(e => e);
        var r = entropy(rangeNormilize(h.filter(e => 0 < e))),
            t = t.length / n.length;
        i += t * r, vecAdd(f, h)
    }
    if (a.length > BIN_SIZE - 1) {
        let t = new Array(BIN_SIZE_FOR_MAT * BIN_SIZE_FOR_MAT).fill(0),
            r = 0;
        for (let e = o; e < a.length; e++) {
            var [, s] = a[e];
            vecAdd(t, matrixBinShareRange(s, l).flatMap(e => e)), r += s.length
        }
        var e = entropy(rangeNormilize(t.filter(e => 0 < e))),
            g = r / n.length;
        i += g * e, vecAdd(f, t)
    }
    return (entropy(rangeNormilize(f.filter(e => 0 < e))) - i) / Math.log2(BIN_SIZE_FOR_MAT * BIN_SIZE_FOR_MAT)
}

function applyFilters(t, e) {
    if (void 0 === e) return t;
    if (0 === e.length) return t;
    const r = [],
        n = e.filter(e => !e.disable),
        i = new Map;
    for (var l of n) "set" === l.type && i.set(l.fid, new Set(l.values));
    for (let e = 0; e < t.length; e++) {
        const a = t[e];
        n.every(e => "range" === e.type ? e.range[0] <= a[e.fid] && a[e.fid] <= e.range[1] : "set" === e.type && i.get(e.fid).has(a[e.fid])) && r.push(a)
    }
    return r
}
class NextVICore {
    constructor(e, t) {
        this.BIN_SIZE = 16, this.dataSource = [], this.fields = [], this.patterns = [], this.dataSource = e, this.fields = t
    }
    init(e, t) {
        this.dataSource = e, this.fields = t, this.patterns = []
    }
    recommandFilter(r) {
        const e = r.fields.filter(e => "dimension" === e.analyticType),
            l = r.fields.filter(e => "measure" === e.analyticType);
        let a = [...e];
        const o = [];
        if (0 < (a = void 0 !== r.filters ? e.filter(t => !r.filters.find(e => e.fid === t.fid)) : [...e]).length) {
            let i = "",
                e = [],
                n = 0;
            for (let t of a) {
                const u = this.dataSource.map(e => e[t.fid]);
                let r = 0;
                l.forEach(t => {
                    var e = this.dataSource.map(e => e[t.fid]),
                        e = generalMic(u, e);
                    r += e
                }), (r /= l.length) > n && (n = r, i = t.fid, e = u)
            }
            if ("" !== i) {
                const t = new Set(e);
                for (let n of t.values()) {
                    let t = [];
                    const d = [],
                        m = [];
                    for (var f of r.fields)(f.fid === i ? d : m).push(f);
                    if (0 !== d.length) {
                        r.filters && t.push(...r.filters);
                        let e = 0;
                        for (let r of l) {
                            var s = this.dataSource.map(e => e[r.fid]),
                                g = getRange(s),
                                h = rangeNormilize(binShareRange(s, g[0], g[1])),
                                p = this.dataSource.filter(e => e[i] === n).map(e => e[r.fid]),
                                c = rangeNormilize(binMapShareRange(p, g[0], g[1]));
                            let t = 0;
                            for (let e = 0; e < h.length; e++) 0 < h[e] && 0 < c[e] && (t += h[e] * Math.log2(h[e] / c[e]));
                            e += t * (p.length / s.length)
                        }
                        e /= l.length, t.push({
                            fid: d[0].fid,
                            type: "set",
                            values: [n]
                        }), o.push({
                            imp: e,
                            fields: m,
                            filters: t,
                            encodes: r.encodes
                        })
                    }
                }
            }
        }
        return o.sort((e, t) => t.imp - e.imp), o
    }
    searchPatterns() {
        const e = this["dataSource"],
            r = this.fields.filter(e => "measure" === e.analyticType);
        for (let t = 0; t < r.length; t++) {
            const i = bin(e.map(e => e[r[t].fid]));
            var n = entropy(rangeNormilize(i.filter(e => 0 < e)));
            this.patterns.push({
                fields: [r[t]],
                imp: n
            })
        }
        return this.patterns.sort((e, t) => e.imp - t.imp), this.patterns
    }
    createHighOrderPatterns(r) {
        const n = r.fields,
            i = applyFilters(this.dataSource, r.filters),
            l = this.fields.filter(e => "measure" === e.analyticType),
            a = [];
        for (let t = 0; t < l.length; t++)
            if (!n.find(e => e.fid === l[t].fid)) {
                let e = 0;
                var o, f = i.map(e => e[l[t].fid]);
                for (let t = 0; t < n.length; t++) "measure" === n[t].analyticType && (o = i.map(e => e[n[t].fid]), e += mic(f, o));
                e /= n.length, a.push({
                    fields: [...n, l[t]],
                    filters: r.filters,
                    encodes: r.encodes,
                    imp: e
                })
            } return a.sort((e, t) => t.imp - e.imp), a
    }
    firstPattern() {
        const n = this.fields.filter(e => "measure" === e.analyticType),
            e = new Array(n.length).fill(0).map(() => new Array(n.length).fill(0));
        for (let r = 0; r < n.length; r++)
            for (let t = 0; t < n.length; t++) {
                var i = this.dataSource.map(e => e[n[r].fid]),
                    [l, a] = getRange(i),
                    i = binMapShareRange(i, l, a),
                    l = this.dataSource.map(e => e[n[t].fid]);
                e[r][t] = mic(i, l)
            }
        return e
    }
    fewatureSelectionForSecondPatternWithSpecifiedViews(e, t) {
        var r = this["dataSource"];
        const n = e.fields.filter(e => "measure" === e.analyticType),
            i = t.fields.filter(e => "measure" === e.analyticType),
            l = applyFilters(r, e.filters),
            a = applyFilters(r, t.filters);
        if (2 !== e.fields.length || 2 !== t.fields.length) throw new Error("View size Not supported yet!");
        const o = this.fields.filter(e => "dimension" === e.analyticType);
        var f = l.map(t => n.map(e => t[e.fid])),
            s = a.map(t => i.map(e => t[e.fid]));
        let g = 0,
            h = -1;
        for (let t = 0; t < o.length; t++) {
            var p = incSim(l.map(e => e[o[t].fid]), f, a.map(e => e[o[t].fid]), s, r.length);
            p > g && (g = p, h = t)
        }
        return -1 < h ? {
            features: [o[h]],
            score: g
        } : null
    }
    pureFeatureRecommand(a) {
        var e = this["dataSource"];
        const o = applyFilters(e, a.filters),
            t = this.fields.filter(e => "dimension" === e.analyticType),
            f = a.fields.filter(e => "measure" === e.analyticType),
            r = a.fields.filter(e => "dimension" === e.analyticType),
            n = t.filter(t => -1 === r.findIndex(e => e.fid === t.fid)),
            s = [];
        return n.forEach(t => {
            var e = o.map(e => e[t.fid]);
            let r = 0;
            if (1 === f.length) {
                const l = f[0];
                var n = generalMic(e, o.map(e => e[l.fid]));
                r += n
            } else if (1 < f.length) {
                n = getCombination(f.map(e => e.fid), 2, 2);
                for (let t of n) {
                    var i = generalMatMic(e, o.map(e => [e[t[0]], e[t[1]]]));
                    r += i
                }
                r /= n.length
            }
            s.push({
                imp: r,
                fields: [...a.fields, t],
                filters: a.filters,
                encodes: a.encodes
            })
        }), s.sort((e, t) => t.imp - e.imp), s
    }
}

function getSubMatrix(r, n) {
    const i = n.length,
        l = new Array(i).fill(0).map(() => new Array(i).fill(0));
    for (let t = 0; t < i; t++)
        for (let e = 0; e < i; e++) l[t][e] = r[n[t]][n[e]];
    return l
}

function mergeCauserEffects(t, r) {
    const n = [];
    for (let e = 0; e < t.length; e++) n.push([Math.max(t[e][0], r[e][0]), t[e][1]]);
    return n
}

function recInternalRelation(t, r, n) {
    const i = [],
        l = [];
    for (let e = 0; e < t.length; e++) e !== n && (i.push([t[e][n], e]), l.push([t[n][e], e]));
    let a = mergeCauserEffects(i, l);
    a.sort((e, t) => t[0] - e[0]);
    for (let e = 0; e < a.length; e++)
        if (!r[a[e][1]][n] && !r[n][a[e][1]]) return {
            from: n,
            to: a[e][1],
            score: a[e][0]
        };
    return null
}

function uniqueFieldMeta(e) {
    new Set(e.map(e => e.fid));
    const t = new Map;
    for (var r of e) t.set(r.fid, !0);
    const n = [];
    for (var i of e) t.get(i.fid) && (t.set(i.fid, !1), n.push(i));
    return n
}

function uniqueArrValue(e) {
    const t = new Set(e);
    return [...t.values()]
}

function findStrongestEdge2GroupNotMarked(t, r, n) {
    let i = {
        score: -1,
        from: -1,
        to: -1
    };
    for (let e = 0; e < n.length; e++) {
        var l = n[e];
        for (let e = 0; e < t.length; e++) e === l || r[l][e] || r[e][l] || (t[l][e] > i.score || t[e][l] > i.score) && (i.score = Math.max(t[l][e], t[e][l]), i.from = l, i.to = e)
    }
    return i
}

function extendSpecGroup(e) {
    var {
        relationMatrix: t,
        markMatrix: r,
        groupIndices: e,
        wildCardNum: n
    } = e;
    let i = n;
    const l = [],
        a = [];
    let o = [...e];
    for (; 1 < i;) {
        var f = findStrongestEdge2GroupNotMarked(t, r, o);
        if (!(0 <= f.to)) break;
        i--, l.push(f.from, f.to), o.push(f.to), a.push([f.from, f.to])
    }
    return {
        vertexIndices: uniqueArrValue(l),
        edges: a,
        leftWildCardNum: i
    }
}

function markUsedRelation(e, t) {
    for (var r of t) e[r[0]][r[1]] = e[r[1]][r[0]] = !0
}

function autoSet(e, n, t, r) {
    const i = [],
        l = new Map,
        a = new Map;
    for (let e = 0; e < n.length; e++) a.set(n[e].fid, e);
    for (var o of t)
        for (var f of o.fields) "*" !== f && (i.push(f), l.set(f.fid, (l.get(f.fid) || 0) + 1));
    var s = i.map(e => a.get(e.fid));
    const g = [...l.entries()].sort((e, t) => t[1] - e[1]);
    var h, p, c = getFieldRelationMatrix(e, n);
    const u = new Array(n.length).fill(!1).map(() => new Array(n.length).fill(!1));
    for (h of t) {
        var d = h.fields.filter(e => "*" !== e).map(e => a.get(e.fid));
        for (let t = 0; t < d.length; t++)
            for (let e = 0; e < d.length; e++) d[t] !== d[e] && (u[d[t]][d[e]] = u[d[e]][d[t]] = !0)
    }
    const m = [];
    for (p of t) {
        const v = p.fields;
        let r = p.fields.filter(e => "*" !== e);
        if (!p.locked && v.length > r.length) {
            var I = v.filter(e => "*" === e);
            if (I.length === v.length) {
                var S = I.length;
                const {
                    vertexIndices: _,
                    leftWildCardNum: N,
                    edges: B
                } = extendSpecGroup({
                    relationMatrix: c,
                    markMatrix: u,
                    groupIndices: s,
                    wildCardNum: S
                });
                r.push(..._.map(e => n[e])), markUsedRelation(u, B);
                for (let e = 0; e < u.length; e++) u[e][e] = !1
            } else {
                g.filter(t => v.find(e => "*" !== e && e.fid === t[0]));
                let e = I.length;
                for (let e = 0; e < u.length; e++) u[e][e] = !0;
                const R = v.filter(e => "*" !== e),
                    E = i.map(e => a.get(e.fid));
                var M = getSubMatrix(c, E);
                for (let t = 0; t < R.length; t++) {
                    const F = getSubMatrix(u, E);
                    var y = i.findIndex(e => e.fid === R[t].fid);
                    const w = recInternalRelation(M, F, y);
                    null === w || r.find(e => e.fid === n[E[w.to]].fid) || (F[w.from][w.to] = F[w.to][w.from] = !0, u[E[w.from]][E[w.to]] = u[E[w.to]][E[w.from]] = !0, e--, r.push(n[E[w.to]]))
                }
                const {
                    vertexIndices: Z,
                    leftWildCardNum: x,
                    edges: A
                } = extendSpecGroup({
                    relationMatrix: c,
                    markMatrix: u,
                    groupIndices: s,
                    wildCardNum: e + 1
                });
                e = x, r.push(...Z.map(e => n[e])), markUsedRelation(u, A);
                for (let e = 0; e < u.length; e++) u[e][e] = !1
            }
        } else r = p.fields.filter(e => "*" !== e);
        m.push({
            ...p,
            fields: uniqueFieldMeta(r)
        })
    }
    return m
}

function getFieldRelationMatrix(e, n) {
    const t = n.length;
    let i = new Array(t).fill(0).map(() => new Array(t).fill(0));
    for (let r = 0; r < n.length; r++)
        for (let t = 0; t < n.length; t++) {
            var l, a;
            r === t ? i[r][t] = 1 : (l = e.map(e => e[n[r].fid]), a = e.map(e => e[n[t].fid]), "quantitative" === n[r].semanticType && "quantitative" === n[t].semanticType && (i[r][t] = mic(l, a)), "quantitative" !== n[r].semanticType && "quantitative" === n[t].semanticType && ("temporal" === n[r].semanticType ? i[r][t] = pureGeneralMic(l, a) : i[r][t] = generalMic(l, a)), "quantitative" === n[r].semanticType && "quantitative" !== n[t].semanticType && ("temporal" === n[t].semanticType ? i[r][t] = inverseGeneralMic(l, a, getTemporalFreqRange) : i[r][t] = inverseGeneralMic(l, a)), "quantitative" !== n[r].semanticType && "quantitative" !== n[t].semanticType && ("temporal" === n[t].semanticType ? i[r][t] = nnMic(l, a, getTemporalFreqRange) : i[r][t] = nnMic(l, a)))
        }
    return i
}

function getFreqMap(e) {
    const t = new Map;
    for (var r of e) t.has(r) || t.set(r, 0), t.set(r, t.get(r) + 1);
    return t
}

function getFreqRange(e) {
    const t = getFreqMap(e),
        r = [...t.entries()].sort((e, t) => t[1] - e[1]);
    return r.slice(0, BIN_SIZE)
}

function getTemporalFreqRange(e) {
    const t = getFreqMap(e);
    return [...t.entries()].sort((e, t) => t[1] - e[1])
}

function binGroupByShareFreqRange(e, t) {
    const r = new Array(t.length).fill(0),
        n = new Map;
    for (let e = 0; e < t.length; e++) n.set(t[e], e);
    for (var i of e) n.has(i) ? r[n.get(i)]++ : r[r.length - 1]++;
    return r
}

function inverseGeneralMic(e, t, r = 0) {
    e = binMap(e);
    const n = getFreqRange(t);
    var i, l, a = n.map(e => e[0]),
        e = liteGroupBy(t, e);
    let o = 0,
        f = new Array(n.length).fill(0);
    for ([i, l] of e) {
        var s = l.length / t.length;
        const h = binGroupByShareFreqRange(l, a);
        var g = entropy(rangeNormilize(h.filter(e => 0 < e)));
        o += s * g, vecAdd(f, h)
    }
    return (entropy(rangeNormilize(f.filter(e => 0 < e))) - o) / Math.log2(Math.min(BIN_SIZE, n.length))
}

function nnMic(r, n, e = 0) {
    const t = getFreqRange(n);
    var i = t.map(e => e[0]);
    const l = liteGroupBy(n, r);
    var a = [...l.entries()].sort((e, t) => t[1].length - e[1].length),
        o = Math.min(a.length, BIN_SIZE - 1);
    let f = 0,
        s = 0,
        g = new Array(t.length).fill(0);
    for (f = 0; f < o; f++) {
        var h = a[f][1].length / n.length;
        const u = binGroupByShareFreqRange(a[f][1], i);
        var p = entropy(rangeNormilize(u.filter(e => 0 < e)));
        s += p * h, vecAdd(g, u)
    }
    if (a.length > o) {
        let e = new Array(BIN_SIZE).fill(0),
            t = 0;
        for (; f < a.length; f++) {
            var c = binGroupByShareFreqRange(a[f][1], i);
            t += a[f][1].length, vecAdd(e, c)
        }
        t /= n.length;
        r = entropy(rangeNormilize(e.filter(e => 0 < e)));
        s += t * r, vecAdd(g, e)
    }
    return (entropy(rangeNormilize(g.filter(e => 0 < e))) - s) / Math.log2(Math.min(BIN_SIZE, t.length))
}

function purennMic(e, t, r = 0) {
    const n = getFreqRange(t);
    var i = n.map(e => e[0]);
    const l = liteGroupBy(t, e);
    var a = [...l.entries()].sort((e, t) => t[1].length - e[1].length),
        o = a.length;
    let f = 0,
        s = 0,
        g = new Array(n.length).fill(0);
    for (f = 0; f < o; f++) {
        var h = a[f][1].length / t.length;
        const c = binGroupByShareFreqRange(a[f][1], i);
        var p = entropy(rangeNormilize(c.filter(e => 0 < e)));
        s += p * h, vecAdd(g, c)
    }
    return (entropy(rangeNormilize(g.filter(e => 0 < e))) - s) / Math.log2(Math.min(BIN_SIZE, n.length))
}
exports.BIN_SIZE = BIN_SIZE, exports.NextVICore = NextVICore, exports.applyFilters = applyFilters, exports.autoSet = autoSet, exports.bin = bin, exports.binGroupByShareFreqRange = binGroupByShareFreqRange, exports.binMap = binMap, exports.binMapShareRange = binMapShareRange, exports.binShareRange = binShareRange, exports.entropy = entropy, exports.generalMatMic = generalMatMic, exports.generalMic = generalMic, exports.getCombination = getCombination, exports.getFieldRelationMatrix = getFieldRelationMatrix, exports.getFreqMap = getFreqMap, exports.getFreqRange = getFreqRange, exports.getRange = getRange, exports.getTemporalFreqRange = getTemporalFreqRange, exports.incSim = incSim, exports.initRanges = initRanges, exports.inverseGeneralMic = inverseGeneralMic, exports.l1Dis = l1Dis, exports.l1Dis2 = l1Dis2, exports.l2Dis2 = l2Dis2, exports.liteGroupBy = liteGroupBy, exports.matrixBinShareRange = matrixBinShareRange, exports.mic = mic, exports.nnMic = nnMic, exports.normalizeScatter = normalizeScatter, exports.pureGeneralConditionH = pureGeneralConditionH, exports.pureGeneralMic = pureGeneralMic, exports.purennMic = purennMic, exports.rangeNormilize = rangeNormilize, exports.uniqueArrValue = uniqueArrValue, exports.vecAdd = vecAdd, exports.w2dis = w2dis;