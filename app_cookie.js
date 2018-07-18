let exp = require('express');
let app = exp();
let cookieParser = require('cookie-parser');

app.use(cookieParser('cookieKey'));
app.listen(3003, function () {
    console.log('Connnected 3003 port!!');
});

app.get('/count', function (req, res) {
    if (req.signedCookies.count) {
        var count = parseInt(req.signedCookies.count);

    } else {
        var count = 0;
    }
    res.cookie('count', count + 1, { signed: true });
    res.send('count : ' + count);
});

let products = {
    1: { title: 'The history of web 1' },
    2: { title: 'The next web 2' }
};
app.get('/products', function (req, res) {
    let output = '';
    for (var id in products) {
        output +=
            `
            <li>
                <a href="/cart/${id}">${products[id].title}</a>
            </li>
        `;
    }
    res.send(`<h1>Products</h1><ul>${output}</ul><a href="/cart">Cart</a>`);
});

app.get('/cart/:id', function (req, res) {
    let id = req.params.id;
    if (req.signedCookies.cart) {
        var cart = req.signedCookies.cart;
    } else {
        var cart = {};
    }
    if (!cart[id]) cart[id] = 0;
    cart[id] = parseInt(cart[id]) + 1;
    res.cookie('cart', cart, { signed: true });
    res.redirect('/cart');
});

app.get('/cart', function (req, res) {
    var cart = req.signedCookies.cart;
    if (!cart) {
        res.send('Empty');
    } else {
        var output = '';
        for (let id in cart) {
            output += `<li>${products[id].title} (${cart[id]})</li>`
        }
    }
    res.send(`<h1>Cart</h1><ul>${output}</ul><a href="/products">Product List</a>`);
});