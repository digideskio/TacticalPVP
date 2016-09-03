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
            autocomplete: function(begin, callback){
                db.query("SELECT * FROM users WHERE login like '"+begin+"%' ORDER BY elo DESC LIMIT 0, 10;", callback);
            }
        },
        items: {
            get: function (id, callback) {
                db.query("SELECT * FROM items WHERE id_i = ?;", [id], callback);
            },
            getAll: function (callback) {
                db.query("SELECT * FROM items;", callback);
            },
            getAllUserItems: function (id, callback) {
                db.query("SELECT * FROM items i, user_item ui WHERE ui.id_i = i.id_i AND ui.id_u = ?;", [id], callback);
            },
            getEquipedUserItems: function (id, callback) {
                db.query("SELECT * FROM items i, user_item ui WHERE ui.id_i = i.id_i AND ui.id_u = ? AND equiped = 1;", [id], callback);
            },
            getUserItem: function (id_u, id_i, callback) {
                db.query("SELECT * FROM items i, user_item ui WHERE ui.id_i = i.id_i AND ui.id_u = ? AND ui.id_i = ?;", [id_u, id_i], callback);
            },
            addUserItem: function (datas, callback) {
                db.query("INSERT INTO user_item SET ?", datas, callback);
            },
            deleteUserItem: function (id, callback) {
                db.query("DELETE FROM user_item WHERE id_ui = ?;", [id], callback);
            },
            updateUserItem: function (id, datas, callback) {
                db.query("UPDATE user_item SET ? WHERE ?", [datas, { id_ui: id }], callback);
            }
        },
        spells: {
            get: function (id, callback) {
                db.query("SELECT * FROM spells WHERE id_s = ?;", [id], callback);
            },
            getAll: function (callback) {
                db.query("SELECT * FROM spells;", callback);
            },
            getAllUserSpells: function (id, callback) {
                db.query("SELECT * FROM spells s, user_spell us WHERE us.id_s = s.id_s AND us.id_u = ?;", [id], callback);
            },
            getEquipedUserSpells: function (id, callback) {
                db.query("SELECT * FROM spells s, user_spell us WHERE us.id_s = s.id_s AND us.id_u = ? AND equiped = 1;", [id], callback);
            },
            getUserSpell: function (id_u, id_s, callback) {
                db.query("SELECT * FROM spells s, user_spell us WHERE us.id_s = s.id_s AND us.id_u = ? AND us.id_s = ?;", [id_u, id_s], callback);
            },
            addUserSpell: function (datas, callback) {
                db.query("INSERT INTO user_spell SET ?", datas, callback);
            },
            deleteUserSpell: function (id, callback) {
                db.query("DELETE FROM user_spell WHERE id_us = ?;", [id], callback);
            },
            updateUserSpell: function (id, datas, callback) {
                db.query("UPDATE user_spell SET ? WHERE ?", [datas, { id_us: id }], callback);
            }
        },
    }
}