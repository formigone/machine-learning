self.importScripts('Pixel.js');

function onMessage(event) {
  var data = event.data;
  var action = data.action || '';
  switch (action) {
    case 'random':
      postMessage({
        action: 'update',
        pixels: genRandomPixels(data.width, data.height),
      });
      break;
    case 'takeSome':
      postMessage({
        action: 'update',
        pixels: takeSome(data.pixels, data.img, data.width, data.imgWidth),
      });
      break;

    case 'bounce':
      postMessage({ action: 'render', width: data.width, pixels: data.pixels });
      break;
    case 'error':
      console.error(data.message, data);
      break;
    default:
      postMessage({ action: 'error', message: 'Action not implemented', data: event.data });
  }
}

self.addEventListener('message', onMessage);

function genRandomPixels(width, height) {
  const pixels = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const vel = Math.max(Math.random(), 0.25);
      pixels.push({
        rgb: [0, 0, 0],
        pos: {
          x: x,
          y: y,
        },
        vel: {
          x: vel,
          y: vel,
        },
        color: `#${Number(Math.random() * 0xffffff | 0).toString(16)}`,
      });
    }
  }

  return pixels;
}

function takeSome(pixels, img, width, imgWidth) {
  const kernel = Math.floor(imgWidth / width);
  let current = 0;

  PixelList.takeRows(img, imgWidth * 4, (row, y) => {
    if (y % kernel === 0) {
      for (let i = 0, len = row.length; i < len; i += 1) {
        if (i % kernel === 0) {
          if (pixels[current]) {
            const rgb = [row[i][0], row[i][1], row[i][2]];
            pixels.rgb = rgb;
            pixels[current++].next = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
          }
        }
      }
    }
  });

  return pixels;
}
