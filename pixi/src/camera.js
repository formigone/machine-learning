export function scrollWrapRow(container, scrollBy = 1, speed = 1, dir = -1) {
  container.children.forEach(sprite => {
    sprite.x += scrollBy * speed * dir;
    if (sprite.x < -sprite.width) {
      sprite.x = container.children.length * sprite.width - sprite.width - 2;
    }
  });
}

export function scrollWrapContainer(container, scrollBy = 1, rendererWidth = 100, speed = 1, dir = -1) {
  container.x += scrollBy * speed * dir;
  if (container.x < -container.width) {
    container.x = rendererWidth;
  }
}
