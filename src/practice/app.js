
const express = require('express');
const app = express();
const path = require('path');

// __dirname is current directory
// app.use(express.static(path.join(__dirname)));
app.use(express.static('../../public'));

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/login', (req, res) => res.send('Login Page'));

app.get('/route', function (req, res) {
    res.send('Hello Router, <img src="/img.jpg">')
});

app.get('/dynamic', function (req, res) {
    var time = Date();
    var output = `<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Document</title>
    </head>
    <body>
        Hello dynamic
        ${time}
    </body>
    </html>`;
    res.send(output);
});

//  Pug(Jade)
app.locals.pretty = true;
app.set('view engine', 'pug');
app.set('views', '../../views');
app.get('/templete', function (req, res) {
    res.render('temp', {time:Date(), _title:'pug'});
});

app.listen(3000, () => {
    console.log('Example app listening on port 3000');
});
