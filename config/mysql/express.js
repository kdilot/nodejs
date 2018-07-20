module.exports = function () {
    const exp = require('express');
    const app = exp();
    const session = require('express-session');
    const bodyPaser = require('body-parser');
    const FileStore = require('session-file-store')(session); // way to save session information at File.
    const MysqlStore = require('express-mysql-session')(session); // way to save session information at Mysql DB.

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

    app.set('views', 'views/mysql');
    app.set('view engine', 'pug'); //  called pug engine

    return app;
}