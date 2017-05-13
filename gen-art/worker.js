self.importScripts('Pixel.js');

var target = [];
var population = [];
var generation = 0;

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
        pixels: takeSome(data.pixels, data.img, data.width, data.imgWidth, data.population || 1),
      });
      run();
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

function run() {
  console.log('Generation', generation);
  target.forEach((pixel, i) => {
    if (generation === 0) {
    console.log('cycle', { pixel, i, pop: population[0] });
    generation++;
    }
    population.forEach(pop => {
    });
  });
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

function genGene() {
  return {
    r: Math.random() * 255 | 0,
    g: Math.random() * 255 | 0,
    b: Math.random() * 255 | 0,
  };
}

function takeSome(pixels, img, width, imgWidth, populationSize) {
  const kernel = Math.floor(imgWidth / width);
  let current = 0;

  for (let i = 0; i < populationSize; i++) {
    population.push({ fitness: 0, pixels: [] });
  }

  PixelList.takeRows(img, imgWidth * 4, (row, y) => {
    if (y % kernel === 0) {
      for (let i = 0, len = row.length; i < len; i += 1) {
        if (i % kernel === 0) {
          if (pixels[current]) {
            const rgb = [row[i][0], row[i][1], row[i][2]];
            target.push(rgb);
            population.forEach(pop => {
              pop.pixels.push(genGene());
            });

            pixels[current++].next = `rgb(${population[0].r}, ${population[0].g}, ${population[0].b})`;
          }
        }
      }
    }
  });

  return pixels;
}
