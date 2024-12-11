import { CorrelatedFactors, SVDResult } from "../classes/results";
import { LongShort } from "../enums";

// Constants
const one_day_expiry = 1.0 / 365;
const accrual_period = 1.0 / 720;

/****************************
 * Module export interfaces *
 ****************************/
// Matrix module
export const MatrixLib = {
    multiply: (a: Array<Array<number>>, b: Array<Array<number>>): Array<Array<number>> => m_mat(a, b),
	multiply_vect: (a: Array<Array<number>>, b: Array<number>): Array<number> => m_mat_v(a, b),
    inverse: (a: Array<Array<number>>): Array<Array<number>> => m_inv(a),
	to_diagonal: (a: Array<number>): Array<Array<number>> => to_diagonal_m(a),
	SVD: (a: Array<Array<number>>): SVDResult => svd(a),
	getReturns: (spots: Array<number>): Array<number> => get_returns(spots),
	getCorrelatedFactors: (known_ret: Array<Array<number>>, target_ret: Array<number>, spots: Array<number>, known_fwds: Array<number>, known_vols: Array<number>): CorrelatedFactors => 
		get_reg_factors(known_ret, target_ret, spots, known_fwds, known_vols),
};

export const FinLib = {
	// Returns [strike, premium]
	// premium is the annualized premium
	findPremium: (spot: number, forward: number, volatility: number): [number, number] => find_premium(spot, forward, volatility),
	computePutValue: (spot: number, forward: number, strike: number, volatility: number): number => get_put_value(spot, forward, strike, volatility),
	computeIndices: (premForPair: number, spotPerf: number, totalLongPos: number, totalShortPos: number, prevLongIndex: number, prevShortIndex: number): [number, number] => 
		get_indices(premForPair, spotPerf, totalLongPos, totalShortPos, prevLongIndex, prevShortIndex),
	checkZeros: (index_values: Array<number>): [boolean, number] => check_last_zero_perf(index_values), 
}

/****************************
 * Functions Implementation *
 ****************************/
const get_reg_factors = (known_ret: Array<Array<number>>, target_ret: Array<number>, spots: Array<number>, known_fwds: Array<number>, known_vols: Array<number>): CorrelatedFactors => {
	// Sanity checks
	if (known_ret.length == 0 || target_ret.length == 0 || spots.length == 0 || known_fwds.length == 0 || known_vols.length == 0) throw new Error("Null data in solver");
	if (known_ret.length != target_ret.length || known_ret[0].length != known_fwds.length || known_fwds.length != known_vols.length || spots.length != known_fwds.length + 1) throw new Error("Dim error in solver");
	
	const res = solve(known_ret, target_ret);
	const err = get_svd_error(known_ret, target_ret, res);

	let corr_fwd = 0.0;
	let corr_vol = 0.0;

	for (let i = 0; i < known_fwds.length; i++) {
		corr_fwd += known_fwds[i] / spots[i] * res[i];
		corr_vol += Math.pow(known_vols[i] * res[i], 2);
	}

	return new CorrelatedFactors(spots[spots.length - 1], corr_fwd, Math.sqrt(corr_vol) + err);
}

const get_returns = (spots: Array<number>): Array<number> => {
	if (spots.length == 1) throw new Error("Dim err");

	let res = new Array<number>(spots.length);
	for (let i = 0; i < spots.length - 1; i++) res[i] = spots[i + 1] / spots[i] - 1.0;

	return res;
}

const find_premium = (s: number, fwd: number, vol: number): [number, number] => {
	let d = 0;
	while (obj_fn(s * (1 + d), s, get_put_value(s, fwd, s * (1 + d), vol)) < 0) d += 0.02;

	let upperK = s * (1 + d);
	let lowerK = upperK - s * 0.02;
	d = upperK - lowerK;
	
	do
	{
		let midK = 0.5 * d + lowerK;
		let prem = get_put_value(s, fwd, midK, vol);
		
		if (obj_fn(midK, s, prem) > 0)
		{
			upperK = midK;
		} else {
			lowerK = midK;
		}

		d = upperK - lowerK;
	} while (d > 1E-4);

	let k = lowerK + 0.5 * d;
	return [k, get_put_value(s, fwd, k, vol) / k * 365.0];
}

const get_put_value = (s: number, fwd: number, k: number, vol: number): number => {
	const v_sqrtT = vol * Math.sqrt(one_day_expiry);
	const d1 = Math.log(fwd / k) / v_sqrtT + 0.5 * v_sqrtT;
	const d2 = d1 - v_sqrtT;
	const df = s / fwd;
	return -s * standard_cdf(-d1) + k * df * standard_cdf(-d2);
}

