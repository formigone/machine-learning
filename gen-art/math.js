const grid = [];
const WIDTH = 20 * 4;
const HEIGHT = 10;

for (let y = 0; y < HEIGHT; y++) {
  for (let x = 0; x < WIDTH; x++) {
    grid.push(`R=${x},${y}`);
    grid.push(`G=${x},${y}`);
    grid.push(`B=${x},${y}`);
    grid.push(`A=${x},${y}`);
  }
}
//
// let row = [];
// grid.forEach((val, i) => {
//   const x = i % WIDTH;
//   const y = Math.floor(i / WIDTH);
//
//   if (y > 0 && x % WIDTH === 0) {
//     console.log(row);
//     row = [val];
//   } else {
//     row.push(val);
//   }
// });
//
// console.log('---');
//
// row = [];
// grid.forEach((val, i) => {
//   const x = i % WIDTH;
//   const y = Math.floor(i / WIDTH);
//   if (y === 0 || y % 3 === 0) {
//     if (y > 0 && x % WIDTH === 0) {
//       console.log(row);
//       row = [];
//       row.push(val);
//     } else {
//       if (x % 2 === 0) {
//         row.push(val);
//       }
//     }
//   }
//
//   if (i === grid.length - 1) {
//     console.log(row);
//   }
// });

var PixelList = {
  takeRows: function(grid, width, cb) {
    for (var row = [], x, y, r, g, b, i = 0, len = grid.length; i < len; i += 4) {
      x = i % width;
      y = Math.floor(i / width);
      r = grid[i];
      g = grid[i + 1];
      b = grid[i + 2];

      if (y > 0 && x % width === 0) {
        cb(row, y - 1);
        row = [{ r, b, g, y, x }];
      } else {
        row.push({ r, b, g, y, x });
      }
    }

    cb(row, y);
  },
};

PixelList.takeRows(grid, WIDTH, (row, y) => {
  if (y % 3 === 0) {
    console.log(row.map(row => Math.floor(row.x / 4)));
  }
});