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

            db.serialize(() => {
                db.run(`
                CREATE TABLE IF NOT EXISTS notes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                content TEXT NOT NULL,
                categorie TEXT NOT NULL)`,);});
            
    }

    createUser(name, pw) {
        db.run(`INSERT INTO users (name, password, categories) VALUES (?, ?, ?)`, [name, pw, "[]"], function (err) {});
    }

    createNote(name, content, categorie) {
        db.run(`INSERT INTO notes (name, content, categorie) VALUES (?, ?, ?)`, [name, content, categorie], function (err) {});
    }

    getCategories(name, callback) {
        db.get(
            `SELECT categories FROM users WHERE name = ?`,
            [name],
            (err, row) => {
                if (row) {
                    const categories = row.categories ? JSON.parse(row.categories) : [];
                    callback(null, categories);
                } else {
                    callback(null, null);
                }
            }
        );
    }

    setCategories(name, newCategories) {
        const updatedCategories = JSON.stringify(newCategories);

        db.run(
            `UPDATE users SET categories = ? WHERE name = ?`,
            [updatedCategories, name],
            (err) => {
            }
        );
    }

    getNotes(categorie, callback) {
        db.all(`SELECT * FROM notes WHERE categorie = ?`, categorie, (err, rows) => {
            if (err) {
        
              callback(err, null);
            } else {
              callback(null, rows);
            }
          });
    }

    getDb() {
        return db
    }

}

module.exports = Database;