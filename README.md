# cubic spline interpolation

## 介绍
使用TS编写的三次样条插值算法

## 使用
程序中已经实现了一个例子，可以直接运行查看结果
```bash
npm i
node cubicSpline.js
```



如果需要使用自己的数据，可以修改`cubicSpline.ts`。其中`x`和`y`为数组，`boundaryCondition`为边界条件，`alpha`和`beta`为边界条件的值。
```typescript
const x = [27.7, 28, 29, 30];
const y = [4.1, 4.3, 4.1, 3];
const boundaryCondition = 'clamped';
const alpha = 3.0;
const beta = -4;
```
修改后，使用以下命令再次运行：
```bash
npm i
tsc 
node cubicSplins.js
```
