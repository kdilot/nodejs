const express = require('express');
const route = express.Router();

module.exports = function (app) {
    route.get('/r1', function (req, res) {
        res.send('Hello /p1/r1');
    });

    route.get('/r2', function (req, res) {
        res.send('Hello /p1/r2');
    });

    return route;
};