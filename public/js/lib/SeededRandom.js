var SeededRandom = function(seed){
    this.seed = seed;
}

SeededRandom.prototype.next = function(){
    if(this.seed == null || this.seed == undefined){
        this.seed = Date.now();
    }

    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
}
