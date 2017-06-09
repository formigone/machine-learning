class Vec2:
    x = 0
    y = 0

    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __str__(self):
        return 'Vec2: [%s, %s]' % (self.x, self.y)

    def __add__(self, other):
        return Vec2(self.x + other.x, self.y + other.y)

v1 = Vec2(2, 3)
v2 = Vec2(4, 5)
v3 = v1 + v2

print(v1)
print(v3)
