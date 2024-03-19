"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mathjs_1 = require("mathjs");
var matrix_1 = require("./matrix");
console.log('hello CubicSplineInterpolation');
function cubicSplineInterpolation(x, y, boundary, alpha, beta) {
    var _a, _b, _c;
    var mu = new Array(x.length);
    var lambda = new Array(x.length);
    var n = x.length - 1;
    var h = new Array(n);
    var d = new Array(n + 1);
    var size = 0;
    var lambdaOffset = 0;
    var miuOffset = 0;
    for (var i = 0; i < n; i++) {
        h[i] = x[i + 1] - x[i];
    }
    for (var i = 0; i <= n; i++) {
        mu[i] = h[i - 1] / (h[i - 1] + h[i]);
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
            break;
        // 周期样条函数
        case 'periodic':
            lambda[n] = h[0] / (h[0] + h[n - 1]);
            mu[n] = 1 - lambda[n - 1];
            d[n] = 6 * ((y[1] - y[0]) / h[0] - (y[n] - y[n - 1]) / h[n - 1]) / (h[0] + h[n - 1]);
            size = n;
            miuOffset = 2;
            lambdaOffset = 1;
        default:
            throw new Error('Invalid boundary condition');
    }
    console.log('mu\tlambda\td');
    for (var i = 0; i <= n; i++) {
        console.log(((_a = mu[i]) === null || _a === void 0 ? void 0 : _a.toFixed(3)) + '\t' +
            ((_b = lambda[i]) === null || _b === void 0 ? void 0 : _b.toFixed(3)) + '\t' +
            ((_c = d[i]) === null || _c === void 0 ? void 0 : _c.toFixed(3)));
    }
    console.log('-------------------');
    var mat = (0, matrix_1.generateMatrix)(size, new Array(size).fill(2), lambda.slice(lambdaOffset, -1), mu.slice(miuOffset));
    // if (boundary === 'periodic') {
    //     mat[0][size - 1] = mu[1];
    //     mat[size - 1][0] = lambda[n];
    // }
    // console.log('Matrix:', mat);
    // console.log('d:', d.slice(lambdaOffset));
    // 原始结果
    var preAns = (0, mathjs_1.multiply)((0, mathjs_1.inv)((0, mathjs_1.matrix)(mat)), d.slice(lambdaOffset));
    var m = new Array(size);
    for (var i = 0; i < size; i++) {
        m[i] = preAns._data[i];
    }
    console.log(m);
    return function (t) {
        var k = 0;
        while (k < n && t > x[k + 1]) {
            k++;
        }
        var hk = x[k + 1] - x[k];
        var ak = (x[k + 1] - t) / hk;
        var bk = (t - x[k]) / hk;
        return ak * y[k] + bk * y[k + 1] + ((Math.pow(ak, 3) - ak) * Math.pow(hk, 2) * m[k] + (Math.pow(bk, 3) - bk) * Math.pow(hk, 2) * m[k + 1]) / 6;
    };
}
var x = [27.7, 28, 29, 30];
var y = [4.1, 4.3, 4.1, 3];
var boundaryCondition = 'clamped';
var alpha = 3.0;
var beta = -4;
var f = cubicSplineInterpolation(x, y, boundaryCondition, alpha, beta);
console.log(f(28).toFixed(3));
console.log(f(28.5).toFixed(3));
console.log(f(29).toFixed(3));
console.log(f(29.5).toFixed(3));
console.log(f(30).toFixed(3));
