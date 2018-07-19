// issue with Error: EPERM: operation not permitted, rename

let exp = require('express');
let app = exp();
let session = require('express-session');
let bodyPaser = require('body-parser');
let FileStore = require('session-file-store')(session); // way to save session information at File.

app.use(bodyPaser.urlencoded({ extended: false }));
app.use(session({
    secret: 'sessionKey',
    resave: false,
    saveUninitialized: true,
    store: new FileStore() // way to save session information at File.
}));

app.listen(3003, function () {
    console.log('Connnected 3003 port!!');
});

app.get('/count', function (req, res) {
    if (req.session.count) {
        req.session.count++;
    } else {
        req.session.count = 1;
    }
    res.send('count : ' + req.session.count);
});

app.get('/tmp', function (req, res) {
    res.send('result : ' + req.session.count);
});

app.get('/auth/login', function (req, res) {
    let output =
        `
        <h1>Login</h1>
        <form action="/auth/login" method="post">
            <p><input type="text" name="id" placeholder="username"></p>
            <p><input type="password" name="pw" placeholder="password"></p>
            <p><input type="submit"></p>
        </form>
        `;

    res.send(output);
});

var users = [{ id: 'user', pw: '1234', displayName: 'USER' }];

app.post('/auth/login', function (req, res) {
    let id = req.body.id;
    let pw = req.body.pw;
    for (let i = 0; i < users.length; i++) {
        let user = users[i];
        if (id === user.id && pw === user.pw) {
            req.session.displayName = user.displayName;
            return req.session.save(function () {
                res.redirect('/welcome');
            });
        }
    }
    res.send('Who are You?? <a href="/auth/login">Login</a>');
});

app.get('/welcome', function (req, res) {
    if (req.session.displayName) {
        res.send(`<h1>Hello, ${req.session.displayName}</h1><a href="/auth/logout">Logout</a>`);
    } else {
        res.send('<h1>Hello</h1><ul><li><a href="/auth/login">Login</a></li><li><a href="/auth/register">Register</a></li></ul>')
    }
});

app.get('/auth/logout', function (req, res) {
    if (req.session.displayName) {
        delete req.session.displayName;
        req.session.save(function () {
            res.redirect('/welcome');
        });
    }

});

app.get('/auth/register', function (req, res) {
    let output =
        `
        <h1>Register</h1>
        <form action="/auth/register" method="post">
            <p><input type="text" name="id" placeholder="username"></p>
            <p><input type="password" name="pw" placeholder="password"></p>
            <p><input type="text" name="pdn" placeholder="displayName"></p>
            <p><input type="submit"></p>
        </form>
        `;

    res.send(output);
});

app.post('/auth/register', function (req, res) {
    let user = {
        id: req.body.id,
        pw: req.body.pw,
        displayName: req.body.pdn
    }
    users.push(user);
    req.session.displayName = req.body.pdn;
    req.session.save(function () {
        res.redirect('/welcome');
    });
});