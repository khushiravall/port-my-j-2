class Form { 

  constructor(){
    this.inputBox = createInput("").attribute("placeholder","Enter your name");
    this.playButton = createButton("Play");
    this.greeting = createElement("h4");
  }

  setPosition(){
    this.inputBox.position(width/2 - 100, height/2 - 80);
    this.playButton.position(width / 2 - 90, height / 2 - 20);
    this.greeting.position(width / 2 - 310, height / 2 - 100);
  }

  setStyle(){
    this.inputBox.class("customInput");
    this.playButton.class("customButton");
    this.greeting.class("greeting")
  }

  handleMousePressed(){
    this.playButton.mousePressed(() =>{
      this.inputBox.hide();
      this.playButton.hide();
      var message = `Hello ${this.inputBox.value()}.
      <br> Please wait for another player to join.`
      this.greeting.html(message);
      playerCount += 1; 
      playerObject.name = this.inputBox.value();
      playerObject.index = playerCount;
      playerObject.addPlayer();
      playerObject.updateCount (playerCount);
      playerObject.getDistance()
    })
  }
 
    display(){
      this.setPosition();
      this.setStyle();
      this.handleMousePressed();
    }

    hide(){
    this.greeting.hide()
    this.inputBox.hide()
    this.playButton.hide()
    }

}


























