//Create variables here
var dog, dogImg, happyDogImg, database, foodS, foodStock;
var feedTime, lastFed;
var feed, addFood;
var foodObj;
var readstate,gameState;
var bedimg,washimg,gardenimg;
function preload()
{
  //load images here
  dogImg = loadImage("images/dogImg.png");
  happyDogImg = loadImage("images/happydogImg.png");
  bedimg=loadImage("vi/Bed Room.png");
  gardenimg=loadImage("vi/Garden.png");
  washimg=loadImage("vi/Wash Room.png");




}

function setup() {
  
  database = firebase.database();
  createCanvas(1000, 400);

  foodObj = new Food();
  foodStock = database.ref('Food');
  foodStock.on("value", readStock);

  dog = createSprite(800,200,150,150);
  dog.addImage(dogImg);
  dog.scale = 0.2;


readstate= database.ref("gameState");
readstate.on("value",function(data){
  gameState=data.val();
});


  feed = createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);
}


function draw() {  
  background(46, 139, 87);
  foodObj.display();

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
 
  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + " PM", 350,30);
  }
  else if(lastFed==0){
     text("Last Feed : 12 AM",350,30);
  }
  else{
     text("Last Feed : "+ lastFed + " AM", 350,30);
  }


// telling to change the scene with time
  currentTime=hour();
  if(currentTime==(lastFed+1)){
      update("Playing");
      foodObj.garden();
   }else if(currentTime==(lastFed+2)){
    update("Sleeping");
      foodObj.bedroom();
   }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
      foodObj.washroom();
   }else{
    update("Hungry")
    foodObj.display();
   }




//adding the gamestate

  if(gameState!="Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }else{
   feed.show();
   addFood.show();
   dog.addImage(dogImg);
  }

  drawSprites();  
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDogImg);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  });  
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  });
  dog.addImage(dogImg);
}

function update(state){
database.ref("/").update({
  gameState:state
})

}