export class SVDResult {
    U: Array<Array<number>>;
    Q: Array<Array<number>>;
    V: Array<Array<number>>;
    n: number;

    public constructor(u: Array<Array<number>>, q: Array<Array<number>>, v: Array<Array<number>>) {
        this.U = u;
        this.Q = q;
        this.V = v;
        this.n = v.length;
    }
}

export class CorrelatedFactors {
    Spot: number;
    Fwd: number;
    Vol: number;

    public constructor(spot: number, correlated_yield: number, correlated_vol: number) {
        this.Spot = spot;
        this.Fwd = spot * (1 + correlated_yield);
        this.Vol = correlated_vol;
    }
}