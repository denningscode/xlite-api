import mysql from "mysql2";

const connection = mysql.createConnection(
  "mysql://u_xlite_api_db:-FbDmey9l7FkfsePkCiJNjMR@localhost:3306/xlite_api_db"
);

connection.connect((err) => {
  if (err) {
    console.error("DB connection failed:", err);
  } else {
    console.log("Connected to MySQL");
  }
});

export default connection;