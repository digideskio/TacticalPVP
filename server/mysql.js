var mysql = require('mysql');

module.exports = function (app) {
    var db;
    db = mysql.createConnection(app.get("config").mysql);

    db.connect(function (err) {
        if (err) {
            console.log("Error connecting database \n\n");
            process.exit();
        } else {
            console.log("Database : OK");
        }
    });

    return {
        getDB: function () {
            return db;
        },
        user: {
            getUserById: function (id, callback) {
                db.query("SELECT * FROM users WHERE id_u = ?;", [id], callback);
            },
            getUserByLogin: function (login, callback) {
                db.query("SELECT * FROM users WHERE login = ?;", [login], callback);
            },
            getUserAuthentification: function (login, password, callback) {
                db.query("SELECT * FROM users WHERE login = ? AND password = ?;", [login, password], callback);
            },
            getUserByToken: function (token, callback) {
                db.query("SELECT * FROM users WHERE token = ?;", [token], callback);
            },
            addUser: function (datas, callback) {
                db.query("INSERT INTO users SET ?", datas, callback);
            },
            updateUser: function (datas, id, callback) {
                db.query("UPDATE users SET ? WHERE ?", [datas, { id_u: id }], callback);
            },
            getRanking: function (attribute, limit, offset, callback) {
                if(attribute == "xp"){
                    db.query("SELECT * FROM users ORDER BY xp DESC LIMIT ? OFFSET ?;", [limit, offset], callback);
                }else{
                    db.query("SELECT * FROM users ORDER BY elo DESC LIMIT ? OFFSET ?;", [limit, offset], callback);
                }
                
            },
            autocomplete: function(begin, callback){
                db.query("SELECT * FROM users WHERE login like '"+begin+"%' ORDER BY elo DESC LIMIT 0, 10;", callback);
            }
        }
    }
}