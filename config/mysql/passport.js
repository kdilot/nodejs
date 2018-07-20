module.exports = function (app) {
    const passport = require('passport')
    const LocalStrategy = require('passport-local').Strategy;
    const FacebookStrategy = require('passport-facebook').Strategy;
    const KakaoStrategy = require('passport-kakao').Strategy;
    const NaverStrategy = require('passport-naver').Strategy;   // naver dosn't support localhost domain with port
    const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
    const conn = require(__dirname + '/db')();
    const sha256 = require('sha256');
    const salt = '#&$&$#HDDHSdhfsedjsa';

    app.use(passport.initialize());
    app.use(passport.session()); // have to use after session code

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
        callbackURL: '/auth/kakao/oauth',
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
    return passport;
}