import Queue from 'tinyqueue';

export default function knn(tree, x, y, z, n, predicate, maxDistance) {
    var node = tree.data,
        result = [],
        i, child, dist, candidate;

    var queue = new Queue(undefined, compareDist);

    while (node) {
        for (i = 0; i < node.children.length; i++) {
            child = node.children[i];
            dist = boxDist(x, y, z, node.children[i]);
            // console.log(dist);
            if (!maxDistance || dist <= maxDistance) {
                queue.push({
                    node: child,
                    isItem: node.leaf,
                    dist: dist
                });
            }
        }

        while (queue.length && queue.peek().isItem) {
            candidate = queue.pop().node;
            if (!predicate || predicate(candidate))
                result.push(candidate);
            if (n && result.length === n) return result;
        }

        node = queue.pop();
        if (node) node = node.node;
    }

    return result;
}

function compareDist(a, b) {
    return a.dist - b.dist;
}

function boxDist(x, y, z, box) {
    var dx = axisDist(x, box.minX, box.maxX),
        dy = axisDist(y, box.minY, box.maxY),
        dz = axisDist(z, box.minZ, box.maxZ);
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

function axisDist(k, min, max) {
    return k < min ? min - k : k <= max ? 0 : k - max;
}
