const mysql = require('mysql2');

const pool = mysql.createPool({
  // Your MySQL configuration
  user: 'root', // Your MySQL username
  password: 'Roman1435', // Your MySQL password
  host: '127.0.0.1', // MySQL host (usually localhost)
  port: 3306, // MySQL port
  database: 'mydb', // Your database name
  waitForConnections: true, // Optional: Set to true if you want to queue queries when all connections are in use
  connectionLimit: 10, // Adjust this limit as needed
});

// You can create a promise-based pool using the 'promise()' method
const promisePool = pool.promise();

// Export the promise-based pool for use in other parts of your code
module.exports = promisePool;

// Test the database connection
(async () => {
  try {
    // Attempt to acquire a connection from the pool
    const connection = await promisePool.getConnection();

    // If the connection was successfully acquired, release it
    connection.release();

    console.log('Database connection is established.');
  } catch (error) {
    console.error('Error establishing the database connection:', error);
    // You might want to handle the error or exit the application if the connection fails
  }
})();
