import tensorflow as tf
import scipy.misc

img = tf.image.decode_jpeg('./img-03.jpg', channels=3)
# res_img = tf.image.resize_images(img, [32, 32])

with tf.Session() as sess:
    # tf.global_variables_initializer()
   print('running res_img')
   res = scipy.misc.toimage(sess.run(img.eval()))
   scipy.misc.imsave('img-04.jpg', res)
