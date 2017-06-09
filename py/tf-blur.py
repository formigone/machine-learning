import scipy.misc
import tensorflow as tf

def render():
    path = 'img-02.jpg'
    # mat(4, 7, 3)
    img = scipy.misc.imread(path, mode='RGB')

    h, w, c = img.shape

    for y in range(0, h):
       for x in range(0, w):
           r, g, b = img[y][x]
           img[y][x] = [r, g, b]

    scipy.misc.toimage(img).show()

img = [
    [
        [255, 0, 0],
        [255, 255, 255],
        [255, 0, 0],
        [255, 255, 255],
        [255, 0, 0],
        [255, 255, 255],
        [255, 0, 0],
    ],
    [
        [255, 255, 255],
        [255, 0, 0],
        [255, 255, 255],
        [255, 0, 0],
        [255, 255, 255],
        [255, 0, 0],
        [255, 255, 255],
    ],
    [
        [255, 0, 0],
        [255, 255, 255],
        [255, 0, 0],
        [255, 255, 255],
        [255, 0, 0],
        [255, 255, 255],
        [255, 0, 0],
    ],
    [
        [255, 255, 255],
        [255, 0, 0],
        [255, 255, 255],
        [255, 0, 0],
        [255, 255, 255],
        [255, 0, 0],
        [255, 255, 255],
    ],
]

filter = [
    [1/16, 1/8, 1/16],
    [1/8,  1/4, 1/8],
    [1/16, 1/8, 1/16],
]

img = scipy.misc.toimage(img)
scipy.misc.imsave('img-01.png', img)
# tf_img = tf.image.decode_image())
# kernel = tf.constant([img], shape=[1, 4, 7, 3])
# with tf.Session() as sess:
#     res = kernel.eval()
#     print(res)
    # scipy.misc.toimage(img).show()