const get_indices = (prem: number, spotPerf: number, totalLongPos: number, totalShortPos: number, prevLongIndex: number, prevShortIndex: number): [number, number] => {
	const accrual = prem * accrual_period;
	let newLongIndex = prevLongIndex;
	let newShortIndex = prevShortIndex;

	if (spotPerf > 0) {
		let adjustedAccrual = accrual * get_position_ratio(LongShort.Long, totalLongPos, totalShortPos);
		newLongIndex += adjustedAccrual;
		newShortIndex -= accrual;
	} else {
		let adjustedAccrual = accrual * get_position_ratio(LongShort.Short, totalLongPos, totalShortPos);
		newLongIndex -= accrual;
		newShortIndex += adjustedAccrual;
	}

	return [newLongIndex, newShortIndex];
}

const get_position_ratio = (longShort: LongShort, totalLongPos: number, totalShortPos: number): number => {
	if (longShort == LongShort.Long) {
		if (totalLongPos == 0) return 0;
		return totalShortPos / totalLongPos;
	}

	if (totalShortPos == 0) return 0;
		return totalLongPos / totalShortPos;
}

// Returns:
// - true or false: true a zero has been detected
// - the index of the last index_value leading to 100% loss
const check_last_zero_perf = (index_values: Array<number>): [boolean, number] => {
	let iT = index_values.length - 1;

	for (let i = iT - 1; i >= 0; i--) {
		if (index_values[iT] - index_values[i] <= -1) return [true, i];
	}

	return [false, -1];
}

const m_mat = (a: Array<Array<number>>, b: Array<Array<number>>): Array<Array<number>> => {
    const r_a = a.length;
    const r_b = b.length;

    if (r_a == 0 || r_b == 0) return new Array<Array<number>>(0);

    const c_a = a[0].length;
    const c_b = b[0].length;

    if (c_a == 0 || c_b == 0 || c_a != r_b || r_a != c_b) new Array<Array<number>>(0);
    const res = Array.from({ length: r_a }, () => Array<number>(c_b).fill(0));

    for (let i = 0; i < r_a; i++) {
        let subRes = Array<number>(c_b);

        for (let j = 0; j < c_b; j++) {
            let tot = 0;

            for (let k = 0; k < r_b; k++){
                tot += a[i][k] * b[k][j]
            }

            subRes[j] = tot;
        }

        res[i] = subRes;
    }

    return res;
}

const m_mat_v = (a: Array<Array<number>>, b: Array<number>): Array<number> => {
	let nRowA = a.length;
    if (nRowA == 0) throw new Error("Null matrix");
    
    let nColA = a[0].length;
    if (nColA != b.length) throw new Error("Dimension error for M x V");
    
    let R = Array<number>(nRowA).fill(0);
    
    for (let i = 0; i < nRowA; i++) {
    	let tot = 0.0;
    	for (let j = 0; j < nColA; j++) {
        	tot += a[i][j] * b[j];
        }
        
        R[i] = tot;
    }
    
    return R;
}

const m_inv = (a: Array<Array<number>>): Array<Array<number>> => {
	let fd = 0;
	let fdScaler = 1.0 / a[0][0];
	
	const n = a.length;
	const I = m_id(n);
	
	for (let j = 0; j < n; j++) {
		a[fd][j] = fdScaler * a[fd][j];
		if (fd == j) { I[fd][j] = fdScaler * I[fd][j]; }
	}
		
	for (let i = 1; i < n; i++) {
		let crScaler = a[i][fd];
		
		for (let j = 0; j < n; j++) {
			a[i][j] = a[i][j] - crScaler * a[fd][j];
			I[i][j] = I[i][j] - crScaler * I[fd][j];
		}
	}
	
	for (fd = 1; fd < n; fd++) {
		fdScaler = 1.0 / a[fd][fd];
		
		for (let j = 0; j < n; j++) {
			a[fd][j] = a[fd][j] * fdScaler;
			I[fd][j] = I[fd][j] * fdScaler;
		}
		
		for (let i = 0; i < n; i++) {
			if (i != fd) {
				let crScaler = a[i][fd];
				for (let j = 0; j < n; j++) {
					a[i][j] = a[i][j] - crScaler * a[fd][j];
					I[i][j] = I[i][j] - crScaler * I[fd][j];
				}
			}
		}
	}
	
	return I;
}

const m_id = (n: number): Array<Array<number>> => {
	const res = Array.from({ length: n }, () => Array<number>(n).fill(0));
	
	// We don't fill all the values to optimize CPU resources and time
	for (let i = 0; i < n; i++) {
		res[i][i] = 1.0;
	}
	
	return res;
}

