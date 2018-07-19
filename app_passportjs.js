// issue with Error: EPERM: operation not permitted, rename

const exp = require('express');
const app = exp();
const session = require('express-session');
const bodyPaser = require('body-parser');
const FileStore = require('session-file-store')(session); // way to save session information at File.
const sha256 = require('sha256');
const salt = '#&$&$#HDDHSdhfsedjsa';
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;

app.use(bodyPaser.urlencoded({ extended: false }));
app.use(session({
    secret: 'sessionKey',
    resave: false,
    saveUninitialized: true,
    // store: new FileStore() // way to save session information at File.
}));
app.use(passport.initialize());
app.use(passport.session()); // have to use after session code

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
            <p><input type="text" name="username" placeholder="username"></p>
            <p><input type="password" name="password" placeholder="password"></p>
            <p><input type="submit"></p>
        </form>
        `;

    res.send(output);
});

var users = [{ username: 'user', password: sha256('1234' + salt), displayName: 'USER' }];

passport.serializeUser(function (user, done) {
    done(null, user.username);
});

passport.deserializeUser(function (id, done) {
    for (let i = 0; i < users.length; i++) {
        let user = users[i];
        if (id === user.username) {
            return done(null, user);
        }
    }
});

passport.use(new LocalStrategy(
    function (username, password, done) {
        let _username = username;
        let _password = password;
        for (let i = 0; i < users.length; i++) {
            let user = users[i];
            if (_username === user.username && sha256(_password + salt) === user.password) {
                return done(null, user);
            }
        }
        return done(null, false);
        // done(null, false, { message: 'Who are You?? <a href="/auth/login">Login</a>' });
    }
));
app.post('/auth/login',
    passport.authenticate('local', {
        successRedirect: '/welcome',
        failureRedirect: '/auth/login',
        failureFlash: false
    })
);

app.get('/welcome', function (req, res) {
    if (req.user && req.user.displayName) {
        res.send(`<h1>Hello, ${req.user.displayName}</h1><a href="/auth/logout">Logout</a>`);
    } else {
        res.send('<h1>Hello</h1><ul><li><a href="/auth/login">Login</a></li><li><a href="/auth/register">Register</a></li></ul>')
    }
});


app.get('/auth/logout', function (req, res) {
    req.logout();
    req.session.save(function () {
        res.redirect('/welcome');
    });
});

app.get('/auth/register', function (req, res) {
    let output =
        `
        <h1>Register</h1>
        <form action="/auth/register" method="post">
            <p><input type="text" name="username" placeholder="username"></p>
            <p><input type="password" name="password" placeholder="password"></p>
            <p><input type="text" name="pdn" placeholder="displayName"></p>
            <p><input type="submit"></p>
        </form>
        `;

    res.send(output);
});

app.post('/auth/register', function (req, res) {
    let user = {
        username: req.body.username,
        password: sha256(req.body.password + salt),
        displayName: req.body.pdn
    }
    users.push(user);
    req.login(user, function (err) {
        req.session.save(function () {
            res.redirect('/welcome');
        });
    });
});