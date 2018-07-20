module.exports = function (passport) {
    var route = require('express').Router();

    route.get('/login', function (req, res) {
        res.render('auth/login');
    });

    route.post('/login',
        passport.authenticate('local', {
            successRedirect: '/welcome',
            failureRedirect: '/auth/login',
            failureFlash: false
        })
    );

    route.get('/facebook',
        passport.authenticate('facebook', { scope: 'email' })
    );

    route.get('/facebook/callback',
        passport.authenticate('facebook', { failureRedirect: '/auth/login' }),
        (req, res) => {
            req.session.save(() => {
                res.redirect('/welcome');
            })
        });

    route.get('/kakao',
        passport.authenticate('kakao')
    );

    route.get('/kakao/oauth',
        passport.authenticate('kakao', { failureRedirect: '/auth/login' }),
        (req, res) => {
            req.session.save(() => {
                res.redirect('/welcome');
            })
        });

    route.get('/google',
        passport.authenticate('google', { scope: 'email' })
    );

    route.get('/google/callback',
        passport.authenticate('google', { failureRedirect: '/auth/login' }),
        (req, res) => {
            req.session.save(() => {
                res.redirect('/welcome');
            })
        });

    route.get('/naver',
        passport.authenticate('naver'));

    route.get('/naver/callback',
        passport.authenticate('naver', { failureRedirect: '/auth/login' }),
        (req, res) => {
            req.session.save(() => {
                res.redirect('/welcome');
            })
        });

    route.get('/logout', function (req, res) {
        req.logout();
        req.session.save(function () {
            res.redirect('/welcome');
        });
    });

    route.get('/register', function (req, res) {
        res.render('auth/register');
    });

    route.post('/register', function (req, res) {
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

    return route;
}