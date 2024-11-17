const sqlite = require("sqlite3");

let db

class Database {

    init() {
         db = new sqlite.Database('./note2.db', (err) => {
            if (err) {
                console.error('Database error: ', err.message);
            } else {
                console.log('Connected to sqlite database.');
            }
        });

        db.serialize(() => {
            db.run(`
            CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            categories TEXT)`,);});
    }

    createUser(name, pw) {
        db.run(`INSERT INTO users (name, password, categories) VALUES (?, ?, ?)`, [name, pw, "[]"], function (err) {});
    }

    getDb() {
        return db
    }

}

module.exports = Database;