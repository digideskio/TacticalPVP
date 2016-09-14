var async = require("async");

module.exports = function (app, router) {
    var mysql = app.get("MysqlManager");

    router.get("/", function (req, res) {
        mysql.items.getAll(function (err, data) {
            if (err) {
                res.json({ error: "Error getting items" });
                return;
            }
            res.json(data);
        });
    });

    router.get("/user", function (req, res) {
        if (!req.connected) {
            res.json({ error: "Need to be connected" });
            return;
        }
        mysql.items.getAllUserItems(req.connected.id, function (err, data) {
            if (err) {
                res.json({ error: "Error getting items" });
                return;
            }
            res.json(data);
        });
    });

    router.get("/:id", function (req, res) {
        mysql.items.get(req.params.id, function (err, data) {
            if (err) {
                res.json({ error: "Error getting item" });
                return;
            }
            if (data.length == 0) {
                res.json({ error: "Item not exists" });
                return;
            }
            res.json(data[0]);
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
                mysql.items.getUserItem(req.connected.id, req.params.id, function (err, data) {
                    if (err) {
                        callback("Error getting user item");
                        return;
                    }
                    if (data.length == 0) {
                        callback("Item not posseded");
                        return;
                    }
                    var item = data[0];
                    if (item.equiped == 1) {
                        callback("Item already equiped");
                        return;
                    }
                    callback(null, item);
                });
            },
            function (item, callback) {
                mysql.items.getEquipedUserItems(req.connected.id, function (err, data) {
                    if (err) {
                        callback("Error getting user items");
                        return;
                    }
                    var lvl = 0;
                    for (var i in data) {
                        lvl += data[i].level;
                    }
                    if (lvl + item.level >= maxLevel) {
                        callback("Level to high");
                        return;
                    }
                    callback(null, item);
                });
            },
            function (item, callback) {
                mysql.items.updateUserItem(item.id_ui, { equiped: 1 }, function (err, data) {
                    callback(null, item);
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

        mysql.items.getUserItem(req.connected.id, req.params.id, function (err, data) {
            if (err) {
                res.json({ error: "Error getting user item" });
                return;
            }
            if (data.length == 0) {
                res.json({ error: "Item not posseded" });
                return;
            }
            var item = data[0];
            if (item.equiped == 0) {
                res.json({ error: "Item unequiped" });
                return;
            }

            mysql.items.updateUserItem(item.id_ui, { equiped: 0 }, function (err, data) {
                res.json(item);
            });
        });
    });
}