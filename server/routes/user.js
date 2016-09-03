var jwt = require('jsonwebtoken');
var async = require("async");

module.exports = function (app, router) {
    var mysql = app.get("MysqlManager");

    router.post("/register", function (req, res) {

        if (req.connected) {
            res.json({ error: "Already logged." });
            return;
        }
        if (req.body.login && req.body.password && req.body.login.length > 0 && req.body.password.length > 0) {

            async.waterfall([
                function (callback) {
                    mysql.user.getUserByLogin(req.body.login, function (err, rows) {
                        if (err) {
                            callback(err);
                            return;
                        }
                        if (rows.length == 0) {
                            var userToSave = {
                                login: req.body.login,
                                password: req.body.password,
                                elo: 1500,
                                xp: 0,
                                golds: 0,
                                gems: 0,
                                win: 0,
                                lose: 0,
                                draw: 0,
                                registration: Math.floor(Date.now()/1000),
                            }
                            callback(null, userToSave);
                        } else {
                            res.json({ error: "Login already taken." });
                            callback(true);
                        }
                    });
                },
                function (userToSave, callback) {
                    mysql.user.addUser(userToSave, function (err, rows) {
                        if (err) {
                            res.json({ error: "Problem adding user." });
                            callback(err);
                            return;
                        }
                        var user = {
                            id: rows.insertId,
                            login: req.body.login,
                            password: req.body.password
                        };

                        var token = jwt.sign(user, app.get('config').jwtKey);
                        mysql.user.updateUser({ token: token }, user.id);
                        res.json({ token: token });
                        callback(null);
                    });
                }
            ]);
        } else {
            res.json({ error: "Login or password are empty." });
        }
    });

    router.post("/login", function (req, res) {

        if (req.connected) {
            res.json({ error: "Already logged." });
            return;
        }

        if (req.body.login && req.body.password && req.body.login.length > 0 && req.body.password.length > 0) {
            mysql.user.getUserAuthentification(req.body.login, req.body.password, function (err, rows) {
                if (err) {
                    res.json({ error: "Can't get informations" })
                    return;
                }

                if (rows.length > 0) {
                    res.json({ token: rows[0].token });
                } else {
                    res.json({ error: "Login and password don't match." });
                }
            });
        } else {
            res.json({ error: "Login or password are empty." });
        }
    });

    router.get("/profile/:login?", function (req, res) {
        if (!req.params.login) {
            if (req.connected) {
                mysql.user.getUserById(req.connected.id, function (err, rows) {
                    if (err) {
                        return;
                    }
                    delete rows[0].token;
                    delete rows[0].password;
                    res.json(rows[0]);
                });
            } else {
                res.json({ error: "Non-existing user." });
            }
        } else {
            mysql.user.getUserByLogin(req.params.login, function (err, rows) {
                if (err) {
                    return;
                }
                if (rows.length > 0) {
                    delete rows[0].token;
                    delete rows[0].password;
                    res.json(rows[0]);
                } else {
                    res.json({ error: "Non-existing user." });
                }
            });

        }
    });

    router.get("/ranking/:attribute?/:limit?/:offset?", function (req, res) {
        var attribute = "elo";
        if (req.params.attribute && req.params.attribute == "xp") {
            attribute = "xp";
        }

        var limit = 100;
        if (req.params.limit) {
            limit = parseInt(req.params.limit);
        }

        var offset = 0;
        if (req.params.offset) {
            offset = parseInt(req.params.offset);
        }

        mysql.user.getRanking(attribute, limit, offset, function (err, rows) {
            if (err) {
                res.json({ error: "Error getting ranking" });
                return;
            }
            res.json(rows);

        });
    });

    router.get("/autocomplete/:begin", function (req, res) {
        mysql.user.autocomplete(req.params.begin, function (err, rows) {
            if (err) {
                res.json({ error: "Error getting autocomplete" });
                return;
            }
            res.json(rows);
        });
    });
}