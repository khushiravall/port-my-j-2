class Game{
  constructor(){
      this.playerMoving = false;
      this.leftKeyActive = false;
      this.resetButton = createButton("");

      this.leaderboardTitle = createElement("h2");

      this.leader1 = createElement("h3");
      this.leader2 = createElement("h3");
  }

    getState(){

      var gameStateRef = database.ref("gameState");
      gameStateRef.on("value", data =>{
          gameState = data.val()
      })
    }

      start(){
        playerObject = new Player();
        playerCount = playerObject.getCount();
        formObject = new Form()
        formObject.display();

        girl = createSprite(width / 2 - 50, height - 200);
        girl.addAnimation("gAnimation", girlAnimation1);
        girl.addAnimation("gAnimation2", girlAnimation);
        girl.scale = 0.5

        boy = createSprite(width / 2 + 100, height - 200);
        boy.addAnimation("bAnimation", boyAnimation1);
        boy.addAnimation("bAnimation2", boyAnimation);
        boy.scale = 0.5

        waterBottleGroup = new Group();
        powerCoinsGroup = new Group();
        carsGroup = new Group();

        humans = [girl, boy];
        
      var obstaclesPositions = [
      { x: width / 2 + 250, y: height - 800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 1300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 1800, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 2300, image: obstacle2Image },
      { x: width / 2, y: height - 2800, image: obstacle2Image },
      { x: width / 2 - 180, y: height - 3300, image: obstacle1Image },
      { x: width / 2 + 180, y: height - 3300, image: obstacle2Image },
      { x: width / 2 + 250, y: height - 3800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 4300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 4800, image: obstacle2Image },
      { x: width / 2, y: height - 5300, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 5500, image: obstacle2Image }
      ];
      
      this.addSprites(waterBottleGroup, 4, waterBottleImage, 0.09);
      this.addSprites(powerCoinsGroup, 8, powerCoinImage, 0.09);
      this.addSprites(carsGroup, obstaclesPositions.length, obstacle1Image, 0.09, obstaclesPositions);



    }
      handleElements(){
        formObject.hide();
        this.resetButton.class("resetButton");
       this.resetButton.position(width / 2 + 215, 50);

      this.leaderboardTitle.html("Leaderboard");
      this.leaderboardTitle.class("resetText");
      this.leaderboardTitle.position(width / 3 - 60, 40);

      this.leader1.class("leadersText");
      this.leader1.position(width / 3 - 50, 80);

      this.leader2.class("leadersText");
      this.leader2.position(width / 3 - 50, 130);
      }
      
      addSprites(spriteGroup, numberOfSprites, spriteImage, scale, positions = []) {
        for (var i = 0; i < numberOfSprites; i++) {
          var x, y;
    
          //C41 //SA
          if (positions.length > 0) {
            x = positions[i].x;
            y = positions[i].y;
            spriteImage = positions[i].image;
          } else {
            x = random(width / 2 + 150, width / 2 - 150);
            y = random(-height * 4.5, height - 400);
          }
          var sprite = createSprite(x, y);
          sprite.addImage("sprite", spriteImage);
    
          sprite.scale = scale;
          spriteGroup.add(sprite);
        }
      }


    handleWaterBottle(index) {
    // Adding fuel
    humans[index - 1].overlap(waterBottleGroup, function(collector, collected) {
      playerObject.life = 185;
      //collected is the sprite in the group collectibles that triggered
      //the event
      collected.remove();
    });
  }


  handlePowerCoin(index) {
    // Adding fuel
    humans[index - 1].overlap(powerCoinsGroup, function(collector, collected) {
      playerObject.score +=10;
      //collected is the sprite in the group collectibles that triggered
      //the event
      collected.remove();
    });
  }

  showRank() {
        swal({
          title: `Awesome!${"\n"}Rank${"\n"}${playerObject.rank}`,
          text: "You reached the Finish line successfully :)",
          imageUrl:
            "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
          imageSize: "100x100",
          confirmButtonText: "Ok"
        });
      }

      play(){
        this.handleElements();

        Player.getPlayersInfo();
        playerObject.getPlayersAtEnd();
        
        this.handleResetButton();
      

        if (allPlayers !== undefined) {
          image(trackImage, 0, -height * 5, width, height * 6);
          
          this.showLife();
          this.showLeaderboard();
         
          var index = 0;


          for (var plr in allPlayers){
            index = index + 1
          
            var currentlife = allPlayers[plr].life;

           if (currentlife <= 0) {
            this.gameOver()
            gameState = 2;
          }

            var x = allPlayers[plr].positionX
            var y = height - allPlayers[plr].positionY
            humans[index - 1].position.x = x
            humans[index - 1].position.y = y

            if(index === playerObject.index){
             stroke(10)
             fill("white")
             ellipse(x,y,60,60)

             if (playerObject.life <= 0) {
              this.playerMoving = false
              this.gameOver();
              gameState = 2;
               }

            this.handlePowerCoin(index);
            this.handleWaterBottle(index);
            this.handleHumanACollisionWithHumanB(index);
            this.handleObstacleCollision(index);
         
            if (this.playerMoving) {
              playerObject.positionY += 2;
              playerObject.update();
            }
            
            camera.position.y = humans[index - 1].position.y
            }
          }
           

          this.handlePlayerControls();

         const finishLine = height * 6 - 100;

                if (playerObject.positionY > finishLine) {
                  gameState = 2;
                  playerObject.rank += 1;
                  Player.updatePlayersAtEnd(playerObject.rank);
                  playerObject.update();
                  this.showRank();
                }
          drawSprites();
        }
        
      }


      end(){

      }

      update(state) {
            database.ref("/").update({
              gameState: state
            });
}

    showLife(){
      push()
      image(lifeImage, width /2 - 300, height - playerObject.positionY - 375, 20, 20);
      fill("white");
      rect(width / 2 - 245, height - playerObject.positionY - 375, 185, 20);
      fill("#f50057");
      rect(width / 2 - 245, height - playerObject.positionY - 375, playerObject.life, 20);
      noStroke();
      pop()
    }


    handlePlayerControls() 
  {

    if (keyIsDown(UP_ARROW)) {
      console.log("upArrow");

      this.playerMoving = true;
      playerObject.positionY += 5;
      playerObject.update();
    }

    if (keyIsDown(LEFT_ARROW) && playerObject.positionX > width / 3 - 50) {
     this.leftKeyActive = true;
      playerObject.positionX -= 5;
      playerObject.update();
    }

    if (keyIsDown(RIGHT_ARROW) && playerObject.positionX < width / 2 + 300) {
     this.leftKeyActive = false;
      playerObject.positionX += 5;
      playerObject.update();
    }
  }

    handleResetButton() {
        this.resetButton.mousePressed(() => {
          database.ref("/").set({
            playerCount: 0,
            gameState: 0,
            players: {},
            playersAtEnd: 0
          });
          window.location.reload();
        });
      }

   

      showLeaderboard() {
        var leader1, leader2;
        var players = Object.values(allPlayers);
        if (
          (players[0].rank === 0 && players[1].rank === 0) ||
          players[0].rank === 1
        ) {
          // &emsp;    This tag is used for displaying four spaces.
          leader1 =
            players[0].rank +
            "&emsp;" +
            players[0].name +
            "&emsp;" +
            players[0].score;
    
          leader2 =
            players[1].rank +
            "&emsp;" +
            players[1].name +
            "&emsp;" +
            players[1].score;
        }
    
        if (players[1].rank === 1) {
          leader1 =
            players[1].rank +
            "&emsp;" +
            players[1].name +
            "&emsp;" +
            players[1].score;
    
          leader2 =
            players[0].rank +
            "&emsp;" +
            players[0].name +
            "&emsp;" +
            players[0].score;
        }
    
        this.leader1.html(leader1);
        this.leader2.html(leader2);
      }

      handleHumanACollisionWithHumanB(index){
  
        if (index ===1)
           {
                if(humans[index-1].collide(humans[1])){
                      if(this.leftKeyActive){
                        playerObject.positionX += 100;
                      } else{
                        playerObject.positionX -= 100;
                      }
                      
                      if(playerObject.life>0){
                        playerObject.life -= 185/4
                      }
      
                      playerObject.update();
                }
          }
          if (index===2){
              if (humans[index-1].collide(humans[0])){
                    if(this.leftKeyActive){
                      playerObject.positionX += 100;
                    } else{
                      playerObject.positionX -= 100;
                    }
                    
                    if(playerObject.life>0){
                      playerObject.life -= 185/4
                    }
      
                    playerObject.update();
              }
          }
      }

        handleObstacleCollision(index) {
        if (humans[index - 1].collide(carsGroup)) {
          if (this.leftKeyActive) {
            playerObject.positionX += 100;
          } else {
            playerObject.positionX -= 100;
          }

          //Reducing Player Life
          if (playerObject.life > 0) {
            playerObject.life -= 185 / 4;
          }

          playerObject.update();
        }
      }

        gameOver() {
    swal({
      title: `Game Over`,
      text: "Thanks for Playing :)",
      confirmButtonText: "Try Again"
    });
  }
}
















