var async = require("async");

module.exports = function (app, router) {
    var mysql = app.get("MysqlManager");

    router.get("/:type?", function (req, res) {
        if (!req.connected) {
            res.json({ error: "Need to be connected" });
            return;
        }

        var price = {
            gems: 10,
            golds: 100
        };

        async.waterfall([
            function (callback) {
                mysql.user.getUserById(req.connected.id, function (err, data) {
                    if (req.params.type == "gems") {
                        if (data[0].gems < price.gems) {
                            callback("Not enough gems");
                            return;
                        }
                        mysql.user.updateUser({ gems: data[0].gems - price.gems }, req.connected.id, function (err, data) {
                            callback(null);
                        });
                    } else {
                        if (data[0].golds < price.golds) {
                            callback("Not enough golds");
                            return;
                        }
                        mysql.user.updateUser({ golds: data[0].golds - price.golds }, req.connected.id, function (err, data) {
                            callback(null);
                        });
                    }
                });
            },
            function (callback) {
                async.parallel({
                    allItems: function (cb) {
                        mysql.items.getAll(function (err, data) {
                            cb(null, data);
                        });
                    },
                    allSpells: function (cb) {
                        mysql.spells.getAll(function (err, data) {
                            cb(null, data);
                        });
                    },
                    userItems: function (cb) {
                        mysql.items.getAllUserItems(req.connected.id, function (err, data) {
                            cb(null, data);
                        });
                    },
                    userSpells: function (cb) {
                        mysql.spells.getAllUserSpells(req.connected.id, function (err, data) {
                            cb(null, data);
                        });
                    },
                }, function (err, results) {

                    var nbDrop = 5;
                    var nbSpell = Math.round(Math.random()) + 2;
                    var nbItems = nbDrop - nbSpell;

                    var drops = {
                        spells:[],
                        items:[],
                        skins:[]
                    };

                    for(var i = 0; i < nbSpell; i++){
                        if(results["allSpells"].length  == 0){
                            break;
                        }
                        var index = Math.floor(Math.random() * results["allSpells"].length);
                        var spell = results["allSpells"][index];
                        var found = false;
                        for(var j in results["userSpells"]){
                            if(results["userSpells"][j].id_s == spell.id_s){
                                found = true;
                                break;
                            }
                        }
                        if(!found){
                            mysql.spells.addUserSpell({id_u:req.connected.id, id_s:spell.id_s, equiped:0, position:0});
                            results["userSpells"].push(spell);
                        }
                        drops.spells.push(spell);
                        results["allSpells"].splice(index, 1);
                    }

                    for(var i = 0; i < nbItems; i++){
                        if(results["allItems"].length == 0){
                            break;
                        }
                        var index = Math.floor(Math.random() * results["allItems"].length);
                        var item = results["allItems"][index];
                        var found = false;
                        for(var j in results["userItems"]){
                            if(results["userItems"][j].id_i == item.id_i){
                                found = true;
                                break;
                            }
                        }
                        if(!found){
                            mysql.items.addUserItem({id_u:req.connected.id, id_i:item.id_i, equiped:0, position:0});
                            results["userItems"].push(item);
                        }
                        drops.items.push(item);
                        results["allItems"].splice(index, 1);
                    }

                    callback(null, drops);
                });
            }
        ], function (err, data) {
            if (err) {
                res.json({ error: err });
                return;
            }
            res.json(data);
        });

    });
}