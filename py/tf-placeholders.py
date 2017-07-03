import tensorflow as tf

# y = mx + b
# y = 2(22) + 222
# y = 44 + 222
# y = 266
x = tf.placeholder(tf.int64)
m = tf.placeholder(tf.int64)
b = tf.placeholder(tf.int64)

slope = tf.multiply(m, x)
intercept = tf.add(slope, b)

sess = tf.Session()
sess.run(tf.global_variables_initializer())
for i in range(0, 3):
    res = sess.run(intercept, feed_dict={b: 222 * i, x: 2 * i, m: 22 * i})
    print(res)
