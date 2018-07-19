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
const FacebookStrategy = require('passport-facebook').Strategy;
const KakaoStrategy = require('passport-kakao').Strategy;
const NaverStrategy = require('passport-naver').Strategy;   // naver dosn't support localhost domain with port
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const MysqlStore = require('express-mysql-session')(session); // way to save session information at Mysql DB.
const mysql = require('mysql');
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'o2'
});
conn.connect();

app.use(bodyPaser.urlencoded({ extended: false }));
app.use(session({
    secret: 'sessionKey',
    resave: false,
    saveUninitialized: true,
    store: new MysqlStore({
        host: 'localhost',
        port: '3306',
        user: 'root',
        password: '123456',
        database: 'o2'
    })
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
        <a href="/auth/facebook">facebook</a>
        <a href="/auth/kakao">kakao</a>
        <a href="/auth/google">google</a>
        <a href="/auth/naver">naver</a>
        `;

    res.send(output);
});

passport.serializeUser(function (user, done) {
    done(null, user.authId);
});

passport.deserializeUser(function (id, done) {
    let sql = 'SELECT * FROM users WHERE authId=?';
    conn.query(sql, [id], function (err, results) {
        if (err) {
            done('There is no users.');
        } else {
            done(null, results[0])
        }
    });
});

passport.use(new LocalStrategy(
    function (username, password, done) {
        let _username = username;
        let _password = password;
        let sql = 'SELECT * FROM users WHERE authId=?';
        conn.query(sql, ['local:' + _username], function (err, results) {
            if (err) {
                return done('There is no user.');
            }
            let user = results[0];
            if (sha256(_password + salt) === user.password) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        });
    }
));

passport.use(new FacebookStrategy({
    clientID: '231583090818472',
    clientSecret: '5d36d116746f88f34fd299a7f6204e70',
    callbackURL: "/auth/facebook/callback",
    profileFields: ['email', 'displayName']
},
    function (accessToken, refreshToken, profile, done) {
        let authId = 'facebook:' + profile.id;
        let _user = {
            'authId': authId,
            'username': 'facebook',
            'displayName': profile.displayName,
            'email': profile.emails[0].value
        }
        let sql = 'SELECT * FROM users WHERE authId=?';
        conn.query(sql, [authId], function (err, results) {
            if (err) {
                console.log(err);
                done('Error');
            } else {
                if (results.length > 0) {
                    done(null, results[0]);
                } else {
                    let sql = 'INSERT INTO users SET ?';
                    conn.query(sql, _user, function (err, results) {
                        if (err) {
                            console.log(err);
                            done('Error');
                        } else {
                            done(null, _user);
                        }
                    });
                }
            }
        });
    }
));

passport.use(new KakaoStrategy({
    clientID: '25dc8bd77b34271ca3e7fa16ee9cd62d',
    clientSecret: 'CguF0ZgYqX2837dH1pgPG92SEFZ1S35W',
    callbackURL: '/oauth',
},
    function (accessToken, refreshToken, profile, done) {
        let authId = 'kakao:' + profile.id;
        let _user = {
            'authId': authId,
            'username': 'kakao',
            'displayName': profile.displayName,
            // 'email': profile.emails[0].value
        }
        let sql = 'SELECT * FROM users WHERE authId=?';
        conn.query(sql, [authId], function (err, results) {
            if (err) {
                console.log(err);
                done('Error');
            } else {
                if (results.length > 0) {
                    done(null, results[0]);
                } else {
                    let sql = 'INSERT INTO users SET ?';
                    conn.query(sql, _user, function (err, results) {
                        if (err) {
                            console.log(err);
                            done('Error');
                        } else {
                            done(null, _user);
                        }
                    });
                }
            }
        });
    }
));

passport.use(new GoogleStrategy({
    clientID: '920010754589-5aoafe14irljknnqm2mr76se6oloh0o4.apps.googleusercontent.com',
    clientSecret: '-EPss8PPZpPgTkS859QymTfR',
    callbackURL: "/auth/google/callback"
},
    function (token, tokenSecret, profile, done) {
        let authId = 'google:' + profile.id;
        let _user = {
            'authId': authId,
            'username': 'google',
            'displayName': profile.displayName,
            'email': profile.emails[0].value
        }
        let sql = 'SELECT * FROM users WHERE authId=?';
        conn.query(sql, [authId], function (err, results) {
            if (err) {
                console.log(err);
                done('Error');
            } else {
                if (results.length > 0) {
                    done(null, results[0]);
                } else {
                    let sql = 'INSERT INTO users SET ?';
                    conn.query(sql, _user, function (err, results) {
                        if (err) {
                            console.log(err);
                            done('Error');
                        } else {
                            done(null, _user);
                        }
                    });
                }
            }
        });
    }
));

passport.use(new NaverStrategy({
    clientID: 'toBlK4k29T6jdxRz_80c',
    clientSecret: 'GHQRf1rZOT',
    callbackURL: "/auth/facebook/callback"
},
    function (accessToken, refreshToken, profile, done) {
        let authId = 'naver:' + profile.id;
        conosle.log(profile);
        for (let i = 0; i < users.length; i++) {
            let user = users[i];
            if (user.authId === authId) {
                return done(null, user);
            }
        }
        let _user = {
            'authId': authId,
            'displayName': profile.displayName,
            'email': profile.emails[0].value
        }
        users.push(_user);
        return done(null, _user);
    }
));

app.post('/auth/login',
    passport.authenticate('local', {
        successRedirect: '/welcome',
        failureRedirect: '/auth/login',
        failureFlash: false
    })
);

app.get('/auth/facebook',
    passport.authenticate('facebook', { scope: 'email' })
);

app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/auth/login' }),
    (req, res) => {
        req.session.save(() => {
            res.redirect('/welcome');
        })
    });

app.get('/auth/kakao',
    passport.authenticate('kakao')
);

app.get('/oauth',   //  kakako
    passport.authenticate('kakao', { failureRedirect: '/auth/login' }),
    (req, res) => {
        req.session.save(() => {
            res.redirect('/welcome');
        })
    });

app.get('/auth/google',
    passport.authenticate('google', { scope: 'email' })
);

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/auth/login' }),
    (req, res) => {
        req.session.save(() => {
            res.redirect('/welcome');
        })
    });

app.get('/auth/naver',
    passport.authenticate('naver'));

app.get('/auth/naver/callback',
    passport.authenticate('naver', { failureRedirect: '/auth/login' }),
    (req, res) => {
        req.session.save(() => {
            res.redirect('/welcome');
        })
    });

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
        authId: 'local:' + req.body.username,
        username: req.body.username,
        password: sha256(req.body.password + salt),
        salt: salt,
        displayName: req.body.pdn
    }

    let sql = 'INSERT INTO users SET ?';
    conn.query(sql, user, function (err, results) {
        if (err) {
            console.log(err);
            res.status(500);
        } else {
            req.login(user, function (err) {
                req.session.save(function () {
                    res.redirect('/welcome');
                });
            });
        }
    });
});