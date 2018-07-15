const exp = require('express');
const fs = require('fs');
const app = exp();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded
app.set('views', __dirname + '/views_file');
app.set('view engine', 'jade'); //  called jade engine
app.locals.pretty = true;   //  make pretty code

app.listen(3000, function () {
    console.log('Connected, 3000 port.');
});

app.get('/topic/new', function (req, res) {
    fs.readdir(__dirname + '/data', function (err, files) {
        if (err) {
            res.status(500).send('Internal Server Error');
        } else {
            res.render('new', {topics:files});
        }
    });
});

app.get(['/topic', '/topic/:filename'], function (req, res) {
    let fn = req.params.filename;
    fs.readdir(__dirname + '/data', function (err, files) {
        if (err) {
            res.status(500).send('Internal Server Error');
        } else {
            if (fn) {
                fs.readFile(__dirname + '/data/' + fn, 'utf-8', function (err, data) {
                    if (err) {
                        res.status(500).send('Internal Server Error');
                    } else {
                        res.render('view', { title: fn, topics: files, des: data });
                    }
                });
            } else {
                res.render('view', { topics: files, title: 'Welcome', des: 'Hello,Javascript for Server' });
            }
        }
    });
});

app.post('/topic', function (req, res) {
    let title = req.body.title;
    let des = req.body.description;
    fs.writeFile(__dirname + '/data/' + title, des, function (err) {
        err ? res.status(500).send('Internal Server Error') : res.redirect('/topic');
    });
});