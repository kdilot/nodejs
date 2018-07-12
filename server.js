
const express = require('express');
const app = express();
const path = require('path');

// __dirname is current directory
// app.use(express.static(path.join(__dirname)));
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/login', (req, res) => res.send('Login Page'));

app.get('/route', function (req, res) {
    //  http://localhost:3000/route
    res.send('Hello Router, <img src="/img.jpg">');
});

app.get('/dynamic', function (req, res) {
    //  http://localhost:3000/dynamic
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
//  http://localhost:3000/templete
app.locals.pretty = true;   // shows pretty code
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.get('/templete', function (req, res) {
    res.render('temp', { time: Date(), _title: 'pug' });
});

//  GET
app.get('/topic', function (req, res) {
    //  http://localhost:3000/topic?id=0
    let topics = [
        'Javascript ...',
        'Nodejs ...',
        'Express ...'
    ];
    let output = `
        <a href="/topic?id=0">JavaScript</a><br>
        <a href="/topic?id=1">Nodejs</a><br>
        <a href="/topic?id=2">Express</a><br><br>
        ${topics[req.query.id]}
    `
    res.send(output);
});

// GET Semantic
app.get('/topic-semantic/:id/:mode', function (req, res) {
    //  http://localhost:3000/topic-semantic/0/new
    let topics = [
        'Semantic Javascript ...',
        'Semantic Nodejs ...',
        'Semantic Express ...'
    ];
    let output = `
        <a href="/topic?id=0">JavaScript</a><br>
        <a href="/topic?id=1">Nodejs</a><br>
        <a href="/topic?id=2">Express</a><br><br>
        ${topics[req.params.id]}
        ${req.params.mode}
    `
    res.send(output);
});
app.get('/form', function (req, res) {
    res.render('form');
});
app.get('/form_receiver', function (req, res) {
    let title = req.query.title;
    let des = req.query.description;
    res.send(title + ',' + des);
});

// POST
const bodyParser = require('body-parser');
// app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded
app.post('/form_receiver', function (req, res) {
    //  http://localhost:3000/form_receiver
    let title = req.body.title;
    let des = req.body.description;
    res.send(title + ',' + des);
})


app.listen(3000, () => {
    console.log('Example app listening on port 3000');
});
