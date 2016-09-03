var async = require("async");

module.exports = function (app, router) {
    var mysql = app.get("MysqlManager");

    router.get("/get/:id", function (req, res) {
        mysql.spells.get(req.params.id, function (err, data) {
            if (err) {
                res.json({ error: "Error getting spell" });
                return;
            }
            if (data.length == 0) {
                res.json({ error: "Spell not exists" });
                return;
            }
            res.json(data[0]);
        });
    });

    router.get("/getAll", function (req, res) {
        mysql.spells.getAll(function (err, data) {
            if (err) {
                res.json({ error: "Error getting spells" });
                return;
            }
            res.json(data);
        });
    });

    router.get("/getUserSpells", function (req, res) {
        if (!req.connected) {
            res.json({ error: "Need to be connected" });
            return;
        }
        mysql.spells.getAllUserSpells(req.connected.id, function (err, data) {
            if (err) {
                res.json({ error: "Error getting spells" });
                return;
            }
            res.json(data);
        });
    });

    router.get("/equip/:id", function (req, res) {
        if (!req.connected) {
            res.json({ error: "Need to be connected" });
            return;
        }

        var maxLevel = 50;

        async.waterfall([
            function (callback) {
                mysql.spells.getUserSpell(req.connected.id, req.params.id, function (err, data) {
                    if (err) {
                        callback("Error getting user spell");
                        return;
                    }
                    if (data.length == 0) {
                        callback("Spell not posseded");
                        return;
                    }
                    var spell = data[0];
                    if (spell.equiped == 1) {
                        callback("Spell already equiped");
                        return;
                    }
                    callback(null, spell);
                });
            },
            function (spell, callback) {
                mysql.spells.getEquipedUserSpells(req.connected.id, function (err, data) {
                    if (err) {
                        callback("Error getting user spells");
                        return;
                    }
                    var lvl = 0;
                    for (var i in data) {
                        lvl += data[i].level;
                    }
                    if (lvl + spell.level >= maxLevel) {
                        callback("Level to high");
                        return;
                    }
                    callback(null, spell);
                });
            },
            function (spell, callback) {
                mysql.spells.updateUserSpell(spell.id_us, { equiped: 1 }, function (err, data) {
                    callback(null, spell);
                });
            }
        ], function (err, data) {
            if (err) {
                res.json({ error: err })
                return;
            }
            res.json(data);
        });
    });

    router.get("/unequip/:id", function (req, res) {
        if (!req.connected) {
            res.json({ error: "Need to be connected" });
            return;
        }

        mysql.spells.getUserSpell(req.connected.id, req.params.id, function (err, data) {
            if (err) {
                res.json({ error: "Error getting user spell" });
                return;
            }
            if (data.length == 0) {
                res.json({ error: "Spell not posseded" });
                return;
            }
            var spell = data[0];
            if (spell.equiped == 0) {
                res.json({ error: "Spell unequiped" });
                return;
            }

            mysql.spells.updateUserSpell(spell.id_us, { equiped: 0 }, function (err, data) {
                res.json(spell);
            });
        });
    });
}