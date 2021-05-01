
class ModelAnimation{

  constructor(name,time,arg,option,entity){
    this.name = name;
    this.loopTime = time;
    if(arg.start){
      this.running = arg.start;
      this.start = arg.start;
      entity.current = this;
      delete arg.start;
    }
    this.arg = arg;
    this.option = option;
    this.entity = entity;
  }

  name = null;
  loopTime = null;
  arg = null;
  option = null;
  entity = null;
  startTime = null;
  running = null; // si l'animation est déjà en fonctionnement au moment de sa création
  start = null; // passage de stop à start

}

ModelAnimation.prototype.update = function() {
  var self = this;
  if(this.running == true && this.start == false)this.Start();
  if(this.start == true){
    if(this.running == false)this.running = true;
    if(this.start == false)this.start = true;
    var ecart = Date.now() - this.startTime;
    ecart = new Date(ecart).getSeconds();
    var pourcentage = (ecart/this.loopTime)*100;
    this.animate(pourcentage);
    // ecart = ecart*0.001;
    if(ecart >= this.loopTime){

      this.Stop();
      if(this.option == "infinite")this.Start();
      // this.Start();
    }
  }
}

ModelAnimation.prototype.Start = function () {
  this.startTime = Date.now();
  this.running = true;
  this.start = true;
};

ModelAnimation.prototype.Stop = function () {
  this.startTime = null;
  this.running = false;
  this.start = false;
};

ModelAnimation.prototype.animate = function (pourcentage) {

  try{
    // console.log(this.arg[pourcentage]);
    if(this.arg[pourcentage]){
      for(var layerName of Object.keys(this.arg[pourcentage])){
        for(var propName of Object.keys(this.arg[pourcentage][layerName])){
          // console.log(this.arg[pourcentage][layerName][propName]);
          if(!this.entity.model.layers[layerName].dom)this.entity.model.layers[layerName].dom = document.getElementById(layerName);
          // console.log(this.entity.model.layers[layerName]);
          this.entity.model.layers[layerName].dom.style[propName] = this.arg[pourcentage][layerName][propName];
        }
      }
    }
  }catch(err){

  }

};

/*
*
*
*
*/
class ModelLayer{

  constructor(name, layer , modelParent = null){
    this.name = name;
    this.layer = layer;
    if(modelParent)this.model = modelParent;
  }

}

/*
*
*
*
*/
class EntityModel{

  layers = {}

  constructor(){

  }

}

EntityModel.prototype.addLayer = function (name,layer) {
  var self = this;
  self.layers[name] = new ModelLayer(name,layer,self);
};

/*
*
*
*
*/
class Entity{

  position = thorium.vec2();
  model = null;
  animations = {};
  current = null;

  constructor(name){
    var self = this;
    self.name = name;
    self.model = new EntityModel();
    self.template = self.render()
  }

}

Entity.prototype.update = function () {
  var self = this;
  if(self.current)self.current.update();
};

Entity.prototype.render = function () {
  var self = this;

  var result = [] , x = Object.keys(self.model.layers) , xLength = x.length - 1 , i = 0;
  if(xLength <= 0)return result;
  for(var layerName of x){
    result.push(self.model.layers[layerName].layer);
    if(i == xLength){
      return {
        type:'div',
        prop:{id:self.name},
        childrens : result
      };
    }
    i++;
  }

  // var layerLoader = new Promise(function(next){
  //     var result = [] , x = Object.keys(self.model.layers) , xLength = x.length - 1 , i = 0;
  //     if(xLength <= 0)next(result)
  //     for(var layerName of x){
  //       result.push(self.model.layers[layerName].layer);
  //       if(i == xLength)next(result);
  //       i++;
  //     }
  // })
  //
  // var result = {
  //   type:'div',
  //   prop:{id:self.name},
  //   childrens : await layerLoader
  // };
  //
  // // console.log(result);
  //
  // return result;
};

Entity.prototype.addLayer = function (name,layer) {
  this.model.addLayer(name,layer);
  this.template = this.render();
  return this.model.addLayer(name,layer);
};

Entity.prototype.addAnimation = function (time,arg,option) {
  var name = String(arg.name);
  delete arg.name;
  this.animations[name] = new ModelAnimation(name,time,arg,option,this);
  return this.animations[name];
};

Entity.prototype.animationStart = function (name) {
  this.animation[name].start();
};

Entity.prototype.animationStop = function (name) {
  this.animation[name].stop();
};


class ThoriumEntitites{

  list = {};

  constructor(root){
    this.root = root;
  }

}

ThoriumEntitites.prototype.initialise = function (arg) {
  // console.log("ThoriumEntitites.prototype.initialise à faire !!");
  console.log("%cThoriumEntitites.prototype.initialise à faire !!", "border: 1px solid red;color: red;");
};

ThoriumEntitites.prototype.update = function (arg) {
  var self = this;
  for(var entityName of Object.keys(self.list)){
    // if(self.list[entityName])
    // console.log(self.list[entityName]);
    self.list[entityName].update();

  }

};

ThoriumEntitites.prototype.entity = function(name){
  return new Entity(name)
}

ThoriumEntitites.prototype.addEntity = function(entity){
  this.list[entity.name] = entity;
}
