function onMessage(event) {
  var data = event.data;
  var action = data.action || '';
  switch (action) {
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
