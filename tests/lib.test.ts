// lib.test.ts
import { MatrixLib, FinLib } from '../1xmm/src/lib/math';

describe("Test Matrix library", () => {
    test("Matrix multiply", () => {
        const a = [[1, 1], [2,2]];
        const b = [[1,2,3],[1,2,3]];

        const c = MatrixLib.multiply(a, b);
        expect(c[0][0]).toBe(2);
        expect(c[1][2]).toBe(12);
    });
});

describe("Test Utils library", () => {
    test("Price put", () => {
        expect(FinLib.computePutValue(100, 105, 110, 0.3)).toBeCloseTo(4.7626053, 5);
    });
    test("Find premium", () => {
        let p = FinLib.findPremium(100, 105, 0.3);
        expect(p[0]).toBeCloseTo(100.000399171515, 5);
        expect(p[1]).toBeCloseTo(0.001457, 6);
    });
});