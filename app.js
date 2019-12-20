'use strict'

const mysql = require('mysql')
const fs = require('fs')
const readline = require('readline')

let con = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "root",
    password: "root",
    database: 'reddit_database'
})

const stream = readline.createInterface({
    input: fs.createReadStream('./data/RC_2007-10.json'),
    output: process.stdout,
    terminal: false
})

stream.on('line', (line) => {
    let data = JSON.parse(line)
    fillTable(data)
})

con.getConnection(function (err) {
    if (err) throw err

    console.log('Connected!')

    let sql = "SELECT * FROM comments;"
    con.query(sql, function (err, result) {
        if (err) {
            createTable()
        } else {
            console.log(result)
        }
    })
})

function fillTable(data) {
    let sqlInsert = "INSERT INTO comments (id, parent_id, link_id, name, author, body, subreddit_id, score, created_utc)\
    VALUES ('" + data.id + "','" + data.parent_id + "','" + data.link_id + "','" + data.name + "','" + data.author + "'," + mysql.escape(data.body) + ",'" + data.subreddit_id + "','" + data.score + "','" + data.created_utc + "')"

    con.query(sqlInsert, function (err, result) {
        if (err) throw err;
        console.log(result);
    })
}


function createTable() {
    let arr = [
        'id VARCHAR(255)',
        'parent_id VARCHAR(255)',
        'link_id VARCHAR(255)',
        'name VARCHAR(255)',
        'author VARCHAR(255)',
        'body VARCHAR(255)',
        'subreddit_id VARCHAR(255)',
        'score INT',
        'created_utc INT'
    ]

    let table = `CREATE TABLE comments (${arr})`

    con.query(table, function (err, result) {
        if (err) throw err;
        console.log(result);
    })
}
