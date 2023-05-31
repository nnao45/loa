import { autoSet, getFieldRelationMatrix } from '../src/autoset';
import fs from 'fs/promises';
import path from 'path';

fs.readFile(path.resolve(__dirname, './datasets/bike_dc-dataset-service.json')).then(buf => {
    return JSON.parse(buf.toString())
}).then(ds => {
    ds.fields.find((f: any) => f.name === 'hour')!.semanticType = 'quantitative'

    const mat = getFieldRelationMatrix(ds.dataSource, ds.fields);
    // console.log(mat, ds.fields.map((f: any) => f.name))
    for (let i = 0; i < mat.length; i++) {
        for (let j = 0; j < mat.length; j++) {
            if (mat[i][j] !== mat[j][i]) {
                console.log(mat[i][j], mat[j][i], i, j, ds.fields[i].name, ds.fields[j].name, ds.fields[i].semanticType, ds.fields[j].semanticType)
            }
        }
    }
    // @ts-ingore
    // const ans = autoSet(ds.dataSource, ds.fields, [
    //     {
    //         fields: ds.fields.filter((f: any) => f.name === 'registered' || f.name === 'casual'),
    //         locked: true
    //     },
    //     {
    //         fields: [ds.fields.find((f: any) => f.name === 'hour'), '*', '*'],
    //         locked: false
    //     },
    //     {
    //         fields: ['*', '*'],
    //         locked: false
    //     },
    //     {
    //         fields: ['*', '*'],
    //         locked: false
    //     }
    // ])
    // console.log(ans);
    // for (let v of ans) {
    //    // @ts-ignore
    //     console.log(v.fields.map(f => f.name))
    // }
})
