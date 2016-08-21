var SeededRandom = function(seed){
    this.seed = seed;
    console.log("xD");
}

SeededRandom.prototype.next = function(){
	console.log("prout");
    if(this.seed == null || this.seed == undefined){
        this.seed = Date.now();
    }

    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
}
