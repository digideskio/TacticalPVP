var SPELL = {};

SPELL.RANDOM = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

SPELL.GET_DAMAGE = function(player, jet){
    var power = player.characteristics.power || 0;
    var damage = player.characteristics.damage || 0;

    return Math.floor(jet * (100 + power) /100 + damage);
}

SPELL.DAMAGE_PLAYER = function(player, damage){
    var resistance = player.characteristics.resistance || 0;
    var damresistance = player.characteristics.damresistance || 0;

    return (1 - resistance / 100) * (damage - damresistance);
}

SPELL.GET_HEAL = function(player, jet){
    var heal = player.characteristics.heal || 0;
    var damheal = player.characteristics.damheal || 0;

    return Math.floor(jet * (100 + heal) /100 + damheal);
}