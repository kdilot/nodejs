
const mysql = require('mysql');

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'o2'
});
con.connect();

/*
let sql = 'select * from topic';
con.query(sql, function(err, rows, fields) {
    if(err) {
        console.log(err);
    } else {
        for(let i=0; i<rows.length; i++) {
            console.log(rows[i].title);
        }
    }
});
*/

/*
// let sql = 'insert into topic (title, description, author) values ("nodejs", "server side javascript", "test")';
let params = ['supervisor', 'watcher', 'graphittie'];
let sql = 'insert into topic (title, description, author) values (?, ?, ?)';
con.query(sql, params, function (err, rows, fields) {
    if (err) {
        console.log(err);
    } else {
        console.log(rows);
    }
});
*/

let params = ['npm', 'ttt', 2];
let sql = 'update topic set title=?, author=? where id=?';
con.query(sql, params, function (err, rows, fields) {
    if (err) {
        console.log(err);
    } else {
        console.log(rows);
    }
});

con.end()