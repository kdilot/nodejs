var fs = require('fs');

// Sync
console.log(1);
var data = fs.readFileSync('SyncData.txt', {encoding:'utf8'});
console.log(data);

// Async
console.log(2);
fs.readFile('SyncData.txt', {encoding:'utf8'}, function(err, data) {
    console.log(3);
    console.log(data);
});

console.log(4);
// console 1 > 2 > 4 > 3