const to_diagonal_m = (q: Array<number>): Array<Array<number>> => {
	const n = q.length;
	const R = Array.from({ length: n }, () => Array<number>(n).fill(0));

	for (let i = 0; i < n; i++) {
		R[i][i] = q[i];
	}
	
	return R;
}

const solve = (a: Array<Array<number>>, r: Array<number>): Array<number> => {
	if (a.length == 0 || a.length != r.length) throw new Error("Solver dim error");
	const svd_res = svd(a);
    
	let si = m_inv(svd_res.Q);
	const ut = transpose_U(svd_res.U, svd_res.n);
	const aa = m_mat(m_mat(svd_res.V, si), ut);
    return m_mat_v(aa, r);
}

const get_svd_error = (a: Array<Array<number>>, target: Array<number>, reg_factors: Array<number>): number => {
	const n = a.length;
	const l = a[0].length;
	let sq = 0.0;

	for (let i = 0; i < n; i++) {
		let err = 0.0;

		for (let j = 0; j < l; j++) { err += a[i][j] * reg_factors[j]; }
		
		err -= target[i];
		sq += err * err;
	}

	return Math.sqrt(sq / (n - 1));
}

const pythag = (a: number, b: number): number => {
	if (a == 0) return 0;

	let absa = Math.abs(a);
	let absb = Math.abs(b);

	if (absa > absb) { 
		let r = absb / absa; 
		return absa * Math.sqrt(1.0 + r * r); 
	} else {
		let r = absa / absb;
		return absb * Math.sqrt(1.0 + r * r);
	}
}

