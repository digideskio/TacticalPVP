var vue;

$(function () {

    var requests = {
        users: {
            self: function (callback) {
                $.get("/users", function (data) {
                    callback(data);
                });
            },
            get: function (login, callback) {
                $.get("/users/" + login, function (data) {
                    callback(data);
                });
            },
            ranking:function(page, nb, callback){
                $.get("/users/ranking/"+page+"/"+nb, function(data){
                    callback(data)
                });
            }
        },
        items: {
            get: function (id, callback) {
                $.get("/items/" + id, function (data) {
                    callback(data);
                });
            },
            all: function (callback) {
                $.get("/items", function (data) {
                    callback(data);
                });
            },
            self: function (callback) {
                $.get("/items/user", function (data) {
                    callback(data);
                });
            },
            equip: function (id, callback) {
                $.get("/items/equip/" + id, function (data) {
                    callback(data);
                });
            },
            unequip: function (id, callback) {
                $.get("/items/unequip/" + id, function (data) {
                    callback(data);
                });
            }
        },
        spells: {
            get: function (id, callback) {
                $.get("/spells/" + id, function (data) {
                    callback(data);
                });
            },
            all: function (callback) {
                $.get("/spells", function (data) {
                    callback(data);
                });
            },
            self: function (callback) {
                $.get("/spells/user", function (data) {
                    callback(data);
                });
            },
            equip: function (id, callback) {
                $.get("/spells/equip/" + id, function (data) {
                    callback(data);
                });
            },
            unequip: function (id, callback) {
                $.get("/spells/unequip/" + id, function (data) {
                    callback(data);
                });
            }
        },
        drop: function (type, callback) {
            $.get("/drop/" + type, function (data) {
                callback(data);
            });
        }
    }


    vue = new Vue({
        el: "#app",
        data: {
            login: {
                login: "",
                password: ""
            },
            register: {
                login: "",
                password: "",
                passwordconfirmation: ""
            },
            self: null,
            profile:{},
            ranking:{players:[]},
            items: {
                CHARACTERISTICS: CHARACTERISTICS,
                maxlevel: MAX_ITEMS_LEVEL,
                self: [],
            },
            spells: {
                maxlevel: MAX_SPELLS_LEVEL,
                self: [],
            },
            drop: {
                DROP_GOLDS: DROP_GOLDS,
                DROP_GEMS: DROP_GEMS
            }
        },
        computed: {
            itemsLevel: function () {
                var lvl = 0;
                for (var item of this.items.self) {
                    if (item.equiped == 1) {
                        lvl += item.level;
                    }
                }
                return lvl;
            },
            spellsLevel: function () {
                var lvl = 0;
                for (var spell of this.spells.self) {
                    if (spell.equiped == 1) {
                        lvl += spell.level;
                    }
                }
                return lvl;
            },
            characteristics: function () {
                var caracs = JSON.parse(JSON.stringify(CHARACTERISTICS));

                for (var i in DEFAULT_CHARACTERISTICS) {
                    caracs[i] += DEFAULT_CHARACTERISTICS[i];
                }

                for (var item of this.items.self) {
                    if (item.equiped == 1) {
                        for (var i in item) {
                            if (caracs[i] != undefined) {
                                caracs[i] += item[i];
                            }
                        }
                    }
                }
                return caracs;
            }
        },
        methods: {
            connection: function () {
                var _this = this;
                $.post("/users/login", { login: this.login.login, password: this.login.password }, function (data) {
                    if (!data.error) {
                        localStorage.setItem("token", data.token);
                    } else {
                        console.log("ERROR CONNECTION", data.error);
                    }
                    _this.loadAll();
                });
            },
            registration: function () {
                var _this = this;
                if (this.register.password != this.register.passwordconfirmation) {
                    console.log("PROBLEME PASSWORDS");
                    return;
                }
                $.post("/users/register", { login: this.register.login, password: this.register.password }, function (data) {
                    if (!data.error) {
                        localStorage.setItem("token", data.token);
                    } else {
                        console.log("ERROR CONNECTION", data.error);
                    }
                    _this.loadAll();
                });
            },
            disconnect:function(){
                localStorage.removeItem("token");
            },
            equipItem: function (id) {
                var _this = this;
                requests.items.equip(id, function (data) {
                    if (!data.error) {
                        for (var i in _this.items.self) {
                            if (_this.items.self[i].id_i == id) {
                                _this.items.self[i].equiped = 1;
                            }
                        }
                    }
                });
            },
            unequipItem: function (id) {
                var _this = this;
                requests.items.unequip(id, function (data) {
                    if (!data.error) {
                        for (var i in _this.items.self) {
                            if (_this.items.self[i].id_i == id) {
                                _this.items.self[i].equiped = 0;
                            }
                        }
                    }
                });
            },
            equipSpell: function (id) {
                var _this = this;
                requests.spells.equip(id, function (data) {
                    if (!data.error) {
                        for (var i in _this.spells.self) {
                            if (_this.spells.self[i].id_s == id) {
                                _this.spells.self[i].equiped = 1;
                            }
                        }
                    }
                });
            },
            unequipSpell: function (id) {
                var _this = this;
                requests.spells.unequip(id, function (data) {
                    if (!data.error) {
                        for (var i in _this.spells.self) {
                            if (_this.spells.self[i].id_s == id) {
                                _this.spells.self[i].equiped = 0;
                            }
                        }
                    }
                });
            },
            dropping: function (type) {
                var _this = this;
                requests.drop(type, function (data) {
                    if (!data.error) {
                        requests.users.self(function (data) {
                            _this.self = data;
                        });

                        requests.items.self(function (data) {
                            _this.items.self = data;
                        });

                        requests.spells.self(function (data) {
                            _this.spells.self = data;
                        });
                    }
                });
            },
            loadAll: function () {
                var _this = this;
                requests.users.self(function (data) {
                    _this.self = data;
                });

                requests.items.self(function (data) {
                    _this.items.self = data;
                });

                requests.spells.self(function (data) {
                    _this.spells.self = data;
                });

                requests.users.ranking(0, 100, function(data){
                    _this.ranking.players = data;
                });
            },
            getProfile:function(login){
                var _this = this;
                requests.users.get(login, function(data){
                    _this.profile = data;
                    _this.show("profile");
                });
            },
            show:function(id){
                $("#"+id).show();
            },
            hide:function(id){
                $("#"+id).hide();
            },
            matchmaking:function(){
                socket.emit("matchmaking");
            }
        },
        ready: function () {
            this.loadAll();

           this.show("login");
        }
    });
});