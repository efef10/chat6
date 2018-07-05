import * as mysqlDB from 'mysql'
// import * as mysql from 'async-mysql'
import * as Promise from 'bluebird'
// import {Connection} from "mysql";
// const mysql = require('promise-mysql2');
let conn:any;
// let mysql = require('async-mysql');
function initConnection(){
    conn = mysqlDB.createConnection({
    // conn = mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'root',
        database:'chat'
    });

    conn.connect()
}

export function db(){
    if(!conn){
        initConnection();
    }
    return Promise.promisifyAll(conn);
}

