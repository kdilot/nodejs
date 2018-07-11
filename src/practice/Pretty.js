function hello(name) {
    console.log('Hi,' + name);
}

hello('Tom');

/*
    uglifyjs
    
    $ uglifyjs pretty.js
    function hello(name){console.log("Hi,"+name)}hello("Tom");

    $ uglifyjs pretty.js -m
    function hello(o){console.log("Hi,"+o)}hello("Tom");

    $ uglifyjs pretty.js -o uglify.min.js -m
    make a new file name uglify.min.js with ugliy code
*/