const svd = (a: Array<Array<number>>): SVDResult => {
	let eps = 1E-10;
	const tol = 1E-12;
	const itMax = 50;
	
	let m = a.length;
	let n = a[0].length;
	
	const e = Array<number>(n).fill(0.0);
	const q = Array<number>(n).fill(0.0);
	
	const v = Array.from({ length: n }, () => Array<number>(n).fill(0));
	
	let g = 0.0;
	let x = 0.0;
	let l = 0;
	
	for (let i = 0; i < n; i++) {
		e[i] = g;
		let s = 0.0;
		l = i + 1;
		
		for (let j = i; j < m; j++) { s += a[j][i] * a[j][i]; }
		
		if (s <= tol) { g = 0.0; }
		else {
			let f = a[i][i];
			
			if (f < 0.0) { g = Math.sqrt(s); }
			else { g = -Math.sqrt(s); }
			
			let h = f * g - s;
			a[i][i] = f - g;
			
			for (let j = l; j < n; j++) {
				s = 0.0;
				for (let k = i; k < m; k++) { s += a[k][i] * a[k][j]; }
				f = s / h;
				for (let k = i; k < m; k++) { a[k][j] += f * a[k][i]; }
			}
		}
		
		q[i] = g;
		s = 0.0;
		
		for (let j = l; j < n; j++) { s += a[i][j] * a[i][j]; }
		
		if (s <= tol) {
			g = 0.0;
		} else {
			let f = a[i][i + 1];
			if (f < 0.0) { g = Math.sqrt(s); }
			else { g = -Math.sqrt(s); }
            
			let h = f * g - s;
			a[i][i + 1] = f - g;
            
			for (let j = l; j < n; j++) { e[j] = a[i][j] / h; }
			for (let j = l; j < m; j++) {
				s = 0.0;
				for (let k = l; k < n; k++) { s += a[j][k] * a[i][k]; }
				for (let k = l; k < n; k++) { a[j][k] += s * e[k]; }
			}
		}
		
		let y = Math.abs(q[i]) + Math.abs(e[i]);
		if (x > y) { x = y; }
	}
	
	for (let i = n - 1;i >= 0; i--) {
		if (g != 0.0) {
			let h = g * a[i][i + 1];
            
			for (let j = l; j < n; j++) { v[j][i] = a[i][j] / h; }
			for (let j = l; j < n; j++) {
				let s = 0.0;
				for (let k = l; k < n; k++) { s += a[i][k] * v[k][j]; }
				for (let k = l; k < n; k++) { v[k][j] += s * v[k][i]; }
			}
		}
		
		for (let j = l; j < n; j++) {
			v[i][j] = 0.0;
			v[j][i] = 0.0;
		}
		
		v[i][i] = 1.0;
		g = e[i];
		l = i;
	}
	
	for (let i = n - 1; i >= 0; i--) {
		l = i + 1;
		g = q[i];
		
		for (let j = l; j < n; j++) { a[i][j] = 0.0; }
		if (g != 0.0) {
			let h = a[i][i] * g;
			for (let j = l; j < n; j++) {
				let s = 0.0;
				for (let k = l; k < m; k++) { s += a[k][i] * a[k][j]; }
				let f = s / h;
				for (let k = i; k < m; k++) { a[k][j] += f * a[k][i]; }
			}
			for (let j = i; j < m; j++) { a[j][i] /= g; }
		} else {
			for (let j = i; j < m; j++) { a[j][i] = 0.0; }
		}

		a[i][i] += 1.0;
	}
	
	eps = eps * x;
	
	for (let k = n - 1; k >= 0; k--) {
		for (let it = 0; it < itMax; it++) {
			let test_conv = false;

			for (l = k; l >= 0; l--) {
				if (Math.abs(e[l]) <= eps) {
					test_conv = true;
					break;
				}

				if (Math.abs(q[l - 1]) <= eps) { break; }
			}
			
			if (!test_conv) {
				let c = 0.0;
				let s = 1.0;
				let l1 = l - 1;
				
				for (let i = l; i < k + 1; i++) {
					let f = s * e[i];
					e[i] = c * e[i];
					
					if (Math.abs(f) <= eps) { break; }
					g = q[i];
					let h = pythag(f, g);
					
					q[i] = h;
					c = g / h;
					s = -f / h;
					
					for (let j = 0; j < m; j++) {
						let y = a[j][l1];
						let z = a[j][i];
						a[j][l1] = y * c + z * s;
						a[j][i] = -y * s + z * c;
					}
				}
			}
			
			let z = q[k];
			if (l == k) {
				if (z < 0.0) { 
					q[k] = -z;
					for (let j = 0; j < n; j++) { v[j][k] = -v[j][k]; }
				}
				break;
			}
			if (it >= itMax - 1) { break; }
			
			x = q[l];
			let y = q[k - 1];
			g = e[k - 1];
			let h = e[k];
			let f = ((y - z) * (y + z) + (g - h) * (g + h)) / (2.0 * h * y);
			g = pythag(f, 1.0);
			
			if (f < 0.0) { f = ((x - z) * (x + z) + h * (y / (f - g) - h)) / x; }
			else { f = ((x - z) * (x + z) + h * (y / (f + g) - h)) / x; }
			
			let c = 1.0;
			let s = 1.0;
			
			for (let i = l + 1; i < k + 1; i++) {
				g = e[i];
				y = q[i];
				h = s * g;
				g = c * g;
				z = pythag(f, h);
				e[i - 1] = z;
				c = f / z;
				s = h / z;
				f = x * c + g * s;
				g = -x * s + g * c;
				h = y * s;
				y = y * c;
				
				for (let j = 0; j < n; j++) {
					x = v[j][i - 1];
					z = v[j][i];
					v[j][i - 1] = x * c + z * s;
					v[j][i] = -x * s + z * c;
				}
				
				z = pythag(f, h);
				q[i - 1] = z;
				c = f / z;
				s = h / z;
				f = c * g + s * y;
				x = -s * g + c * y;
				
				for (let j = 0; j< m; j++) {
					y = a[j][i - 1];
					z = a[j][i];
					a[j][i - 1] = y * c + z * s;
					a[j][i] = -y * s + z * c;
				}
			}
			
			e[l] = 0.0;
			e[k] = f;
			q[k] = x;
		}
	}
    
	return new SVDResult(a, to_diagonal_m(q), v);
}

const transpose_U = (u: Array<Array<number>>, n: number): Array<Array<number>> => {
	let m = u.length;
	const UT = Array.from({ length: n }, () => Array<number>(m).fill(0));
	
	for (let j = 0; j < n; j++) {
		for (let i = 0; i < m; i++) {
			UT[j][i] = u[i][j];
		}
	}
	
	return UT;
}

const standard_cdf = (x: number): number => cdf(0, 1, x);

const cdf = (mean: number, sigma: number, x: number): number => {
    let z = (x - mean) / Math.sqrt(2 * sigma * sigma);
    let t = 1.0 / (1.0 + 0.3275911 * Math.abs(z));
    let a1 =  0.254829592;
    let a2 = -0.284496736;
    let a3 =  1.421413741;
    let a4 = -1.453152027;
    let a5 =  1.061405429;
    let erf = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-z * z);
    let sign = 1;
    if(z < 0)
    {
        sign = -1;
    }
    return 0.5 * (1.0 + sign * erf);
}

const obj_fn = (k: number, s: number, p: number): number => { return k - s - p; }