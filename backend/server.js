const express = require('express')
const cors = require('cors');
const session = require('express-session');
const Database = require('./Database');
const {urlencoded} = require("express");
const db = new Database();

const app = express()
const port = 3003

let pw= ""
let sessions = [], validCredentials

//DB
db.init()

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
    next();
});
app.use(session({
    secret: 'k283e4398y',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60000 * 60,
    }
}));
//tauri://localhost
const allowedOrigins = ['http://localhost:1420', 'tauri://localhost', 'https://note2.quinilo.de'];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed!'));
        }
    },
    credentials: true,
}));

app.use("/api/*", (req, res, next) => {

    console.log(req.session.sessionId)

    if (req.session.sessionId) {
        if (isSessionValid(req.session.sessionId)) {
            next()
            return
        }
    }

    res.send("auth failed")
})

app.get("/api/hello-world", (req, res) => {
    res.send("hello world!")
})

app.get("/api/user/name", (req, res) => {
    res.send(req.session.username)
})

app.post("/api/setCategories", (req, res) => {
    db.setCategories(req.session.username, req.body.categories);
    res.send("success")
})

app.get("/api/categories", (req, res) => {
    db.getCategories(req.session.username, (err, categories) => {
        if (err) {
            console.error('Fehler:', err.message);
        }
        res.send(categories)
    })
})

app.get("/api/createNote/:category", (req, res) => {
    db.createNote("New note", req.session.username, "Hello world", req.params.category)
    res.send("success")
})

app.get("/api/notes/:category", (req, res) => {
    db.getNotes(req.params.category, req.session.username, (err, users) => {
        if (err) {
          console.error('error:', err.message);
        } else {
          res.json(users)
        }
      });
})

app.post("/api/updateNote/:id", (req, res) => {
    console.log(req.body)
    db.updateNote(req.params.id, req.body.name, req.body.content);
    res.send("success")
})

/*
  AUTH
*/

app.get("/api/logout", async (req, res) => {
    deleteSession(req.session.sessionId)
    res.send("success")
})

app.post("/login", (req, res) => {
    console.log(req.body)
    db.getDb().get(
        `SELECT * FROM users WHERE name = ?`,
        [req.body.name],
        (err, row) => {
            validCredentials = false

            if (err) {
                console.error('login error :', err.message);
            } else if (row) {
                row.categories = row.categories ? JSON.parse(row.categories) : [];
                if (row.password === req.body.password) validCredentials = true;
            }

            if (validCredentials) {
                sessions.push({id: "12345678", name: "kekw"})
                req.session.sessionId = "12345678";
                req.session.username = row.name
                req.session.categories = row.categories

                req.session.save((err) => {
                    if (err) {
                        console.error('Error while saving the session: ', err);
                    }
                });

                res.send("success")
            } else {
                res.send("invalid")
            }
        }
    );
})

app.get("/check/:cookie", (req, res) => {
    res.send(isSessionValid(req.params.cookie))
})

app.post("/register", (req, res) => {
    if (req.body.adminPw !== pw) {
        res.send("invalid pw")
        return
    }

    db.createUser(req.body.name, req.body.password)
    res.send("success")
})

app.get("/note2-ping", (req, res) => {
    res.send("pong!")
})

app.get("/shared/:id", (req, res) => {
    res.send("<!DOCTYPE html>\n" +
        "<html lang=\"de\">\n" +
        "<head>\n" +
        "  <meta charset=\"UTF-8\">\n" +
        "  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
        "  <title>Shared note</title>\n" +
        "  <style>\n" +
        "    body {\n" +
        "      background-color: #101317;\n" +
        "      font-family: SansSerif,sans-serif;\n" +
        "    }\n" +
        "\n" +
        "    .container {\n" +
        "      text-align: center;\n" +
        "      color: #b5b5b5;\n" +
        "      margin-top: 80px;\n" +
        "    }\n" +
        "\n" +
        "    h1  {\n" +
        "      font-size: 50px;\n" +
        "      color: white;\n" +
        "    }\n" +
        "  </style>\n" +
        "</head>\n" +
        "<body>\n" +
        "\n" +
        "<div class=\"container\">\n" +
        "  <p>note2 • shared by quinilo</p>\n" +
        "  <h1>Title</h1>\n" +
        "  <div>Lorem inpsun asdn asj,dhnbkajsdhakjm,shbd akmhsb dkj</div>\n" +
        "</div>\n" +
        "\n" +
        "</body>\n" +
        "</html>")
})

function isSessionValid(id) {
    const session = sessions.find(session => session.id === id);
    return session !== undefined;
}

function getUserById(id) {
    const session = sessions.find(session => session.id === id);
    return session ? session.token : "unknown";
}

function deleteSession(sessionId) {
    const index = sessions.findIndex(session => session.id === sessionId);
    if (index !== -1) {
        sessions.splice(index, 1);
    }
}

function randomId() {
    return Math.random().toString(33).split(".")[1];
}

/*
  START
*/

app.listen(port, () => {
    pw = randomId();

    console.log(`Backend listening on port ${port}`)
    console.log(`Your administration password is ${pw}`)
})
