var _ = require('underscore');
var arr = [3, 6, 9, 1, 12];

console.log(arr[0]);                //  3
console.log(_.first(arr));          //  3 underscore

console.log(arr[arr.length - 1]);   //  12
console.log(_.last(arr));           //  12 underscore

