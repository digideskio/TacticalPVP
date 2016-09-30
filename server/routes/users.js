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

    router.get("/:login?", function (req, res) {
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
                    delete rows[0].golds;
                    delete rows[0].gems;
                    res.json(rows[0]);
                } else {
                    res.json({ error: "Non-existing user." });
                }
            });

        }
    });

    router.get("/autocomplete/:begin", function (req, res) {
        mysql.user.autocomplete(req.params.begin, function (err, rows) {
            if (err) {
                res.json({ error: "Error getting autocomplete" });
                return;
            }
            for(var i in rows){
                delete rows[i].password;
                delete rows[i].token;
                delete rows[i].golds;
                delete rows[i].gems;
            }
            res.json(rows);
        });
    });

    router.get("/ranking/:page/:number", function(req, res){
        var nb = parseInt(req.params.number);
        if(nb > 100){
            nb = 100;
        }

        if(nb < 0){
            nb = 0;
        }

        var page = parseInt(req.params.page);
        if(page < 0){
            page = 0;
        }

        mysql.user.getRanking(page * nb, page * nb + nb, function(err, rows){
            for(var i in rows){
                delete rows[i].password;
                delete rows[i].token;
                delete rows[i].golds;
                delete rows[i].gems;
            }
            res.json(rows);
        });
    });

}