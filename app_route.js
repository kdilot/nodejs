const express = require('express');
const app = express();

const p1 = require(__dirname + '/routes/p1')(app);
app.use('/p1', p1);

const p2 = require(__dirname + '/routes/p2')(app);
app.use('/p2', p2);

app.listen(3000, function () {
    console.log('Connected!');
});