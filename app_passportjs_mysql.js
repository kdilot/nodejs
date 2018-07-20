// issue with Error: EPERM: operation not permitted, rename

const app = require(__dirname + '/config/mysql/express')();
const passport = require(__dirname + '/config/mysql/passport')(app);
const auth = require(__dirname + '/routes/mysql/auth')(passport);
app.use('/auth/', auth);

app.listen(3003, function () {
    console.log('Connnected 3003 port!!');
});

app.get('/welcome', function (req, res) {
    if (req.user && req.user.displayName) {
        res.send(`<h1>Hello, ${req.user.displayName}</h1><a href="/auth/logout">Logout</a>`);
    } else {
        res.send('<h1>Hello</h1><ul><li><a href="/auth/login">Login</a></li><li><a href="/auth/register">Register</a></li></ul>')
    }
});


