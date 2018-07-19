var salt = '#&$&$#HDDHSdhfsedjsa';

var md5 = require('md5');
console.log(md5('1234' + salt));


var sha256 = require('sha256');
console.log(sha256('1234' + salt));


var pbkfds2 = require('pbkdf2-password');
var hasher = pbkfds2();

hasher({password:'111111'}, function(err, pass, salt, hash) {
    // console.log(err, pass, salt, hash);
});

// password 111111
var _salt = 'miNerrw3JEmTl8/vPEHBVaUPtuWWlch6uBtqJyTdWkd6/ScnUUcMlVP0A4ik2ohyln3bNf7NqXR3Ur+uiK+Ddw==';
var _hash = '+begs2QfSUyd6qvY3GAGbT543QKq00jFpUWxACRUb94WHCuHzbjC5gaC/oTyJB1633Gv28wIZzFkHkfdYogx25vo+IiAVvaRTnMSLC0p7oWKUPV9h2MP9tr/8Rltjos3QkNE1lX2ECBiz13O460aeruzaPfDDpZPx565V5fISa8=';

// check password
hasher({password:'111111', salt:'miNerrw3JEmTl8/vPEHBVaUPtuWWlch6uBtqJyTdWkd6/ScnUUcMlVP0A4ik2ohyln3bNf7NqXR3Ur+uiK+Ddw=='}, function(err, pass, salt, hash) {
    if(hash === _hash) {
        console.log('correct!');
    }
});

// make salt & hash
hasher({password:'111111'}, function(err, pass, salt, hash) {
    console.log('password : 111111');
    console.log('salt : ' + salt);
    console.log('hash : ' + hash);
});