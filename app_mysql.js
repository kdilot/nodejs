const exp = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = exp();
const mysql = require('mysql');

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'o2'
});
con.connect();

app.use(bodyParser.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded
app.set('views', __dirname + '/views_mysql');
app.set('view engine', 'pug'); //  called pug engine
app.locals.pretty = true;   //  make pretty code
app.use('/user', exp.static('uploads'));    // user are able to access to uploaded file

app.listen(3000, function () {
    console.log('Connected, 3000 port.');
});

app.get('/topic/add', function (req, res) {
    let sql = 'SELECT id,title FROM topic';
    con.query(sql, function (err, rows, fields) {
        if (err) res.status(500).send('Internal Server Error');
        else res.render('add', { topics: rows });
    });
});

app.post('/topic/add', function (req, res) {
    let title = req.body.title;
    let des = req.body.description;
    let auth = req.body.author;
    let sql = 'INSERT INTO topic (title, description, author) VALUES (?, ?, ?)';
    con.query(sql, [title, des, auth], function (err, result, fields) {
        if (err) res.status(500).send('Internal Server Error');
        else {
            res.redirect('/topic/' + result.insertId);
        }
    });
});

app.get('/topic/:id/edit', function (req, res) {
    let sql = 'SELECT id,title FROM topic';
    con.query(sql, function (err, rows, fields) {
        let id = req.params.id;
        if (id) {
            let sql = 'SELECT * FROM topic WHERE id=?';
            con.query(sql, [id], function (err, topic, fields) {
                if (err) res.status(500).send('Internal Server Error');
                else res.render('edit', { topics: rows, topic: topic[0] });
            });
        } else {
            res.status(500).send('Internal Server Error');
        }
    });
});

app.post('/topic/:id/edit', function (req, res) {
    let title = req.body.title;
    let des = req.body.description;
    let auth = req.body.author;
    let id = req.params.id;
    let sql = 'UPDATE topic SET title=?, description=?, author=? WHERE id=?';
    con.query(sql, [title, des, auth, id], function (err, result, fields) {
        if (err) res.status(500).send('Internal Server Error');
        else {
            res.redirect('/topic/' + id);
        }
    });
});

app.get('/topic/:id/delete', function (req, res) {
    let id = req.params.id;
    let sql = 'SELECT id, title FROM topic';
    con.query(sql, function (err, topics, fields) {
        let sql = 'SELECT * FROM topic WHERE id=?';
        con.query(sql, [id], function (err, topic, fields) {
            if (err) {
                res.status(500).send('Internal Server Error');
            } else {
                if (topic.length === 0) {
                    res.status(500).send('Internal Server Error');
                } else {
                    res.render('delete', { topics: topics, topic: topic[0] });
                }
            }
        });
    });
});

app.post('/topic/:id/delete', function (req, res) {
    let id = req.params.id;
    let sql = 'DELETE FROM topic WHERE id=?';
    con.query(sql, [id], function (err, result, fields) {
        if (err) res.status(500).send('Internal Server Error');
        else {
            res.redirect('/topic');
        }
    });
});

app.get(['/topic', '/topic/:id'], function (req, res) {
    let sql = 'SELECT id,title FROM topic';
    con.query(sql, function (err, rows, fields) {
        let id = req.params.id;
        if (id) {
            let sql = 'SELECT * FROM topic WHERE id=?';
            con.query(sql, [id], function (err, topic, fields) {
                if (err) res.status(500).send('Internal Server Error');
                else res.render('view', { topics: rows, topic: topic[0] });
            });
        } else {
            res.render('view', { topics: rows });
        }
    });
});

