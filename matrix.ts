export function generateMatrix(n: number, a: number[], b: number[], c: number[]): number[][] {
  const matrix: number[][] = [];
  for (let i = 0; i < n; i++) {
    matrix[i] = [];
    for (let j = 0; j < n; j++) {
      if (i === j) {
        matrix[i][j] = a[i];
      } else if (j === i + 1) {
        matrix[i][j] = b[i];
      } else if (j === i - 1) {
        console.log('c[i - 1]:', c[i - 1]);
        
        matrix[i][j] = c[i - 1];
      } else {
        matrix[i][j] = 0;
      }
    }
  }
  return matrix;
}

// // 示例用法
// const n = 5;
// const a = [2, 3, 1, 4, 5];
// const b = [1, 2, 3, 4, 0];
// const c = [0, 7, 7, 7, 7];
// const matrix = generateMatrix(n, a, b, c);
// console.log('Matrix:', matrix);
