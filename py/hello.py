from sklearn.linear_model import LinearRegression
import random

def genData(items, total = 10):
    data = {
        'feat': [],
        'labels': [],
    }
    for i in range(total):
        row = []
        total = 0
        for item, cost in items.items():
            rnd = random.randint(0, 100)
            total += rnd * cost
            row.append(rnd)
        data['feat'].append(row)
        data['labels'].append(round(total, 2))
    return data;

def sumCost(items, amounts):
    total = 0;
    prices = [];
    for k, v in items.items():
        prices.append(v)

    for i in range(len(prices)):
        total += prices[i] * amounts[i]
    return round(total, 2);

def genPrices(items):
    prices = {}
    for item in items:
        prices[item] = round(random.random() * 100, 2)

    return prices

prices = genPrices(['rice', 'bean', 'potato', 'egg', 'water', 'apple', 'banana', 'milk', 'coke', 'pepsi', 'chicken', 'beef', 'sausage', 'chips', 'kiwi', 'soup', 'pasta', 'pizza', 'salad'])
data = genData(prices, 100)
print(prices)
print(data['feat'][0])
print(data['labels'][0])

#features = [[140, 1], [130, 1], [150, 0], [170, 0]]
#labels = [0, 0, 1, 1]

clf = LinearRegression()
clf.fit(data['feat'], data['labels'])

pred = []
for i in range(len(prices)):
    pred.append(random.randint(0, 10))

print(clf.predict([pred]))
print(sumCost(prices, pred))
# print(round(prices['rice'] + prices['bean'] + prices['potato'] + prices['egg'] + prices['water'] + prices['apple'] + prices['banana'] + prices['milk'], 2))
