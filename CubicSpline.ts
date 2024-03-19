import { matrix, inv, multiply } from "mathjs";
import { generateMatrix } from "./matrix";


console.log('hello CubicSplineInterpolation')

function cubicSplineInterpolation(x: number[], y: number[], boundary: string, alpha: number, beta: number): ((t: number) => number) {
    const mu = new Array(x.length);
    const lambda = new Array(x.length);
    const n = x.length - 1;
    const h = new Array(n);
    const d = new Array(n + 1);
    let size = 0;
    let lambdaOffset = 0;
    let miuOffset = 0;
    let bdc = 0;

    for (let i = 0; i < n; i++) {
        h[i] = x[i + 1] - x[i];
    }


    for (let i = 0; i <= n; i++) {
        mu[i] = h[i - 1] / (h[i-1] + h[i]);
        lambda[i] = h[i] / (h[i - 1] + h[i]);
        d[i] = 6 * ((y[i + 1] - y[i]) / h[i] - (y[i] - y[i - 1]) / h[i - 1]) / (h[i - 1] + h[i]);
    }

    switch (boundary) {
        // 两端一阶导数已知
        case 'clamped':
            lambda[0] = 1;
            mu[n] = 1;
            d[0] = 6 * ((y[1] - y[0]) / h[0] - alpha) / h[0];
            d[n] = 6 * (beta - (y[n] - y[n - 1]) / h[n - 1]) / h[n - 1];
            size = n + 1;
            miuOffset = 1;
            lambdaOffset = 0;
            bdc = 1;
            break;
        // 两端二阶导数已知 
        case 'not-a-knot':
        // 两端二阶导数为0
        case 'natural':
            lambda[0] = 0;
            mu[n] = 0;
            d[0] = 2 * alpha;
            d[n] = 2 * beta;
            size = n + 1;
            miuOffset = 1;
            lambdaOffset = 0;
            bdc = 2;
            break;
        // 周期样条函数
        case 'periodic':
            lambda[n] = h[0] / (h[0] + h[n - 1]);
            mu[n] = 1 - lambda[n - 1];
            d[n] = 6 * ((y[1] - y[0]) / h[0] - (y[n] - y[n - 1]) / h[n - 1]) / (h[0] + h[n - 1]);
            size = n;
            miuOffset = 2;
            lambdaOffset = 1;
            bdc = 3;
        default:
            throw new Error('Invalid boundary condition');
    }
    console.log('mu\tlambda\td');
    
    for (let i = 0; i <= n; i++) {
        console.log(mu[i]?.toFixed(3) + '\t' +
            lambda[i]?.toFixed(3) + '\t' +
            d[i]?.toFixed(3));
    }
    console.log('-------------------');

    let mat = generateMatrix(size, new Array(size).fill(2),
                                   lambda.slice(lambdaOffset, -1),
                                   mu.slice(miuOffset));

    if (bdc === 3) {
        mat[0][size - 1] = mu[1];
        mat[size - 1][0] = lambda[n];
    }

    // console.log('Matrix:', mat);
    // console.log('d:', d.slice(lambdaOffset));
    
    // 原始结果
    const preAns = multiply(inv(matrix(mat)), d.slice(lambdaOffset));
    const m = new Array(size);
    for (let i = 0; i < size; i++) {
        m[i] = preAns._data[i];
    
    }
    console.log(m);
   
    return (t: number) => {
        let k = 0;
        while (k < n && t > x[k + 1]) {
            k++;
        }
        const hk = x[k + 1] - x[k];
        const ak = (x[k + 1] - t) / hk;
        const bk = (t - x[k]) / hk;
        return ak * y[k] + bk * y[k + 1] + ((ak ** 3 - ak) * hk ** 2 * m[k] + (bk ** 3 - bk) * hk ** 2 * m[k + 1]) / 6;
    };
}

const x = [27.7, 28 , 29 , 30];
const y = [4.1 , 4.3, 4.1, 3 ];
const boundaryCondition = 'clamped';
const alpha = 3.0;
const beta = -4;

const f = cubicSplineInterpolation(x, y, boundaryCondition, alpha, beta);

console.log(f(28).toFixed(3));
console.log(f(28.5).toFixed(3));
console.log(f(29).toFixed(3));
console.log(f(29.5).toFixed(3));
console.log(f(30).toFixed(3));
