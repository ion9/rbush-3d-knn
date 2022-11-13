import {RBush3D} from 'rbush-3d';
import test from 'tape';

import knn from './index';

/*eslint comma-spacing: 0 */

function arrToBox(arr) {
    return {
        minX: arr[0],
        minY: arr[1],
        minZ: arr[2],
        maxX: arr[3],
        maxY: arr[4],
        maxZ: arr[5]
    };
}

var data = [[87,55,87,87,55,87,],[38,13,39,38,13,39],[7,47,8,7,47,8],[89,9,91,89,9,91],[4,58,5,4,58,5],[0,11,1,0,11,1],[0,5,0,0,5,0],[69,78,73,69,78,73],
    [56,77,57,56,77,57],[23,7,24,23,7,24],[68,24,70,68,24,70],[31,47,33,31,47,33],[11,13,14,11,13,14],[1,80,1,1,80,1],[72,90,72,72,90,72],[59,79,61,59,79,61]].map(arrToBox);

test('finds n neighbours', function (t) {
    var tree = new RBush3D().load(data);
    var result = knn(tree, 40, 40, 40, 1);
    t.same(result,[[31,47,33,31,47,33]].map(arrToBox));
    t.end();
});

test('does not throw if requesting too many items', function (t) {
    var tree = new RBush3D().load(data);
    t.doesNotThrow(function () {
        var result = knn(tree, 40, 40, 40, 1000);
        t.equal(result.length, data.length);
    });
    t.end();
});

test('finds all neighbors for maxDistance', function (t) {
    var tree = new RBush3D().load(data);
    var result = knn(tree, 40, 40, 40, 0);
    t.same(result, [[31,47,33,31,47,33],
        [38,13,39,38,13,39],
        [23,7,24,23,7,24],
        [56,77,57,56,77,57],
        [68,24,70,68,24,70],
        [7,47,8,7,47,8],
        [11,13,14,11,13,14],
        [59,79,61,59,79,61],
        [4,58,5,4,58,5],
        [69,78,73,69,78,73],
        [0,11,1,0,11,1],
        [0,5,0,0,5,0],
        [72,90,72,72,90,72],
        [1,80,1,1,80,1],
        [87,55,87,87,55,87],
        [89,9,91,89,9,91]].map(arrToBox));
    t.end();
});

test('finds n neighbors for maxDistance', function (t) {
    var tree = new RBush3D().load(data);
    var result = knn(tree, 40, 40, 40, 3, null, 15);
    t.same(result, [[31,47,33,31,47,33]].map(arrToBox));
    t.end();
});

test('does not throw if requesting too many items for maxDistance', function (t) {
    var tree = new RBush3D().load(data);
    t.doesNotThrow(function () {
        var result = knn(tree, 40, 40, 40, 1000, null, 15);
        t.same(result, [[31,47,33,31,47,33]].map(arrToBox));
    });
    t.end();
});

var pythData = [[0,0,0,0,0,0],[9,9,9,9,9,9],[12,12,12,12,12,12],[16,16,16,16,16,16]].map(arrToBox);

test('verify maxDistance excludes items too far away, in order to adhere to pythagoras theorem sqrt(a^2+b^2+c^2)', function (t) {
    var tree = new RBush3D().load(pythData);
    // sqrt(9^2+9^2+9^2)~=15.58845727
    var result = knn(tree, 0, 0, 0, 4, null, 16);
    // console.log(result);
    t.same(result, [[0,0,0,0,0,0,0],
        [9,9,9,9,9,9,9]].map(arrToBox));
    t.end();
});

test('verify maxDistance includes all items within range, in order to adhere to pythagoras theorem sqrt(a^2+b^2+c^2)', function (t) {
    var tree = new RBush3D().load(pythData);
    // sqrt(9^2+9^2+9^2)~=15.58845727
    var result = knn(tree, 0, 0, 0, 4, null, 100);
    // console.log(result);
    t.same(result, [[0,0,0,0,0,0,0],
        [9,9,9,9,9,9,9],
        [12,12,12,12,12,12,12],
        [16,16,16,16,16,16,16]].map(arrToBox));
    t.end();
});

var richData = [[1,2,1,1,2,1],[3,3,3,3,3,3],[5,5,5,5,5,5],[4,2,4,4,2,4],[2,4,2,2,4,2],[5,3,5,5,3,5]].map(function (a, i) {
    var item = arrToBox(a);
    item.version = i + 1;
    return item;
});

test('find n neighbours that do satisfy a given predicate', function (t) {
    var tree = new RBush3D().load(richData);
    var result = knn(tree, 2, 4, 3, 0, function (item) {
        return item.version < 5;
    });
    // console.log(result);
    if (result.length === 4) {
        var item = result[0];
        // console.log(item);
        if (item.minX === 3 && item.minY === 3 && item.minZ === 3 && item.maxX === 3 && item.maxY === 3 && item.maxZ === 3 && item.version === 2) {
            t.pass('Found the correct item');
        } else {
            console.warn(item);
            t.fail('Could not find the correct item');
        }
    } else {
        t.fail('Could not find the correct item');
    }
    t.end();
});
