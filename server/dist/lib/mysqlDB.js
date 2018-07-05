"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mysqlDB = require("mysql");
// import * as mysql from 'async-mysql'
var Promise = require("bluebird");
// import {Connection} from "mysql";
// const mysql = require('promise-mysql2');
var conn;
// let mysql = require('async-mysql');
function initConnection() {
    conn = mysqlDB.createConnection({
        // conn = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'chat'
    });
    conn.connect();
}
function db() {
    if (!conn) {
        initConnection();
    }
    return Promise.promisifyAll(conn);
}
exports.db = db;
//# sourceMappingURL=mysqlDB.js.map