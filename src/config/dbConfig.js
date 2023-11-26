import mysql from "mysql";

const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'xlite'
});

connection.connect();

export default connection;