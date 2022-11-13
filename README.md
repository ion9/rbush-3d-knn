## rbush-3d-knn 

_k_-nearest neighbors search for [RBush-3D](https://github.com/Eronana/rbush-3d).
Implements a simple depth-first kNN search algorithm using a priority queue.

```js
var RBush = require('rbush-3d');
var knn = require('rbush-knn');

var tree = new RBush(); // create RBush tree
tree.load(data); // bulk insert
var neighbors = knn(tree, 40, 40, 40, 10); // return 10 nearest items around point [40, 40, 40]
```

You can optionally pass a filter function to find k neighbors that satisfy a certain condition:

```js
var neighbors = knn(tree, 40, 40, 40, 10, function (item) {
    return item.foo === 'bar';
});
```

### API

**knn(tree, x, y, z, [k, filterFn, maxDistance])**

- `tree`: an RBush tree
- `x`, `y`, `z`: query coordinates
- `k`: number of neighbors to search for (`Infinity` by default)
- `filterFn`: optional filter function; `k` nearest items where `filterFn(item) === true` will be returned.
- `maxDistance` (optional): maximum distance between neighbors and the query coordinates (`Infinity` by default)

### Changelog



##### 0.0.1 (Nov 12, 2020)

- Rework rbush-knn to work with rbush-3d
