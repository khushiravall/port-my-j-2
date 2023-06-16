class Player{
    constructor(){
        this.name = null 
        this.index = null
        this.positionX = 0 
        this.positionY = 0
        this.rank = 0
        this.score = 0 
        this.life = 185
    }

    getCount(){
        var getCountRef = database.ref("playerCount");
        getCountRef.on("value", data =>{
        playerCount = data.val()
            })
          }
    
    addPlayer(){
        var playerIndex = "players/player" + this.index;
                if(this.index === 1){
                    this.positionX = width / 2 - 100;
                } else {
                    this.positionX = width / 2 + 100;
                }
        database.ref(playerIndex).set({
            name: this.name,
            positionX: this.positionX,
            positionY: this.positionY,
            rank: this.rank,
            score: this.score 
        })
    }

    updateCount(count){
        database.ref("/").update({
            playerCount: count
        })
    }

    getDistance(){
        var playerDistanceRef = database.ref("players/player" + this.index);
        playerDistanceRef.on("value", data => {
            var data = data.val();
            this.positionX = data.positionX;
            this.positionY = data.positionY;
        })
    }


     static getPlayersInfo() {
        var playerInfoRef = database.ref("players");
        playerInfoRef.on("value", data => {
        allPlayers = data.val();
            });
          }

      getPlayersAtEnd() {
      database.ref("playersAtEnd").on("value", data => {
      this.rank = data.val();
    });
  }
    
    static updatePlayersAtEnd(rank){
        database.ref("/").update({
        playersAtEnd:rank
        })
    }

    update(){
        var playerIndex = "players/player" + this.index;
        database.ref(playerIndex).update({
            positionX: this.positionX,
            positionY: this.positionY, 
            rank: this.rank,
            score: this.score,
            life: this.life
        })
}
}

















