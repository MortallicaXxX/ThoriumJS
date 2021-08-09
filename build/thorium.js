class ThoriumConsole{

  styles = {
    w : "border: 1px solid red;color: red;", // messages warning
    type1 : "background: green;color: white;",
    type2 : "background: blue;color: white;",
    type3 : "background: orange;color: white;",
    type4 : "background: red;color: white;",
  };

  constructor(){

  }

}

ThoriumConsole.prototype.setStyle = function (name,def) {
  try{
    if(this.styles[name])throw {err:1,msg:"Il semblerait que ce style existe déjà", style:this.style[name] , name:name};
    this.styles[name] = def;
  }catch(err){
    console.error(err);
  }
};

ThoriumConsole.prototype.removeStyle = function () {
  try{
    delete this.styles[name];
  }catch(err){
    console.error(err);
  }
};


ThoriumConsole.prototype.log = function (message=null,style=null) {

  try{

    if(typeof style == "object")throw {err:1,msg:"Le style doit être un string correspondant au style ou au nom d'un style définis"}

    if(this.styles[style])console.log(`%c${message}`,this.styles[style]);
    else console.log(`%c${message}`,style);

  }catch(err){
    console.error(err);
  }

};


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

class ThoriumCaches{

  data = {
    svg : {
      close :[
      '<svg viewBox="0 0 365.696 365.696" xmlns="http://www.w3.org/2000/svg"><path d="m243.1875 182.859375 113.132812-113.132813c12.5-12.5 12.5-32.765624 0-45.246093l-15.082031-15.082031c-12.503906-12.503907-32.769531-12.503907-45.25 0l-113.128906 113.128906-113.132813-113.152344c-12.5-12.5-32.765624-12.5-45.246093 0l-15.105469 15.082031c-12.5 12.503907-12.5 32.769531 0 45.25l113.152344 113.152344-113.128906 113.128906c-12.503907 12.503907-12.503907 32.769531 0 45.25l15.082031 15.082031c12.5 12.5 32.765625 12.5 45.246093 0l113.132813-113.132812 113.128906 113.132812c12.503907 12.5 32.769531 12.5 45.25 0l15.082031-15.082031c12.5-12.503906 12.5-32.769531 0-45.25zm0 0"/></svg>'
      ],
      thorium :[ '<svg xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" version="1.1" id="svg5037" viewBox="0 0 1000 1000"> <defs id="defs4" /> <metadata id="metadata7"> <rdf:RDF> <cc:Work rdf:about=""> <dc:format>image/svg+xml</dc:format> <dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage" /> <dc:title></dc:title> </cc:Work> </rdf:RDF> </metadata> <g id="layer1"> <g id="g1574-5" transform="matrix(7.1047724,0,0,7.1047724,1442.4897,69.507832)" style="stroke-width:2;stroke-miterlimit:4;stroke-dasharray:none"> <g id="g1186-6" transform="translate(-230.86742,-72.216224)" style="stroke-width:2;stroke-miterlimit:4;stroke-dasharray:none"> <g id="g1149-5" style="stroke-width:2;stroke-miterlimit:4;stroke-dasharray:none"> <path style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="m 89.435963,156.01864 2.407994,-2.73801 12.123883,-0.002 2.47225,2.73952" id="path1055-3" /> <g id="g1017-0" transform="translate(-0.11899099)" style="stroke-width:2;stroke-miterlimit:4;stroke-dasharray:none"> <path style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="m 97.895832,170.08928 h 10.961308 l 3.71465,-6.43395 v -19.6464 l 12.87876,-7.43556 v -19.58974 l -19.61722,3.77976 -0.94494,7.37054 -6.997799,3.09586" id="path873-7" /> <path style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="m 97.820645,113.32228 62.407435,-11.35896 1.06908,-6.414464 4.94448,-1.336349 1.20272,-6.949006 -28.33057,8.552624 -5.73148,8.483145" id="path875-49" /> <path style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="m 161.29716,95.548854 -25.92515,5.746296" id="path877-1" /> <path style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="m 97.895829,72.193451 0.203358,0.270409 5.200483,6.91519 c 0,0 27.39513,2.806329 30.46873,27.26149" id="path881-80" /> <path style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="m 125.45055,116.98363 30.55912,-6.61458 1.70089,-8.032" id="path883-34" /> <path style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="m 133.7684,106.64054 c 0,0 0.31865,1.83863 0.60213,8.26422" id="path885-9" /> <path style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="m 125.3936,126.71652 24.37946,-8.88244 1.51191,-6.61459" id="path887-54" /> <path style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="m 135.31547,123.03125 -0.94494,10.96131 2.36236,1.88988 -0.66146,13.60714 -21.63914,20.6942 -1.6064,-0.66146 -0.2541,-5.86699" id="path889-5" /> <path style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="M 119.44047,165.36458 V 140.02837" id="path891-1" /> <path style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="M 114.43229,170.18378 V 142.88897" id="path893-5" /> <path style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="m 111.50297,165.36458 c 0,0 0.75596,1.98438 -0.56696,4.44122 -1.32292,2.45685 -4.8192,7.08706 -4.8192,9.44941 0,2.36235 -0.37797,7.46503 1.41741,10.20535 1.79539,2.74033 5.00819,5.95313 6.4256,6.3311 1.41741,0.37798 -2.64583,-1.88988 1.22842,-5.38616 3.87426,-3.49628 7.74852,-8.12648 12.00075,-10.58333 4.25223,-2.45685 1.03943,-12.47321 3.87425,-6.89806 2.83482,5.57514 3.11831,3.59077 3.11831,1.5119 0,-2.07887 -0.18899,-9.35491 1.03943,-11.43378 1.22842,-2.07887 -1.88988,-10.96131 -1.88988,-10.96131" id="path895-8" /> <path style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="m 112.58729,180.27329 c 0,0 -4.81086,10.22306 1.5368,15.50164" id="path897-1" /> </g> <path style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="M 97.874282,170.08928 H 87.034454 l -3.673481,-6.43395 v -19.6464 l -12.73603,-7.43556 v -19.58974 l 19.39981,3.77976 0.934467,7.37054 6.920245,3.09586" id="path873-8-1" /> <path style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="m 97.948636,113.32228 -61.715796,-11.35896 -1.057232,-6.414464 -4.889682,-1.336349 -1.18939,-6.949006 28.016592,8.552624 5.66796,8.483145" id="path875-4-0" /> <path style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="m 35.175608,95.548854 25.637831,5.746296" id="path877-5-6" /> <path style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="m 97.874285,72.193451 -5.343952,7.185599 c 0,0 -27.09152,2.806329 -30.131056,27.26149" id="path881-8-9" /> <path style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="m 70.624943,116.98363 -30.220444,-6.61458 -1.68204,-8.032" id="path883-3-6" /> <path style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="m 62.399277,106.64054 c 0,0 -0.315118,1.83863 -0.595457,8.26422" id="path885-1-7" /> <path style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="m 70.681262,126.71652 -24.109271,-8.88244 -1.495154,-6.61459" id="path887-5-1" /> <path style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="m 60.869353,123.03125 0.934467,10.96131 -2.336179,1.88988 0.65413,13.60714 21.399321,20.6942 1.588597,-0.66146 0.251284,-5.86699" id="path889-7-3" /> <path style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="M 76.568416,165.36458 V 140.02837" id="path891-3-2" /> <path style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="M 81.521092,170.18378 V 142.88897" id="path893-6-5" /> <path style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="m 84.417947,165.36458 c 0,0 -0.747582,1.98438 0.560677,4.44122 1.308258,2.45685 4.76579,7.08706 4.76579,9.44941 0,2.36235 0.373781,7.46503 -1.401701,10.20535 -1.775492,2.74033 -4.952686,5.95313 -6.354387,6.3311 -1.401702,0.37798 2.616507,-1.88988 -1.214806,-5.38616 -3.831323,-3.49628 -7.662646,-8.12648 -11.86775,-10.58333 -4.205104,-2.45685 -1.027911,-12.47321 -3.831313,-6.89806 -2.803403,5.57514 -3.083751,3.59077 -3.083751,1.5119 0,-2.07887 0.186895,-9.35491 -1.027911,-11.43378 -1.214805,-2.07887 1.868936,-10.96131 1.868936,-10.96131" id="path895-7-9" /> <path style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="m 83.345644,180.27329 c 0,0 4.757543,10.22306 -1.519768,15.50164" id="path897-6-6" /> <path style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="m 93.796386,143.33032 4.023998,1.82878 4.142936,-1.83582" id="path1059-6" /> <path style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="m 96.139282,158.1556 3.418615,0.001" id="path1057-9" /> </g> <path style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="m 90.959219,128.13393 6.812381,3.09586 6.9978,-3.09586" id="path1151-5" /> <path style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="m 92.530331,79.37905 5.343953,-7.185599 5.306396,7.185599" id="path1153-2" /> </g> <path style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="m -138.54245,40.084374 5.37669,1.021681 5.10743,-0.889389" id="path1539-0" /> </g> </g> </svg>'
      ],
      thoriumColor :[ '<svg xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" version="1.1" id="svg6330" viewBox="0 0 1000 1000"> <defs id="defs4" /> <metadata id="metadata7"> <rdf:RDF> <cc:Work rdf:about=""> <dc:format>image/svg+xml</dc:format> <dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage" /> <dc:title></dc:title> </cc:Work> </rdf:RDF> </metadata> <g id="layer1"> <g id="g2036" transform="matrix(7.1044941,0,0,7.1044941,1435.7579,-2022.7002)"> <path style="fill:#e6e6e6;fill-opacity:1;stroke:none;stroke-width:0.263353px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -159.25092,334.28608 0.0565,9.73289 -24.15334,-8.88244 -1.49789,-6.61461 -4.68088,-0.85042 -1.68511,-8.03201 -2.49417,-0.37372 -1.05916,-6.41448 -4.89862,-1.33633 -1.19157,-6.94902 28.0678,8.55263 5.67832,8.48315 -0.97905,10.60548 z" id="path1920-6" /> <path style="fill:#e6e6e6;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -104.59095,334.28606 -0.057,9.73289 24.379456,-8.88244 1.511909,-6.61461 4.724701,-0.85042 1.70089,-8.03201 2.517518,-0.37372 1.069081,-6.41448 4.94448,-1.33633 1.202719,-6.94902 -28.330569,8.55263 -5.731481,8.48315 0.988221,10.60548 z" id="path1920" /> <path style="fill:#f6f749;fill-opacity:1;stroke:none;stroke-width:0.268089px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -144.8637,382.53472 2.03199,7.32883 2.98805,4.63021 0.40747,6.35 -1.76567,6.87916 -6.35289,5.22216 0.64839,-3.50237 -10.72987,-10.31875 -4.61792,-3.17499 -1.49404,-4.63021 -0.13582,-2.51354 -2.85225,4.23333 -1.49403,0.26458 -0.13582,-11.37708 -1.49404,-3.43958 2.58595,-9.2754 19.40303,18.14285 z" id="path1898-5" /> <path style="fill:#f6f749;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -118.53853,382.667 -1.97918,7.32883 -2.91041,4.63021 -0.39688,6.35 1.71979,6.87916 6.1878,5.22216 -0.63155,-3.50237 10.45104,-10.31875 4.49792,-3.17499 1.45521,-4.63021 0.13229,-2.51354 2.778126,4.23333 1.455209,0.26458 0.132291,-11.37708 1.455209,-3.43958 -2.518739,-9.2754 -18.898816,18.14285 z" id="path1898" /> <path style="fill:#c89688;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -159.29757,334.28606 2e-5,19.58973 12.73601,7.43555 v 19.6464 l 3.67348,6.43395 h 21.7037 l 3.71465,-6.43395 v -19.6464 l 12.87876,-7.43555 v -19.58973 l -19.61722,3.77976 -0.94494,7.37052 -6.9978,3.09587 -6.81239,-3.09587 -0.93446,-7.37052 z" id="path1896" /> <path style="fill:#999999;fill-opacity:1;stroke:none;stroke-width:0.285663px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -137.39218,297.87209 5.34395,-8.37623 5.3064,8.37623 z" id="path1894" /> <path style="fill:#999999;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -167.52323,323.94297 c 0,0 1.87949,-22.81232 30.13105,-27.2615 28.25156,-4.44918 38.83489,19.09873 38.83489,19.09873 l 2.284187,8.16277 -35.700777,6.68174 z" id="path1892" /> <path style="fill:#666666;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -146.56154,361.31134 -0.25128,25.5134 c 0,0 -1.5886,0.66146 -1.5886,0.66146 l -4.95268,-4.8192 v -25.33621 z" id="path1888" /> <path style="fill:#999999;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -159.24125,344.01895 -0.0563,9.85684 5.94347,3.455 V 382.667 l -16.44664,-15.875 -0.65413,-13.60715 2.33618,-1.88986 -0.93447,-10.96132 z" id="path1886" /> <path style="fill:#666666;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -117.46971,361.31134 6.86868,-3.98055 V 382.667 l -5.00819,4.8192 -1.60639,-0.66146 z" id="path1884" /> <path style="fill:#999999;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -104.6479,344.01895 9.921866,-3.68528 -0.944941,10.96132 2.362359,1.88986 -0.661458,13.60715 -16.630956,15.875 v -25.33621 l 6.01008,-3.455 z" id="path1882" /> <path style="fill:#666666;fill-opacity:1;stroke:none;stroke-width:0.265;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="m -168.11869,332.20718 0.59546,-8.26421 35.30237,6.68174 35.947755,-6.68174 0.60213,8.26421 -28.537195,5.85864 -0.94494,7.37052 -6.88994,3.09587 -6.92025,-3.09587 -0.93446,-7.37052 -28.22093,-5.85864" id="path1880" /> <g id="g1574-5-8" transform="translate(0.94490496,289.51865)" style="stroke-width:2;stroke-miterlimit:4;stroke-dasharray:none"> <g id="g1186-6-3" transform="translate(-230.86742,-72.216224)" style="stroke-width:2;stroke-miterlimit:4;stroke-dasharray:none"> <g id="g1149-5-8" style="stroke-width:2;stroke-miterlimit:4;stroke-dasharray:none"> <path style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="m 89.435963,156.01864 2.407994,-2.73801 12.123883,-0.002 2.47225,2.73952" id="path1055-3-3" /> <g id="g1017-0-1" transform="translate(-0.11899099)" style="stroke-width:2;stroke-miterlimit:4;stroke-dasharray:none"> <path style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="m 97.895832,170.08928 h 10.961308 l 3.71465,-6.43395 v -19.6464 l 12.87876,-7.43556 v -19.58974 l -19.61722,3.77976 -0.94494,7.37054 -6.997799,3.09586" id="path873-7-6" /> <path style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="m 97.820645,113.32228 62.407435,-11.35896 1.06908,-6.414464 4.94448,-1.336349 1.20272,-6.949006 -28.33057,8.552624 -5.73148,8.483145" id="path875-49-8" /> <path style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="m 161.29716,95.548854 -25.92515,5.746296" id="path877-1-3" /> <path style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="m 97.895829,72.193451 0.203358,0.270409 5.200483,6.91519 c 0,0 27.39513,2.806329 30.46873,27.26149" id="path881-80-2" /> <path style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="m 125.45055,116.98363 30.55912,-6.61458 1.70089,-8.032" id="path883-34-1" /> <path style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="m 133.7684,106.64054 c 0,0 0.31865,1.83863 0.60213,8.26422" id="path885-9-2" /> <path style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="m 125.3936,126.71652 24.37946,-8.88244 1.51191,-6.61459" id="path887-54-2" /> <path style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="m 135.31547,123.03125 -0.94494,10.96131 2.36236,1.88988 -0.66146,13.60714 -21.63914,20.6942 -1.6064,-0.66146 -0.2541,-5.86699" id="path889-5-8" /> <path style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="M 119.44047,165.36458 V 140.02837" id="path891-1-2" /> <path style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="M 114.43229,170.18378 V 142.88897" id="path893-5-4" /> <path style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="m 111.50297,165.36458 c 0,0 0.75596,1.98438 -0.56696,4.44122 -1.32292,2.45685 -4.8192,7.08706 -4.8192,9.44941 0,2.36235 -0.37797,7.46503 1.41741,10.20535 1.79539,2.74033 5.00819,5.95313 6.4256,6.3311 1.41741,0.37798 -2.64583,-1.88988 1.22842,-5.38616 3.87426,-3.49628 7.74852,-8.12648 12.00075,-10.58333 4.25223,-2.45685 1.03943,-12.47321 3.87425,-6.89806 2.83482,5.57514 3.11831,3.59077 3.11831,1.5119 0,-2.07887 -0.18899,-9.35491 1.03943,-11.43378 1.22842,-2.07887 -1.88988,-10.96131 -1.88988,-10.96131" id="path895-8-2" /> <path style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="m 112.58729,180.27329 c 0,0 -4.81086,10.22306 1.5368,15.50164" id="path897-1-5" /> </g> <path style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="M 97.874282,170.08928 H 87.034454 l -3.673481,-6.43395 v -19.6464 l -12.73603,-7.43556 v -19.58974 l 19.39981,3.77976 0.934467,7.37054 6.920245,3.09586" id="path873-8-1-1" /> <path style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="m 97.948636,113.32228 -61.715796,-11.35896 -1.057232,-6.414464 -4.889682,-1.336349 -1.18939,-6.949006 28.016592,8.552624 5.66796,8.483145" id="path875-4-0-8" /> <path style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="m 35.175608,95.548854 25.637831,5.746296" id="path877-5-6-9" /> <path style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="m 97.874285,72.193451 -5.343952,7.185599 c 0,0 -27.09152,2.806329 -30.131056,27.26149" id="path881-8-9-3" /> <path style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="m 70.624943,116.98363 -30.220444,-6.61458 -1.68204,-8.032" id="path883-3-6-9" /> <path style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="m 62.399277,106.64054 c 0,0 -0.315118,1.83863 -0.595457,8.26422" id="path885-1-7-8" /> <path style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="m 70.681262,126.71652 -24.109271,-8.88244 -1.495154,-6.61459" id="path887-5-1-6" /> <path style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="m 60.869353,123.03125 0.934467,10.96131 -2.336179,1.88988 0.65413,13.60714 21.399321,20.6942 1.588597,-0.66146 0.251284,-5.86699" id="path889-7-3-1" /> <path style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="M 76.568416,165.36458 V 140.02837" id="path891-3-2-8" /> <path style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="M 81.521092,170.18378 V 142.88897" id="path893-6-5-7" /> <path style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="m 84.417947,165.36458 c 0,0 -0.747582,1.98438 0.560677,4.44122 1.308258,2.45685 4.76579,7.08706 4.76579,9.44941 0,2.36235 0.373781,7.46503 -1.401701,10.20535 -1.775492,2.74033 -4.952686,5.95313 -6.354387,6.3311 -1.401702,0.37798 2.616507,-1.88988 -1.214806,-5.38616 -3.831323,-3.49628 -7.662646,-8.12648 -11.86775,-10.58333 -4.205104,-2.45685 -1.027911,-12.47321 -3.831313,-6.89806 -2.803403,5.57514 -3.083751,3.59077 -3.083751,1.5119 0,-2.07887 0.186895,-9.35491 -1.027911,-11.43378 -1.214805,-2.07887 1.868936,-10.96131 1.868936,-10.96131" id="path895-7-9-7" /> <path style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="m 83.345644,180.27329 c 0,0 4.757543,10.22306 -1.519768,15.50164" id="path897-6-6-9" /> <path style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="m 93.796386,143.33032 4.023998,1.82878 4.142936,-1.83582" id="path1059-6-2" /> <path style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="m 96.139282,158.1556 3.418615,0.001" id="path1057-9-5" /> </g> <path style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="m 90.959219,128.13393 6.812381,3.09586 6.9978,-3.09586" id="path1151-5-2" /> <path style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="m 92.530331,79.37905 5.343953,-7.185599 5.306396,7.185599" id="path1153-2-5" /> </g> <path style="fill:none;stroke:#000000;stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="m -138.54245,40.084374 5.37669,1.021681 5.10743,-0.889389" id="path1539-0-3" /> </g> </g> </g> </svg>'
      ],
    th_bg1 : [ '<svg xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1920 1080" version="1.1" id="SVGRoot"> <defs id="defs2215"> <radialGradient xlink:href="#linearGradient11125" id="radialGradient11129-4" cx="-13.737825" cy="364.96576" fx="-13.737825" fy="364.96576" r="960" gradientTransform="matrix(-0.48401597,0,0,-0.60579161,-2871.5557,1059.2911)" gradientUnits="userSpaceOnUse" /> <linearGradient id="linearGradient11125"> <stop style="stop-color:#ffffff;stop-opacity:1;" offset="0" id="stop11121" /> <stop style="stop-color:#ffffff;stop-opacity:0" offset="1" id="stop11123" /> </linearGradient> <filter style="color-interpolation-filters:sRGB" id="filter11611-4" x="-0.20749959" width="1.4149992" y="-0.86140275" height="2.7228055"> <feGaussianBlur stdDeviation="165.99968" id="feGaussianBlur11613-2" /> </filter> </defs> <metadata id="metadata2218"> <rdf:RDF> <cc:Work rdf:about=""> <dc:format>image/svg+xml</dc:format> <dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage" /> <dc:title></dc:title> </cc:Work> </rdf:RDF> </metadata> <g id="layer1"> <g id="g2213" transform="matrix(1.0054294,0,0,1.1944014,3817.7631,-455.34654)"> <rect style="fill:#4343ff;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:14.029;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" id="rect11099-9" width="1920" height="462.50052" x="-3800.2263" y="838.15723" /> <g id="g2207" transform="translate(-1.0271396,-3.5088853)"> <rect style="fill:#000333;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:14.029;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" id="rect13083-2" width="1921.0265" height="466.00842" x="-3800.2263" y="375.65771" /> <rect style="fill:url(#radialGradient11129-4);fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:14.029;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;filter:url(#filter11611-4)" id="rect11099-5-1" width="1920" height="462.50052" x="-3827.0322" y="776.28253" /> </g> </g> </g> </svg>'
    ],
    th_bg3 : [ '<svg xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg"viewBox="0 0 1920 1080" version="1.1" id="SVGRoot"> <defs id="defs2215"> <filter style="color-interpolation-filters:sRGB" id="filter15016-6" x="-0.054822333" width="1.1096447" y="-0.054822333" height="1.1096447"> <feGaussianBlur stdDeviation="6.7932106" id="feGaussianBlur15018-5" /> </filter> </defs> <metadata id="metadata2218"> <rdf:RDF> <cc:Work rdf:about=""> <dc:format>image/svg+xml</dc:format> <dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage" /> <dc:title></dc:title> </cc:Work> </rdf:RDF> </metadata> <g id="layer1"> <g id="g27451" transform="matrix(1.0089688,0,0,1.2736842,3826.671,-501.72791)"> <g id="g15004-6" transform="matrix(0.78415801,0,0,0.34329176,-2824.3449,518.20921)" style="opacity:0.609137;filter:url(#filter15016-6)"> <g id="g11097-1-4" transform="matrix(2.1953124,0,0,2.1953124,45.294983,-576.08613)"> <g id="XMLID_32_-5-9-0-6" transform="matrix(0.27359266,0,0,0.27359266,-99.483337,672.04166)" style="fill:#fffae3;fill-opacity:1;stroke:none"> <g id="g4-6-7-7" style="fill:#fffae3;fill-opacity:1;stroke:none"> <path id="circle2-8-1-4" style="fill:#fffae3;fill-opacity:1;stroke:none" d="m 495.14001,247.57001 a 247.57001,247.57001 0 0 1 -247.57,247.57 A 247.57001,247.57001 0 0 1 0,247.57001 247.57001,247.57001 0 0 1 247.57001,0 a 247.57001,247.57001 0 0 1 247.57,247.57001 z" /> </g> </g> <path d="m -58.890397,739.77499 c 0,-30.33704 19.94874,-56.01481 47.4407,-64.63872 -6.40782,-2.01009 -13.22903,-3.09461 -20.30031,-3.09461 -37.40832,0 -67.73333,30.32501 -67.73333,67.73333 0,37.40833 30.32501,67.73334 67.73333,67.73334 7.07128,0 13.89441,-1.08507 20.3025,-3.09543 -27.49196,-8.62364 -47.44289,-34.30086 -47.44289,-64.63791 z" fill="#fee97d" id="path7-70-7-5" style="fill:#fff9de;fill-opacity:1;stroke:none;stroke-width:0.273593;stroke-opacity:1" /> <g id="XMLID_222_-9-54-2-4" transform="matrix(0.27359266,0,0,0.27359266,-99.483337,672.04166)" style="fill:#262626;fill-opacity:0.124242;stroke:none"> <g id="g29-7-4-5" style="fill:#262626;fill-opacity:0.124242;stroke:none"> <path d="m 495.09,251.71 h 0.01 c -0.58,35.83 -8.78,69.81 -23.04,100.39 l -0.02,-0.01 c -19.11,-7.74 -32.59,-26.46 -32.59,-48.35 0,-28.8 23.35,-52.15 52.15,-52.15 1.17,0 2.33,0.05 3.49,0.12 z" fill="#fee97d" id="path9-2-9-8" style="fill:#262626;fill-opacity:0.124242;stroke:none" /> <path d="m 247.57,456.33 c 21.57,0 39.7,14.77 44.8,34.76 -14.53,2.66 -29.5,4.05 -44.8,4.05 -15.3,0 -30.27,-1.39 -44.8,-4.05 5.1,-19.99 23.23,-34.76 44.8,-34.76 z" fill="#fedf30" id="path11-6-8-8" style="fill:#262626;fill-opacity:0.124242;stroke:none" /> <g fill="#fee97d" id="g19-74-5-8" style="fill:#262626;fill-opacity:0.124242;stroke:none"> <path d="m 307.32,345.89 c 16.67,0 30.19,13.52 30.19,30.19 0,16.68 -13.52,30.19 -30.19,30.19 -16.68,0 -30.2,-13.51 -30.2,-30.19 0,-16.67 13.52,-30.19 30.2,-30.19 z" id="path13-3-4-2" style="fill:#262626;fill-opacity:0.124242;stroke:none" /> <path id="circle15-70-3-4" style="fill:#262626;fill-opacity:0.124242;stroke:none" d="m 383.41,296.73001 a 21.35,21.35 0 0 1 -21.35,21.35 21.35,21.35 0 0 1 -21.35,-21.35 21.35,21.35 0 0 1 21.35,-21.35 21.35,21.35 0 0 1 21.35,21.35 z" /> <path id="circle17-6-5-4" style="fill:#262626;fill-opacity:0.124242;stroke:none" d="m 373.52999,182.46001 a 57.450001,57.450001 0 0 1 -57.45,57.45 57.450001,57.450001 0 0 1 -57.45,-57.45 57.450001,57.450001 0 0 1 57.45,-57.45 57.450001,57.450001 0 0 1 57.45,57.45 z" /> </g> <path id="circle21-22-7-1" style="fill:#262626;fill-opacity:0.124242;stroke:none" d="m 181.43999,296.26999 a 33.07,33.07 0 0 1 -33.06999,33.07 33.07,33.07 0 0 1 -33.07,-33.07 33.07,33.07 0 0 1 33.07,-33.07 33.07,33.07 0 0 1 33.06999,33.07 z" /> <path d="m 148.37,329.34 c 4.585,0 8.953,-0.935 12.923,-2.623 -6.789,-20.134 -11.059,-41.427 -12.435,-63.505 -0.163,-0.002 -0.324,-0.012 -0.488,-0.012 -18.27,0 -33.07,14.81 -33.07,33.07 0,18.26 14.8,33.07 33.07,33.07 z" fill="#fedf30" id="path23-4-0-6" style="fill:#262626;fill-opacity:0.124242;stroke:none" /> <path d="m 86.99,191.57 c 11.15,0 20.19,9.04 20.19,20.18 0,11.15 -9.04,20.19 -20.19,20.19 -11.15,0 -20.18,-9.04 -20.18,-20.19 0,-11.14 9.03,-20.18 20.18,-20.18 z" fill="#fedf30" id="path25-03-6-6" style="fill:#262626;fill-opacity:0.124242;stroke:none" /> <path d="m 173.32,11.34 c 2.24,8.27 3.45,16.97 3.45,25.95 0,54.63 -44.29,98.92 -98.93,98.92 -16.4,0 -31.87,-4 -45.49,-11.06 H 32.34 C 62.99,71.37 113.22,30.2 173.32,11.33 Z" fill="#fedf30" id="path27-85-2-3" style="fill:#262626;fill-opacity:0.124242;stroke:none" /> </g> </g> </g> </g> <path style="fill:#ffffff;fill-opacity:0.512121;stroke:none;stroke-width:0.101226px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -3772.1627,901.54471 c 0,0 14.9671,-2.62891 43.4046,-1.97168 28.4375,0.65723 32.9276,3.50521 65.8552,1.97168 32.9276,-1.53353 31.4309,-2.62891 65.8552,-1.09537 34.4243,1.53352 31.4309,3.28613 10.477,2.84798 -20.954,-0.43815 -23.9474,-2.40983 -41.9079,-1.75261 -17.9605,0.65723 -53.8815,3.72429 -71.842,2.62891 -17.9605,-1.09538 -26.9408,-3.06706 -32.9276,-3.06706 -5.9869,0 -38.9145,3.28614 -38.9145,1.75261 0,-1.53353 0,-1.31446 0,-1.31446 z" id="path11131-59" /> <path style="fill:#ffffff;fill-opacity:0.512121;stroke:none;stroke-width:0.101226px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -3513.2962,901.56382 c 0,0 14.9671,-2.6289 43.4046,-1.97168 28.4375,0.65723 32.9276,3.50521 65.8552,1.97168 32.9276,-1.53353 31.4309,-2.6289 65.8552,-1.09537 34.4243,1.53352 31.4309,3.28613 10.477,2.84798 -20.954,-0.43815 -23.9474,-2.40983 -41.9079,-1.75261 -17.9605,0.65723 -53.8815,3.72429 -71.842,2.62891 -17.9605,-1.09538 -26.9408,-3.06706 -32.9276,-3.06706 -5.9869,0 -38.9145,3.28614 -38.9145,1.75261 0,-1.53353 0,-1.31446 0,-1.31446 z" id="path11131-1-0" /> <path style="fill:#ffffff;fill-opacity:0.512121;stroke:none;stroke-width:0.101226px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -3634.4197,918.85102 c 0,0 14.9671,-2.6289 43.4046,-1.97168 28.4375,0.65723 32.9276,3.50522 65.8552,1.97168 32.9276,-1.53353 31.4309,-2.6289 65.8552,-1.09537 34.4243,1.53352 31.4309,3.28613 10.477,2.84799 -20.954,-0.43816 -23.9474,-2.40984 -41.9079,-1.75262 -17.9605,0.65724 -53.8815,3.72429 -71.842,2.62892 -17.9605,-1.09538 -26.9408,-3.06707 -32.9276,-3.06707 -5.9869,0 -38.9145,3.28614 -38.9145,1.75261 0,-1.53353 0,-1.31446 0,-1.31446 z" id="path11131-1-4-1" /> <path style="fill:#ffffff;fill-opacity:0.512121;stroke:none;stroke-width:0.136255px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -3778.0717,1033.4673 c 0,0 14.9671,-4.7632 43.4046,-3.5724 28.4375,1.1908 32.9276,6.3509 65.8552,3.5724 32.9276,-2.7786 31.4309,-4.7632 65.8552,-1.9846 34.4243,2.7785 31.4309,5.954 10.477,5.16 -20.954,-0.7938 -23.9474,-4.3662 -41.9079,-3.1754 -17.9605,1.1908 -53.8815,6.7479 -71.842,4.7632 -17.9605,-1.9847 -26.9408,-5.5571 -32.9276,-5.5571 -5.9869,0 -38.9145,5.954 -38.9145,3.1755 0,-2.7785 0,-2.3816 0,-2.3816 z" id="path11131-8-0" /> <path style="fill:#ffffff;fill-opacity:0.512121;stroke:none;stroke-width:0.136255px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -3519.2052,1033.5019 c 0,0 14.9671,-4.7632 43.4046,-3.5724 28.4375,1.1908 32.9276,6.351 65.8552,3.5724 32.9276,-2.7785 31.4309,-4.7632 65.8552,-1.9847 34.4243,2.7786 31.4309,5.954 10.477,5.1602 -20.954,-0.7939 -23.9474,-4.3662 -41.9079,-3.1755 -17.9605,1.1908 -53.8815,6.7479 -71.842,4.7632 -17.9605,-1.9846 -26.9408,-5.557 -32.9276,-5.557 -5.9869,0 -38.9145,5.954 -38.9145,3.1754 0,-2.7785 0,-2.3816 0,-2.3816 z" id="path11131-1-3-2" /> <path style="fill:#ffffff;fill-opacity:0.512121;stroke:none;stroke-width:0.136255px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -3640.3287,1064.8239 c 0,0 14.9671,-4.7632 43.4046,-3.5725 28.4375,1.1909 32.9276,6.3511 65.8552,3.5725 32.9276,-2.7785 31.4309,-4.7632 65.8552,-1.9847 34.4243,2.7785 31.4309,5.9541 10.477,5.1602 -20.954,-0.7938 -23.9474,-4.3664 -41.9079,-3.1755 -17.9605,1.1908 -53.8815,6.7479 -71.842,4.7632 -17.9605,-1.9846 -26.9408,-5.5571 -32.9276,-5.5571 -5.9869,0 -38.9145,5.9541 -38.9145,3.1756 0,-2.7787 0,-2.3817 0,-2.3817 z" id="path11131-1-4-5-1" /> <path style="fill:#ffffff;fill-opacity:0.512121;stroke:none;stroke-width:0.179928px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -3763.8529,1155.2087 c 0,0 14.9671,-8.306 43.4045,-6.2295 28.4375,2.0765 32.9276,11.0747 65.8552,6.2295 32.9277,-4.8452 31.4309,-8.306 65.8553,-3.4608 34.4243,4.8451 31.4308,10.3825 10.4769,8.9982 -20.9539,-1.3844 -23.9473,-7.6139 -41.9078,-5.5374 -17.9606,2.0765 -53.8816,11.7669 -71.8421,8.306 -17.9605,-3.4608 -26.9407,-9.6903 -32.9276,-9.6903 -5.9868,0 -38.9144,10.3825 -38.9144,5.5373 0,-4.8452 0,-4.153 0,-4.153 z" id="path11131-8-6-4" /> <path style="fill:#ffffff;fill-opacity:0.512121;stroke:none;stroke-width:0.179928px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -3504.9864,1155.2691 c 0,0 14.9671,-8.306 43.4045,-6.2295 28.4375,2.0765 32.9276,11.0747 65.8552,6.2295 32.9277,-4.8452 31.4309,-8.306 65.8553,-3.4609 34.4243,4.8452 31.4308,10.3826 10.4769,8.9982 -20.9539,-1.3843 -23.9473,-7.6138 -41.9078,-5.5373 -17.9606,2.0765 -53.8816,11.7668 -71.8421,8.306 -17.9605,-3.4608 -26.9408,-9.6904 -32.9276,-9.6904 -5.9868,0 -38.9144,10.3826 -38.9144,5.5374 0,-4.8452 0,-4.153 0,-4.153 z" id="path11131-1-3-7-0" /> <path style="fill:#ffffff;fill-opacity:0.512121;stroke:none;stroke-width:0.179928px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -3626.1099,1209.8879 c 0,0 14.9671,-8.306 43.4045,-6.2295 28.4375,2.0765 32.9276,11.0748 65.8552,6.2295 32.9276,-4.8451 31.4309,-8.306 65.8553,-3.4608 34.4243,4.8452 31.4308,10.3826 10.4769,8.9983 -20.9539,-1.3842 -23.9473,-7.614 -41.9078,-5.5375 -17.9606,2.0768 -53.8816,11.767 -71.8421,8.3063 -17.9605,-3.461 -26.9407,-9.6906 -32.9276,-9.6906 -5.9868,0 -38.9144,10.3826 -38.9144,5.5376 0,-4.8454 0,-4.1533 0,-4.1533 z" id="path11131-1-4-5-5-7" /> <path style="fill:#ffffff;fill-opacity:0.512121;stroke:none;stroke-width:0.144813px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -1882.4429,937.89045 c 0,0 -16.9632,-4.74721 -49.1932,-3.56041 -32.23,1.18681 -37.3189,6.32962 -74.6379,3.56041 -37.319,-2.76921 -35.6227,-4.74721 -74.638,-1.978 -39.0153,2.7692 -35.6226,5.93401 -11.8742,5.14282 23.7484,-0.79121 27.1411,-4.35162 47.4969,-3.16482 20.3558,1.18681 61.0674,6.72522 81.4232,4.74722 20.3558,-1.97801 30.5337,-5.53842 37.3189,-5.53842 6.7853,0 44.1043,5.93402 44.1043,3.16481 0,-2.76921 0,-2.37361 0,-2.37361 z" id="path11131-5-7" /> <path style="fill:#ffffff;fill-opacity:0.512121;stroke:none;stroke-width:0.144813px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -2175.833,937.92496 c 0,0 -16.9632,-4.74721 -49.1931,-3.56041 -32.2301,1.18681 -37.319,6.32962 -74.638,3.56041 -37.319,-2.76921 -35.6226,-4.74721 -74.638,-1.978 -39.0152,2.7692 -35.6226,5.93401 -11.8742,5.14282 23.7485,-0.79121 27.1411,-4.35162 47.4969,-3.16482 20.3558,1.18681 61.0674,6.72522 81.4232,4.74722 20.3558,-1.97801 30.5337,-5.53842 37.319,-5.53842 6.7853,0 44.1042,5.93402 44.1042,3.16481 0,-2.76921 0,-2.37361 0,-2.37361 z" id="path11131-1-2-9" /> <path style="fill:#ffffff;fill-opacity:0.512121;stroke:none;stroke-width:0.144813px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -2038.5559,969.14177 c 0,0 -16.9632,-4.74724 -49.1932,-3.56044 -32.23,1.18681 -37.319,6.32964 -74.6379,3.56044 -37.319,-2.76924 -35.6227,-4.74724 -74.638,-1.97803 -39.0153,2.76923 -35.6226,5.93403 -11.8742,5.14283 23.7484,-0.7912 27.1411,-4.35163 47.4969,-3.1648 20.3558,1.1868 61.0674,6.7252 81.4232,4.7472 20.3558,-1.978 30.5337,-5.5384 37.3189,-5.5384 6.7853,0 44.1043,5.934 44.1043,3.1648 0,-2.7692 0,-2.3736 0,-2.3736 z" id="path11131-1-4-8-1" /> <path style="fill:#ffffff;fill-opacity:0.512121;stroke:none;stroke-width:0.144813px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -1907.9759,1015.6296 c 0,0 -16.9632,-4.7472 -49.1931,-3.5604 -32.2301,1.1868 -37.319,6.3296 -74.638,3.5604 -37.319,-2.7692 -35.6227,-4.7472 -74.638,-1.978 -39.0152,2.7692 -35.6226,5.934 -11.8742,5.1428 23.7485,-0.7912 27.1411,-4.3516 47.4969,-3.1648 20.3558,1.1868 61.0674,6.7252 81.4232,4.7472 20.3558,-1.978 30.5337,-5.5384 37.319,-5.5384 6.7852,0 44.1042,5.934 44.1042,3.1648 0,-2.7692 0,-2.3736 0,-2.3736 z" id="path11131-8-7-9" /> <path style="fill:#ffffff;fill-opacity:0.512121;stroke:none;stroke-width:0.144813px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -2201.366,1015.6641 c 0,0 -16.9631,-4.7472 -49.1931,-3.5604 -32.23,1.1868 -37.319,6.3296 -74.638,3.5604 -37.3189,-2.7692 -35.6226,-4.7472 -74.6379,-1.978 -39.0153,2.7692 -35.6227,5.934 -11.8743,5.1428 23.7485,-0.7912 27.1411,-4.3516 47.4969,-3.1648 20.3558,1.1868 61.0675,6.7252 81.4233,4.7472 20.3558,-1.978 30.5337,-5.5384 37.3189,-5.5384 6.7853,0 44.1042,5.934 44.1042,3.1648 0,-2.7692 0,-2.3736 0,-2.3736 z" id="path11131-1-3-3-3" /> <path style="fill:#ffffff;fill-opacity:0.512121;stroke:none;stroke-width:0.144813px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -2064.0889,1046.8808 c 0,0 -16.9632,-4.7472 -49.1932,-3.5604 -32.23,1.1868 -37.3189,6.3297 -74.6379,3.5604 -37.319,-2.7692 -35.6227,-4.7472 -74.638,-1.978 -39.0152,2.7692 -35.6226,5.9341 -11.8742,5.1429 23.7485,-0.7912 27.1411,-4.3517 47.4969,-3.1649 20.3558,1.1869 61.0674,6.7253 81.4232,4.7473 20.3558,-1.978 30.5337,-5.5385 37.319,-5.5385 6.7852,0 44.1042,5.9341 44.1042,3.1649 0,-2.7693 0,-2.3737 0,-2.3737 z" id="path11131-1-4-5-7-1" /> <path style="fill:#ffffff;fill-opacity:0.512121;stroke:none;stroke-width:0.191573px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -1995.7382,1110.2927 c 0,0 -16.9632,-8.3079 -49.1932,-6.2309 -32.23,2.077 -37.319,11.0773 -74.6379,6.2309 -37.319,-4.8464 -35.6227,-8.3079 -74.638,-3.4616 -39.0153,4.8462 -35.6226,10.385 -11.8742,9.0003 23.7484,-1.3847 27.1411,-7.6157 47.4969,-5.5387 20.3558,2.077 61.0674,11.7697 81.4232,8.308 20.3558,-3.4616 30.5337,-9.6925 37.3189,-9.6925 6.7853,0 44.1043,10.3848 44.1043,5.5385 0,-4.8464 0,-4.154 0,-4.154 z" id="path11131-8-6-8-1" /> <path style="fill:#ffffff;fill-opacity:0.512121;stroke:none;stroke-width:0.191573px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -2289.1283,1110.3531 c 0,0 -16.9632,-8.3079 -49.1932,-6.2309 -32.23,2.0769 -37.3189,11.0773 -74.6379,6.2309 -37.319,-4.8463 -35.6226,-8.3079 -74.638,-3.4617 -39.0152,4.8464 -35.6226,10.385 -11.8742,9.0004 23.7485,-1.3847 27.1411,-7.6156 47.4969,-5.5387 20.3558,2.077 61.0674,11.7696 81.4232,8.3079 20.3558,-3.4615 30.5337,-9.6926 37.319,-9.6926 6.7853,0 44.1042,10.3851 44.1042,5.5387 0,-4.8463 0,-4.154 0,-4.154 z" id="path11131-1-3-7-6-1" /> <path style="fill:#ffffff;fill-opacity:0.512121;stroke:none;stroke-width:0.191573px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -2151.8512,1164.9846 c 0,0 -16.9632,-8.3079 -49.1932,-6.231 -32.23,2.077 -37.319,11.0775 -74.6379,6.231 -37.319,-4.8462 -35.6227,-8.3079 -74.638,-3.4616 -39.0153,4.8463 -35.6226,10.385 -11.8742,9.0004 23.7484,-1.3846 27.1411,-7.6158 47.4969,-5.5388 20.3558,2.0772 61.0674,11.7697 81.4232,8.3082 20.3558,-3.4617 30.5337,-9.6928 37.3189,-9.6928 6.7853,0 44.1043,10.3851 44.1043,5.5388 0,-4.8464 0,-4.1542 0,-4.1542 z" id="path11131-1-4-5-5-3-3" /> <path style="fill:#ffffff;fill-opacity:0.7;stroke:none;stroke-width:0.0808082px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -2791.1252,912.84129 c 0,0 -9.4657,-2.64903 -27.4506,-1.98678 -17.985,0.66227 -20.8247,3.53205 -41.6494,1.98678 -20.8246,-1.54527 -19.878,-2.64903 -41.6493,-1.10376 -21.7712,1.54526 -19.878,3.31128 -6.626,2.86978 13.2521,-0.44151 15.1452,-2.42828 26.5041,-1.76602 11.3589,0.66226 34.0767,3.75279 45.4356,2.64903 11.3589,-1.10376 17.0384,-3.09054 20.8247,-3.09054 3.7863,0 24.6109,3.31129 24.6109,1.76602 0,-1.54527 0,-1.32451 0,-1.32451 z" id="path11131-5-1-5" /> <path style="fill:#ffffff;fill-opacity:0.7;stroke:none;stroke-width:0.0808082px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -2954.8421,912.86054 c 0,0 -9.4657,-2.64902 -27.4506,-1.98677 -17.985,0.66226 -20.8247,3.53204 -41.6494,1.98677 -20.8246,-1.54526 -19.878,-2.64902 -41.6493,-1.10376 -21.7712,1.54527 -19.878,3.31129 -6.626,2.86979 13.2521,-0.44151 15.1452,-2.42828 26.5041,-1.76603 11.3589,0.66226 34.0767,3.7528 45.4356,2.64904 11.3589,-1.10377 17.0384,-3.09054 20.8247,-3.09054 3.7863,0 24.6109,3.31129 24.6109,1.76602 0,-1.54527 0,-1.32452 0,-1.32452 z" id="path11131-1-2-0-60" /> <path style="fill:#ffffff;fill-opacity:0.7;stroke:none;stroke-width:0.0808082px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -2878.239,930.28008 c 0,0 -9.4658,-2.64904 -27.4507,-1.98679 -17.9849,0.66226 -20.8247,3.53206 -41.6493,1.98679 -20.8247,-1.54528 -19.8781,-2.64904 -41.6493,-1.10377 -21.7712,1.54528 -19.8781,3.31129 -6.626,2.86979 13.252,-0.44151 15.1452,-2.42829 26.5041,-1.76602 11.3589,0.66226 34.0767,3.75278 45.4356,2.64902 11.3589,-1.10375 17.0383,-3.09052 20.8246,-3.09052 3.7863,0 24.611,3.31128 24.611,1.76601 0,-1.54526 0,-1.32451 0,-1.32451 z" id="path11131-1-4-8-3-7" /> <path style="fill:#ffffff;fill-opacity:0.7;stroke:none;stroke-width:0.0808082px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -2548.0827,935.27268 c 0,0 -9.4658,-2.64903 -27.4507,-1.98678 -17.9849,0.66227 -20.8246,3.53205 -41.6493,1.98678 -20.8247,-1.54527 -19.8781,-2.64903 -41.6493,-1.10376 -21.7712,1.54526 -19.8781,3.31128 -6.626,2.86978 13.252,-0.44151 15.1452,-2.42828 26.5041,-1.76602 11.3589,0.66226 34.0767,3.75279 45.4356,2.64903 11.3589,-1.10376 17.0383,-3.09054 20.8246,-3.09054 3.7863,0 24.611,3.31129 24.611,1.76602 0,-1.54527 0,-1.32451 0,-1.32451 z" id="path11131-5-1-6-3" /> <path style="fill:#ffffff;fill-opacity:0.7;stroke:none;stroke-width:0.0808082px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -2711.7996,935.29193 c 0,0 -9.4658,-2.64902 -27.4507,-1.98677 -17.9849,0.66226 -20.8246,3.53204 -41.6493,1.98677 -20.8247,-1.54526 -19.8781,-2.64902 -41.6493,-1.10376 -21.7712,1.54527 -19.8781,3.31129 -6.626,2.86979 13.252,-0.44151 15.1452,-2.42828 26.5041,-1.76603 11.3589,0.66226 34.0767,3.7528 45.4356,2.64904 11.3589,-1.10377 17.0383,-3.09054 20.8246,-3.09054 3.7863,0 24.611,3.31129 24.611,1.76602 0,-1.54527 0,-1.32452 0,-1.32452 z" id="path11131-1-2-0-2-1" /> <path style="fill:#ffffff;fill-opacity:0.7;stroke:none;stroke-width:0.0808082px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -2635.1966,952.71147 c 0,0 -9.4657,-2.64904 -27.4506,-1.98679 -17.985,0.66226 -20.8247,3.53206 -41.6493,1.98679 -20.8247,-1.54528 -19.8781,-2.64904 -41.6494,-1.10377 -21.7712,1.54528 -19.878,3.31129 -6.626,2.86979 13.2521,-0.44151 15.1452,-2.42829 26.5041,-1.76602 11.3589,0.66226 34.0767,3.75278 45.4356,2.64902 11.3589,-1.10375 17.0384,-3.09052 20.8247,-3.09052 3.7863,0 24.6109,3.31128 24.6109,1.76601 0,-1.54526 0,-1.32451 0,-1.32451 z" id="path11131-1-4-8-3-4-0" /> <path style="fill:#ffffff;fill-opacity:0.7;stroke:none;stroke-width:0.0973024px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -2712.2886,1000.9533 c 0,0 -11.3978,-3.1897 -33.0537,-2.39227 -21.656,0.79745 -25.0753,4.25307 -50.1506,2.39227 -25.0753,-1.86064 -23.9355,-3.1897 -50.1506,-1.32901 -26.2151,1.86071 -23.9355,3.98721 -7.9785,3.45561 15.957,-0.5317 18.2366,-2.924 31.914,-2.1266 13.6774,0.7975 41.0323,4.5189 54.7097,3.1898 13.6775,-1.329 20.5162,-3.7214 25.0753,-3.7214 4.5592,0 29.6344,3.9872 29.6344,2.1265 0,-1.8607 0,-1.5949 0,-1.5949 z" id="path11131-5-1-7-9" /> <path style="fill:#ffffff;fill-opacity:0.7;stroke:none;stroke-width:0.0973024px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -2909.4226,1000.9765 c 0,0 -11.3979,-3.1897 -33.0538,-2.39228 -21.6559,0.79744 -25.0753,4.25298 -50.1506,2.39228 -25.0753,-1.86065 -23.9355,-3.1897 -50.1506,-1.32903 -26.2151,1.86073 -23.9355,3.98723 -7.9785,3.45563 15.957,-0.5317 18.2366,-2.924 31.914,-2.1266 13.6774,0.7975 41.0323,4.5189 54.7098,3.1898 13.6774,-1.3291 20.5161,-3.7214 25.0752,-3.7214 4.5592,0 29.6345,3.9872 29.6345,2.1265 0,-1.8607 0,-1.5949 0,-1.5949 z" id="path11131-1-2-0-6-8" /> <path style="fill:#ffffff;fill-opacity:0.7;stroke:none;stroke-width:0.0973024px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -2817.1837,1021.9517 c 0,0 -11.3979,-3.1898 -33.0538,-2.3923 -21.6559,0.7974 -25.0753,4.2529 -50.1506,2.3923 -25.0753,-1.8607 -23.9355,-3.1898 -50.1506,-1.3291 -26.215,1.8607 -23.9355,3.9872 -7.9785,3.4556 15.957,-0.5316 18.2366,-2.924 31.914,-2.1265 13.6775,0.7974 41.0323,4.5188 54.7098,3.1897 13.6774,-1.3291 20.5161,-3.7213 25.0753,-3.7213 4.5591,0 29.6344,3.9871 29.6344,2.1265 0,-1.8607 0,-1.5949 0,-1.5949 z" id="path11131-1-4-8-3-2-8" /> <path style="fill:#ffffff;fill-opacity:0.7;stroke:none;stroke-width:0.0973024px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -2616.7714,1027.9866 c 0,0 -11.3979,-3.1898 -33.0538,-2.3924 -21.6559,0.7975 -25.0753,4.253 -50.1506,2.3924 -25.0753,-1.8607 -23.9355,-3.1898 -50.1506,-1.3291 -26.215,1.8608 -23.9354,3.9872 -7.9785,3.4556 15.9571,-0.5316 18.2366,-2.9239 31.914,-2.1265 13.6775,0.7974 41.0323,4.5188 54.7098,3.1897 13.6774,-1.3291 20.5161,-3.7213 25.0753,-3.7213 4.5591,0 29.6344,3.9871 29.6344,2.1265 0,-1.8607 0,-1.5949 0,-1.5949 z" id="path11131-1-2-0-2-0-7" /> <path style="fill:#ffffff;fill-opacity:0.7;stroke:none;stroke-width:0.194544px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -2670.849,1137.3912 c 0,0 -16.4098,-8.8565 -47.5885,-6.6426 -31.1788,2.2142 -36.1017,11.8089 -72.2034,6.6426 -36.1017,-5.1664 -34.4608,-8.8565 -72.2034,-3.6905 -37.7427,5.1665 -34.4608,11.0708 -11.487,9.5949 22.9739,-1.4763 26.2558,-8.1186 45.9477,-5.9044 19.6918,2.2139 59.0755,12.5469 78.7673,8.8564 19.6919,-3.6901 29.5378,-10.3326 36.1017,-10.3326 6.564,0 42.6656,11.0707 42.6656,5.9043 0,-5.1662 0,-4.4281 0,-4.4281 z" id="path11131-5-1-7-4-4" /> <path style="fill:#ffffff;fill-opacity:0.7;stroke:none;stroke-width:0.161948px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -2954.6692,1137.4556 c 0,0 -11.3716,-8.8565 -32.9777,-6.6426 -21.6061,2.2142 -25.0176,11.8087 -50.0352,6.6426 -25.0177,-5.1664 -23.8805,-8.8565 -50.0353,-3.6905 -26.1547,5.1665 -23.8804,11.0708 -7.9601,9.5949 15.9203,-1.4763 18.1946,-8.1184 31.8406,-5.9044 13.6459,2.2139 40.9379,12.5469 54.5839,8.8565 13.6459,-3.6904 20.4689,-10.3327 25.0176,-10.3327 4.5486,0 29.5662,11.0707 29.5662,5.9043 0,-5.1661 0,-4.4281 0,-4.4281 z" id="path11131-1-2-0-6-4-6" /> <path style="fill:#ffffff;fill-opacity:0.7;stroke:none;stroke-width:0.194544px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -2821.8699,1195.6948 c 0,0 -16.4098,-8.8566 -47.5885,-6.6424 -31.1788,2.2142 -36.1017,11.8086 -72.2034,6.6424 -36.1018,-5.1664 -34.4607,-8.8566 -72.2035,-3.6902 -37.7426,5.1664 -34.4607,11.0708 -11.4869,9.5946 22.9739,-1.476 26.2558,-8.1187 45.9477,-5.9044 19.6918,2.2142 59.0755,12.547 78.7673,8.8565 19.6919,-3.6903 29.5378,-10.3324 36.1017,-10.3324 6.564,0 42.6656,11.0705 42.6656,5.9043 0,-5.1664 0,-4.4284 0,-4.4284 z" id="path11131-1-4-8-3-2-3-6" /> <path style="fill:#ffffff;fill-opacity:0.7;stroke:none;stroke-width:0.160823px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -2603.1798,1212.4514 c 0,0 -11.2142,-8.8568 -32.5212,-6.6429 -21.3069,2.2144 -24.6712,11.809 -49.3424,6.6429 -24.6713,-5.1666 -23.5498,-8.8568 -49.3425,-3.6904 -25.7926,5.1667 -23.5498,11.0708 -7.8499,9.5947 15.6998,-1.4759 17.9427,-8.1185 31.3997,-5.9043 13.4571,2.214 40.3711,12.5468 53.8282,8.8565 13.457,-3.6904 20.1855,-10.3326 24.6712,-10.3326 4.4856,0 29.1569,11.0704 29.1569,5.9045 0,-5.1664 0,-4.4284 0,-4.4284 z" id="path11131-1-2-0-2-0-6-4" /> <path style="fill:#ffffff;fill-opacity:0.512121;stroke:none;stroke-width:0.128262px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -3781.8134,968.04978 c 0,0 14.9671,-4.22073 43.4045,-3.16554 28.4375,1.05518 32.9276,5.62763 65.8552,3.16554 32.9276,-2.46209 31.4309,-4.22073 65.8553,-1.75862 34.4242,2.46207 31.4308,5.27589 10.4769,4.57244 -20.9539,-0.70345 -23.9473,-3.86899 -41.9078,-2.81382 -17.9606,1.05518 -53.8816,5.97936 -71.8421,4.22073 -17.9605,-1.75864 -26.9408,-4.92418 -32.9276,-4.92418 -5.9868,0 -38.9144,5.27591 -38.9144,2.81382 0,-2.46209 0,-2.11037 0,-2.11037 z" id="path11131-4-6" /> <path style="fill:#ffffff;fill-opacity:0.512121;stroke:none;stroke-width:0.128262px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -3443.6213,950.11995 c 0,0 14.9671,-4.22071 43.4045,-3.16554 28.4375,1.05518 32.9276,5.62763 65.8552,3.16554 32.9276,-2.46209 31.4309,-4.22071 65.8552,-1.75862 34.4243,2.46207 31.4309,5.27589 10.477,4.57244 -20.9539,-0.70345 -23.9473,-3.86899 -41.9078,-2.81382 -17.9606,1.05518 -53.8816,5.97936 -71.8421,4.22073 -17.9605,-1.75864 -26.9408,-4.92418 -32.9276,-4.92418 -5.9868,0 -38.9144,5.27591 -38.9144,2.81382 0,-2.46209 0,-2.11037 0,-2.11037 z" id="path11131-1-9-7" /> <path style="fill:#ffffff;fill-opacity:0.512121;stroke:none;stroke-width:0.128262px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -3564.7448,977.87463 c 0,0 14.9671,-4.22071 43.4045,-3.16554 28.4375,1.05519 32.9276,5.62765 65.8552,3.16554 32.9276,-2.46209 31.4309,-4.22071 65.8552,-1.75862 34.4243,2.46207 31.4309,5.2759 10.477,4.57246 -20.9539,-0.70347 -23.9473,-3.86901 -41.9078,-2.81384 -17.9606,1.0552 -53.8816,5.97937 -71.8421,4.22075 -17.9605,-1.75864 -26.9408,-4.9242 -32.9276,-4.9242 -5.9868,0 -38.9144,5.27591 -38.9144,2.81382 0,-2.46209 0,-2.11037 0,-2.11037 z" id="path11131-1-4-3-2" /> <path style="fill:#ffffff;fill-opacity:0.512121;stroke:none;stroke-width:0.101226px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -2385.1248,894.61622 c 0,0 14.9671,-2.62891 43.4045,-1.97168 28.4375,0.65723 32.9276,3.50521 65.8552,1.97168 32.9276,-1.53353 31.4309,-2.62891 65.8552,-1.09537 34.4243,1.53352 31.4309,3.28613 10.477,2.84798 -20.9539,-0.43815 -23.9473,-2.40983 -41.9078,-1.75261 -17.9606,0.65723 -53.8816,3.72429 -71.8421,2.62891 -17.9605,-1.09538 -26.9408,-3.06706 -32.9276,-3.06706 -5.9868,0 -38.9144,3.28614 -38.9144,1.75261 0,-1.53353 0,-1.31446 0,-1.31446 z" id="path11131-6-9" /> <path style="fill:#ffffff;fill-opacity:0.512121;stroke:none;stroke-width:0.101226px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -2126.2583,894.63533 c 0,0 14.9671,-2.6289 43.4045,-1.97168 28.4375,0.65723 32.9276,3.50521 65.8552,1.97168 32.9276,-1.53353 31.4309,-2.6289 65.8552,-1.09537 34.4243,1.53352 31.4309,3.28613 10.477,2.84798 -20.9539,-0.43815 -23.9473,-2.40983 -41.9078,-1.75261 -17.9606,0.65723 -53.8816,3.72429 -71.8421,2.62891 -17.9605,-1.09538 -26.9408,-3.06706 -32.9276,-3.06706 -5.9868,0 -38.9144,3.28614 -38.9144,1.75261 0,-1.53353 0,-1.31446 0,-1.31446 z" id="path11131-1-96-5" /> </g> </g> </svg>'
    ],
    th_bg4 : [ '<svg xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" version="1.1" id="SVGRoot"> <defs id="defs2215"> <filter style="color-interpolation-filters:sRGB" id="filter22534-5" x="-0.033689555" width="1.0673791" y="-0.25587586" height="1.5117517"> <feGaussianBlur stdDeviation="6.2307862" id="feGaussianBlur22536-9" /> </filter> <filter style="color-interpolation-filters:sRGB" id="filter22558-1" x="-0.033689555" width="1.0673791" y="-0.25587586" height="1.5117517"> <feGaussianBlur stdDeviation="6.2307862" id="feGaussianBlur22560-4" /> </filter> <filter style="color-interpolation-filters:sRGB" id="filter22558-8-8" x="-0.033689555" width="1.0673791" y="-0.25587586" height="1.5117517"> <feGaussianBlur stdDeviation="6.2307862" id="feGaussianBlur22560-7-2" /> </filter> <filter style="color-interpolation-filters:sRGB" id="filter23510-6-3" x="-0.027528314" width="1.0550566" y="-0.20908058" height="1.4181612"> <feGaussianBlur stdDeviation="5.0912828" id="feGaussianBlur23512-8-3" /> </filter> <filter style="color-interpolation-filters:sRGB" id="filter23510-1-7" x="-0.027528314" width="1.0550566" y="-0.20908058" height="1.4181612"> <feGaussianBlur stdDeviation="5.0912828" id="feGaussianBlur23512-7-4" /> </filter> <filter style="color-interpolation-filters:sRGB" id="filter23510-9" x="-0.027528314" width="1.0550566" y="-0.20908058" height="1.4181612"> <feGaussianBlur stdDeviation="5.0912828" id="feGaussianBlur23512-2" /> </filter> </defs> <metadata id="metadata2218"> <rdf:RDF> <cc:Work rdf:about=""> <dc:format>image/svg+xml</dc:format> <dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage" /> <dc:title></dc:title> </cc:Work> </rdf:RDF> </metadata> <g id="layer1"> <g id="g27394" transform="matrix(0.86322438,0,0,0.86322438,3414.8334,-147.28134)"> <g id="g27131"> <g id="g1836-7-7" transform="matrix(3.651809,0,0,3.651809,-2500.1798,1076.1472)" style="stroke:none"> <path style="fill:#b3b3b3;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -382.84216,-68.928334 4.34673,-2.26786 3.02381,-4.34673 3.21279,2.26786 6.61459,0.94494 h 8.69345 l 7.9375,-1.70089 0.94494,-2.26786 2.07887,-0.944944 1.32292,-1.5119 3.77975,-0.56697 1.32292,2.834824 2.26786,-0.944944 0.56696,-3.59077 1.13393,-1.70089 3.40179,3.21279 1.32291,2.26786 3.40179,1.322924 3.96875,-0.18899 2.26786,-3.590774 1.5119,1.13392 3.96875,1.13393 2.45685,3.779764 3.96875,0.37798 2.64583,-2.64583 3.59077,-1.322924 2.07887,-1.32292 4.34673,1.32292 h 3.77976 l 2.26785,0.56697 h 4.9137 l 1.88988,1.511904 2.07887,-1.700894 2.07886,-0.94494 0.94494,0.94494 1.51191,-1.51191 3.77976,3.023814 2.26786,-0.37797 1.5119,0.75595 3.02381,-0.56697 1.13393,0.56697 2.83482,-0.94494 1.70089,1.32291 1.7009,0.18899 2.45684,0.75595 1.88988,-0.37797 2.83483,1.32292 1.32291,-0.18899 2.07887,2.26785 2.64583,1.51191 2.07887,0.56696 1.51191,-0.75595 8.12648,0.37798 2.07888,-0.75596 2.45684,0.75596 2.07887,-0.56697 1.70089,0.75596 2.26786,-1.88989 3.59077,1.13393 2.64584,-0.37797 1.5119,1.32291 1.70089,-0.56696 2.45685,0.94494 5.10268,-0.94494 2.26785,1.13393 3.96875,-1.32292 2.26787,1.13393 4.15772,-1.32292 3.77977,3.02381 3.96875,-0.37797 5.85863,2.07887 2.64584,0.37797 2.45685,2.45685 2.26785,-1.13393 1.88988,-1.88988 2.64584,1.70089 3.77976,1.5119 1.5119,-1.88988 1.88988,-0.75595 3.2128,2.45685 1.03945,1.88988 1.70089,-0.28348 4.25223,2.45684 2.55134,2.83482 2.07887,-0.66145 1.51191,-1.03944 1.5119,0.18899 1.70089,1.32291 5.19718,2.83483 h -246.2515 z" id="path956-7-4-6" /> <path style="fill:#999999;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -382.84216,-58.647414 v -7.80521 -2.47571 l 9.1273,-0.53659 7.67065,1.87088 9.91568,-0.46772 12.34787,-2.05797 c 0,0 10.10277,2.15152 10.5705,2.15152 0.46773,0 6.26747,-2.61924 6.26747,-2.61924 l 10.28986,0.8419 7.7642,2.80633 14.12518,-3.08697 7.48355,2.71279 8.98025,3.92886 12.90913,-2.5257 9.72861,-1.21607 7.95126,3.27405 11.03824,-0.8419 7.57709,1.49671 c 0,0 4.77076,-2.80633 5.42557,-2.71279 0.65481,0.0935 24.22798,4.02241 24.22798,4.02241 l 5.79975,-1.40317 11.03823,3.27406 10.38343,1.21607 11.50596,0.74836 6.5481,1.40316 3.46114,1.87089 14.11449,2.38659 h -246.2515 z" id="path980-7-1-2" /> <path style="fill:#808080;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -382.84215,-52.391874 v -6.25554 l 4.29443,1.15069 h 8.82213 l 5.55604,-1.48874 12.17104,1.39638 10.71563,-0.79375 15.08125,-0.92604 19.05,2.11667 22.35729,-2.51354 26.72291,2.91041 10.98021,0.39688 6.87917,-1.19063 14.2875,0.92605 12.43542,-0.92605 12.7,1.98438 11.37708,1.05833 8.46667,-0.79375 16.93334,1.45521 7.14375,-0.52917 4.63021,1.05834 15.64742,0.96387 z" id="path978-9-2-4" /> <path style="fill:#cccccc;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -155.39498,-60.329374 1.22868,3.68002 3.02355,-1.22318 z" id="path1028-2-0-1" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -153.05546,-57.105384 4.46405,2.06767 v 0 l -2.55134,-2.83482 z" id="path1075-2-8-83" /> <path style="fill:none;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -164.01204,-53.884914 -0.47956,1.55443 h 0.95912 z" id="path1081-3-5-8" /> <path style="fill:none;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -215.87038,-66.717204 0.33073,2.18281 1.4582,0.16764 0.46002,-0.66373 z" id="path1175-3-7-6" /> <path style="fill:none;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -356.12852,-68.061764 6.92229,2.5257 5.42558,-4.58367 z" id="path1303-8-3-7" /> <path style="fill:#808080;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -351.99851,-57.589084 4.82685,1.87518 0.98224,3.36759 -0.60804,-3.60146 z" id="path1311-8-0-8" /> <g id="g1349-7-2-4" transform="translate(2.1462862,-10.625539)" style="stroke:none"> <path style="fill:#666666;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -138.73696,-41.766334 -5.69549,-0.983428 0.41092,-1.616826 -2.30327,-0.922075 -2.33403,0.215037 1.89534,1.895343 -0.59222,0.872857 -1.67085,-1.201996 -1.71114,-0.904754 -2.11375,0.25925 -3.46114,-1.870888 3.11884,2.301418 -1.19062,0.992187 -1.81852,1.049928 z" id="path1325-1-4-4" /> <path style="fill:#666666;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -157.54127,-49.703825 -1.39055,0.826918 -0.72497,2.15152 1.21607,1.22777 2.12813,-0.526188 -2.70199,2.235272 -0.96962,2.091153 -7.0629,-0.0226 0.88877,-1.539396 -4.13412,-4.001823 -12.17162,-1.124608 -0.62759,3.671223 1.84951,3.028889 h -3.16881 l 1.3193,-3.028889 -1.65841,-4.676825 2.41909,0.344273 0.3649,-2.798522 -0.61612,-2.299398 2.64583,0.37797 -2.02971,1.921428 1.18952,2.583553 3.29704,-2.048131 2.26785,-1.13393 1.88988,-1.889879 -0.53035,2.22985 2.83209,4.214611 4.12386,-3.231671 1.5119,-1.889882 1.88988,-0.755949 -0.91106,1.148075 v 1.852083 l 1.54478,3.339949 -3.29764,4.167603 7.14375,-0.529166 -0.64221,-2.936854 v -1.660411 l 0.41463,-1.034548 z" id="path1327-7-9-6" /> <path style="fill:#666666;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -181.96608,-51.845656 -3.04381,1.707115 -5.42396,-2.811198 -0.29766,-1.686719 2.29068,-1.587465 -3.96875,0.377968 -3.37872,3.180495 -1.73056,-2.432153 1.32951,-3.772151 -6.0535,1.901264 -0.37209,-1.712275 -6.78405,2.46063 0.54745,-2.271638 -5.10268,0.944938 -2.27351,3.805626 -1.78893,-2.350447 0.59531,-0.529167 1.01028,-1.87095 -1.70089,0.566959 0.69061,1.303991 -1.42214,-0.198437 -0.79847,-0.85517 0.0181,-1.573295 -2.64585,0.377971 -3.48602,1.951275 4.20026,-1.752864 1.91351,0.996913 -0.85517,0.755951 -2.54662,0.496094 -2.71198,-0.496094 -0.10474,-3.085206 -2.26786,1.88989 1.54057,2.712172 0.83203,-1.516856 2.54664,0.727604 3.43958,-0.661458 0.0992,0.23151 1.65365,0.529167 0.33073,2.182813 -8.90183,-1.49278 -4.65383,2.829716 -0.14032,-4.490127 1.55269,-1.80772 -2.07887,0.56697 -0.31572,1.42784 0.98222,4.303037 3.17076,6.534418 -1.72083,-5.131253 0.53788,-1.543481 3.695,-1.052372 5.26187,1.753954 2.24507,3.531299 -0.35079,1.753957 -2.73618,1.333008 -2.94664,0.04677 -3.98538,-0.691882 1.02526,2.282031 3.56816,0.842004 2.1749,-0.608038 1.80073,-1.379779 1.09915,-1.824114 2.76722,-0.238146 0.24958,-5.561603 13.56393,2.45554 -1.08044,5.355021 -6.91224,2.943487 -5.82083,-5.192445 1.25677,5.258594 23.08489,-0.06615 -0.26458,-2.149737 -10.02972,-7.341462 -13.75101,-2.291837 1.05238,-3.028497 7.52127,2.015318 5.17736,3.305016 -0.44433,-2.057974 -7.36661,-2.899876 7.15614,-0.748355 2.75928,1.06364 1.16993,1.126514 -3.71874,1.458077 0.44433,2.057974 3.53379,-3.31085 2.26596,1.907685 c 0,0 11.03823,3.274052 11.03823,3.274052 0,0 -7.46015,0.865285 -7.46015,0.865285 l -9.37783,-2.736172 8.2553,3.414368 1.77442,3.927094 1.45286,-4.114183 5.3554,-1.356392 z" id="path1329-7-1-9" /> <path style="fill:#666666;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -231.2416,-52.571917 -7.57708,-1.496708 1.98353,-2.783707 4.61134,-0.02262 -3.81759,-0.67192 1.67647,-1.51188 -2.07888,0.75596 -4.43285,2.082649 -3.55468,-1.449938 -0.13895,-1.010692 -1.51191,0.755951 -1.90383,1.236957 -1.8709,3.461141 3.0676,-3.581201 1.42254,-0.30089 2.29184,0.467723 1.1693,1.075761 -0.37417,1.730568 -0.0785,6.871224 -3.42941,4.073464 -3.44976,-2.882839 -0.61943,-7.45381 -2.19828,-4.583673 4.95785,-0.42095 -1.06371,-0.260434 -3.89414,0.681384 -5.75298,1.309621 2.71279,-4.162721 2.20963,-1.608045 -1.32291,0.188989 -1.40121,1.138423 -2.1983,4.443354 -0.46771,-5.706205 1.23239,-1.198491 -1.88988,0.37797 -0.23119,1.00761 -5.05139,-0.04677 1.12484,-1.905777 -1.59256,1.859007 -2.8531,6.828737 3.07353,-6.287918 5.53254,0.184147 1.12253,4.887693 -9.7286,1.216078 7.31908,9.114909 -5.72883,4.495789 h 8.79317 l -3.06434,-4.495789 2.40952,-10.330987 8.57069,10.727862 3.49654,4.145687 3.38264,-5.336312 z" id="path1331-4-3-7" /> <path style="fill:#666666;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -268.76076,-64.917385 -3.54679,1.634643 4.77078,7.998047 -3.74179,7.951261 5.33204,5.659438 -4.30305,-0.04678 -16.69105,-7.359436 15.66206,1.746774 -9.16736,-5.425569 9.07381,2.572469 3.83532,-5.098166 -7.39,-2.619243 -5.51913,5.14494 2.29185,-9.073801 2.58974,-2.895589 -1.60753,2.381093 4.16272,-1.028985 -3.92886,2.759556 9.40121,5.332029 -5.47235,-8.091585 1.22457,-0.97413 z" id="path1333-3-7-4" /> <path style="fill:#666666;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -278.15407,-61.832804 -1.44995,-3.414369 0.25993,-2.505032 -1.51191,1.511911 -0.4318,1.788247 0.74835,0.608039 -2.94667,-0.841899 1.68516,-2.499328 -2.07886,0.944941 -2.07885,1.70089 -0.47408,1.069573 -0.93782,-2.246054 -0.478,-0.33542 -9.06115,6.650654 5.14045,-6.645963 -0.99298,-0.0047 -4.14747,6.650654 2.2135,-7.175129 -0.678,-0.04961 -1.5355,7.224739 -1.90014,-7.217624 -0.38428,-0.04019 2.28442,7.257812 -6.7658,-6.877473 0.51893,-1.66307 -2.07888,1.322919 -3.59077,1.322922 -2.64583,2.645828 1.71114,1.795359 3.57187,0.926042 9.27934,0.527473 -14.12518,3.086963 1.73699,9.747022 1.45521,-8.466667 1.85208,-1.322916 9.0809,-3.044402 9.9691,10.320443 -9.22073,2.588673 -13.13656,-0.07514 3.92245,1.478298 1.54347,1.964431 9.0738,1.449935 2.89986,-4.677217 4.91771,-2.728991 6.4947,-3.678793 -8.98025,-3.928864 -7.48355,-2.712784 12.76881,-2.619243 z" id="path1335-3-0-60" /> <path style="fill:#666666;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -311.47207,-62.649536 -7.32703,3.529518 7.7642,2.80633 -6.79583,0.88348 -1.98437,7.739057 0.66146,2.050521 3.04271,3.241146 5.22552,-0.529167 1.12448,-1.058333 0.46302,-2.579682 0.39687,4.894786 -18.52083,0.06615 -0.92604,-7.077604 2.05052,3.042703 2.71198,0.330729 2.57968,-0.661458 1.19063,-1.719786 1.016,-11.428873 -9.54881,10.436685 -0.74105,-11.278584 -2.15154,-3.086965 -2.19829,1.216078 -2.52568,-1.356394 0.60804,5.893294 -5.09617,5.702155 6.43268,3.259748 -5.66295,6.613229 h -8.65283 l -3.8821,-2.057977 -1.92699,-3.184792 2.27777,2.927546 3.53132,2.315223 7.35393,-6.168811 -5.62239,-2.248958 -7.54063,3.175 7.34219,-4.101042 4.7625,-1.190625 -3.88683,-7.238989 c 0,0 4.54829,6.180656 4.54829,6.180656 l 6.02221,-3.982363 -1.26289,-6.220698 -2.77497,0.380405 -2.01745,-0.826823 -0.29845,-1.899301 2.26788,-0.944943 0.56694,-3.590773 1.13396,-1.700881 -0.59452,2.513505 0.0661,3.803383 1.65052,2.265428 3.60257,-3.101673 -2.94775,3.429077 2.3386,0.748355 2.38537,-0.608039 c 0,0 1.62558,-2.246471 1.62558,-2.246471 l -0.83045,2.199701 1.35641,3.133735 5.71064,-9.113199 -0.19154,2.845728 0.65482,1.449938 2.99342,1.543481 0.70159,-2.572469 1.32237,-0.998826 -0.2466,1.700408 -0.74834,2.38538 0.0935,3.601458 3.35828,-3.907486 z" id="path1337-9-7-4" /> <path style="fill:#666666;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -346.81284,-68.130173 -0.41971,1.951268 1.30562,6.684708 -5.00462,2.946646 -3.21324,9.58401 -0.80917,5.289539 -6.99604,-6.215581 -2.91967,6.122038 h -6.73518 l -0.26702,-5.103643 -4.43177,-2.242093 -1.55443,0.396875 -2.83593,1.845218 -1.71525,5.197186 -2.57918,-0.09233 v -16.536461 l 4.34673,-2.26786 3.02379,-4.346731 -0.60396,3.269469 2.36074,2.808531 -5.40345,3.839125 0.57058,8.129072 3.19973,-3.333499 -2.28203,-4.20026 4.20026,-2.811198 2.61276,1.719792 4.82865,2.282031 -7.0776,-2.182813 -2.38125,0.231511 -0.82683,1.124479 0.92604,3.836458 0.89297,0.628386 7.37526,-0.628386 1.09141,-3.009635 -0.59531,2.877343 2.41411,1.977057 -5.55604,1.488734 7.0022,5.103643 -1.44616,-6.592377 4.36583,0.470339 -1.12447,-3.96875 -5.11601,-5.110167 -7.67065,-1.870885 1.45603,-3.81014 6.21462,5.681025 -0.10952,-3.091916 10.0252,2.624196 -8.70228,-1.433571 -1.2134,1.901291 5.90976,4.11798 4.00592,-4.5857 -3.07988,5.577887 -0.59532,3.96875 7.80521,0.926042 -0.48178,-6.777678 -3.64823,-3.695001 5.14493,3.554685 1.40316,-2.946649 5.79978,-2.666013 -12.34787,2.057977 -9.51571,-4.268364 h 8.69344 l 7.9375,-1.70089 0.94496,-2.26786 2.07885,-0.944941 z" id="path1339-5-0-9" /> </g> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -145.00063,-56.738604 0.82212,0.8244 2.30327,0.92208 4.20953,2.43066 1.07507,0.16959 -5.1972,-2.83483 -1.70089,-1.32291 z" id="path1351-4-7-8" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -161.34812,-64.392624 -0.3393,1.30143 0.11794,1.8392 1.30635,2.58119 2.75263,1.31987 v -1.66041 l 0.41463,-1.03455 -1.03945,-1.88988 z" id="path1353-1-9-5" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -171.1755,-64.959584 -0.1275,2.05026 2.42924,4.3942 0.16206,-2.88816 3.9618,-0.34351 -3.77976,-1.5119 z" id="path1355-3-7-40" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -177.79008,-64.392624 -2.02972,1.92143 1.18953,2.58355 -0.20048,-2.31444 1.18219,-0.48415 2.31533,0.75046 z" id="path1357-5-8-5" /> <path style="fill:none;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -186.29455,-66.849464 5.85863,2.07887 -2.19847,1.86651 -0.0706,1.45387 -0.82654,-0.0213 -4.75602,-2.10373 -0.29766,-1.68672 z" id="path1359-3-8-7" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -186.29455,-66.849464 -2.29066,1.58747 5.05368,3.79045 3.71173,-0.99965 -0.61612,-2.2994 z" id="path1361-1-2-7" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -193.64202,-63.291004 -5.79975,1.40317 16.83798,1.87089 z" id="path1363-8-9-83" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -187.95919,-58.660554 v 0 l 7.01381,3.32043 -1.65841,-4.67682 z" id="path1365-9-0-2" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -194.04307,-69.495304 -1.32951,3.77215 1.73056,2.43215 -1.10044,-2.38643 4.47916,-0.79406 z" id="path1367-3-5-2" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -200.46866,-69.306314 0.37209,1.71227 1.89578,-0.57834 z" id="path1369-8-2-1" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -206.70526,-69.117324 -0.54745,2.27164 2.93271,-1.05972 z" id="path1371-4-8-8" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -207.25271,-66.845684 7.27982,1.4759 2.6356,-1.16062 -2.75928,-1.06364 z" id="path1373-5-4-3" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -212.1404,-67.208164 -1.05238,3.02849 7.80926,0.19264 5.94175,2.0992 -5.17736,-3.30502 z" id="path1375-1-4-5" /> <path style="fill:none;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -213.23955,-63.150684 -0.24958,5.5616 0.81531,-2.78206 1.28793,-1.19086 2.62384,-0.39544 3.0628,0.54224 2.42013,1.08808 1.46196,2.32053 1.0611,2.66647 1.08044,-5.35502 z" id="path1377-2-8-9" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -180.31779,-59.011344 -0.62759,3.67122 12.79922,-2.54661 v 0 z" id="path1379-9-4-8" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -214.26479,-69.117324 2.45685,0.94494 -0.55661,0.93469 -2.91052,-0.009 z" id="path1381-1-0-6" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -217.47758,-69.873274 -0.0181,1.57329 0.79847,0.85517 0.73153,-1.10555 z" id="path1383-5-4-7" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -223.71419,-70.629234 0.10474,3.08521 3.48602,-1.95128 z" id="path1385-3-6-6" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -227.68294,-69.495304 1.70089,0.75596 -1.32396,1.67145 -1.78931,3.87044 -0.14031,-4.49013 z" id="path1387-1-0-9" /> <path style="fill:#808080;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -220.72675,-59.206044 -3.49284,0.73694 -3.42579,-3.32519 1.72083,5.13126 3.98538,0.69188 z" id="path1395-8-1-6" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -223.4125,-64.390144 2.56745,3.95754 0.1183,1.22656 -1.21242,3.23489 2.94664,-0.0468 2.73618,-1.33301 0.35079,-1.75396 -2.24507,-3.5313 z" id="path1397-4-2-6" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -232.21865,-69.684294 0.33142,1.1063 1.8097,1.0775 -3.81759,-0.67192 z" id="path1399-9-8-2" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -242.42401,-69.306314 5.58601,0.38997 -1.93694,0.722 0.0446,1.34866 -3.55468,-1.44994 z" id="path1401-1-7-8" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -249.90892,-68.435934 4.06917,1.12253 1.90383,-1.23696 -1.01515,-0.30652 z" id="path1403-1-3-4" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -250.73949,-72.897084 -2.20962,1.60805 -2.71279,4.16272 1.83738,-1.69047 2.15337,-0.95034 3.01053,-0.86211 z" id="path1405-3-4-7" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -253.10383,-73.172834 -1.40648,1.01642 -1.1516,5.0301 -0.4677,-5.70621 1.23239,-1.19849 z" id="path1407-3-3-5" /> <path style="fill:#666666;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -262.64573,-75.920894 c 0,0 -1.90852,1.63859 -1.945,1.76999 -0.0365,0.13139 -0.79978,8.24066 -0.79978,8.24066 l -0.22257,-8.36631 0.13253,-0.6994 z" id="path1409-3-4-1" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -270.16127,-73.908284 2.78022,2.11702 0.0589,-2.28128 1.84161,-0.90341 -1.13393,-0.56697 z" id="path1413-3-5-9" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -273.41805,-75.353934 2.26785,-0.37797 -0.19558,0.52989 -3.6798,2.22917 z" id="path1415-3-8-2" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -279.65468,-77.810778 0.94496,0.94494 -1.02711,1.391314 -1.60301,0.16308 z" id="path1417-8-0-0" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -277.19781,-78.377748 3.77976,3.023814 -1.70662,-0.25886 -0.90104,0.46801 0.018,2.68644 -1.44995,-3.41437 z" id="path1419-7-3-5" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -301.01031,-78.566738 3.96245,1.28272 -0.82105,2.968814 -1.57673,-0.43771 -2.0836,-2.150764 z" id="path1421-0-7-9" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -294.76344,-70.026204 12.76881,-2.61925 5.98692,0.18711 -0.45289,1.87184 c 0,0 -4.80423,0.27299 -4.97126,0.33485 -0.167,0.0619 -5.84803,2.93825 -5.84803,2.93825 z" id="path1423-1-8-6" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -315.75138,-77.432808 2.45684,3.779764 -1.53178,-0.0604 -1.82653,3.96788 -0.0935,-3.60146 0.74832,-2.38538 z" id="path1425-5-1-78" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -321.23204,-79.700658 1.51191,1.13392 3.96875,1.13393 -1.32239,0.998834 -2.76694,-0.590484 -1.58289,0.16953 z" id="path1427-9-9-5" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -330.87044,-77.243818 c 0,0 -1.22214,-0.93909 -1.31506,-0.96488 -0.0929,-0.0258 -1.98716,-0.0513 -1.98716,-0.0513 l -1.95087,1.852424 -0.0661,-3.803384 0.59452,-2.51351 3.4018,3.21279 z" id="path1429-2-1-1" /> <path style="fill:none;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -345.08627,-76.804448 5.82081,2.215884 -0.29842,-1.8993 -1.32292,-2.834824 -3.77976,0.56697 z" id="path1431-2-0-6" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -339.56391,-76.487864 -1.14959,-0.355964 -0.55459,0.978204 0.73631,2.23563 1.05156,2.83928 6.27007,2.86927 -10.5705,-2.19829 -1.30562,-6.684714 0.41971,-1.95127 3.77976,-0.56697 z" id="path1433-8-2-0" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -356.12852,-68.061754 12.34787,-2.05798 -5.79978,2.66601 z" id="path1435-2-0-6" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -365.64423,-72.330124 -6.61459,-0.94494 6.21462,5.68102 -3.12114,-3.59196 0.41492,-0.66771 3.15365,0.17499 4.09451,1.79005 5.37374,1.82691 z" id="path1437-2-3-7" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -372.25882,-73.275064 -3.21281,-2.26786 -0.60396,3.26947 2.15463,2.25135 -0.51641,-1.74448 z" id="path1439-7-7-5" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -333.21015,-67.921444 3.27247,4.13461 -1.93596,4.82729 3.61106,-6.28125 -0.79814,-1.70497 2.11802,-3.64169 z" id="path1441-9-3-9" /> <path style="fill:none;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -294.76344,-70.026204 c 0,1e-5 -5.46934,2.69686 -5.46934,2.69686 l 1.88002,1.50422 -1.30415,1.81904 14.86257,4.30034 -11.80208,-4.94919 0.64119,-1.76998 -2.29214,-0.91935 z" id="path1443-0-4-8" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -244.64305,-67.433464 -0.33876,0.43574 4.84827,2.53742 0.37417,-1.73057 -1.1693,-1.07576 -2.29184,-0.46772 z" id="path1445-3-3-7" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -270.86286,-74.001824 -3.92886,2.75955 9.40121,5.33203 -6.76865,-4.69755 0.0897,-1.55263 1.2814,-0.29776 1.16517,0.36091 z" id="path1447-8-0-7" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -309.32579,-73.275074 -7.32703,3.52952 7.7642,2.80632 14.12518,-3.08696 c 0,0 -11.41929,2.2206 -11.51279,2.21818 -0.0935,-0.002 -2.91867,-0.2157 -2.91867,-0.2157 l -2.68351,-1.16879 0.20949,-1.77253 z" id="path1449-5-1-8" /> <path style="fill:none;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -366.0442,-67.594044 -1.70249,1.2638 1.75834,2.49038 -1.114,-2.07605 z" id="path1451-1-0-3" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -344.45788,-60.764084 -7.54063,3.17501 7.40118,-2.21892 5.76184,1.29287 z" id="path1453-7-2-3" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -294.76344,-70.026204 -5.46934,2.69686 -2.40596,2.70322 -4.51289,7.43392 1.45521,-8.46668 1.85208,-1.32292 z" id="path1455-4-8-8" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -315.68445,-66.055744 1.46752,2.17006 4.00195,1.32741 3.06335,5.36605 -1.73699,-9.747 z" id="path1457-8-2-9" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -262.64573,-75.920894 -1.08153,1.6434 0.22957,3.28124 0.58608,-1.55636 0.3742,-0.18636 1.59256,-1.85901 z" id="path1459-9-4-6" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -262.31697,-72.198154 -3.07354,6.28791 2.34664,-3.72938 6.25944,-2.37438 z" id="path1461-8-1-6" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -260.94485,-74.597984 1.65279,0.5402 2.27377,1.41235 0.23118,-1.00761 -2.45684,-0.75595 z" id="path1463-8-4-1" /> </g> <g id="g1836-7-4-7" transform="matrix(-3.6073644,0,0,3.651809,-3150.7243,1076.7213)" style="stroke:none"> <path style="fill:#b3b3b3;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -382.84216,-68.928334 4.34673,-2.26786 3.02381,-4.34673 3.21279,2.26786 6.61459,0.94494 h 8.69345 l 7.9375,-1.70089 0.94494,-2.26786 2.07887,-0.944944 1.32292,-1.5119 3.77975,-0.56697 1.32292,2.834824 2.26786,-0.944944 0.56696,-3.59077 1.13393,-1.70089 3.40179,3.21279 1.32291,2.26786 3.40179,1.322924 3.96875,-0.18899 2.26786,-3.590774 1.5119,1.13392 3.96875,1.13393 2.45685,3.779764 3.96875,0.37798 2.64583,-2.64583 3.59077,-1.322924 2.07887,-1.32292 4.34673,1.32292 h 3.77976 l 2.26785,0.56697 h 4.9137 l 1.88988,1.511904 2.07887,-1.700894 2.07886,-0.94494 0.94494,0.94494 1.51191,-1.51191 3.77976,3.023814 2.26786,-0.37797 1.5119,0.75595 3.02381,-0.56697 1.13393,0.56697 2.83482,-0.94494 1.70089,1.32291 1.7009,0.18899 2.45684,0.75595 1.88988,-0.37797 2.83483,1.32292 1.32291,-0.18899 2.07887,2.26785 2.64583,1.51191 2.07887,0.56696 1.51191,-0.75595 8.12648,0.37798 2.07888,-0.75596 2.45684,0.75596 2.07887,-0.56697 1.70089,0.75596 2.26786,-1.88989 3.59077,1.13393 2.64584,-0.37797 1.5119,1.32291 1.70089,-0.56696 2.45685,0.94494 5.10268,-0.94494 2.26785,1.13393 3.96875,-1.32292 2.26787,1.13393 4.15772,-1.32292 3.77977,3.02381 3.96875,-0.37797 5.85863,2.07887 2.64584,0.37797 2.45685,2.45685 2.26785,-1.13393 1.88988,-1.88988 2.64584,1.70089 3.77976,1.5119 1.5119,-1.88988 1.88988,-0.75595 3.2128,2.45685 1.03945,1.88988 1.70089,-0.28348 4.25223,2.45684 2.55134,2.83482 2.07887,-0.66145 1.51191,-1.03944 1.5119,0.18899 1.70089,1.32291 5.19718,2.83483 h -246.2515 z" id="path956-7-4-2-7" /> <path style="fill:#999999;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -382.84216,-58.647414 v -7.80521 -2.47571 l 9.1273,-0.53659 7.67065,1.87088 9.91568,-0.46772 12.34787,-2.05797 c 0,0 10.10277,2.15152 10.5705,2.15152 0.46773,0 6.26747,-2.61924 6.26747,-2.61924 l 10.28986,0.8419 7.7642,2.80633 14.12518,-3.08697 7.48355,2.71279 8.98025,3.92886 12.90913,-2.5257 9.72861,-1.21607 7.95126,3.27405 11.03824,-0.8419 7.57709,1.49671 c 0,0 4.77076,-2.80633 5.42557,-2.71279 0.65481,0.0935 24.22798,4.02241 24.22798,4.02241 l 5.79975,-1.40317 11.03823,3.27406 10.38343,1.21607 11.50596,0.74836 6.5481,1.40316 3.46114,1.87089 14.11449,2.38659 h -246.2515 z" id="path980-7-1-8-7" /> <path style="fill:#808080;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -382.84215,-52.391874 v -6.25554 l 4.29443,1.15069 h 8.82213 l 5.55604,-1.48874 12.17104,1.39638 10.71563,-0.79375 15.08125,-0.92604 19.05,2.11667 22.35729,-2.51354 26.72291,2.91041 10.98021,0.39688 6.87917,-1.19063 14.2875,0.92605 12.43542,-0.92605 12.7,1.98438 11.37708,1.05833 8.46667,-0.79375 16.93334,1.45521 7.14375,-0.52917 4.63021,1.05834 15.64742,0.96387 z" id="path978-9-2-9-9" /> <path style="fill:#cccccc;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -155.39498,-60.329374 1.22868,3.68002 3.02355,-1.22318 z" id="path1028-2-0-2-1" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -153.05546,-57.105384 4.46405,2.06767 v 0 l -2.55134,-2.83482 z" id="path1075-2-8-8-0" /> <path style="fill:none;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -164.01204,-53.884914 -0.47956,1.55443 h 0.95912 z" id="path1081-3-5-1-2" /> <path style="fill:none;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -215.87038,-66.717204 0.33073,2.18281 1.4582,0.16764 0.46002,-0.66373 z" id="path1175-3-7-4-4" /> <path style="fill:none;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -356.12852,-68.061764 6.92229,2.5257 5.42558,-4.58367 z" id="path1303-8-3-6-5" /> <path style="fill:#808080;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -351.99851,-57.589084 4.82685,1.87518 0.98224,3.36759 -0.60804,-3.60146 z" id="path1311-8-0-9-1" /> <g id="g1349-7-2-9-5" transform="translate(2.1462862,-10.625539)" style="stroke:none"> <path style="fill:#666666;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -138.73696,-41.766334 -5.69549,-0.983428 0.41092,-1.616826 -2.30327,-0.922075 -2.33403,0.215037 1.89534,1.895343 -0.59222,0.872857 -1.67085,-1.201996 -1.71114,-0.904754 -2.11375,0.25925 -3.46114,-1.870888 3.11884,2.301418 -1.19062,0.992187 -1.81852,1.049928 z" id="path1325-1-4-8-3" /> <path style="fill:#666666;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -157.54127,-49.703825 -1.39055,0.826918 -0.72497,2.15152 1.21607,1.22777 2.12813,-0.526188 -2.70199,2.235272 -0.96962,2.091153 -7.0629,-0.0226 0.88877,-1.539396 -4.13412,-4.001823 -12.17162,-1.124608 -0.62759,3.671223 1.84951,3.028889 h -3.16881 l 1.3193,-3.028889 -1.65841,-4.676825 2.41909,0.344273 0.3649,-2.798522 -0.61612,-2.299398 2.64583,0.37797 -2.02971,1.921428 1.18952,2.583553 3.29704,-2.048131 2.26785,-1.13393 1.88988,-1.889879 -0.53035,2.22985 2.83209,4.214611 4.12386,-3.231671 1.5119,-1.889882 1.88988,-0.755949 -0.91106,1.148075 v 1.852083 l 1.54478,3.339949 -3.29764,4.167603 7.14375,-0.529166 -0.64221,-2.936854 v -1.660411 l 0.41463,-1.034548 z" id="path1327-7-9-3-3" /> <path style="fill:#666666;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -181.96608,-51.845656 -3.04381,1.707115 -5.42396,-2.811198 -0.29766,-1.686719 2.29068,-1.587465 -3.96875,0.377968 -3.37872,3.180495 -1.73056,-2.432153 1.32951,-3.772151 -6.0535,1.901264 -0.37209,-1.712275 -6.78405,2.46063 0.54745,-2.271638 -5.10268,0.944938 -2.27351,3.805626 -1.78893,-2.350447 0.59531,-0.529167 1.01028,-1.87095 -1.70089,0.566959 0.69061,1.303991 -1.42214,-0.198437 -0.79847,-0.85517 0.0181,-1.573295 -2.64585,0.377971 -3.48602,1.951275 4.20026,-1.752864 1.91351,0.996913 -0.85517,0.755951 -2.54662,0.496094 -2.71198,-0.496094 -0.10474,-3.085206 -2.26786,1.88989 1.54057,2.712172 0.83203,-1.516856 2.54664,0.727604 3.43958,-0.661458 0.0992,0.23151 1.65365,0.529167 0.33073,2.182813 -8.90183,-1.49278 -4.65383,2.829716 -0.14032,-4.490127 1.55269,-1.80772 -2.07887,0.56697 -0.31572,1.42784 0.98222,4.303037 3.17076,6.534418 -1.72083,-5.131253 0.53788,-1.543481 3.695,-1.052372 5.26187,1.753954 2.24507,3.531299 -0.35079,1.753957 -2.73618,1.333008 -2.94664,0.04677 -3.98538,-0.691882 1.02526,2.282031 3.56816,0.842004 2.1749,-0.608038 1.80073,-1.379779 1.09915,-1.824114 2.76722,-0.238146 0.24958,-5.561603 13.56393,2.45554 -1.08044,5.355021 -6.91224,2.943487 -5.82083,-5.192445 1.25677,5.258594 23.08489,-0.06615 -0.26458,-2.149737 -10.02972,-7.341462 -13.75101,-2.291837 1.05238,-3.028497 7.52127,2.015318 5.17736,3.305016 -0.44433,-2.057974 -7.36661,-2.899876 7.15614,-0.748355 2.75928,1.06364 1.16993,1.126514 -3.71874,1.458077 0.44433,2.057974 3.53379,-3.31085 2.26596,1.907685 c 0,0 11.03823,3.274052 11.03823,3.274052 0,0 -7.46015,0.865285 -7.46015,0.865285 l -9.37783,-2.736172 8.2553,3.414368 1.77442,3.927094 1.45286,-4.114183 5.3554,-1.356392 z" id="path1329-7-1-1-1" /> <path style="fill:#666666;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -231.2416,-52.571917 -7.57708,-1.496708 1.98353,-2.783707 4.61134,-0.02262 -3.81759,-0.67192 1.67647,-1.51188 -2.07888,0.75596 -4.43285,2.082649 -3.55468,-1.449938 -0.13895,-1.010692 -1.51191,0.755951 -1.90383,1.236957 -1.8709,3.461141 3.0676,-3.581201 1.42254,-0.30089 2.29184,0.467723 1.1693,1.075761 -0.37417,1.730568 -0.0785,6.871224 -3.42941,4.073464 -3.44976,-2.882839 -0.61943,-7.45381 -2.19828,-4.583673 4.95785,-0.42095 -1.06371,-0.260434 -3.89414,0.681384 -5.75298,1.309621 2.71279,-4.162721 2.20963,-1.608045 -1.32291,0.188989 -1.40121,1.138423 -2.1983,4.443354 -0.46771,-5.706205 1.23239,-1.198491 -1.88988,0.37797 -0.23119,1.00761 -5.05139,-0.04677 1.12484,-1.905777 -1.59256,1.859007 -2.8531,6.828737 3.07353,-6.287918 5.53254,0.184147 1.12253,4.887693 -9.7286,1.216078 7.31908,9.114909 -5.72883,4.495789 h 8.79317 l -3.06434,-4.495789 2.40952,-10.330987 8.57069,10.727862 3.49654,4.145687 3.38264,-5.336312 z" id="path1331-4-3-9-0" /> <path style="fill:#666666;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -268.76076,-64.917385 -3.54679,1.634643 4.77078,7.998047 -3.74179,7.951261 5.33204,5.659438 -4.30305,-0.04678 -16.69105,-7.359436 15.66206,1.746774 -9.16736,-5.425569 9.07381,2.572469 3.83532,-5.098166 -7.39,-2.619243 -5.51913,5.14494 2.29185,-9.073801 2.58974,-2.895589 -1.60753,2.381093 4.16272,-1.028985 -3.92886,2.759556 9.40121,5.332029 -5.47235,-8.091585 1.22457,-0.97413 z" id="path1333-3-7-9-8" /> <path style="fill:#666666;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -278.15407,-61.832804 -1.44995,-3.414369 0.25993,-2.505032 -1.51191,1.511911 -0.4318,1.788247 0.74835,0.608039 -2.94667,-0.841899 1.68516,-2.499328 -2.07886,0.944941 -2.07885,1.70089 -0.47408,1.069573 -0.93782,-2.246054 -0.478,-0.33542 -9.06115,6.650654 5.14045,-6.645963 -0.99298,-0.0047 -4.14747,6.650654 2.2135,-7.175129 -0.678,-0.04961 -1.5355,7.224739 -1.90014,-7.217624 -0.38428,-0.04019 2.28442,7.257812 -6.7658,-6.877473 0.51893,-1.66307 -2.07888,1.322919 -3.59077,1.322922 -2.64583,2.645828 1.71114,1.795359 3.57187,0.926042 9.27934,0.527473 -14.12518,3.086963 1.73699,9.747022 1.45521,-8.466667 1.85208,-1.322916 9.0809,-3.044402 9.9691,10.320443 -9.22073,2.588673 -13.13656,-0.07514 3.92245,1.478298 1.54347,1.964431 9.0738,1.449935 2.89986,-4.677217 4.91771,-2.728991 6.4947,-3.678793 -8.98025,-3.928864 -7.48355,-2.712784 12.76881,-2.619243 z" id="path1335-3-0-6-7" /> <path style="fill:#666666;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -311.47207,-62.649536 -7.32703,3.529518 7.7642,2.80633 -6.79583,0.88348 -1.98437,7.739057 0.66146,2.050521 3.04271,3.241146 5.22552,-0.529167 1.12448,-1.058333 0.46302,-2.579682 0.39687,4.894786 -18.52083,0.06615 -0.92604,-7.077604 2.05052,3.042703 2.71198,0.330729 2.57968,-0.661458 1.19063,-1.719786 1.016,-11.428873 -9.54881,10.436685 -0.74105,-11.278584 -2.15154,-3.086965 -2.19829,1.216078 -2.52568,-1.356394 0.60804,5.893294 -5.09617,5.702155 6.43268,3.259748 -5.66295,6.613229 h -8.65283 l -3.8821,-2.057977 -1.92699,-3.184792 2.27777,2.927546 3.53132,2.315223 7.35393,-6.168811 -5.62239,-2.248958 -7.54063,3.175 7.34219,-4.101042 4.7625,-1.190625 -3.88683,-7.238989 c 0,0 4.54829,6.180656 4.54829,6.180656 l 6.02221,-3.982363 -1.26289,-6.220698 -2.77497,0.380405 -2.01745,-0.826823 -0.29845,-1.899301 2.26788,-0.944943 0.56694,-3.590773 1.13396,-1.700881 -0.59452,2.513505 0.0661,3.803383 1.65052,2.265428 3.60257,-3.101673 -2.94775,3.429077 2.3386,0.748355 2.38537,-0.608039 c 0,0 1.62558,-2.246471 1.62558,-2.246471 l -0.83045,2.199701 1.35641,3.133735 5.71064,-9.113199 -0.19154,2.845728 0.65482,1.449938 2.99342,1.543481 0.70159,-2.572469 1.32237,-0.998826 -0.2466,1.700408 -0.74834,2.38538 0.0935,3.601458 3.35828,-3.907486 z" id="path1337-9-7-6-9" /> <path style="fill:#666666;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -346.81284,-68.130173 -0.41971,1.951268 1.30562,6.684708 -5.00462,2.946646 -3.21324,9.58401 -0.80917,5.289539 -6.99604,-6.215581 -2.91967,6.122038 h -6.73518 l -0.26702,-5.103643 -4.43177,-2.242093 -1.55443,0.396875 -2.83593,1.845218 -1.71525,5.197186 -2.57918,-0.09233 v -16.536461 l 4.34673,-2.26786 3.02379,-4.346731 -0.60396,3.269469 2.36074,2.808531 -5.40345,3.839125 0.57058,8.129072 3.19973,-3.333499 -2.28203,-4.20026 4.20026,-2.811198 2.61276,1.719792 4.82865,2.282031 -7.0776,-2.182813 -2.38125,0.231511 -0.82683,1.124479 0.92604,3.836458 0.89297,0.628386 7.37526,-0.628386 1.09141,-3.009635 -0.59531,2.877343 2.41411,1.977057 -5.55604,1.488734 7.0022,5.103643 -1.44616,-6.592377 4.36583,0.470339 -1.12447,-3.96875 -5.11601,-5.110167 -7.67065,-1.870885 1.45603,-3.81014 6.21462,5.681025 -0.10952,-3.091916 10.0252,2.624196 -8.70228,-1.433571 -1.2134,1.901291 5.90976,4.11798 4.00592,-4.5857 -3.07988,5.577887 -0.59532,3.96875 7.80521,0.926042 -0.48178,-6.777678 -3.64823,-3.695001 5.14493,3.554685 1.40316,-2.946649 5.79978,-2.666013 -12.34787,2.057977 -9.51571,-4.268364 h 8.69344 l 7.9375,-1.70089 0.94496,-2.26786 2.07885,-0.944941 z" id="path1339-5-0-1-6" /> </g> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -145.00063,-56.738604 0.82212,0.8244 2.30327,0.92208 4.20953,2.43066 1.07507,0.16959 -5.1972,-2.83483 -1.70089,-1.32291 z" id="path1351-4-7-0-3" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -161.34812,-64.392624 -0.3393,1.30143 0.11794,1.8392 1.30635,2.58119 2.75263,1.31987 v -1.66041 l 0.41463,-1.03455 -1.03945,-1.88988 z" id="path1353-1-9-9-0" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -171.1755,-64.959584 -0.1275,2.05026 2.42924,4.3942 0.16206,-2.88816 3.9618,-0.34351 -3.77976,-1.5119 z" id="path1355-3-7-4-8" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -177.79008,-64.392624 -2.02972,1.92143 1.18953,2.58355 -0.20048,-2.31444 1.18219,-0.48415 2.31533,0.75046 z" id="path1357-5-8-3-9" /> <path style="fill:none;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -186.29455,-66.849464 5.85863,2.07887 -2.19847,1.86651 -0.0706,1.45387 -0.82654,-0.0213 -4.75602,-2.10373 -0.29766,-1.68672 z" id="path1359-3-8-2-5" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -186.29455,-66.849464 -2.29066,1.58747 5.05368,3.79045 3.71173,-0.99965 -0.61612,-2.2994 z" id="path1361-1-2-2-0" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -193.64202,-63.291004 -5.79975,1.40317 16.83798,1.87089 z" id="path1363-8-9-8-8" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -187.95919,-58.660554 v 0 l 7.01381,3.32043 -1.65841,-4.67682 z" id="path1365-9-0-8-8" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -194.04307,-69.495304 -1.32951,3.77215 1.73056,2.43215 -1.10044,-2.38643 4.47916,-0.79406 z" id="path1367-3-5-5-2" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -200.46866,-69.306314 0.37209,1.71227 1.89578,-0.57834 z" id="path1369-8-2-9-9" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -206.70526,-69.117324 -0.54745,2.27164 2.93271,-1.05972 z" id="path1371-4-8-0-4" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -207.25271,-66.845684 7.27982,1.4759 2.6356,-1.16062 -2.75928,-1.06364 z" id="path1373-5-4-6-4" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -212.1404,-67.208164 -1.05238,3.02849 7.80926,0.19264 5.94175,2.0992 -5.17736,-3.30502 z" id="path1375-1-4-7-8" /> <path style="fill:none;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -213.23955,-63.150684 -0.24958,5.5616 0.81531,-2.78206 1.28793,-1.19086 2.62384,-0.39544 3.0628,0.54224 2.42013,1.08808 1.46196,2.32053 1.0611,2.66647 1.08044,-5.35502 z" id="path1377-2-8-0-5" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -180.31779,-59.011344 -0.62759,3.67122 12.79922,-2.54661 v 0 z" id="path1379-9-4-6-9" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -214.26479,-69.117324 2.45685,0.94494 -0.55661,0.93469 -2.91052,-0.009 z" id="path1381-1-0-1-0" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -217.47758,-69.873274 -0.0181,1.57329 0.79847,0.85517 0.73153,-1.10555 z" id="path1383-5-4-1-6" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -223.71419,-70.629234 0.10474,3.08521 3.48602,-1.95128 z" id="path1385-3-6-5-5" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -227.68294,-69.495304 1.70089,0.75596 -1.32396,1.67145 -1.78931,3.87044 -0.14031,-4.49013 z" id="path1387-1-0-7-5" /> <path style="fill:#808080;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -220.72675,-59.206044 -3.49284,0.73694 -3.42579,-3.32519 1.72083,5.13126 3.98538,0.69188 z" id="path1395-8-1-2-7" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -223.4125,-64.390144 2.56745,3.95754 0.1183,1.22656 -1.21242,3.23489 2.94664,-0.0468 2.73618,-1.33301 0.35079,-1.75396 -2.24507,-3.5313 z" id="path1397-4-2-8-7" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -232.21865,-69.684294 0.33142,1.1063 1.8097,1.0775 -3.81759,-0.67192 z" id="path1399-9-8-7-8" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -242.42401,-69.306314 5.58601,0.38997 -1.93694,0.722 0.0446,1.34866 -3.55468,-1.44994 z" id="path1401-1-7-2-2" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -249.90892,-68.435934 4.06917,1.12253 1.90383,-1.23696 -1.01515,-0.30652 z" id="path1403-1-3-5-9" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -250.73949,-72.897084 -2.20962,1.60805 -2.71279,4.16272 1.83738,-1.69047 2.15337,-0.95034 3.01053,-0.86211 z" id="path1405-3-4-3-6" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -253.10383,-73.172834 -1.40648,1.01642 -1.1516,5.0301 -0.4677,-5.70621 1.23239,-1.19849 z" id="path1407-3-3-7-8" /> <path style="fill:#666666;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -262.64573,-75.920894 c 0,0 -1.90852,1.63859 -1.945,1.76999 -0.0365,0.13139 -0.79978,8.24066 -0.79978,8.24066 l -0.22257,-8.36631 0.13253,-0.6994 z" id="path1409-3-4-4-0" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -270.16127,-73.908284 2.78022,2.11702 0.0589,-2.28128 1.84161,-0.90341 -1.13393,-0.56697 z" id="path1413-3-5-7-5" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -273.41805,-75.353934 2.26785,-0.37797 -0.19558,0.52989 -3.6798,2.22917 z" id="path1415-3-8-7-9" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -279.65468,-77.810778 0.94496,0.94494 -1.02711,1.391314 -1.60301,0.16308 z" id="path1417-8-0-4-0" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -277.19781,-78.377748 3.77976,3.023814 -1.70662,-0.25886 -0.90104,0.46801 0.018,2.68644 -1.44995,-3.41437 z" id="path1419-7-3-0-2" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -301.01031,-78.566738 3.96245,1.28272 -0.82105,2.968814 -1.57673,-0.43771 -2.0836,-2.150764 z" id="path1421-0-7-7-0" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -294.76344,-70.026204 12.76881,-2.61925 5.98692,0.18711 -0.45289,1.87184 c 0,0 -4.80423,0.27299 -4.97126,0.33485 -0.167,0.0619 -5.84803,2.93825 -5.84803,2.93825 z" id="path1423-1-8-2-9" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -315.75138,-77.432808 2.45684,3.779764 -1.53178,-0.0604 -1.82653,3.96788 -0.0935,-3.60146 0.74832,-2.38538 z" id="path1425-5-1-7-2" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -321.23204,-79.700658 1.51191,1.13392 3.96875,1.13393 -1.32239,0.998834 -2.76694,-0.590484 -1.58289,0.16953 z" id="path1427-9-9-3-2" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -330.87044,-77.243818 c 0,0 -1.22214,-0.93909 -1.31506,-0.96488 -0.0929,-0.0258 -1.98716,-0.0513 -1.98716,-0.0513 l -1.95087,1.852424 -0.0661,-3.803384 0.59452,-2.51351 3.4018,3.21279 z" id="path1429-2-1-4-1" /> <path style="fill:none;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -345.08627,-76.804448 5.82081,2.215884 -0.29842,-1.8993 -1.32292,-2.834824 -3.77976,0.56697 z" id="path1431-2-0-2-6" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -339.56391,-76.487864 -1.14959,-0.355964 -0.55459,0.978204 0.73631,2.23563 1.05156,2.83928 6.27007,2.86927 -10.5705,-2.19829 -1.30562,-6.684714 0.41971,-1.95127 3.77976,-0.56697 z" id="path1433-8-2-1-9" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -356.12852,-68.061754 12.34787,-2.05798 -5.79978,2.66601 z" id="path1435-2-0-8-9" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -365.64423,-72.330124 -6.61459,-0.94494 6.21462,5.68102 -3.12114,-3.59196 0.41492,-0.66771 3.15365,0.17499 4.09451,1.79005 5.37374,1.82691 z" id="path1437-2-3-2-4" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -372.25882,-73.275064 -3.21281,-2.26786 -0.60396,3.26947 2.15463,2.25135 -0.51641,-1.74448 z" id="path1439-7-7-1-4" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -333.21015,-67.921444 3.27247,4.13461 -1.93596,4.82729 3.61106,-6.28125 -0.79814,-1.70497 2.11802,-3.64169 z" id="path1441-9-3-4-2" /> <path style="fill:none;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -294.76344,-70.026204 c 0,1e-5 -5.46934,2.69686 -5.46934,2.69686 l 1.88002,1.50422 -1.30415,1.81904 14.86257,4.30034 -11.80208,-4.94919 0.64119,-1.76998 -2.29214,-0.91935 z" id="path1443-0-4-6-7" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -244.64305,-67.433464 -0.33876,0.43574 4.84827,2.53742 0.37417,-1.73057 -1.1693,-1.07576 -2.29184,-0.46772 z" id="path1445-3-3-1-8" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -270.86286,-74.001824 -3.92886,2.75955 9.40121,5.33203 -6.76865,-4.69755 0.0897,-1.55263 1.2814,-0.29776 1.16517,0.36091 z" id="path1447-8-0-5-8" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -309.32579,-73.275074 -7.32703,3.52952 7.7642,2.80632 14.12518,-3.08696 c 0,0 -11.41929,2.2206 -11.51279,2.21818 -0.0935,-0.002 -2.91867,-0.2157 -2.91867,-0.2157 l -2.68351,-1.16879 0.20949,-1.77253 z" id="path1449-5-1-9-0" /> <path style="fill:none;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -366.0442,-67.594044 -1.70249,1.2638 1.75834,2.49038 -1.114,-2.07605 z" id="path1451-1-0-7-0" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -344.45788,-60.764084 -7.54063,3.17501 7.40118,-2.21892 5.76184,1.29287 z" id="path1453-7-2-4-5" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -294.76344,-70.026204 -5.46934,2.69686 -2.40596,2.70322 -4.51289,7.43392 1.45521,-8.46668 1.85208,-1.32292 z" id="path1455-4-8-6-8" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -315.68445,-66.055744 1.46752,2.17006 4.00195,1.32741 3.06335,5.36605 -1.73699,-9.747 z" id="path1457-8-2-6-6" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -262.64573,-75.920894 -1.08153,1.6434 0.22957,3.28124 0.58608,-1.55636 0.3742,-0.18636 1.59256,-1.85901 z" id="path1459-9-4-1-0" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -262.31697,-72.198154 -3.07354,6.28791 2.34664,-3.72938 6.25944,-2.37438 z" id="path1461-8-1-0-1" /> <path style="fill:#cccccc;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -260.94485,-74.597984 1.65279,0.5402 2.27377,1.41235 0.23118,-1.00761 -2.45684,-0.75595 z" id="path1463-8-4-4-0" /> </g> <g id="g1063-1-6" transform="matrix(2.9504809,0,0,2.9504809,-2403.5121,807.59267)" style="stroke:none"> <path style="fill:#b3b3b3;fill-opacity:1;stroke:none;stroke-width:0.264583;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="m -209.28026,16.66654 10.06417,-7.5908703 12.30064,-13.85637 6.70943,-2.650786 9.58492,-4.5786197 8.94594,-4.09666 7.02894,2.16881 8.94592,-3.13273 5.11195,-4.337652 10.54341,4.337652 2.55598,3.6147 9.26542,-2.16882 7.98743,7.9523397 5.75095,9.880196 5.111947,-3.61471 7.348441,7.71136 2.55598,7.9523603 4.79245,2.4098 H -209.59976" id="path950-4-8-9-5-1" /> <path style="fill:#999999;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -209.28026,16.666539 10.06417,-7.5908693 9.03239,-10.327836 11.04133,6.374712 8.23546,-2.027986 21.26994,5.699262 24.0872,-2.864442 21.06461,-3.721651 5.111957,-3.614711 7.348434,7.711361 2.555978,7.9523613 4.792456,2.409799 z" id="path1074-5-2-5" /> <path style="fill:#f2f2f2;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -166.3816,-13.986691 4.32218,2.495415 h 6.63587 l 5.51486,1.477703 10.70717,-2.868978 8.50807,2.27973 h 10.41584 l 10.0415,2.9303547 -7.98743,-7.9523397 -9.26542,2.168818 -2.55598,-3.614697 -10.54341,-4.337654 -5.11195,4.337654 -8.94592,3.132727 -7.02894,-2.168808 z" id="path1076-4-8-8" /> <path style="fill:none;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -143.79733,-18.530275 4.25865,2.45873 7.04338,-1.88727 -8.09305,-3.449524 z" id="path1078-1-3-4" /> <path style="fill:#666666;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -179.14237,5.1225457 -6.59733,11.4269073 h 3.18829 z" id="path1080-0-6-7" /> <path style="fill:#666666;stroke:none;stroke-width:0.323622px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -170.90691,3.0945597 8.38015,13.4585293 h -4.04987 z" id="path1080-3-8-2-4" /> <path style="fill:#666666;stroke:none;stroke-width:0.21797px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -149.63697,8.7938217 -6.59733,7.7553093 h 3.18829 z" id="path1080-2-61-3-6" /> <path style="fill:#666666;stroke:none;stroke-width:0.65317px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="M -99.373203,-1.4069823 -124.81493,16.651458 h 12.29521 z" id="path1080-2-1-2-4-1" /> <path style="fill:#666666;stroke:none;stroke-width:0.22939px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -99.373203,-1.4069803 7.348432,7.71136 h -3.551275 z" id="path1080-2-1-9-7-1-2" /> <path style="fill:#666666;stroke:none;stroke-width:0.234653px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -89.468791,14.25674 -6.107255,-7.9523603 3.551275,-0.11693 z" id="path1080-2-1-9-5-2-8-4" /> <path style="fill:#666666;stroke:none;stroke-width:0.103025px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -89.468792,14.25674 -4.747779,2.407507 h 2.294456 z" id="path1080-2-1-1-3-6-2" /> <path style="fill:#666666;stroke:none;stroke-width:0.276373px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -198.99339,8.9112307 -10.60637,7.7553093 h 5.12574 z" id="path1080-2-8-3-3-0" /> <path style="fill:#e6e6e6;stroke:none;stroke-width:0.0420247px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -154.64622,-13.937958 1.71162,3.098151 3.02591,0.826234 z" id="path1080-2-3-0-3-1-2" /> <path style="fill:#e6e6e6;stroke:none;stroke-width:0.039232px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -150.09562,-12.032655 0.18693,2.019082 -3.81753,-2.345235 z" id="path1080-2-3-0-1-3-1-5" /> <path style="fill:#e6e6e6;stroke:none;stroke-width:0.0531147px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -145.56583,-17.222695 -1.52129,6.451487 -2.82157,0.757635 z" id="path1080-2-3-0-6-80-1-2" /> <path style="fill:#e6e6e6;stroke:none;stroke-width:0.038828px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -161.67516,-16.106766 -0.38426,4.61549 3.18091,-0.233861 z" id="path1080-2-3-3-2-5-6" /> <path style="fill:#e6e6e6;stroke:none;stroke-width:0.129779px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -154.22861,-14.021478 -7.83081,2.530202 h 3.58258 z" id="path1080-2-3-6-7-9" /> <path style="fill:#e6e6e6;stroke:none;stroke-width:0.236324px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -145.63599,-16.956678 14.94254,6.353857 -8.50807,-2.27973 z" id="path1080-3-4-5-3-0" /> <path style="fill:#e6e6e6;stroke:none;stroke-width:0.0587845px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -130.04494,-17.070686 -0.64851,6.467865 -8.50807,-2.27973 z" id="path1080-2-3-0-6-8-4-9-0" /> <path style="fill:#e6e6e6;stroke:none;stroke-width:0.0587845px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -127.48896,-13.455988 1.72551,2.852815 -4.93,3.52e-4 z" id="path1080-2-3-0-6-8-5-0-0-9" /> <path style="fill:#e6e6e6;stroke:none;stroke-width:0.0587845px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -118.22354,-15.624806 -2.05407,5.021985 -5.48584,-3.52e-4 z" id="path1080-2-3-0-6-8-5-3-87-0-7" /> <path style="fill:#e6e6e6;stroke:none;stroke-width:0.0272903px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -118.22354,-15.624806 -2.57411,5.021985 3.00058,0.7187697 z" id="path1080-2-3-0-6-8-5-3-8-4-6-6" /> <path style="fill:#e6e6e6;stroke:none;stroke-width:0.111235px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -140.58835,-21.408338 3.01246,8.102554 -0.86415,-0.115755 z" id="path1080-3-9-1-0-3" /> <path style="fill:none;stroke:none;stroke-width:0.264583;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" d="m -209.28026,16.66654 10.06417,-7.5908703 12.30064,-13.85637 6.70944,-2.650786 9.58492,-4.5786197 8.94593,-4.09666 7.02894,2.16881 8.94592,-3.13273 5.11195,-4.337652 10.54341,4.337652 2.55598,3.6147 9.26542,-2.16882 7.98743,7.9523397 5.75095,9.880196 5.111957,-3.61471 7.348432,7.71136 2.555979,7.9523603 4.792457,2.4098 H -209.59976" id="path950-4-7-2-6" /> <path style="fill:#666666;stroke:none;stroke-width:0.491507px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -152.9346,-10.839807 4.32662,6.1632447 -1.30071,-5.3370107 z" id="path1080-1-4-7-8-5" /> <path style="fill:#666666;stroke:none;stroke-width:0.491507px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -139.20152,-12.882551 -2.15678,11.3397237 10.66485,-9.0599937 z" id="path1080-1-4-6-4-5-2" /> <path style="fill:#e6e6e6;stroke:none;stroke-width:0.039232px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -150.09562,-12.032655 0.18693,2.019082 1.89406,-2.967489 z" id="path1080-2-3-0-1-6-3-1-4" /> <path style="fill:#666666;stroke:none;stroke-width:0.491507px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -150.13086,-10.066192 1.52288,5.3896297 1.52086,-6.0946457 z" id="path1080-1-4-5-4-3-5" /> <path style="fill:#666666;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -162.05942,-11.491276 -17.08295,16.6138217 8.23546,-2.027986 5.4712,-9.066705 6.95887,-5.5191307 z" id="path1677-6-9-0" /> <path style="fill:#666666;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -130.69345,-10.602821 2.03303,4.8091847 10.86335,-4.090416 -3.00058,-0.7187687 z" id="path1683-8-6-3" /> <path style="fill:#666666;fill-opacity:1;stroke:none;stroke-width:0.264583px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -148.60798,-4.6765623 1.23008,6.145823 -2.25907,7.324561 6.6247,-5.737061 5.73815,4.282943 8.6137,-13.13334 -8.39504,10.121588 -4.30284,-5.870779 -3.50605,1.42458797 z" id="path1689-0-2-6" /> <path style="fill:#666666;stroke:none;stroke-width:0.345366px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -137.27412,7.3397037 13.60825,9.4391073 h -6.57646 z" id="path1080-2-0-3-4-4" /> <path style="fill:#666666;stroke:none;stroke-width:0.21797px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1" d="m -125.20444,8.3775617 -12.06968,-1.037858 11.65421,-1.39452 21.13475,-3.737454 z" id="path1080-2-6-1-3-5" /> </g> <g id="g18962-8" style="fill:#dedede;fill-opacity:1;stroke:none;filter:url(#filter22534-5)" transform="matrix(1.2716992,0,0,0.94870617,-2681.078,297.92676)"> <ellipse style="opacity:1;fill:#dedede;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:5.07256;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" id="path18812-0" cx="-648.51813" cy="573.24866" rx="63.856304" ry="15.231452" /> <ellipse style="fill:#dedede;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:3.96737;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" id="path18812-1-8" cx="-564.28632" cy="572.64099" rx="49.943638" ry="11.912907" /> <ellipse style="fill:#dedede;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:3.96737;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" id="path18812-1-9-3" cx="-614.77637" cy="557.74878" rx="49.943638" ry="11.912907" /> <ellipse style="fill:#dedede;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:5.76831;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" id="path18812-1-9-6-1" cx="-713.06708" cy="554.42499" rx="72.615051" ry="17.32065" /> <ellipse style="fill:#dedede;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:5.76831;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" id="path18812-1-9-6-7-13" cx="-758.49561" cy="578.22565" rx="72.615051" ry="17.32065" /> <ellipse style="fill:#dedede;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:3.96737;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" id="path18812-1-9-65-87" cx="-822.37103" cy="554.29169" rx="49.943638" ry="11.912907" /> <ellipse style="fill:#dedede;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:5.07256;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" id="path18812-4-8" cx="-879.63849" cy="569.71576" rx="63.856304" ry="15.231452" /> <ellipse style="fill:#dedede;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:3.96737;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" id="path18812-1-7-7" cx="-908.27216" cy="552.69611" rx="49.943638"  ry="11.912907" /> </g> <g id="g18962-3-7-8" style="fill:#dedede;fill-opacity:1;stroke:none;filter:url(#filter22558-1)" transform="matrix(1.2854909,-0.06211144,0.08515689,0.93760696,-1140.9679,255.06897)"> <ellipse style="opacity:1;fill:#dedede;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:5.07256;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" id="path18812-6-7-1" cx="-648.51813" cy="573.24866" rx="63.856304" ry="15.231452" /> <ellipse style="fill:#dedede;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:3.96737;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" id="path18812-1-6-0-3" cx="-564.28632" cy="572.64099" rx="49.943638" ry="11.912907" /> <ellipse style="fill:#dedede;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:3.96737;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" id="path18812-1-9-4-1-2" cx="-614.77637" cy="557.74878" rx="49.943638" ry="11.912907" /> <ellipse style="fill:#dedede;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:5.76831;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" id="path18812-1-9-6-5-9-1" cx="-713.06708" cy="554.42499" rx="72.615051" ry="17.32065" /> <ellipse style="fill:#dedede;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:5.76831;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" id="path18812-1-9-6-7-6-6-9" cx="-758.49561" cy="578.22565" rx="72.615051" ry="17.32065" /> <ellipse style="fill:#dedede;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:3.96737;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" id="path18812-1-9-65-0-5-1" cx="-822.37103" cy="554.29169" rx="49.943638" ry="11.912907" /> <ellipse style="fill:#dedede;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:5.07256;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" id="path18812-4-6-5-1" cx="-879.63849" cy="569.71576" rx="63.856304" ry="15.231452" /> <ellipse style="fill:#dedede;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:3.96737;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" id="path18812-1-7-3-5-3" cx="-908.27216" cy="552.69611" rx="49.943638" ry="11.912907" /> </g> <g id="g18962-3-7-1-9" style="fill:#dedede;fill-opacity:1;stroke:none;filter:url(#filter22558-8-8)" transform="matrix(0.80634649,0.00719381,-0.00686153,0.84539399,-2239.9921,315.51539)"> <ellipse style="opacity:1;fill:#dedede;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:5.07256;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" id="path18812-6-7-0-4" cx="-648.51813" cy="573.24866" rx="63.856304" ry="15.231452" /> <ellipse style="fill:#dedede;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:3.96737;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" id="path18812-1-6-0-1-1" cx="-564.28632" cy="572.64099" rx="49.943638" ry="11.912907" /> <ellipse style="fill:#dedede;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:3.96737;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" id="path18812-1-9-4-1-6-8" cx="-614.77637" cy="557.74878" rx="49.943638" ry="11.912907" /> <ellipse style="fill:#dedede;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:5.76831;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" id="path18812-1-9-6-5-9-9-7" cx="-713.06708" cy="554.42499" rx="72.615051" ry="17.32065" /> <ellipse style="fill:#dedede;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:5.76831;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" id="path18812-1-9-6-7-6-6-8-5" cx="-758.49561" cy="578.22565" rx="72.615051" ry="17.32065" /> <ellipse style="fill:#dedede;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:3.96737;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" id="path18812-1-9-65-0-5-4-7" cx="-822.37103" cy="554.29169" rx="49.943638" ry="11.912907" /> <ellipse style="fill:#dedede;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:5.07256;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" id="path18812-4-6-5-9-4" cx="-879.63849" cy="569.71576" rx="63.856304" ry="15.231452" /> <ellipse style="fill:#dedede;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:3.96737;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" id="path18812-1-7-3-5-1-7" cx="-908.27216" cy="552.69611" rx="49.943638" ry="11.912907" /> </g> <g id="g18962-2-5-7" style="opacity:0.812183;fill:#dedede;fill-opacity:1;stroke:none;filter:url(#filter23510-6-3)" transform="matrix(1.9940423,0,0,0.31186633,-754.00795,711.74591)"> <ellipse style="opacity:1;fill:#dedede;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:5.07256;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" id="path18812-9-0-5" cx="-648.51813" cy="573.24866" rx="63.856304" ry="15.231452" /> <ellipse style="fill:#dedede;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:3.96737;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" id="path18812-1-2-7-8" cx="-564.28632" cy="572.64099" rx="49.943638" ry="11.912907" /> <ellipse style="fill:#dedede;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:3.96737;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" id="path18812-1-9-9-3-6" cx="-614.77637" cy="557.74878" rx="49.943638" ry="11.912907" /> <ellipse style="fill:#dedede;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:5.76831;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" id="path18812-1-9-6-6-9-7" cx="-713.06708" cy="554.42499" rx="72.615051" ry="17.32065" /> <ellipse style="fill:#dedede;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:5.76831;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" id="path18812-1-9-6-7-1-4-8" cx="-758.49561" cy="578.22565" rx="72.615051" ry="17.32065" /> <ellipse style="fill:#dedede;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:3.96737;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" id="path18812-1-9-65-8-7-3" cx="-822.37103" cy="554.29169" rx="49.943638" ry="11.912907" /> <ellipse style="fill:#dedede;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:5.07256;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" id="path18812-4-5-4-3" cx="-879.63849" cy="569.71576" rx="63.856304" ry="15.231452" /> <ellipse style="fill:#dedede;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:3.96737;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" id="path18812-1-7-9-2-6" cx="-908.27216" cy="552.69611" rx="49.943638" ry="11.912907" /> </g> <g id="g18962-2-4-7" style="opacity:0.812183;fill:#dedede;fill-opacity:1;stroke:none;filter:url(#filter23510-1-7)" transform="matrix(0.8460085,0,0,0.18701268,-2214.7022,752.82035)"> <ellipse style="opacity:1;fill:#dedede;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:5.07256;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" id="path18812-9-6-6" cx="-648.51813" cy="573.24866" rx="63.856304" ry="15.231452" /> <ellipse style="fill:#dedede;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:3.96737;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" id="path18812-1-2-1-0" cx="-564.28632" cy="572.64099" rx="49.943638" ry="11.912907" /> <ellipse style="fill:#dedede;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:3.96737;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" id="path18812-1-9-9-1-4" cx="-614.77637" cy="557.74878" rx="49.943638" ry="11.912907" /> <ellipse style="fill:#dedede;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:5.76831;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" id="path18812-1-9-6-6-6-2" cx="-713.06708" cy="554.42499" rx="72.615051" ry="17.32065" /> <ellipse style="fill:#dedede;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:5.76831;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" id="path18812-1-9-6-7-1-5-8" cx="-758.49561" cy="578.22565" rx="72.615051" ry="17.32065" /> <ellipse style="fill:#dedede;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:3.96737;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" id="path18812-1-9-65-8-4-6" cx="-822.37103" cy="554.29169" rx="49.943638" ry="11.912907" /> <ellipse style="fill:#dedede;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:5.07256;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" id="path18812-4-5-7-5" cx="-879.63849" cy="569.71576" rx="63.856304" ry="15.231452" /> <ellipse style="fill:#dedede;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:3.96737;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" id="path18812-1-7-9-8-1" cx="-908.27216" cy="552.69611" rx="49.943638" ry="11.912907" /> </g> </g> <g id="g18962-2-8" style="opacity:0.812183;fill:#dedede;fill-opacity:1;stroke:none;filter:url(#filter23510-9)" transform="matrix(2.0446383,0,0,0.3075226,-1948.4204,712.33498)"> <ellipse style="opacity:1;fill:#dedede;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:5.07256;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" id="path18812-9-8" cx="-648.51813" cy="573.24866" rx="63.856304" ry="15.231452" /> <ellipse style="fill:#dedede;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:3.96737;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" id="path18812-1-2-9" cx="-564.28632" cy="572.64099" rx="49.943638" ry="11.912907" /> <ellipse style="fill:#dedede;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:3.96737;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" id="path18812-1-9-9-6" cx="-614.77637" cy="557.74878" rx="49.943638" ry="11.912907" /> <ellipse style="fill:#dedede;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:5.76831;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" id="path18812-1-9-6-6-7" cx="-713.06708" cy="554.42499" rx="72.615051" ry="17.32065" /> <ellipse style="fill:#dedede;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:5.76831;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" id="path18812-1-9-6-7-1-2" cx="-758.49561" cy="578.22565" rx="72.615051" ry="17.32065" /> <ellipse style="fill:#dedede;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:3.96737;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" id="path18812-1-9-65-8-8" cx="-822.37103" cy="554.29169" rx="49.943638" ry="11.912907" /> <ellipse style="fill:#dedede;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:5.07256;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" id="path18812-4-5-71" cx="-879.63849" cy="569.71576" rx="63.856304" ry="15.231452" /> <ellipse style="fill:#dedede;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:3.96737;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" id="path18812-1-7-9-21" cx="-908.27216" cy="552.69611" rx="49.943638" ry="11.912907" /> </g> </g> </g> </svg>'
    ],
    th_bg2 : [ '<svg xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" version="1.1" id="SVGRoot"> <defs id="defs2215"> <filter style="color-interpolation-filters:sRGB" id="filter24957-7" x="-1.2" width="3.4000001" y="-1.2" height="3.4000001"> <feGaussianBlur stdDeviation="14.967094" id="feGaussianBlur24959-0" /> </filter> <filter style="color-interpolation-filters:sRGB" id="filter24957-8-8" x="-1.2" width="3.4000001" y="-1.2" height="3.4000001"> <feGaussianBlur stdDeviation="14.967094" id="feGaussianBlur24959-4-4" /> </filter> <filter style="color-interpolation-filters:sRGB" id="filter24957-8-5-5" x="-1.2" width="3.4000001" y="-1.2" height="3.4000001"> <feGaussianBlur stdDeviation="14.967094" id="feGaussianBlur24959-4-2-4" /> </filter> <filter style="color-interpolation-filters:sRGB" id="filter24957-8-5-0-3" x="-1.2" width="3.4000001" y="-1.2" height="3.4000001"> <feGaussianBlur stdDeviation="14.967094" id="feGaussianBlur24959-4-2-8-0" /> </filter> <filter style="color-interpolation-filters:sRGB" id="filter24957-8-5-0-4-2" x="-1.2" width="3.4000001" y="-1.2" height="3.4000001"> <feGaussianBlur stdDeviation="14.967094" id="feGaussianBlur24959-4-2-8-9-5" /> </filter> <filter style="color-interpolation-filters:sRGB" id="filter24957-8-5-9-7" x="-1.2" width="3.4000001" y="-1.2" height="3.4000001"> <feGaussianBlur stdDeviation="14.967094" id="feGaussianBlur24959-4-2-9-1" /> </filter> <filter style="color-interpolation-filters:sRGB" id="filter25353-3" x="-0.73808396" width="2.4761679" y="-0.73808396" height="2.4761679"> <feGaussianBlur stdDeviation="9.2058101" id="feGaussianBlur25355-9" /> </filter> <filter style="color-interpolation-filters:sRGB" id="filter25353-0-3" x="-0.73808396" width="2.4761679" y="-0.73808396" height="2.4761679"> <feGaussianBlur stdDeviation="9.2058101" id="feGaussianBlur25355-2-3" /> </filter> <filter style="color-interpolation-filters:sRGB" id="filter25353-2-1" x="-0.73808396" width="2.4761679" y="-0.73808396" height="2.4761679"> <feGaussianBlur stdDeviation="9.2058101" id="feGaussianBlur25355-6-5" /> </filter> </defs> <metadata id="metadata2218"> <rdf:RDF> <cc:Work rdf:about=""> <dc:format>image/svg+xml</dc:format> <dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage" /> <dc:title></dc:title> </cc:Work> </rdf:RDF> </metadata> <g id="layer1"> <g id="g27511" transform="matrix(1.0944665,0,0,1.0944665,4080.6368,-378.09354)"> <g id="g11097-5" transform="matrix(2.1953124,0,0,2.1953124,-2775.522,-965.54583)"> <g id="XMLID_32_-5-9-4" transform="matrix(0.27359266,0,0,0.27359266,-99.483337,672.04166)" style="fill:#fffae3;fill-opacity:1;stroke:none"> <g id="g4-6-2" style="fill:#fffae3;fill-opacity:1;stroke:none"> <circle cx="247.57001" cy="247.57001" fill="#fef0ae" r="247.57001" id="circle2-8-3" style="fill:#fffae3;fill-opacity:1;stroke:none" /> </g> </g> <path d="m -58.890397,739.77499 c 0,-30.33704 19.94874,-56.01481 47.4407,-64.63872 -6.40782,-2.01009 -13.22903,-3.09461 -20.30031,-3.09461 -37.40832,0 -67.73333,30.32501 -67.73333,67.73333 0,37.40833 30.32501,67.73334 67.73333,67.73334 7.07128,0 13.89441,-1.08507 20.3025,-3.09543 -27.49196,-8.62364 -47.44289,-34.30086 -47.44289,-64.63791 z" fill="#fee97d" id="path7-70-1" style="fill:#fff9de;fill-opacity:1;stroke:none;stroke-width:0.273593;stroke-opacity:1" /> <g id="XMLID_222_-9-54-4" transform="matrix(0.27359266,0,0,0.27359266,-99.483337,672.04166)" style="fill:#262626;fill-opacity:0.124242;stroke:none"> <g id="g29-7-8" style="fill:#262626;fill-opacity:0.124242;stroke:none"> <path d="m 495.09,251.71 h 0.01 c -0.58,35.83 -8.78,69.81 -23.04,100.39 l -0.02,-0.01 c -19.11,-7.74 -32.59,-26.46 -32.59,-48.35 0,-28.8 23.35,-52.15 52.15,-52.15 1.17,0 2.33,0.05 3.49,0.12 z" fill="#fee97d" id="path9-2-1" style="fill:#262626;fill-opacity:0.124242;stroke:none" /> <path d="m 247.57,456.33 c 21.57,0 39.7,14.77 44.8,34.76 -14.53,2.66 -29.5,4.05 -44.8,4.05 -15.3,0 -30.27,-1.39 -44.8,-4.05 5.1,-19.99 23.23,-34.76 44.8,-34.76 z" fill="#fedf30" id="path11-6-2" style="fill:#262626;fill-opacity:0.124242;stroke:none" /> <g fill="#fee97d" id="g19-74-2" style="fill:#262626;fill-opacity:0.124242;stroke:none"> <path d="m 307.32,345.89 c 16.67,0 30.19,13.52 30.19,30.19 0,16.68 -13.52,30.19 -30.19,30.19 -16.68,0 -30.2,-13.51 -30.2,-30.19 0,-16.67 13.52,-30.19 30.2,-30.19 z" id="path13-3-9" style="fill:#262626;fill-opacity:0.124242;stroke:none" /> <circle cx="362.06" cy="296.73001" r="21.35" id="circle15-70-6" style="fill:#262626;fill-opacity:0.124242;stroke:none" /> <circle cx="316.07999" cy="182.46001" r="57.450001" id="circle17-6-4" style="fill:#262626;fill-opacity:0.124242;stroke:none" /> </g> <circle cx="148.37" cy="296.26999" fill="#fee45a" r="33.07" id="circle21-22-1" style="fill:#262626;fill-opacity:0.124242;stroke:none" /> <path d="m 148.37,329.34 c 4.585,0 8.953,-0.935 12.923,-2.623 -6.789,-20.134 -11.059,-41.427 -12.435,-63.505 -0.163,-0.002 -0.324,-0.012 -0.488,-0.012 -18.27,0 -33.07,14.81 -33.07,33.07 0,18.26 14.8,33.07 33.07,33.07 z" fill="#fedf30" id="path23-4-3" style="fill:#262626;fill-opacity:0.124242;stroke:none" /> <path d="m 86.99,191.57 c 11.15,0 20.19,9.04 20.19,20.18 0,11.15 -9.04,20.19 -20.19,20.19 -11.15,0 -20.18,-9.04 -20.18,-20.19 0,-11.14 9.03,-20.18 20.18,-20.18 z" fill="#fedf30" id="path25-03-4" style="fill:#262626;fill-opacity:0.124242;stroke:none" /> <path d="m 173.32,11.34 c 2.24,8.27 3.45,16.97 3.45,25.95 0,54.63 -44.29,98.92 -98.93,98.92 -16.4,0 -31.87,-4 -45.49,-11.06 H 32.34 C 62.99,71.37 113.22,30.2 173.32,11.33 Z" fill="#fedf30" id="path27-85-4" style="fill:#262626;fill-opacity:0.124242;stroke:none" /> </g> </g> </g> <circle style="fill:#ffffff;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:3.46395;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;filter:url(#filter24957-7)" id="path24843-4" cx="-3662.5291" cy="471.44717" r="14.967094" /> <circle style="fill:#ffffff;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:3.46395;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;filter:url(#filter24957-8-8)" id="path24843-6-3" cx="-709.44025" cy="567.25287" r="14.967094" transform="matrix(0.7647059,0,0,0.7647059,-2846.1178,217.27064)" /> <circle style="fill:#ffffff;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:3.46395;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;filter:url(#filter24957-8-5-5)" id="path24843-6-0-67" cx="-709.44025" cy="567.25287" r="14.967094" transform="matrix(1.3088235,0,0,1.3088235,-2439.8933,-237.31081)" /> <circle style="fill:#ffffff;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:3.46395;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;filter:url(#filter24957-8-5-0-3)" id="path24843-6-0-5-77" cx="-709.44025" cy="567.25287" r="14.967094" transform="matrix(0.80968935,0,0,0.80968935,-1828.7287,261.84843)" /> <circle style="fill:#ffffff;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:3.46395;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;filter:url(#filter24957-8-5-0-4-2)" id="path24843-6-0-5-7-4" cx="-709.44025" cy="567.25287" r="14.967094" transform="matrix(1.1632427,0,0,1.1632427,-1272.0454,-153.54739)" /> <circle style="fill:#ffffff;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:3.46395;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;filter:url(#filter24957-8-5-9-7)" id="path24843-6-0-6-4" cx="-709.44025" cy="567.25287" r="14.967094" transform="matrix(0.99686465,0,0,0.99686465,-1629.264,14.914372)" /> <circle style="fill:#ffffff;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:3.46395;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;filter:url(#filter25353-3)" id="path24843-6-0-9-53" cx="-709.44025" cy="567.25287" r="14.967094" transform="matrix(0.84568775,0,0,0.84568775,-2927.1399,95.378235)" /> <circle style="fill:#ffffff;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:3.46395;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;filter:url(#filter25353-0-3)" id="path24843-6-0-9-9-9" cx="-709.44025" cy="567.25287" r="14.967094"  transform="matrix(0.84568775,0,0,0.84568775,-1623.2732,114.42823)" /> <circle style="fill:#ffffff;fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:3.46395;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1;filter:url(#filter25353-2-1)" id="path24843-6-0-9-5-5" cx="-709.44025" cy="567.25287" r="14.967094" transform="matrix(0.84568775,0,0,0.84568775,-2702.7732,-44.321768)" /> </g> </g> </svg>'
    ],
    }
  };

  constructor(root = null){
    if(root)this.root = root;
  }

}

class FILTRES{

  elements = {};
  constructor(root = null){
    var self = this;
    if(root)self.root = root;

    var filter = new UI([
      {
        type:'div',
        prop:{id:'thorium-filterUI'},
      }
    ]);

    filter.buildIn(document.getElementsByTagName('body')[0])
    .then(function(){
      self.dom = document.getElementById('thorium-filterUI');
    })

    addCss('thorium-filter',[
      "#thorium-filterUI {",
        "position: absolute;",
        "display:none;",
        "height: -webkit-fill-available;",
        "width: -webkit-fill-available;",
        "top: 0;",
        "left: 0;",
        "z-index: 50;",
      "}",

      "#thorium-filterUI.active {",
        "display:block;",
      "}",

      ".bbox-filter-container {",
        "position: absolute;",
        "display: grid;",
        "transition:0.08s;",
        "--vertical-line:calc(var(--self-height)*0.8);",
        "--horizontal-line:calc(var(--self-width)*0.8);",
      "}",

      ".bbox-filter-container:hover {",
        "background-color:rgba(100,149,237,0.5);",
      "}",

      ".bbox-filter-container div {",
        "height: 1px;",
        "width: 1px;",
        "background-color: cornflowerblue;",
        "grid-column:1;",
        "grid-row:1;",
        "opacity:0;",
      "}",

      ".bbox-filter-container:hover div{",
        "opacity:1;",
      "}",

      ".bbox-filter-container div[name='top'] {",
        "margin:auto;",
        "margin-top:0;",
        "width: var(--horizontal-line);",
      "}",

      ".bbox-filter-container div[name='left'] {",
        "margin:auto;",
        "margin-left:0;",
        "height: var(--vertical-line);",
      "}",

      ".bbox-filter-container div[name='bottom'] {",
        "margin:auto;",
        "margin-bottom:0;",
        "width: var(--horizontal-line);",
      "}",

      ".bbox-filter-container div[name='right'] {",
        "margin:auto;",
        "margin-right:0;",
        "height: var(--vertical-line);",
      "}",

      ".bbox-filter-container div[name='center'] {",
        "height:5px;",
        "width:5px;",
        "margin:auto;",
        "background-color: lime;",
      "}",
    ])

  }

}

FILTRES.prototype.updateOne = function (element) {
  var self = this , id = element.th.id;
  if(!self.elements[id]){
    var title = element.tagName.toLowerCase();
    if(element.getAttribute('id') != "" && element.getAttribute('id') != null)title += "#"+element.getAttribute('id');
    if(element.getAttribute('class') != "" && element.getAttribute('class') != null)title += "."+element.getAttribute('class');
    var filtreUI = new UI([
      {type:'div',prop:{id:'filter-'+id,class:'bbox-filter-container',tag:element.tagName,title:title},childrens:[
        {type:'div',prop:{name:'top'}},
        {type:'div',prop:{name:'left'}},
        {type:'div',prop:{name:'bottom'}},
        {type:'div',prop:{name:'right'}},
        {type:'div',prop:{name:'center'}},
      ]}
    ])
    filtreUI.buildIn(self.dom)
    .then(function(){
      self.elements[id] = {dom : document.getElementById('filter-'+id)};
      var dom = self.elements[id].dom;
      var p = element.position.get();

      dom.style.setProperty('--self-height',p.height+'px');
      dom.style.setProperty('--self-width',p.width+'px');
      dom.style.top = p.global.top+'px';
      dom.style.left = p.global.left+'px';
      dom.style.height = p.height+'px';
      dom.style.width = p.width+'px';
      dom.style.zIndex = element.nodeID.get();
    })
  }else{
    var p = element.position.get();
    const filtre = document.getElementById('filter-'+id);
    filtre.style.setProperty('--self-height',p.height+'px');
    filtre.style.setProperty('--self-width',p.width+'px');
    filtre.style.top = p.global.top+'px';
    filtre.style.left = p.global.left+'px';
    filtre.style.height = p.height+'px';
    filtre.style.width = p.width+'px';
  }
};

FILTRES.prototype.delete = function () {

};

FILTRES.prototype.show = function () {

};

FILTRES.prototype.hide = function () {

};

class PLATFORM{

  mobile = false;

  constructor(root = null){
    if(root)this.root = root;
    this.mobile = this.isMobile();
    this.navigator();
  }
}

PLATFORM.prototype.isMobile = function () {
  return (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
      || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4)) ? true : false);
};

PLATFORM.prototype.navigator = function () {
  this.appCodeName = navigator.appCodeName;
  this.appName = navigator.appName;
  this.appVersion = navigator.appVersion;
  this.bluetooth = navigator.bluetooth;
  this.clipboard = navigator.clipboard;
  this.connection = navigator.connection;
  this.cookieEnabled = navigator.cookieEnabled;
  this.credentials = navigator.credentials;
  this.deviceMemory = navigator.deviceMemory;
  this.doNotTrack = navigator.doNotTrack;
  this.geolocation = navigator.geolocation;
  this.hardwareConcurrency = navigator.hardwareConcurrency;
  this.hid = navigator.hid;
  this.keyboard = navigator.keyboard;
  this.language = navigator.language;
  this.languages = navigator.languages;
  this.locks = navigator.locks;
  this.managed = navigator.managed;
  this.maxTouchPoints = navigator.maxTouchPoints;
  this.mediaCapabilities = navigator.mediaCapabilities;
  this.mediaDevices = navigator.mediaDevices;
  this.mediaSession = navigator.mediaSession;
  this.mimeTypes = navigator.mimeTypes;
  this.onLine = navigator.onLine;
  this.permissions = navigator.permissions;
  this.platform = navigator.platform;
  this.plugins = navigator.plugins;
  this.presentation = navigator.presentation;
  this.product = navigator.product;
  this.productSub = navigator.productSub;
  this.scheduling = navigator.scheduling;
  this.serial = navigator.serial;
  this.serviceWorker = navigator.serviceWorker;
  this.storage = navigator.storage;
  this.usb = navigator.usb;
  this.userActivation = navigator.userActivation;
  this.userAgent = navigator.userAgent;
  this.userAgentData = navigator.userAgentData;
  this.vendor = navigator.vendor;
  this.vendorSub = navigator.vendorSub;
  this.wakeLock = navigator.wakeLock;
  this.webdriver = navigator.webdriver;
  this.webkitPersistentStorage = navigator.webkitPersistentStorage;
  this.webkitTemporaryStorage = navigator.webkitTemporaryStorage;
  this.xr = navigator.xr;
};

class STATS{
  constructor(root = null){
    var self = this;
    self.stats = this.initialise();
    if(root)self.root = root;
    var statsUI = new UI([{
      type:'div',
      prop:{
        id:'thorium-statsUI',
      },
      proto:{
        onMouseDown : function(e){
          this.selfDrag();
        }
      },
      childrens:[{
        type:'div',
        prop:{
          id:'statsUI-header',
        },
        childrens:[
          {type:'div',prop:{class:'statsUI-header-btn',text:th_caches.svg.close,style:"grid-column:2;"}},
          {type:'div',prop:{class:'statsUI-header-btn',text:th_caches.svg.close,style:"grid-column:3;"}},
          {type:'div',prop:{class:'statsUI-header-btn',text:th_caches.svg.close,style:"grid-column:4;"}},
        ]
      }]
    }])
    statsUI.buildIn(document.getElementsByTagName('body')[0])
    .then(function(){
      self.dom = document.getElementById('thorium-statsUI');
      self.dom.appendChild(self.stats.dom);
      self.#__add_css();
      // document.body.appendChild( this.stats.dom );
      self.stats.showPanel( 1 );
      self.stats.isShow = false;
      requestAnimationFrame( self.animate );
    })
  }

  #__add_css = function(self = this){
    var styleSheet = document.createElement("style")
    styleSheet.setAttribute('id','thorium-stats');
    styleSheet.type = "text/css";
    styleSheet.innerText = self.#style.join(" ");
    document.head.appendChild(styleSheet);
  }

  #style=[
    "#thorium-statsUI{",
      "position: absolute;",
      "background-color: ghostwhite;",
      "display: none;",
      "border: 1px solid black;",
      "filter: drop-shadow(1px 1px 10px lightgray);",
      "z-index: 100;",
    "}",

    "#thorium-statsUI.active{",
      "display: grid;",
    "}",

    "#statsUI-header{",
      "height: 1vw;",
      "display: grid;",
      "grid-template-columns: 1fr max-content max-content max-content;",
      "background-color: lightgray;",
    "}",

    ".statsUI-header-btn{",
      "display: grid;",
      "height: 0.8vw;",
      "width: 0.8vw;",
      "margin: auto;",
      "margin-right: 0.2vw;",
      "opacity: 0.4;",
    "}"

  ]

}

STATS.prototype.initialise = function(){
  var metrics = function(){
    (function (global, factory) { /** @author mrdoob / http://mrdoob.com/ */
      typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
      typeof define === 'function' && define.amd ? define(factory) :
      (global.Stats = factory());
      }(this, (function () { 'use strict';
      var Stats = function () {

        var mode = 0;

        var container = document.createElement( 'div' );
        container.setAttribute('id','stats-container')
        // container.style.cssText = 'position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000';
        container.addEventListener( 'click', function ( event ) {

          event.preventDefault();
          showPanel( ++ mode % container.children.length );

        }, false );

        //

        function addPanel( panel ) {

          container.appendChild( panel.dom );
          return panel;

        }

        function showPanel( id ) {

          for ( var i = 0; i < container.children.length; i ++ ) {

            // container.children[ i ].style.display = i === id ? 'block' : 'none';

          }

          mode = id;

        }

        //

        var beginTime = ( performance || Date ).now(), prevTime = beginTime, frames = 0;

        var fpsPanel = addPanel( new Stats.Panel( 'FPS', '#0ff', '#002' ) );
        var msPanel = addPanel( new Stats.Panel( 'MS', '#0f0', '#020' ) );

        if ( self.performance && self.performance.memory ) {

          var memPanel = addPanel( new Stats.Panel( 'MB', '#f08', '#201' ) );

        }

        showPanel( 0 );

        return {

          REVISION: 16,

          dom: container,

          addPanel: addPanel,
          showPanel: showPanel,

          begin: function () {

            beginTime = ( performance || Date ).now();

          },

          end: function () {

            frames ++;

            var time = ( performance || Date ).now();

            msPanel.update( time - beginTime, 200 );
            this.frameRate = time - beginTime;

            if ( time >= prevTime + 1000 ) {

              fpsPanel.update( ( frames * 1000 ) / ( time - prevTime ), 100 );

              prevTime = time;
              this.fps = frames;
              frames = 0;

              if ( memPanel ) {

                var memory = performance.memory;
                this.memory = {
                  use : memory.usedJSHeapSize / 1048576,
                  limit : memory.jsHeapSizeLimit / 1048576
                };
                memPanel.update( memory.usedJSHeapSize / 1048576, memory.jsHeapSizeLimit / 1048576 );

              }

            }
            // console.log(time);
            return time;

          },

          update: function () {

            beginTime = this.end();

          },

          // Backwards Compatibility

          domElement: container,
          setMode: showPanel

        };

      };

      Stats.Panel = function ( name, fg, bg ) {

        var min = Infinity, max = 0, round = Math.round;
        var PR = round( window.devicePixelRatio || 1 );

        var WIDTH = 80 * PR, HEIGHT = 48 * PR,
            TEXT_X = 8 * PR, TEXT_Y = 4 * PR,
            GRAPH_X = 3 * PR, GRAPH_Y = 15 * PR,
            GRAPH_WIDTH = 74 * PR, GRAPH_HEIGHT = 30 * PR;

        var canvas = document.createElement( 'canvas' );
        canvas.width = "80";
        canvas.height = "48";
        canvas.style.cssText = 'width:5vw;height:3.5vw';

        var context = canvas.getContext( '2d' );
        context.font = 'bold ' + ( 9 * PR ) + 'px Helvetica,Arial,sans-serif';
        context.textBaseline = 'top';

        context.fillStyle = bg;
        context.fillRect( 0, 0, WIDTH, HEIGHT );

        context.fillStyle = fg;
        context.fillText( name, TEXT_X, TEXT_Y );
        context.fillRect( GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT );

        context.fillStyle = bg;
        context.globalAlpha = 0.9;
        context.fillRect( GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT );

        return {

          dom: canvas,

          update: function ( value, maxValue ) {

            min = Math.min( min, value );
            max = Math.max( max, value );

            context.fillStyle = bg;
            context.globalAlpha = 1;
            context.fillRect( 0, 0, WIDTH, GRAPH_Y );
            context.fillStyle = fg;
            context.fillText( round( value ) + ' ' + name + ' (' + round( min ) + '-' + round( max ) + ')', TEXT_X, TEXT_Y );

            context.drawImage( canvas, GRAPH_X + PR, GRAPH_Y, GRAPH_WIDTH - PR, GRAPH_HEIGHT, GRAPH_X, GRAPH_Y, GRAPH_WIDTH - PR, GRAPH_HEIGHT );

            context.fillRect( GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, GRAPH_HEIGHT );

            context.fillStyle = bg;
            context.globalAlpha = 0.9;
            context.fillRect( GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, round( ( 1 - ( value / maxValue ) ) * GRAPH_HEIGHT ) );

          }

        };

      };

      return Stats;

    })))
    return new Stats();
  }
  return metrics();
}

STATS.prototype.update = function(){
  this.fps = this.stats.fps;
  this.memory = this.stats.memory;
  this.frameRate = this.stats.frameRate;
}

STATS.prototype.setInstructions = function(f){
  try{
    if(typeof f != "function")throw {err:1,msg:"le parametre entrant n'est pas une fonction" , f:f };
    this.instruction = f;
  }catch(err){
    console.error(err);
  }
}

STATS.prototype.loadInstructions = function(f){
  if(this.instruction)return this.instruction(this);
}

STATS.prototype.animate = function () {
  thorium.stats.start();
  thorium.stats.loadInstructions(thorium.stats);
  thorium.frameUpdate();
  thorium.stats.stop();
  thorium.stats.update();
  requestAnimationFrame( thorium.stats.animate );
};

STATS.prototype.start = function () {
  this.stats.begin();
};

STATS.prototype.stop = function () {
  this.stats.end();
};

STATS.prototype.showPanel = function ( panelNumber = null) {
  try{
    if(!Number(panel)) throw{err:1,msg:"panelNumber n'est pas un int" , desc :"pour choisir le panel à afficher passer un nombre (0: fps, 1: ms, 2: mb, 3+: custom)" , panelNumber:panelNumber};
    stats.showPanel( 1 );
  }catch(err){
    console.error(err);
  }
};

STATS.prototype.show = function () {
  this.dom.turnActive();
};

STATS.prototype.hide = function () {
  this.dom.turnActive();
};

/*
*@{name}th_var "thorium variables"
*@{type}class
*@{desc}th est la class présente dans tout les DOMelement passer entre les mains de thoriumJS , elle contient
        toute les variables personaliser en interne ainsi que toute les fonctions interne
        au DOMelement. Les fonctions et variables de th sont référencer dans le DOMelement, il est donc possible d'y
        acceder directement ex : DOMelment."nom de variable || fonction".
*/
class th_var{

  constructor(value){
    this.#value = value;
    this.type = this.typedef(value);
  }

  #value;
  type;

  get(){
    return this.#value;
  }

  set(value){
    this.#value = value;
  }

}

th_var.prototype.typedef = function (value) {
  if(typeof value == 'object'){ // si value est un "object"
    if(Array.isArray(value) == true){ // si value est un Array
      return "array";
    }
    else{ // si value est un Object
      return typeof value;
    }
  }
  else if(!isNaN(new Number(value))){ // si value est un nombre
    if(typeof value == 'boolean') return typeof value; // si il est aussi égal à un bool c'est uqe c'est un bool true = 1 , false = 0
    else return typeof Number(0); // sinon c'est un nombre
  }
  else if (typeof value == 'boolean'){ // si value est un boolean
    return typeof value;
  }
  else return typeof String("");  // sinon c'est un string
};


/*
*@{name}th
*@{type}class
*@{desc}th est la class présente dans tout les DOMelement passer entre les mains de thoriumJS , elle contient
        toute les variables personaliser en interne ainsi que toute les fonctions interne
        au DOMelement. Les fonctions et variables de th sont référencer dans le DOMelement, il est donc possible d'y
        acceder directement ex : DOMelment."nom de variable || fonction".
*/
class THORUS{

  constructor(elementHTML , elementRef , ui){
    if(elementHTML != null && elementRef != null)return new this.th(elementHTML , elementRef , ui);
  }

  th_key_comparator = {
    keys : [
      "onInitialise",
      "onUpdate",
      "onClick",
      "onDblClick",
      "onMouseEnter",
      "onMouseLeave",
      "onMouseMove",
      "onMouseOut",
      "onMouseOver",
      "onMouseUp",
      "onMouseDown",
      "onMouseWheel",
      "onAfterScriptExecute",
      "onFrameUpdate",
      "onResize",
    ],
    findByKey : function(key){
      for(var keyName of this.keys){
        if(key == keyName.toLowerCase())return keyName;
      }
    }
  }

  th = function(elementHTML , elementRef , ui){
    const self = this;
    // self.id = elementRef.id;
    // self.root = ui.root;
    self.e = elementHTML;

    // liste des fonction "type" à appliquer à TOUT DOMelment
    var th_proto = {
      nodeID : null,
      // varibale qui détermine si l'élément est actif ou non
      active : false,
      // variable contenant les position locales et globales de l'élément
      position : {},
      // fonction d'envois de l'information d'initialisation dans la chaine d'éléments
      initialise : function(arg = null){
        this.e.updateNodeID();
        this.e.updatePosition();
        for(const htmlChildren of this.e.children){
          try{
            if(!htmlChildren.th)throw {err:1,msg:"Il semblerait qu'un élément n'ai pas été référencer et prototyper correctement",element:htmlChildren,th:htmlChildren.th,proto:htmlChildren.__proto__}
            htmlChildren.th.initialise(arg);
          }
          catch(err){
            // console.error(err);
          }
          try{ // block qui essaye d'envoyer une instruction à onUpdate si définis
            htmlChildren.th.onInitialise(arg);
          }catch(err){
          }
        }
      },
      // fonction d'update de la chaine des éléments
      update : function(arg = null){
        this.e.updateNodeID();
        if(htmlChildren.th)this.e.updatePosition(); // ne se propage pas si pas un prototype conforme
        for(const htmlChildren of this.e.children){
          try{
            if(!htmlChildren.th)throw {err:1,msg:"Il semblerait qu'un élément n'ai pas été référencer et prototyper correctement",element:htmlChildren,th:htmlChildren.th,proto:htmlChildren.__proto__}
            htmlChildren.th.update(arg);
          }
          catch(err){
            console.error(err);
          }
        }
        try{ // block qui essaye d'envoyer une instruction à onUpdate si définis
          this.onUpdate(arg = null)
        }catch(err){
        }
      },
      //
      updateNodeID : function(){
        var parentnodeid;
        try{
          parentnodeid = this.e.parentNode.nodeID.get();
          this.e.nodeID.set(parentnodeid++);
        }catch(err){
          // parentnodeid n'est pas définis
          this.e.nodeID.set(1);
        }
      },
      // fonction d'update de la position de l'élement dans l'espace
      updatePosition : function(){

        var boundingBox = this.e.getBoundingClientRect();

        var position = {
          x : boundingBox.x,
          y : boundingBox.y,
          height : boundingBox.height,
          width : boundingBox.width,
          centre : thorium.vec2({ x : (boundingBox.x + boundingBox.width/2) , y : (boundingBox.y + boundingBox.height/2)}),
          margin : {
            top : cssToValue(this.cssProp('margin-top')),
            left : cssToValue(this.cssProp('margin-left')),
            bottom : cssToValue(this.cssProp('margin-bottom')),
            right : cssToValue(this.cssProp('margin-right')),
          },
          padding : {
            top : cssToValue(this.cssProp('padding-top')),
            left : cssToValue(this.cssProp('padding-left')),
            bottom : cssToValue(this.cssProp('padding-bottom')),
            right : cssToValue(this.cssProp('padding-right')),
          },
          global : {
            top : boundingBox.top,
            left : boundingBox.left,
            bottom : boundingBox.bottom,
            right : boundingBox.right
          }
        }

        this.e.position.set(position);
        thorium.filters.updateOne(this.e)

      },
      //
      frameUpdate : function(arg = null){

        for(var e of this.e.children){

          try{
            e.frameUpdate(arg);
          }catch(err){

          }

        }

        try{
          this.e.onFrameUpdate(arg)
        }catch(err){

        }
      },
      //
      resize : function(arg = null){
        for(const htmlChildren of this.e.children){
          try{
            if(!htmlChildren.th)throw {err:1,msg:"Il semblerait qu'un élément n'ai pas été référencer et prototyper correctement",element:htmlChildren,th:htmlChildren.th,proto:htmlChildren.__proto__}
            htmlChildren.th.resize(arg);
          }
          catch(err){
            console.error(err);
          }
        }
        try{ // block qui essaye d'envoyer une instruction à onUpdate si définis
          this.onResize(arg = null)
        }catch(err){
        }
      },
      // fonction de suppression et déréférencement de GUI
      destroy : async function(){
        for await(const enfants of this.e.children){
          enfants.destroy(this.id);
        }
        this.root.uids.deleteOne(this.id);
      },
      // fonction qui rend l'élément dragable SI il est absolute
      selfDrag : function(box_header) {
        var elmnt = this.e;
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        if (box_header) {// Si header specifier , la box bougera à partir du header
          box_header.onmousedown = dragMouseDown;
        } else {         // Sinon la div bougera de n'importe où à l'interier d'elle même
          elmnt.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e) {
          e = e || window.event;
          e.preventDefault();
          // get the mouse cursor position at startup:
          pos3 = e.clientX;
          pos4 = e.clientY;
          document.onmouseup = closeDragElement;
          // call a function whenever the cursor moves:
          document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
          e = e || window.event;
          e.preventDefault();
          // calculate the new cursor position:
          pos1 = pos3 - e.clientX;
          pos2 = pos4 - e.clientY;
          pos3 = e.clientX;
          pos4 = e.clientY;
          // set the element's new position:
          elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
          elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
          // stop moving when mouse button is released:
          document.onmouseup = null;
          document.onmousemove = null;
        }
      },
      // fonction qui ajoute ou retire le mot clef "active" à la class de l'élément
      turnActive : function() {
        var element = this.e;
        if(element.active.get() == false){
          element.classList.add('active');
          element.active.set(true);
        }
        else {
          element.classList.remove('active');
          element.active.set(false);
        }
      },
      radioLike : function(){
        this.e.turnActive();
        for(var e of this.e.parentNode.children){
          var active = e.active.get();
          if(active == true && e != this.e)e.turnActive();
        }
      },
      getNodeId : function(){
        const self = this;
        var id = self.id;
        for(var i = 0 ; i <= self.e.parentNode.children.length ; i++){
          if(self.e.parentNode.children[i].th.id == id)return i;
        }
        return null;
      },
      //
      findElementsByName : function(name = null , result = []){
        var element = this.e;
        try{
          if(!name)throw {err:1,msg:"name ne peut être vide",name:name};
          if(element.getAttribute('name') == name)result.push(element);
          if(element.children.length != 0){
            for(var e of element.children){
              e.findByName(name , result);
            }
          }
          else{
            return result;
          }
        }catch(err){
          console.error(err);
        }
      },
      // fonction qui retourne la propriete css définie dans le fichier css
      cssProp : function(propName = null) {
        try{
          if(!propName)throw {err:1,msg:"Le nom de propriété ne peut être null" , propName : propName}
          const styles = window.getComputedStyle(this.e);
          return styles[propName];
        }
        catch(err){
          console.error(err);
        }
      }
    }

    // boucle qui vas créer le "getter"/referencement du DOMelement ver les fonction proto "type" de th
    // le choix de méthode de référence dépend de si la référence pointe vers une fonction ou une variable
    for(const protoName of Object.keys(th_proto)){
      self[protoName] = th_proto[protoName];
      if(typeof self[protoName]  == 'function'){ // si fonction
        try{ // rejet et avertissement si le nom de la propriete est déjà existante dans le DOMelement
          if(self.e[protoName])throw {err : 1 , msg : `le nom de propiété "${protoName}" du proto fait référence à un champ déjà existant dans DOMelment` , name : protoName , DOMelement : elementHTML[protoName] , proto : th_proto}
          self.e[protoName] = function(){ // création de la fonction qui servira de getter
            return self[protoName]();
          }
        }catch(err){
          console.error(err);
        }
      }else{ // si variable
        try{ // rejet et avertissement si le nom de la propriete est déjà existante dans le DOMelement
          if(self.e[protoName])throw {err : 1 , msg : `le nom de propiété "${protoName}" du proto fait référence à un champ déjà existant dans DOMelment` , name : protoName , DOMelement : elementHTML[protoName] , proto : th_proto}
          // self.e[protoName] = function(){ // création de la fonction qui servira de getter
          //   self.e[protoName] = self[protoName];
          // }
          self[protoName] = new th_var(self[protoName]);
          self.e[protoName] = self[protoName];
        }catch(err){
          console.error(err);
        }
      }
    }
/*
  X  afterscriptexecute event (en-US)
  *  auxclick event (en-US)
  *  beforescriptexecute event (en-US)
  *  blur event (en-US)
  X  click event
  *  compositionend event
  *  compositionstart event
  *  compositionupdate event
  *  contextmenu event
  *  copy event
  *  cut event (en-US)
  X  dblclick event
  *  DOMActivate event (en-US)
  *  DOMMouseScroll event (en-US)
  *  error event
  *  focusin event
  *  focusout event
  *  focus event (en-US)
  *  fullscreenchange event (en-US)
  *  fullscreenerror event (en-US)
  *  gesturechange event (en-US)
  *  gestureend event (en-US)
  *  gesturestart event (en-US)
  *  keydown event (en-US)
  *  keypress event (en-US)
  *  keyup event (en-US)
  X  mousedown event
  X  mouseenter event
  X  mouseleave event
  X  mousemove event
  X  mouseout event
  X  mouseover event
  X  mouseup event
  X  mousewheel event (en-US)
  *  msContentZoom event (en-US)
  *  MSGestureChange event (en-US)
  *  MSGestureEnd event (en-US)
  *  MSGestureHold event (en-US)
  *  MSGestureStart event (en-US)
  *  MSGestureTap event (en-US)
  *  MSInertiaStart event (en-US)
  *  MSManipulationStateChanged event (en-US)
  *  overflow event (en-US)
  *  paste event (en-US)
  *  scroll event (en-US)
  *  select event
  *  show event (en-US)
  *  touchcancel event (en-US)
  *  touchend event (en-US)
  *  touchmove event (en-US)
  *  touchstart event (en-US)
  *  underflow event (en-US)
  *  webkitmouseforcechanged event (en-US)
  *  webkitmouseforcedown event (en-US)
  *  webkitmouseforceup event (en-US)
  *  webkitmouseforcewillbegin event (en-US)
  *  wheel event (en-US)
*/
    var th_handlers = {
      click : function(e = null){ // fonction sur click de l'élément
        try{
          self.onClick(e)
        }catch(err){
          // console.log(e);
        }
      },
      dblclick : function(e = null){ // fonction sur double click de l'élément
        try{
          self.onDblClick(e)
        }catch(err){
          // console.log(e);
        }
      },
      mouseenter : function(e = null){ // fonction d'entrée du curseur sur l'élément
        try{
          self.onMouseEnter(e)
        }catch(err){
          // console.log(e);
        }
      },
      mouseleave : function(e = null){ // fonction de sortie du curseur sur l'élément
        try{
          self.onMouseLeave(e)
        }catch(err){
          // console.log(e);
        }
      },
      mousemove : function(e = null){ // fonction de passage du curseur sur l'élément
        try{
          self.onMouseMove(e);
        }catch(err){
          // console.log(err);
        }
      },
      mouseout : function(e = null){ // fonction
        try{
          self.onMouseOut (e);
        }catch(err){
          // console.log(err);
        }
      },
      mouseover : function(e = null){ // fonction de positionnement du curseur sur l'élement
        try{
          self.onMouseOver(e);
        }catch(err){
          // console.log(err);
        }
      },
      mouseup : function(e = null){ // fonction du relachement du click sur l'élément
        try{
          self.onMouseUp(e);
        }catch(err){
          // console.log(err);
        }
      },
      mousedown : function(e = null){ // fonction d'appuis du click sur l'élément
        try{
          self.onMouseDown(e);
        }catch(err){
          // console.log(err);
        }
      },
      mousewheel : function(e = null){ // fonction si action de la roulette sur l'élément
        try{
          self.onMouseWheel(e);
        }catch(err){
          // console.log(err);
        }
      },
      afterscriptexecute : function(e = null){ // fonction qui se lance après l'exécution d'un script
        try{
          self.onAfterScriptExecute(e);
        }catch(err){
          // console.log(err);
        }
      }
    }

    for(const listenerName of Object.keys(th_handlers)){
      try{
        elementHTML.addEventListener(listenerName,function(e){th_handlers[listenerName](e)})
      }catch(err){
      }
    }

    // boucle qui vas créer le "getter"/referencement du DOMelement ver le proto "personalisé" de th
    // le choix de méthode de référence dépend de si la référence pointe vers une fonction ou une variable
    if(elementRef.proto) for (const protoName of Object.keys(elementRef.proto)){
      self[protoName] = elementRef.proto[protoName];
      if(typeof self[protoName]  == 'function'){ // si fonction
        try{ // rejet et avertissement si le nom de la propriete est déjà existante dans le DOMelement
          if(self.e[protoName])throw {err : 1 , msg : `le nom de propiété "${protoName}" du proto fait référence à un champ déjà existant dans DOMelment` , name : protoName , DOMelement : elementHTML[protoName] , proto : elementRef.proto}
          self.e[protoName] = function(){ // création de la fonction qui servira de getter
            return self[protoName]();
          }
        }catch(err){
          console.error(err);
        }
      }else{ // si variable
        try{ // rejet et avertissement si le nom de la propriete est déjà existante dans le DOMelement
          if(self.e[protoName])throw {err : 1 , msg : `le nom de propiété "${protoName}" du proto fait référence à un champ déjà existant dans DOMelment` , name : protoName , DOMelement : elementHTML[protoName] , proto : elementRef.proto}
          // self.e[protoName] = function(){ // création de la fonction qui servira de getter
          //   self.e[protoName] = self[protoName];
          // }
          // if(typeof self[protoName] == 'boolean')self.e[protoName] = new Boolean(self[protoName])
          // else self.e[protoName] = self[protoName];
          self[protoName] = new th_var(self[protoName]);
          self.e[protoName] = self[protoName];

          // self.e[protoName] = self[protoName];
        }catch(err){
          console.error(err);
        }
      }
    };

  }

  parse = async function(element , elementRef , ui){
    var elementRef = {proto : {}};
    var self = this;
    for await(const attributeName of element.getAttributeNames()){

      /* gestion des variables internes */
      if(attributeName[0] == "v" && attributeName[1] == ":"){
        const v = element.getAttribute(attributeName);
        elementRef.proto[attributeName.split('v:').join('')] = v;
        element.removeAttribute(attributeName);
      }

      /* gestion des fonctions internes */
      if(attributeName[0] == "f" && attributeName[1] == ":"){
        const f = element.getAttribute(attributeName);
        // const functionName = self.th_key_comparator.findByKey(attributeName.split('f:').join(''));
        //
        // if(functionName == undefined)functionName = attributeName.split('f:').join('');

        const functionName = (self.th_key_comparator.findByKey(attributeName.split('f:').join('')) != undefined ? self.th_key_comparator.findByKey(attributeName.split('f:').join('')) : attributeName.split('f:').join(''));

        elementRef.proto[functionName] = function(){
          return eval(`(${f})`)(element.th);
        };
        element.removeAttribute(attributeName);
      }
    }

    console.log(elementRef);

    if(!element.th){
      element.th = new THORUS( element , elementRef , ui);
    }
    if(element.children){
      for await(const e of element.children){
        await this.parse(e);
      }
    }
  }

}

class ThoriumMath{

  vec2 = (function inject(clean, precision, undef) {

    var isArray = function (a) {
      return Object.prototype.toString.call(a) === "[object Array]";
    };

    var defined = function(a) {
      return a !== undef;
    };

    function Vec2(x, y) {
      if (!(this instanceof Vec2)) {
        return new Vec2(x, y);
      }

      if (isArray(x)) {
        y = x[1];
        x = x[0];
      } else if('object' === typeof x && x) {
        y = x.y;
        x = x.x;
      }

      this.x = Vec2.clean(x || 0);
      this.y = Vec2.clean(y || 0);
    }

    Vec2.prototype = {
      name:"Vec2",
      type:'Math',
      change : function(fn) {
        if (typeof fn === 'function') {
          if (this.observers) {
            this.observers.push(fn);
          } else {
            this.observers = [fn];
          }
        } else if (this.observers && this.observers.length) {
          for (var i=this.observers.length-1; i>=0; i--) {
            this.observers[i](this, fn);
          }
        }

        return this;
      },

      ignore : function(fn) {
        if (this.observers) {
          if (!fn) {
            this.observers = [];
          } else {
            var o = this.observers, l = o.length;
            while(l--) {
              o[l] === fn && o.splice(l, 1);
            }
          }
        }
        return this;
      },

      // set x and y
      set: function(x, y, notify) {
        if('number' != typeof x) {
          notify = y;
          y = x.y;
          x = x.x;
        }

        if(this.x === x && this.y === y) {
          return this;
        }

        var orig = null;
        if (notify !== false && this.observers && this.observers.length) {
          orig = this.clone();
        }

        this.x = Vec2.clean(x);
        this.y = Vec2.clean(y);

        if(notify !== false) {
          return this.change(orig);
        }
      },

      // reset x and y to zero
      zero : function() {
        return this.set(0, 0);
      },

      // return a new vector with the same component values
      // as this one
      clone : function() {
        return new (this.constructor)(this.x, this.y);
      },

      // negate the values of this vector
      negate : function(returnNew) {
        if (returnNew) {
          return new (this.constructor)(-this.x, -this.y);
        } else {
          return this.set(-this.x, -this.y);
        }
      },

      // Add the incoming `vec2` vector to this vector
      add : function(x, y, returnNew) {

        if (typeof x != 'number') {
          returnNew = y;
          if (isArray(x)) {
            y = x[1];
            x = x[0];
          } else {
            y = x.y;
            x = x.x;
          }
        }

        x += this.x;
        y += this.y;


        if (!returnNew) {
          return this.set(x, y);
        } else {
          // Return a new vector if `returnNew` is truthy
          return new (this.constructor)(x, y);
        }
      },

      // Subtract the incoming `vec2` from this vector
      subtract : function(x, y, returnNew) {
        if (typeof x != 'number') {
          returnNew = y;
          if (isArray(x)) {
            y = x[1];
            x = x[0];
          } else {
            y = x.y;
            x = x.x;
          }
        }

        x = this.x - x;
        y = this.y - y;

        if (!returnNew) {
          return this.set(x, y);
        } else {
          // Return a new vector if `returnNew` is truthy
          return new (this.constructor)(x, y);
        }
      },

      // Multiply this vector by the incoming `vec2`
      multiply : function(x, y, returnNew) {
        if (typeof x != 'number') {
          returnNew = y;
          if (isArray(x)) {
            y = x[1];
            x = x[0];
          } else {
            y = x.y;
            x = x.x;
          }
        } else if (typeof y != 'number') {
          returnNew = y;
          y = x;
        }

        x *= this.x;
        y *= this.y;

        if (!returnNew) {
          return this.set(x, y);
        } else {
          return new (this.constructor)(x, y);
        }
      },

      // Rotate this vector. Accepts a `Rotation` or angle in radians.
      //
      // Passing a truthy `inverse` will cause the rotation to
      // be reversed.
      //
      // If `returnNew` is truthy, a new
      // `Vec2` will be created with the values resulting from
      // the rotation. Otherwise the rotation will be applied
      // to this vector directly, and this vector will be returned.
      rotate : function(r, inverse, returnNew) {
        var
        x = this.x,
        y = this.y,
        cos = Math.cos(r),
        sin = Math.sin(r),
        rx, ry;

        inverse = (inverse) ? -1 : 1;

        rx = cos * x - (inverse * sin) * y;
        ry = (inverse * sin) * x + cos * y;

        if (returnNew) {
          return new (this.constructor)(rx, ry);
        } else {
          return this.set(rx, ry);
        }
      },

      // Calculate the length of this vector
      length : function() {
        var x = this.x, y = this.y;
        return Math.sqrt(x * x + y * y);
      },

      // Get the length squared. For performance, use this instead of `Vec2#length` (if possible).
      lengthSquared : function() {
        var x = this.x, y = this.y;
        return x*x+y*y;
      },

      // Return the distance betwen this `Vec2` and the incoming vec2 vector
      // and return a scalar
      distance : function(vec2) {
        var x = this.x - vec2.x;
        var y = this.y - vec2.y;
        return Math.sqrt(x*x + y*y);
      },

      // Given Array of Vec2, find closest to this Vec2.
      nearest : function(others) {
        var
        shortestDistance = Number.MAX_VALUE,
        nearest = null,
        currentDistance;

        for (var i = others.length - 1; i >= 0; i--) {
          currentDistance = this.distance(others[i]);
          if (currentDistance <= shortestDistance) {
            shortestDistance = currentDistance;
            nearest = others[i];
          }
        }

        return nearest;
      },

      // Convert this vector into a unit vector.
      // Returns the length.
      normalize : function(returnNew) {
        var length = this.length();

        // Collect a ratio to shrink the x and y coords
        var invertedLength = (length < Number.MIN_VALUE) ? 0 : 1/length;

        if (!returnNew) {
          // Convert the coords to be greater than zero
          // but smaller than or equal to 1.0
          return this.set(this.x * invertedLength, this.y * invertedLength);
        } else {
          return new (this.constructor)(this.x * invertedLength, this.y * invertedLength);
        }
      },

      // Determine if another `Vec2`'s components match this one's
      // also accepts 2 scalars
      equal : function(v, w) {
        if (typeof v != 'number') {
          if (isArray(v)) {
            w = v[1];
            v = v[0];
          } else {
            w = v.y;
            v = v.x;
          }
        }

        return (Vec2.clean(v) === this.x && Vec2.clean(w) === this.y);
      },

      // Return a new `Vec2` that contains the absolute value of
      // each of this vector's parts
      abs : function(returnNew) {
        var x = Math.abs(this.x), y = Math.abs(this.y);

        if (returnNew) {
          return new (this.constructor)(x, y);
        } else {
          return this.set(x, y);
        }
      },

      // Return a new `Vec2` consisting of the smallest values
      // from this vector and the incoming
      //
      // When returnNew is truthy, a new `Vec2` will be returned
      // otherwise the minimum values in either this or `v` will
      // be applied to this vector.
      min : function(v, returnNew) {
        var
        tx = this.x,
        ty = this.y,
        vx = v.x,
        vy = v.y,
        x = tx < vx ? tx : vx,
        y = ty < vy ? ty : vy;

        if (returnNew) {
          return new (this.constructor)(x, y);
        } else {
          return this.set(x, y);
        }
      },

      // Return a new `Vec2` consisting of the largest values
      // from this vector and the incoming
      //
      // When returnNew is truthy, a new `Vec2` will be returned
      // otherwise the minimum values in either this or `v` will
      // be applied to this vector.
      max : function(v, returnNew) {
        var
        tx = this.x,
        ty = this.y,
        vx = v.x,
        vy = v.y,
        x = tx > vx ? tx : vx,
        y = ty > vy ? ty : vy;

        if (returnNew) {
          return new (this.constructor)(x, y);
        } else {
          return this.set(x, y);
        }
      },

      // Clamp values into a range.
      // If this vector's values are lower than the `low`'s
      // values, then raise them.  If they are higher than
      // `high`'s then lower them.
      //
      // Passing returnNew as true will cause a new Vec2 to be
      // returned.  Otherwise, this vector's values will be clamped
      clamp : function(low, high, returnNew) {
        var ret = this.min(high, true).max(low);
        if (returnNew) {
          return ret;
        } else {
          return this.set(ret.x, ret.y);
        }
      },

      // Perform linear interpolation between two vectors
      // amount is a decimal between 0 and 1
      lerp : function(vec, amount, returnNew) {
        return this.add(vec.subtract(this, true).multiply(amount), returnNew);
      },

      // Get the skew vector such that dot(skew_vec, other) == cross(vec, other)
      skew : function(returnNew) {
        if (!returnNew) {
          return this.set(-this.y, this.x)
        } else {
          return new (this.constructor)(-this.y, this.x);
        }
      },

      // calculate the dot product between
      // this vector and the incoming
      dot : function(b) {
        return Vec2.clean(this.x * b.x + b.y * this.y);
      },

      // calculate the perpendicular dot product between
      // this vector and the incoming
      perpDot : function(b) {
        return Vec2.clean(this.x * b.y - this.y * b.x);
      },

      // Determine the angle between two vec2s
      angleTo : function(vec) {
        return Math.atan2(this.perpDot(vec), this.dot(vec));
      },

      // Divide this vector's components by a scalar
      divide : function(x, y, returnNew) {
        if (typeof x != 'number') {
          returnNew = y;
          if (isArray(x)) {
            y = x[1];
            x = x[0];
          } else {
            y = x.y;
            x = x.x;
          }
        } else if (typeof y != 'number') {
          returnNew = y;
          y = x;
        }

        if (x === 0 || y === 0) {
          throw new Error('division by zero')
        }

        if (isNaN(x) || isNaN(y)) {
          throw new Error('NaN detected');
        }

        if (returnNew) {
          return new (this.constructor)(this.x / x, this.y / y);
        }

        return this.set(this.x / x, this.y / y);
      },

      isPointOnLine : function(start, end) {
        return (start.y - this.y) * (start.x - end.x) ===
               (start.y - end.y) * (start.x - this.x);
      },

      toArray: function() {
        return [this.x, this.y];
      },

      fromArray: function(array) {
        return this.set(array[0], array[1]);
      },
      toJSON: function () {
        return {x: this.x, y: this.y};
      },
      toString: function() {
        return '(' + this.x + ', ' + this.y + ')';
      },
      constructor : Vec2
    };

    Vec2.fromArray = function(array, ctor) {
      return new (ctor || Vec2)(array[0], array[1]);
    };

    // Floating point stability
    Vec2.precision = precision || 8;
    var p = Math.pow(10, Vec2.precision);

    Vec2.clean = clean || function(val) {
      if (isNaN(val)) {
        throw new Error('NaN detected');
      }

      if (!isFinite(val)) {
        throw new Error('Infinity detected');
      }

      if(Math.round(val) === val) {
        return val;
      }

      return Math.round(val * p)/p;
    };

    Vec2.inject = inject;

    if(!clean) {
      Vec2.fast = inject(function (k) { return k; });

      // Expose, but also allow creating a fresh Vec2 subclass.
      if (typeof module !== 'undefined' && typeof module.exports == 'object') {
        module.exports = Vec2;
      } else {
        window.Vec2 = window.Vec2 || Vec2;
      }
    }
    return Vec2;
  })();

  lerp = function(a = null,b = null,alpha = 0){
    try{
      if(alpha > 1 || alpha < 0)throw {err:2,msg:"Alpha doit être entre 0 et 1" , alpha : alpha}
      if((Number.isNaN(a)==false && Number.isNaN(b)==false) && (typeof a == "number" && typeof b == "number")){ // dans le cas où les position sont des nombres
        return a*(1-alpha)+b*alpha;
      }
      else if(a.__proto__.name == "Vec2" && b.__proto__.name == "Vec2"){
        return a.distance(b,alpha);
      }
      else if(a.__proto__.name == "Vec3" && b.__proto__.name == "Vec3"){
        return a.distance(b,alpha);
      }else throw {err:1,msg:"Le format des donnée ne correspond pas à ce qui est attend, a et b doivent êtres un nombre , vec2 ou vec3." , a : a , b : b}
    }catch(err){
      console.error(err);
    }
  }

}

class KeyStat{

  press;

  constructor(callEvent){
    this.key = callEvent.key;
  }
}

class MouseStat{

  press = false;
  x = null;
  y = null;
  last = {
    x : null,
    y : null,
    distance : null, // corespond à la longueur/distance du vecteur origine/dernierPoint à la nouvelle position
    facteur : null // corespond à la puissance du déplacement ( % du déplacement par rapport à la résolution )
  };
  constructor(callEvent){
    this.x = callEvent.x;
    this.y = callEvent.y;
  }
}

MouseStat.prototype.updatePosition = function (newCoord) {
  try{
    if(typeof newCoord != 'object' && (!newCoord.x || !newCoord.y))throw {err:1,msg:"Les coordonnée ne semblent pas être un vecteur 2D" , newCoord:newCoord , exemple : { x : 0 , y : 0 }};

    this.last.x = this.x;
    this.last.y = this.y;

    this.x = newCoord.x;
    this.y = newCoord.y;
    this.path = newCoord.path;
    this.last.distance = Math.sqrt( Math.pow((this.x - this.last.x),2) + Math.pow((this.y - this.last.y),2) )

    try{
      var facteur = thorium.screen.height * thorium.screen.width;
      this.last.facteur = (this.last.distance/facteur)*100;
    }catch(err){
      console.log(err);
    }

  }catch(err){
    console.error(err);
  }
};

class Controls{

  listeners = { // contient les listener qui font référence à un élément l'ayant déclarer
    keydown : [],
    keyup : [],
    mousemove : [],
    mousedown : [],
    mouseup : []
  };

  constructor(root = null){
    if(!root)console.error({warningMessage:"Attention le root de control est null, certain racourcis pourraient ne pas fonctionner"});
    var self = this;
    self.keys = {};
    self.setHandlers();
    if(root)self.root = root;
  }

  shortcutsDef = function(self){

    try{
      if(self.keys.ALT.press == true && self.keys.M.press == true){
        if(self.root){
          if(self.root.stats.isShow == false)self.root.stats.show();
          else self.root.stats.hide();
        }
      }
    }
    catch(err){

    }

    try{
      if(self.keys.ALT.press == true && self.keys.L.press == true){
        if(self.root){
          self.root.filters.dom.turnActive();
        }
      }
    }
    catch(err){
      console.log(err);
    }

  };
  get shortcuts(){return this.shortcutsDef(this)}
  set shortcuts(f){
    try {
      if(typeof f != "function")throw {err:1,msg:"f n'est pas une fonction",f:f,typeof:typeof f}
      this.shortcutsDef = f;
    } catch (e) {
      console.error(err);
    }
  }
}

Controls.prototype.setHandlers = function () {
  var self = this;
  window.addEventListener('keydown',async function(e){
    if(!self.keys[e.key.toUpperCase()])self.keys[e.key.toUpperCase()] = new KeyStat(e);
    self.keys[e.key.toUpperCase()].press = true;
    self.isShortcuts();
    for(var e of self.listeners.keydown){e.function(e.ref);}
  })

  window.addEventListener('keyup',async function(e){
    if(!self.keys[e.key.toUpperCase()])self.keys[e.key.toUpperCase()] = new KeyStat(e);
    self.keys[e.key.toUpperCase()].press = false;
    for(var e of self.listeners.keyup){e.function(e.ref);}
  })

  window.addEventListener('mousemove',async function(e){
    if(!self.mouse)self.mouse = new MouseStat(e);
    self.mouse.updatePosition(e);
    for(var e of self.listeners.mousemove){e.function(e.ref);}
  })

  window.addEventListener('mousedown',async function(e){
    if(!self.mouse)self.mouse = new MouseStat(e);
    self.mouse.press = true;
    for(var e of self.listeners.mousedown){e.function(e.ref);}
  })

  window.addEventListener('mouseup',async function(e){
    if(!self.mouse)self.mouse = new MouseStat(e);
    self.mouse.press = false;
    for(var e of self.listeners.mouseup){e.function(e.ref);}
  })
};

Controls.prototype.isShortcuts = function () {
  this.shortcutsDef(this);
};

Controls.prototype.addEventListener = function(listenerName,f,ref){
  var self = this;
  try{
    if(!self.listeners[listenerName])throw {err:1,msg:"Le listenerName n'existe pas ou ne fais pas partie des listeners qui peuvent être utiliser de la minière faite ici.",listenerName:listenerName,listenersToUse:Object.keys(self.listeners)};
    self.listeners[listenerName].push({function : f , ref : ref });
    return {
      id : self.listeners[listenerName].length-1 ,
      name : listenerName,
      parent : self.listeners[listenerName],
      ref : self.listeners[listenerName][self.listeners[listenerName].length-1],
      delete : function(){
        const self = this;
        return new Promise(async function(next){
          thorium.controls.listeners[listenerName] = self.parent.splice(self.id,self.id);
          next(true);
        })
      }
    };
  }catch(err){
    console.error(err);
    return null;
  }
}

Controls.prototype.lerp = function(start,end,alpha){

}

class ScreenStat{

  reference;
  height;
  width;

  constructor(screen){
    var self = this;
    self.reference = document.children[0];
    self.height = self.reference.clientHeight;
    self.width = self.reference.clientWidth;
    self.reference.style.setProperty('--thorium-default-height',self.height+'px');
    self.reference.style.setProperty('--thorium-default-width',self.width+'px');

    window.addEventListener('resize',function(e){
      self.update();

      try{
        thorium.conf.app.update();
      }catch(err){

      }

      try{
        thorium.conf.app.resize();
      }catch(err){

      }

    })
  }

}

ScreenStat.prototype.update = function () {
  this.height = this.reference.clientHeight;
  this.width = this.reference.clientWidth;
  this.reference.style.setProperty('--thorium-default-height',this.height+'px');
  this.reference.style.setProperty('--thorium-default-width',this.width+'px');
};

/*
*@{name}DATASTORAGE
*@{type}class
*@{desc}DATASTORAGE est la class s'occupant de la base de donnée en format nosql , elle peut prendre en parametre un object issus d'un processus
*       mais aussi d'une base de donnée nosql, qui serra répliquer ici
*/
class DATASTORAGE{

  #data = {}; // contient la db client-side
  #update = false; // boll représentant la nécessité ou non de sauvegarder
  #update_change = false; // boll representant le changement de update de false -> true ou true -> false mais pas false -> false ou true -> true
  #update_eventTime = null; // eventTime de la dernière action ( insert , delete , save )

  constructor(arg = null){
    if(arg)this.initialise(arg);
  }

  initialise = function (arg) {
    this.#data = JSON.parse(JSON.stringify(arg));
  }

  get data(){return this.#data} // retourne les data de la db
  get update(){return this.#update} // retourne en bool l'état de changement true = un object a été inserer , false = rien n'as changer
  get update_change(){return this.#update_change} // retourne un trigger true|false représentant le passage de update d'un état à l'autre
  get update_eventTime(){return this.#update_eventTime} // retourne le dernier EventTime d'insert , delete , update ...

};

/*
*@{name}insert
*@{type}fonction
*@{desc}insert est la fonction d'ajout dans la base de donnée, elle joue aussi le role d'update, car si la donnée existe déjà il vas la
*       reecrire.
*/
DATASTORAGE.prototype.insert = function (arg) {

  function insert_byKeys(obj,ref){
    for(var key of Object.keys(obj)){
      if(!ref[key])ref[key] = obj[key];
      if(typeof obj[key] == 'object')insert_byKeys(obj[key],ref[key]);
      else ref[key] = obj[key];
    }
  }
  insert_byKeys(arg,this.data);
  if(this.update == false)this.update_change = true;
  this.update = true;
  this.update_eventTime = Date.now();
};

/*
*@{name}delete
*@{type}fonction
*@{desc}delete est la fonction de suppression d'une propriete dans la db. En supprimant la propriete la donnée est supprimer aussi.
*/
DATASTORAGE.prototype.delete = function (arg) {

  function delete_byKeys(obj,ref){
    for(var key of Object.keys(obj)){
      if(typeof obj[key] == 'object')delete_byKeys(obj[key],ref[key]);
      else delete ref[key];
    }
  }

  delete_byKeys(arg,this.data);

  if(this.update == false)this.update_change = true;
  this.update = true;
  this.update_eventTime = Date.now();
};

/*
*@{name}UIelement
*@{type}class
*@{desc}UIelement est un élément "basique" de definition, il contient le type|tag de la balise , les attributs(props) ,
        les enfants ( childrens ) qui est interpreté comme un UI , et proto qui contient les variables et fonction de
        prototypage du DOMelement qui en serra générer.
*/
class UIelement{

  constructor(e , root = null , parent = null){
    // if(this.component) console.log('ici');
    this.__proto__.ClassName = 'UIelement';
    if(root)this.__proto__.root = root;
    if(parent)this.__proto__.parent = parent;
    this.normalise(e);
  };

}

UIelement.prototype.initialise = function (arg = null) {
  this.childrens.initialise(arg);
}

UIelement.prototype.update = function (arg = null) {
  this.childrens.update(arg);
}

/*
*@{name} fonction de normalisation du nouveau template ou element. Rejet si n'est pas un tableau
*/
UIelement.prototype.normalise = async function(definition = {}) {
  var self = this;
  try{ // rejet si différent de type Object
    if(Array.isArray(definition)){
      if(definition[0].__proto__.ClassName == "UIelement")definition = definition[0];
      else throw {err:2,msg:"value est un tableau",value:definition,isArray:Array.isArray(definition),typeof:typeof definition};
    }
    if(typeof definition != 'object')throw {err:1,msg:"value n'est pas un object",value:definition,isArray:Array.isArray(definition),typeof:typeof definition};
    // console.log(definition);
    // if(definition.__proto__.ClassName == "UI")throw {err:3,msg:"value est un UI, comprenons qu'il serra ajouter en tant qu'enfant au parent"}
    let i = 0;
    for(var prop of Object.keys(definition)){
      this[prop] = definition[prop];
    }
    // console.log(this);
    if(this.childrens)this.childrens = new UI(this.childrens);
    if(this.__proto__.root)self.id = await this.__proto__.root.setNewId(this);
  }
  catch(err){
    console.error(err);
    if(err.err == 3){
      console.log(err);
    }
  }
}

UIelement.prototype.setId = function (id) {
  this.__proto__.id = id;
};

UIelement.prototype.getId = function () {
  return this.id;
};

/*
*@{name}
*/
UIelement.prototype.find = function (querry) {
  var element_courant = this;
  return new Promise(async function(next){
    var result = await element_courant.find_from_querry(querry);
    if(result.find.length!=1)next(result.find);
    else next(result.find[0]);
  })
};

/*
*@{name}
*/
UIelement.prototype.find_from_querry = function (querry,result) {
  var self = this;
  return new Promise(async function(next){
    if(typeof result=='undefined')result={find:[],historique:{}};
    var querrySelector = self.getQuerrySelector(querry);

    // FILTRE DES CORESPONDANCE TAG , ID , CLASS
    if(self.type.toUpperCase() == querrySelector.type.toUpperCase() && !result.historique[self.getId()]){ // si les type sont égaux
      if(querrySelector.id && querrySelector.class){ // si id && class sont présent
        if(self.prop.id && self.prop.id.toUpperCase() == querrySelector.id.toUpperCase() && self.prop.class.toUpperCase() == querrySelector.class.toUpperCase()){
          result.historique[self.getId()] = true;
          result.find.push(self) ;
        }
      }else{ // sinon si pas d'égalité ID et Class
        if(querrySelector.id){ // si id est présent
          try{
            if(self.prop.id.toUpperCase() == querrySelector.id.toUpperCase()){ // si id est égal
              result.historique[self.getId()] = true;
              result.find.push(self) ;
            }
          }catch(err){}
        }
        else if(querrySelector.class){ // si class est présent
            // console.log(querry,self.prop,result);
          try{
            if(self.prop.class.toUpperCase() == querrySelector.class.toUpperCase()){ // si class est égal
              // console.log(self.prop.class.toUpperCase(),querrySelector.class.toUpperCase());
              result.historique[self.getId()] = true;
              result.find.push(self) ;
            }
          }catch(err){}
        }
        else{ // sinons si les types ne sont pas égaux
          result.historique[self.getId()] = true;
          result.find.push(self) ;
        }
      }
    }
    // Variable de sortie de Promesse

    if(!self.childrens)self.childrens = new UI();
    var x = self.childrens.templates , xLength = x.length - 1 , xI = 0;
    //
    if(self.childrens.templates.length == 0){
      next(result)
    }
    else{
      for await(const htmlE of self.childrens.templates){
        // console.log(htmlE.type.toUpperCase(),querry);
        Promise.resolve(
          await htmlE.find_from_querry(querry,result)
        ).then(async function(find_Result){
          // PEUT ETRE UNE ERREUR //
          if(find_Result && (typeof find_Result[0]!='undefined'))result.find.push(find_Result[0]);

          // PEUT ETRE UNE ERREUR //

          if(xLength == xI)next(result);
          xI++;
        })
      }
    }
  })
};

UIelement.prototype.getQuerrySelector = function (querry) {
  let q = {};
  let querry_Splited = querry.split(/[\s,#,.]+/);
  if(querry_Splited.length == 1){
    q.type = querry_Splited[0];
  }else{
    q.type = querry_Splited[0];
    if(querry_Splited.length == 3){
      q.id = querry_Splited[1];
      q.class = querry_Splited[2];
    }
    else if(querry_Splited.length == 2){
      if(querry.split('#').length==2){
        q.id = querry.split('#')[1]
      }
      if(querry.split('.').length==2){
        q.class = querry.split('.')[1]
      }
    }
  }
  return q;
};

/*
*@{name}UI
*@{type}class
*@{desc}UI est l'élément contenant , c'est à dire qu'il contient des UIelements. Il peut contenir ses templates , mais aussi son propre ui
        si ui n'est pas définis , il serra interpreté que ui serra le template, à l'inverse si on définis ui , on peut y inserrer les templates
*/
class UI{
  templates = {};
  constructor(value , root = null , parent = null){
    this.__proto__.ClassName = 'UI';
    if(root) this.__proto__.root = root;
    if(parent) this.__proto__.parent = parent;
    if(!parent) parent = this;
    this.ui = this.normalise(value , root , parent);
    Object.assign(this.templates, this.ui);
  }
}

UI.prototype.initialise = function (arg = null) {
  for(var e of Object.keys(this.templates)){
    this.templates[e].initialise(arg);
  }
}

UI.prototype.update = function (arg = null) {
  for(var e of Object.keys(this.templates)){
    this.templates[e].update(arg);
  }
}

/*
*@{name} normalise
*@{type} Array<UIelement>
*@{descriptif} Fonction de normalisation du nouveau template ou element. Rejet si n'est pas un tableau
*/
UI.prototype.normalise = function(value = [] , root = null , parent = null) {
  try{ // rejet si différent de type Array
    if(value.__proto__.ClassName == "UI")value = value.ui;
    if(!Array.isArray(value))throw {err:1,msg:"'value' n'est pas un tableau",value:value,isArray:Array.isArray(value),typeof:typeof value};
    let i = 0;
    for(var e of value){
      value[i] = new UIelement(e , root , parent);
      i++;
    }
    return value;
  }
  catch(err){
    console.error(err);
  }
}

/*
*@{name} each
*@{type}
*@{descriptif}
*/
UI.prototype.each = function (f) {
  var self = this;
  return new Promise(async function(next){
    try{
      var xLength = (self.templates).length - 1 , xI = 0;
      if(self.templates.length==0)throw 1;
      else
        for(const e of Object.keys(self.templates)){
          if(typeof f != 'function')console.log(self.templates[e]);
          else f(self.templates[e]);
          if(xI==xLength)next();
          xI++;
        };
    }catch(err){
      switch (err) {
        case 1:
          console.log("Resultat.value est vide");
          break;
        default:
          console.log(err);
          break;
      }
    }
  })
};

/*
*@{name} buildIn
*@{type}
*@{descriptif} Fonction récursive qui génère en DOM sur base d'une roadmap OBJECT des éléments HTML dans un parent
*/
UI.prototype.buildIn = function(parent , template = null) {
  // console.log(typeof toGenerate);
  var self = this;
  var toGenerate;
  if(!template) toGenerate = self.ui;
  else toGenerate = template.templates;

  return new Promise(async function(done){
    var i = 0 , length = toGenerate.length-1;
    for await(const elem of toGenerate){
      new Promise(async function(generate){
        if (!elem.prop) { elem.prop = {} }
        var child = document.createElement(elem.type);
        for await (var propName of Object.keys(elem.prop)) {
          if (propName != 'text') {
            child.setAttribute(propName, elem.prop[propName]);
          }else{
            child.innerHTML=elem.prop[propName]
          }
        }
        // child.__proto__._id = elem.id;
        self._it(child,elem);
        if(self.root)self.root.updateTargetElement(child)
        parent.appendChild(child);
        // parent.appendChild(child);
        // console.log(elem);
        try{
          if(elem.childrens && elem.childrens.ui.length > 0){
            try{
              generate(await elem.childrens.buildIn(child))
            }catch(err){
            }
          }else{generate(child)}
        }
        catch(err){
          // console.error(err);
          generate(child);
        }
      })
      .then(function(value){
        if(i==length){
          done(parent);
        }else{i++;}
      })
    }
  })
}

/*
*@{name} _It ( "prototypeIt" )
*@{type}
*@{descriptif} Fonction qui génère les prototypes d'un élément HTML sur base de son type et de la RoadMap
*/
UI.prototype._it = function(elementHTML , elementRef) {
  elementHTML.th = new THORUS( elementHTML , elementRef , this)
}

UI.prototype.addTemplate = function (name = null , uielement = null) {
  try{ // rejet si aucun nom ou uielement définis
    if(!name) throw {err:1,msg:"name n'est pas renseignée",name:name};
    if(!uielement)throw {err:2,msg:"uielement n'est pas renseignée",uielement:uielement};
    if(!this.templates)this.templates = {};
    if(this.templates[name])throw {err:3,msg:"ce nom de template pour ce parent existe déjà , doublon impossible veuillez utiliser 'updateTemplate()' à la place",uielement:uielement,template:templates[name]};
    this.templates[name] = uielement;
  }catch(err){
    console.error(err);
  }
}

/*
*@{name} setUI
*@{type} VOID
*@{descriptif} Fonciton qui permet de déffinir GUI.UI
*/
UI.prototype.setUI = function (f) {
  f(this);
}

UI.prototype.getUI = function () {
  return this.ui[0];
};

/*
*@{name}ID_UIelements
*@{type}class
*@{desc}ID_UIelements est la class de référencement de tout les UIelement générer par l'interface , elle possède ses fonction d'ajout ,
        de recherche et de suppression. Les référence contienne les accès à l'élément de roadMap ainsi que le DOMelement
*/
class ID_UIelements{

  constructor(){}

  #UID = { }

  get UID(){return this.#UID}


  setNewElementId(element) {
    var self = this;
    var newId = Math.round(Math.random()*100000000);
    if(!self.#UID[newId]){
      self.#UID[newId] = { element : element , target : null};
      self.#UID.__proto__.length = Object.keys(self.#UID).length;
      return newId;
    }
    else return self.setNewElementId(element);
  };

  updateTargetElement(target){
    try{
      var self = this;
      return Promise.resolve(self.#UID[target.th.id].target = target)
    }catch(err){

    }
  }

  findById(id) {
    return this.#UID[id];
  };

  findElementById(id) {
    return this.#UID[id].target;
  };

  findReferenceById(id) {
    return this.#UID[id].element;
  };

  deleteOne(id = null) {
    try{
      if(!this.#UID[id])throw {err:1 , msg :`id ne peut pas être null` , id : id};
      this.#UID[id].target.remove();
      delete this.#UID[id];
    }catch(err){
      console.log(err);
    }
  }

  destroy() {
    this.#UID = {};
  }

}

/*
*@{name}GUI
*@{type}class
*@{desc}GUI est le root de l'interface, c'est un UI mais avec des méthodes qui mettent en relation les différentes méthodes
        présente dans ses propriétés. Il ne peut y avoir qu'un GUI par page. thoriumJS vas dans ce sens du moins.
*/
class GUI{

  constructor(ui = null , root = null){
    this.__proto__.ClassName = 'GUI';
    if(ui)this.ui = new UI(ui,this);
    if(root)this.root = root;
  }

  uids = new ID_UIelements();

}

GUI.prototype.initialise = function (arg = null) {
  for(var e of this.templates){
    e.initialise(arg);
  }
}

GUI.prototype.update = function (arg = null) {
  for(var e of this.templates){
    e.update(arg);
  }
}

/*
*@{name} buildIn
*@{type} REFERENCE
*@{descriptif} Fonction de référence qui appel GUI.UI.buildIn()
*/
GUI.prototype.buildIn = function (target , template = null) {
  return Promise.resolve(this.ui.buildIn(target , template));
}

/*
*@{name} setNewId
*@{type} REFERENCE
*@{descriptif} fonction de référence qui appel GUI.uids.setNewId()
*/
GUI.prototype.setNewId = function (e) {
  return this.uids.setNewElementId(e)
};

/*
*@{name} updateTargetElement
*@{type} REFERENCE
*@{descriptif} fonction de référence qui appel GUI.uids.updateTargetElement()
*/
GUI.prototype.updateTargetElement = function(target){
  this.uids.updateTargetElement(target);
}

/*
*@{name} findElementById
*@{type} REFERENCE
*@{descriptif} fonction de référence qui appel GUI.uids.findById() afin de retourner l'élément HTML , la référence ou les deux par ID
*/
GUI.prototype.findElementById = function (id = null , arg = null) {
  try{

    if(!id)throw { err: 1 , msg: 'id ne peut pas être null' , id: id }
    if(arg && arg != 'element' && arg != 'reference')throw { err: 1 , msg: 'si arg renseigné, il doit être un string égal à "element" ou "reference"' , arg: arg }

    if(arg == 'element') return this.uids.findElementById(id);
    else if(arg == 'reference') return this.uids.findReferenceById(id);
    else return this.uids.findById(id);
  }catch(err){
    console.error(err);
  }
};

// /*
// *@{name}
// *@{type} REFERENCE
// *@{descriptif}
// */
// GUI.prototype.deleteElemen = function (id = null , arg = null) {
//   try{
//
//     if(!id)throw { err: 1 , msg: 'id ne peut pas être null' , id: id }
//     if(arg && arg != 'element' && arg != 'reference')throw { err: 1 , msg: 'si arg renseigné, il doit être un string égal à "element" ou "reference"' , arg: arg }
//
//     if(arg == 'element') return this.uids.findElementById(id);
//     else if(arg == 'reference') return this.uids.findReferenceById(id);
//     else return this.uids.findById(id);
//   }catch(err){
//     console.error(err);
//   }
// };

/*
*@{name} setUI
*@{type} VOID
*@{descriptif} Fonciton qui permet de déffinir GUI.UI
*/
GUI.prototype.setUI = function (f) {
  this.uids.destroy();
  f(this)
}

/*
*@{name} addTemplate
*@{type} VOID
*@{descriptif} Fonction d'ajout d'un templatte à GUI
*/
GUI.prototype.addTemplate = function (name = null , uielement = null) {
  try{ // rejet si aucun nom ou uielement définis
    if(!name) throw {err:1,msg:"name n'est pas renseignée",name:name};
    if(!uielement)throw {err:2,msg:"uielement n'est pas renseignée",uielement:uielement};
    if(!this.templates)this.templates = {};
    if(this.templates[name])throw {err:3,msg:"ce nom de template pour ce parent existe déjà , doublon impossible veuillez utiliser 'updateTemplate()' à la place",uielement:uielement,template:templates[name]};
    this.templates[name] = uielement;
  }catch(err){
    console.error(err);
  }
}

/*
*@{name}
*@{type}
*@{descriptif}
*/
class THORIUM_ENGINE{

  gui = null;
  db = new DATASTORAGE();
  conf = {
    app : null,
    parent : document.body
  };
  buffer = {};
  screen = null;
  controls = null;
  stats = null;
  filters = null;
  caches = null;
  math = new ThoriumMath();
  entities = null;
  console = null;
  componentsList = {};

  get app(){return this.conf.app}
  get body(){return this.conf.parent}

  constructor(){

    console.log("%c ThoriumJS - Odyssee ", "border: 1px solid red;color: red;");
    console.log("%c site : https://thoriumcdn.herokuapp.com/ ", "color: orange;");
    console.log("%c git : https://github.com/MortallicaXxX/ThoriumJS ", "color: orange;");
    // console.log("%cOdyssee", "border: 1px solid red;color: red;");

    var self = this;
    window.thorium = self;
    window.addTemplate = function(name,template){
      return self.addTemplate(name,template)
    },
    window.setUI = function(f){
      return self.setUI(f)
    },
    window.onload = async function(){

      function ready(){
        self.conf = {
          id : 'app-thorium',
          app : null,
          parent : document.body
        }

        self.gui = new GUI([{
          type:"div",
          prop:{
            id:"app-thorium"
          },
          childrens:[
            {
              type:'div',
              prop:{
                id:'background-container'
              },
              childrens:[
                {
                  type:'div',
                  prop:{id:'bckg1',text:th_caches.svg.th_bg1},
                  proto : {
                    updateBackgroundPosition : function(){
                    }
                  }
                },
                {
                  type:'div',
                  prop:{id:'bckg2',text:th_caches.svg.th_bg2},
                  proto : {
                    updateBackgroundPosition : function(){
                      var centre = {
                        x : thorium.screen.width/2,
                        y : thorium.screen.height/2
                      }

                      let x = Math.abs(centre.x - thorium.controls.mouse.x);
                      let y = Math.abs(centre.y - thorium.controls.mouse.y);

                      if(thorium.controls.mouse.x <= centre.x)x = -x;
                      if(thorium.controls.mouse.y <= centre.y)y = -y;

                      let coef = {
                        x : 50,
                        y : 20
                      }

                      this.e.style.transform = "translate("+-((x/thorium.screen.width)*100)/coef.x+"%, "+-((y/thorium.screen.height)*100)/coef.y+"%)";
                    }
                  }
                },
                {
                  type:'div',
                  prop:{id:'bckg3',text:th_caches.svg.th_bg3},
                  proto : {
                    updateBackgroundPosition : function(){
                      var centre = {
                        x : thorium.screen.width/2,
                        y : thorium.screen.height/2
                      }

                      let x = Math.abs(centre.x - thorium.controls.mouse.x);
                      let y = Math.abs(centre.y - thorium.controls.mouse.y);

                      if(thorium.controls.mouse.x <= centre.x)x = -x;
                      if(thorium.controls.mouse.y <= centre.y)y = -y;

                      let coef = {
                        x : 10,
                        y : 200
                      }

                      this.e.style.transform = "translate("+((x/thorium.screen.width)*100)/coef.x+"%, "+((y/thorium.screen.height)*100)/coef.y+"%)";
                    }
                  }
                },
                {
                  type:'div',
                  prop:{id:'bckg4',text:th_caches.svg.th_bg4},
                  proto : {
                    updateBackgroundPosition : function(){
                      var centre = {
                        x : thorium.screen.width/2,
                        y : thorium.screen.height/2
                      }

                      let x = Math.abs(centre.x - thorium.controls.mouse.x);
                      let y = Math.abs(centre.y - thorium.controls.mouse.y);

                      if(thorium.controls.mouse.x <= centre.x)x = -x;
                      if(thorium.controls.mouse.y <= centre.y)y = -y;

                      let coef = {
                        x : 50,
                        y : 200
                      }

                      this.e.style.transform = "translate("+ ((((x/thorium.screen.width)*100)/coef.x)-25) +"%, "+ ((((y/thorium.screen.height)*100)/coef.y)-39) +"%)";
                    }
                  }
                }
              ],
              proto : {
                updateBackground : self.controls.addEventListener('mousemove',function(e){
                  document.getElementById('background-container').updateMyBackground();
                },this),
                updateMyBackground : function(cursorInfo){
                  for(var e of this.e.children){
                    e.updateBackgroundPosition();
                  }
                }
              }
            },
            {
              type:'div',
              prop:{
                id:'app-container'
              },
              childrens:[
                {
                  type:"div",
                  prop:{
                    id:"thorium-title"
                  },
                  childrens:[
                    {
                      type:"p",
                      prop:{
                        text:"Thorium<span>JS</span>"
                      }
                    },
                    {
                      type:"div",
                      prop:{
                        id:"thorium-logo",
                        text:th_caches.svg.thoriumColor
                      }
                    }
                  ],
                  proto : {
                    onClick : function(){
                      window.open("https://thoriumcdn.herokuapp.com/");
                    }
                  }
                },
                {
                  type:"div",
                  prop:{
                    id:"thorium-description"
                  },
                  childrens:[
                    {
                      type:"div",
                      prop:{
                        class:"descirption"
                      },
                      childrens:[
                        {
                          type:'p',
                          prop:{
                            text:"ThoriumJS est un framework JS natif 'client side' qui ajoute à un projet HTML l'environnement 'thorium engine'."
                          }
                        },
                        {
                          type:'p',
                          prop:{
                            text:"L'engine permet d'utiliser directement des outils, fonctions et utilitaires. En savoir plus ? La documentation est sur le git."
                          }
                        },
                        {
                          type:'p',
                          prop:{
                            text:"Première utilisation de thorium ? N'ayez pas peur c'est simple et intuitif , ça va bien se passer. &#128540;"
                          }
                        }
                      ]
                    },
                    {
                      type:"div",
                      prop:{
                        id:"btn-github",
                      },
                      proto:{
                        onclick:function(){
                          window.open("https://github.com/MortallicaXxX/ThoriumJS");
                        }
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }],self);

        addCss("style-app-thorium",[
          "#app-thorium {",
            "display: grid;",
            "font-family: Inconsolata, Monaco, Consolas, 'Courier New', Courier;",
            "min-height: var(--thorium-default-height);",
            "min-width: var(--thorium-default-width);",
            "position: absolute;",
            "top: 0;",
            "left: 0;",
            "user-select: none;",
            "--default-theme-color:lightseagreen;",
            "font-size:1vw;",
          "}",

          "#background-container {",
            "position: fixed;",
            "height: 100%;",
            "width: 100%;",
            "top: 0;",
            "left: 0;",
            "z-index: 0;",
            "display: grid;",
          "}",

          "#background-container div {",
            "grid-column: 1;",
            "grid-row: 1;",
          "}",

          "#bckg1 {",
            "z-index: 1;",
          "}",

          "#bckg1 svg {",
            // "height: var( --thorium-default-height);", // ce serra pour display portrait
            "width: var(--thorium-default-width);",
          "}",

          "#bckg2 {",
            "z-index: 2;",
          "}",

          "#bckg2 svg {",
            // "height: var( --thorium-default-height);", // ce serra pour display portrait
            "width: var(--thorium-default-width);",
          "}",

          "#bckg3 {",
            "z-index: 3;",
          "}",

          "#bckg3 svg {",
            // "height: var( --thorium-default-height);", // ce serra pour display portrait
            "width: var(--thorium-default-width);",
          "}",

          "#bckg4 {",
            "z-index: 4;",
            "height: 200%;",
            "width: 200%;",
          "}",

          "#bckg4 svg {",
            "height: 100%;",
            "width: 100%;",
          "}",

          "#app-container {",
            "display: grid;",
            "z-index:1;",
            "grid-template-rows: min-content 1fr;",
          "}",

          "#thorium-title {",
            "height: fit-content;",
            "width: fit-content;",
            "margin: auto;",
            "font-size: 4vw;",
            "font-weight: bold;",
            "display: grid;",
            "grid-template-columns: min-content max-content;",
            "color:white;",
            "border: 5px solid white;",
            "margin-top: 1vw;",
          "}",

          "#thorium-title:hover {",
            "background:white;",
            "color:black;",
            "border: 5px solid transparent;",
          "}",

          "#thorium-title:hover span{",
            "color:white;",
            "color:var(--default-theme-color);",
          "}",

          "#thorium-title p {",
            "margin: 0 1vw;",
            "grid-column: 2;",
            "grid-row: 1;",
          "}",

          "#thorium-logo {",
            "margin: auto;",
            "display: grid;",
            "grid-column: 1;",
            "grid-row: 1;",
            "height: 100%;",
            "width: 4vw;",
            "border-right: 5px solid white;",
          "}",

          "#thorium-title:hover #thorium-logo{",
            "background:var(--default-theme-color);",
          "}",

          "#thorium-logo svg {",
            "margin: auto;",
            "width: 90%;",
          "}",

          "#thorium-description {",
            "width: 80%;",
            "min-height: 10vw;",
            "margin: auto;",
            "background-color: rgba(32,178,170,0.95);",
            "margin-bottom:1vw;",
            "display: grid;",
            "grid-template-rows: 1fr 3vw;",
            "text-align: center;",
            "font-weight: bold;",
            "color: darkslategray;",
          "}",

          "#thorium-description p{",
            "padding-left:1vw;",
            "padding-right:1vw;",
          "}",

          "#btn-github {",
            "background-image:url(https://phoenixweb.com.au/wp-content/uploads/2016/11/GitHub-wide-logo-1024x219.png);",
            "background-repeat: no-repeat;",
            "background-position: center;",
            "background-size: 80%;",
            "height: 2vw;",
            "width: 10vw;",
            "border-radius: 0.5vw;",
            "background-color: lightgray;",
            "filter: drop-shadow(2px 2px 1px gray);",
            "margin: auto;",
          "}",

          "#btn-github:hover {",
            "background-color: ghostwhite;",
            "filter: drop-shadow(2px 2px 1px gray);",
          "}",
        ])

        self.gui.buildIn(document.body)
        .then(function(){
          self.initialise();
        })
      }

      if(self.onReady){
        delete thorium.caches.data;
        return self.onReady(self);
      }
      else ready();

    }
    window.update = function( arg = null ){
      return self.update(arg)
    }
    window.cssStyle = function(element = null , arg = null){
      return self.cssStyle(element,arg);
    }
    window.cssToValue = function(cssValue = null){
      return self.cssToValue(cssValue);
    }
    window.addCss = function(linkID = null , cssDef = null) {
      return self.addCss(linkID,cssDef);
    }
    window.get = async function(url = null){
      return self.get(url);
    }
    window.post = async function(url = null ,arg = null){
      return self.post(url,arg);
    }

    self.caches = new ThoriumCaches(self);
    window.th_caches = self.caches.data;
    self.screen = new ScreenStat();
    self.controls = new Controls(self);
    self.stats = new STATS(self);
    self.filters = new FILTRES(self);
    self.entities = new ThoriumEntitites(self);
    self.caches = new ThoriumCaches(self);
    self.console = new ThoriumConsole();
    self.platform = new PLATFORM(self);

  }

  get cachesData(){
    try{
      return this.caches.data;
    }catch(err){
      console.error(err);
    }
  }

}

THORIUM_ENGINE.prototype.initialise = async function (arg = null){
  // if(this.thorus){
  //   this.conf = {
  //     id:'UItools',
  //     parent:document.body,
  //   }
  //   thorium.onReady = this.thorus.initialise();
  // }

  // this.conf.sw = {
  //   listeners : {
  //     load : {
  //       register : 'service-worker.js',
  //       onSucces : function(r){
  //         console.log();
  //         console.log(`ServiceWorker registration successful with scope: ${r.scope}`);
  //       },
  //       onError : function(e){
  //         console.log(`ServiceWorker registration failed: ${error}`);
  //       }
  //     }
  //   }
  // }

  this.conf = (function(conf){
    if(!conf.id){
      console.error({msg:`Il semblerait que thorium.conf.id n'aie pas été déclarer. Id par défaut = 'app'`});
      conf.id = 'app';
    }
    if(!conf.parent){
      console.error({msg:`Il semblerait que thorium.conf.parent n'aie pas été déclarer. Parent par défaut = 'document.body'`});
      conf.parent = document.body;
    }
    if(!conf.stats){
      console.error({msg:`Il semblerait que thorium.conf.stats n'aie pas été déclarer. Défaut = 'true'`});
      conf.stats = true;
    }
    if(!conf.filters){
      console.error({msg:`Il semblerait que thorium.conf.filters n'aie pas été déclarer. Défaut = 'true'`});
      conf.filters = true;
    }
    if(!conf.app)conf.app = document.getElementById(conf.id);

    if(conf.sw){
      if(typeof conf.sw != 'object' || Array.isArray(conf.sw))console.error();
      else conf.sw = (function(sw){

        function serviceWorker(sw){
          Object.assign(this, sw);
          this.worker = null;
          this.__proto__.initialise = async function(self){

            if ('serviceWorker' in navigator) {
              if(!self.listeners.load) return console.error({msg:`serviceWorker.listeners.load ne semble pas déclarer`});
              else {

                navigator.serviceWorker.register(self.listeners.load.register)
                .then(
                  function(r,e){
                    if(r){
                      self.worker = r;
                      self.listeners.load.onSucces(r);
                    }
                    if(e)self.listeners.load.onError(e);
                  }
                );

              }
            }
          }
          this.initialise(this);
        }

        return new serviceWorker(sw);

      })(conf.sw);
    }
    return conf;
  })(this.conf);

  // if(this.conf.stats = true)self.stats = new STATS(this);
  // if(this.conf.filters = true)self.filters = new FILTRES(this);

  this.conf.app.initialise();
  this.entities.initialise();
}

THORIUM_ENGINE.prototype.update = function (arg = null){
  if(!this.conf.app)this.conf.app = document.getElementById(this.conf.id);
  this.conf.app.update();
}

THORIUM_ENGINE.prototype.resize = function (arg = null){
  if(!this.conf.app)this.conf.app = document.getElementById(this.conf.id);
  this.conf.app.resize();
}

THORIUM_ENGINE.prototype.addTemplate = function (name,template) {
  if(this.gui)return this.gui.addTemplate(name,template)
};

THORIUM_ENGINE.prototype.setUI = function (f) {
  if(this.gui)return this.gui.setUI(f)
};

THORIUM_ENGINE.prototype.frameUpdate = function () {

  try{
    this.onFrameUpdate(this);
  }catch(err){

  }

  this.entities.update();

};

THORIUM_ENGINE.prototype.vec2 = function(coord = null,y = null){
  try{
    return new this.math.vec2(coord,y);
  }catch(err){

  }
}

THORIUM_ENGINE.prototype.lerp = function(a = null,b = null,alpha = 0){
  try{
    return this.math.lerp(a,b,alpha);
  }catch(err){
    console.log(err);
  }
}

THORIUM_ENGINE.prototype.cssStyle = function (element = null , propName = null) {
  try{
    if(!element)throw {err:1,msg:"element ne peut pas être null , pour changer une propriété css veuillez renseigné l'élément cible" , element:element}
    if(!propName)throw {err:2,msg:"arg ne peut pas être null , veuillez indiquer une propriété css pour recevoir la valeur" , propName:propName}
    const styles = window.getComputedStyle(element);
    return styles[propName];
  }
  catch(err){
    console.error(err);
  }
}

THORIUM_ENGINE.prototype.cssToValue = function (cssValue = null) {
  try{
    if(!cssValue)throw {err:1,msg:"cssValue ne peut être null",cssValue:cssValue};
    // console.log(cssValue);
    cssValue = cssValue.split('p'); // "px"
    if(cssValue.length == 1)cssValue = cssValue.split('v'); // "vw"
    if(cssValue.length == 1)cssValue = cssValue.split('c'); // "ch"
    if(cssValue.length == 1)cssValue = cssValue.split('%'); // "%"
    if(cssValue.length == 1)throw {err:2,msg:"cssValue ne correspond à aucun format connus",cssValue:cssValue};
    return Number(cssValue[0]);
  }
  catch(err){
    // console.error(err);
    return false;
  }
}

THORIUM_ENGINE.prototype.addCss = function (linkID = null , cssDef = null) {
  try{
    if(!linkID){console.error({warningMessage:"Attention aucun id n'est scpécifier pour cette feuille de css"});}
    if(!cssDef)throw {err:1,msg:"cssDef est null , aucune feuille de style ne peut être ajouter.",cssDef:cssDef};
    if(!Array.isArray(cssDef))throw {err:2,msg:"cssDef doit être un array.",cssDef:cssDef};
    var styleSheet = document.createElement("style")
    if(linkID)styleSheet.setAttribute('id',linkID);
    styleSheet.type = "text/css";
    styleSheet.innerText = cssDef.join(" ");
    document.head.appendChild(styleSheet);
  }
  catch(err){
    console.error(err);
  }
}

THORIUM_ENGINE.prototype.get = async function(url = null){
  return new Promise(async function(res){
    try{
      if(!url)throw {err:1,msg:"url ne peut pas être égal à null",url:url}
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.withCredentials = false;
      xhr.setRequestHeader("Content-type", "text/javascript");
      xhr.send();
      xhr.onload = function(e){res(e.target)}
    }catch(err){
      console.error(err);
      res(false);
    }
  })
}

THORIUM_ENGINE.prototype.post = async function (url = null,arg = null){
  return new Promise(async function(req){
    try{
      if(!url)throw {err:1,msg:"url ne peut pas être égal à null",url:url}
      if(!arg)throw {err:2,msg:"arg ne peut pas être égal à null",arg:arg}
      var xhr = new XMLHttpRequest();
      xhr.open('POST', url, true);
      xhr.withCredentials = false;
      xhr.setRequestHeader("Content-type", "application/json");
      xhr.send(JSON.stringify(arg));
      xhr.onload = function(e){req(e.target)}
    }catch(err){
      console.error(err);
      req(false);
    }
  })
}

THORIUM_ENGINE.prototype.components = function(e,root,parent){
  // var self = thorium;
  // var componentClassName = new.target.name;
  // // console.log(thorium.componentsList[componentClassName]);
  // try{
  //   if(self.componentsList[componentClassName])throw {err:1,msg:"Vous esseillez d'ajouter un component déjà existant."}
  //   self.componentsList[componentClassName] = function(e,root,parent){return new UIelement(e,root,parent)};
  //   return self.componentsList[componentClassName](e,root,parent);
  // }catch(err){
  //   return self.componentsList[componentClassName](e,root,parent);
  // }

  return new UIelement(e,root,parent)

}

THORIUM_ENGINE.prototype.entity = function(name){
  return thorium.entities.entity(name);
  // return new Entity(name);
}

THORIUM_ENGINE.prototype.addEntity = function(entity){
  this.entities.addEntity(entity)
}

THORIUM_ENGINE.prototype.animation = function(entity,time,arg,option){

  return entity.addAnimation(time,arg,option);
  // return
  // this.entities.addEntity(entity)
}

THORIUM_ENGINE.prototype.GUI = function(template){
  this.gui = new GUI(template,this);
  return this.gui;
}

THORIUM_ENGINE.prototype.log = function(message=null,style=null){
  return this.console.log(message,style);
}

new THORIUM_ENGINE();

class ThoriumDialog {

  constructor(){
    if(thorium){
      thorium.dialog = this;
      this.root = thorium;
      this.initialise();
    }
  }

}

ThoriumDialog.prototype.new = function (title,arg) {
  return new WinBox(title,arg);
};

ThoriumDialog.prototype.initialise = function () {
  /**
   * WinBox.js v0.1.81 (Bundle)
   * Copyright 2021 Nextapps GmbH
   * Author: Thomas Wilkerling
   * Licence: Apache-2.0
   * https://github.com/nextapps-de/winbox
   */
   (function() {
     'use strict';
     var e, h = document.createElement("style");
     h.innerHTML = "@keyframes fade-in{0%{opacity:0}to{opacity:.85}}.winbox.modal:after,.winbox.modal:before{content:''}.winbox{position:fixed;left:0;top:0;background:#0050ff;box-shadow:0 14px 28px rgba(0,0,0,.25),0 10px 10px rgba(0,0,0,.22);transition:width .3s,height .3s,transform .3s;transition-timing-function:cubic-bezier(.3,1,.3,1);will-change:transform,width,height;contain:layout size;text-align:left;touch-action:none}.max,.no-shadow{box-shadow:none}.wb-header,.winbox iframe{position:absolute;width:100%}.wb-header{left:0;top:0;height:35px;color:#fff;overflow:hidden}.wb-body,.wb-n,.wb-s{position:absolute;left:0}.wb-n,.wb-s{height:10px}.wb-body{right:0;top:35px;bottom:0;overflow:auto;-webkit-overflow-scrolling:touch;overflow-scrolling:touch;will-change:contents;background:#fff;margin-top:0!important;contain:strict}.wb-title{font-family:Arial,sans-serif;font-size:14px;padding-left:10px;cursor:move;line-height:35px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.wb-n{top:-5px;right:0;cursor:n-resize}.wb-e{position:absolute;top:0;right:-5px;bottom:0;width:10px;cursor:w-resize}.wb-s,.wb-se,.wb-sw{bottom:-5px}.wb-s{right:0;cursor:n-resize}.wb-w,.winbox.modal:before{position:absolute;top:0;bottom:0}.wb-w{left:-5px;width:10px;cursor:w-resize}.wb-ne,.wb-nw,.wb-sw{width:15px;height:15px;position:absolute}.wb-nw{top:-5px;left:-5px;cursor:nw-resize}.wb-ne,.wb-sw{cursor:ne-resize}.wb-ne{top:-5px;right:-5px}.wb-sw{left:-5px}.wb-se{position:absolute;right:-5px;width:15px;height:15px;cursor:nw-resize}.wb-icon{float:right;height:35px;max-width:100%;text-align:center}.wb-icon *{display:inline-block;width:30px;height:100%;background-position:center;background-repeat:no-repeat;cursor:pointer;max-width:100%}.no-close .wb-close,.no-full .wb-full,.no-header .wb-header,.no-max .wb-max,.no-min .wb-min,.no-resize .wb-body~div,.winbox.min .wb-body>*,.winbox.min .wb-full,.winbox.min .wb-min,.winbox.modal .wb-full,.winbox.modal .wb-max,.winbox.modal .wb-min{display:none}.wb-min{background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAyIj48cGF0aCBmaWxsPSIjZmZmIiBkPSJNOCAwaDdhMSAxIDAgMCAxIDAgMkgxYTEgMSAwIDAgMSAwLTJoN3oiLz48L3N2Zz4=);background-size:14px auto;background-position:center bottom 11px}.wb-max{background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9IiNmZmYiIHZpZXdCb3g9IjAgMCA5NiA5NiI+PHBhdGggZD0iTTIwIDcxLjMxMUMxNS4zNCA2OS42NyAxMiA2NS4yMyAxMiA2MFYyMGMwLTYuNjMgNS4zNy0xMiAxMi0xMmg0MGM1LjIzIDAgOS42NyAzLjM0IDExLjMxMSA4SDI0Yy0yLjIxIDAtNCAxLjc5LTQgNHY1MS4zMTF6Ii8+PHBhdGggZD0iTTkyIDc2VjM2YzAtNi42My01LjM3LTEyLTEyLTEySDQwYy02LjYzIDAtMTIgNS4zNy0xMiAxMnY0MGMwIDYuNjMgNS4zNyAxMiAxMiAxMmg0MGM2LjYzIDAgMTItNS4zNyAxMi0xMnptLTUyIDRjLTIuMjEgMC00LTEuNzktNC00VjM2YzAtMi4yMSAxLjc5LTQgNC00aDQwYzIuMjEgMCA0IDEuNzkgNCA0djQwYzAgMi4yMS0xLjc5IDQtNCA0SDQweiIvPjwvc3ZnPg==);background-size:17px auto}.wb-close{background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii0xIC0xIDE4IDE4Ij48cGF0aCBmaWxsPSIjZmZmIiBkPSJtMS42MTMuMjEuMDk0LjA4M0w4IDYuNTg1IDE0LjI5My4yOTNsLjA5NC0uMDgzYTEgMSAwIDAgMSAxLjQwMyAxLjQwM2wtLjA4My4wOTRMOS40MTUgOGw2LjI5MiA2LjI5M2ExIDEgMCAwIDEtMS4zMiAxLjQ5N2wtLjA5NC0uMDgzTDggOS40MTVsLTYuMjkzIDYuMjkyLS4wOTQuMDgzQTEgMSAwIDAgMSAuMjEgMTQuMzg3bC4wODMtLjA5NEw2LjU4NSA4IC4yOTMgMS43MDdBMSAxIDAgMCAxIDEuNjEzLjIxeiIvPjwvc3ZnPg==);background-size:15px auto}.wb-full{background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2Utd2lkdGg9IjIuNSIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNOCAzSDVhMiAyIDAgMCAwLTIgMnYzbTE4IDBWNWEyIDIgMCAwIDAtMi0yaC0zbTAgMThoM2EyIDIgMCAwIDAgMi0ydi0zTTMgMTZ2M2EyIDIgMCAwIDAgMiAyaDMiLz48L3N2Zz4=);background-size:16px auto}.winbox.max .wb-body~div,.winbox.max .wb-title,.winbox.min .wb-body~div,.winbox.modal .wb-body~div,.winbox.modal .wb-title{pointer-events:none}.winbox.min .wb-title{cursor:default}.max .wb-body{margin:0!important}.winbox iframe{height:100%;border:0}.winbox.modal:before{left:0;right:0;background:inherit;border-radius:inherit}.winbox.modal:after{position:absolute;top:-100vh;left:-100vw;right:-100vw;bottom:-100vh;background:#0d1117;animation:fade-in .2s ease-out forwards;z-index:-1}.no-animation{transition:none}.no-header .wb-body{top:0}.no-move:not(.min) .wb-title{pointer-events:none}";
     var k = document.getElementsByTagName("head")[0];
     k.firstChild ? k.insertBefore(h, k.firstChild) : k.appendChild(h);
     var q = document.createElement("div");
     q.innerHTML = "<div class=wb-header><div class=wb-icon><span class=wb-min></span><span class=wb-max></span><span class=wb-full></span><span class=wb-close></span></div><div class=wb-title> </div></div><div class=wb-body></div><div class=wb-n></div><div class=wb-s></div><div class=wb-w></div><div class=wb-e></div><div class=wb-nw></div><div class=wb-ne></div><div class=wb-se></div><div class=wb-sw></div>";

     function r(a, b, c, g) {
         a.addEventListener(b, c, g || !1 === g ? g : !0)
     }

     function t(a) {
         a.stopPropagation();
         a.cancelable && a.preventDefault()
     }

     function w(a, b, c) {
         c = "" + c;
         a["_s_" + b] !== c && (a.style.setProperty(b, c), a["_s_" + b] = c)
     };
     var x = document.documentElement,
         y = [],
         A = 0,
         B, C, F, G, exitFullscreen, L, M;

     function O(a, b) {
         if (!(this instanceof O)) return new O(a);
         B || Q();
         this.g = q.cloneNode(!0);
         this.body = this.g.getElementsByClassName("wb-body")[0];
         var c, g;
         if (a) {
             if (b) {
                 var f = a;
                 a = b
             }
             if ("string" === typeof a) f = a;
             else {
                 if (g = a.modal) var u = c = "center";
                 var z = a.id;
                 var H = a.root;
                 f = f || a.title;
                 var D = a.mount;
                 var d = a.html;
                 var I = a.url;
                 var l = a.width;
                 var m = a.height;
                 u = a.x || u;
                 c = a.y || c;
                 var E = a.max;
                 var n = a.top;
                 var p = a.left;
                 var v = a.bottom;
                 var J = a.right;
                 B = a.index || B;
                 var W = a.onclose;
                 var X = a.onfocus;
                 var Y = a.onblur;
                 var Z = a.onmove;
                 var aa =
                     a.onresize;
                 b = a.background;
                 var P = a.border;
                 var N = a["class"];
                 b && this.setBackground(b);
                 P && w(this.body, "margin", P + (isNaN(P) ? "" : "px"))
             }
         }
         this.setTitle(f || "");
         a = L;
         f = M;
         n = n ? R(n, f) : 0;
         v = v ? R(v, f) : 0;
         p = p ? R(p, a) : 0;
         J = J ? R(J, a) : 0;
         a -= p + J;
         f -= n + v;
         l = l ? R(l, a) : a / 2 | 0;
         m = m ? R(m, f) : f / 2 | 0;
         u = u ? R(u, a, l) : p;
         c = c ? R(c, f, m) : n;
         B = B || 10;
         this.g.id = this.id = z || "winbox-" + ++A;
         this.g.className = "winbox" + (N ? " " + ("string" === typeof N ? N : N.join(" ")) : "") + (g ? " modal" : "");
         this.x = u;
         this.y = c;
         this.width = l;
         this.height = m;
         this.top = n;
         this.right = J;
         this.bottom =
             v;
         this.left = p;
         this.max = this.min = !1;
         this.j = W;
         this.l = X;
         this.i = Y;
         this.o = Z;
         this.m = aa;
         E ? this.maximize() : this.move().resize();
         this.focus();
         D ? this.mount(D) : d ? this.body.innerHTML = d : I && this.setUrl(I);
         ba(this);
         (H || document.body).appendChild(this.g)
     }
     O["new"] = function(a) {
         return new O(a)
     };

     function R(a, b, c) {
         "string" === typeof a && ("center" === a ? a = (b - c) / 2 | 0 : "right" === a || "bottom" === a ? a = b - c : (c = parseFloat(a), a = "%" === ("" + c !== a && a.substring(("" + c).length)) ? b / 100 * c | 0 : c));
         return a
     }

     function Q() {
         var a = document.body;
         a[G = "requestFullscreen"] || a[G = "msRequestFullscreen"] || a[G = "webkitRequestFullscreen"] || a[G = "mozRequestFullscreen"] || (G = "");
         exitFullscreen = G && G.replace("request", "exit").replace("mozRequest", "mozCancel").replace("Request", "Exit");
         r(window, "resize", function() {
             L = x.clientWidth;
             M = x.clientHeight;
             S()
         });
         L = x.clientWidth;
         M = x.clientHeight
     }

     function ba(a) {
         T(a, "title");
         T(a, "n");
         T(a, "s");
         T(a, "w");
         T(a, "e");
         T(a, "nw");
         T(a, "ne");
         T(a, "se");
         T(a, "sw");
         r(a.g.getElementsByClassName("wb-min")[0], "click", function(b) {
             t(b);
             a.minimize()
         });
         r(a.g.getElementsByClassName("wb-max")[0], "click", function(b) {
             t(b);
             a.focus().maximize()
         });
         G ? r(a.g.getElementsByClassName("wb-full")[0], "click", function(b) {
             t(b);
             a.focus().fullscreen()
         }) : a.addClass("no-full");
         r(a.g.getElementsByClassName("wb-close")[0], "click", function(b) {
             t(b);
             a.close() || (a = null)
         });
         r(a.g, "click", function() {
                 a.focus()
             },
             !1)
     }

     /*
     * ? se lance entre deux états ?
     */
     function U(a) {
       console.log(a,y);
         y.splice(y.indexOf(a), 1);
         S();
         a.removeClass("min");
         a.min = !1;
         a.g.title = ""
     }

     function S() {
         for (var a = y.length, b = 0, c, g; b < a; b++) c = y[b], g = Math.min((L - 2 * c.left) / a, 250), c.resize(g + 1 | 0, 35, !0).move(c.left + b * g | 0, M - c.bottom - 35, !0)
     }

     function T(a, b) {
         function c(d) {
             t(d);
             a.min ? (U(a), a.resize().move().focus()) : (w(a.g, "transition", "none"), (z = d.touches) && (z = z[0]) ? (d = z, r(window, "touchmove", g), r(window, "touchend", f)) : (r(window, "mousemove", g), r(window, "mouseup", f)), H = d.pageX, D = d.pageY, a.focus())
         }

         function g(d) {
             t(d);
             z && (d = d.touches[0]);
             var I = d.pageX;
             d = d.pageY;
             var l = I - H,
                 m = d - D,
                 E;
             if ("title" === b) {
                 a.x += l;
                 a.y += m;
                 var n = E = 1
             } else {
                 if ("e" === b || "se" === b || "ne" === b) {
                     a.width += l;
                     var p = 1
                 } else if ("w" === b || "sw" === b || "nw" === b) a.x += l, a.width -= l, n = p = 1;
                 if ("s" ===
                     b || "se" === b || "sw" === b) {
                     a.height += m;
                     var v = 1
                 } else if ("n" === b || "ne" === b || "nw" === b) a.y += m, a.height -= m, E = v = 1
             }
             if (p || v) p && (a.width = Math.max(Math.min(a.width, L - a.x - a.right), 150)), v && (a.height = Math.max(Math.min(a.height, M - a.y - a.bottom), 35)), a.resize();
             if (n || E) n && (a.x = Math.max(Math.min(a.x, L - a.width - a.right), a.left)), E && (a.y = Math.max(Math.min(a.y, M - a.height - a.bottom), a.top)), a.move();
             H = I;
             D = d
         }

         function f(d) {
             t(d);
             w(a.g, "transition", "");
             z ? (window.removeEventListener("touchmove", g, !0), window.removeEventListener("touchend",
                 f, !0)) : (window.removeEventListener("mousemove", g, !0), window.removeEventListener("mouseup", f, !0))
         }
         var u = a.g.getElementsByClassName("wb-" + b)[0],
             z, H, D;
         r(u, "mousedown", c);
         r(u, "touchstart", c, {
             passive: !1
         })
     }
     e = O.prototype;
     e.mount = function(a) {
         this.unmount();
         a.h || (a.h = a.parentNode);
         this.body.textContent = "";
         this.body.appendChild(a);
         return this
     };
     e.unmount = function(a) {
         var b = this.body.firstChild;
         if (b) {
             var c = a || b.h;
             c && c.appendChild(b);
             b.h = a
         }
         return this
     };
     e.setTitle = function(a) {
         a = this.title = a;
         this.g.getElementsByClassName("wb-title")[0].firstChild.nodeValue = a;
         return this
     };
     e.setBackground = function(a) {
         w(this.g, "background", a);
         return this
     };
     e.setUrl = function(a) {
         this.body.innerHTML = '<iframe src="' + a + '"></iframe>';
         return this
     };
     e.focus = function() {
         F !== this && (w(this.g, "z-index", B++), this.addClass("focus"), F && (F.removeClass("focus"), F.i && F.i()), F = this, this.l && this.l());
         return this
     };
     e.hide = function() {
       console.log("hide");
         return this.addClass("hide")
     };
     e.show = function() {
       console.log("show");
         return this.removeClass("hide")
     };
     e.minimize = function(a) {
         C && V();
         !a && this.min ? (U(this), this.resize().move()) : !1 === a || this.min || (y.push(this), S(), this.g.title = this.title, this.addClass("min"), this.min = !0);
         this.max && (this.removeClass("max"), this.max = !1);
         return this
     };
     e.maximize = function(a) {
         if ("undefined" === typeof a || a !== this.max) this.min && U(this), (this.max = !this.max) ? this.addClass("max").resize(L - this.left - this.right, M - this.top - this.bottom, !0).move(this.left, this.top, !0) : this.resize().move().removeClass("max");
         return this
     };
     e.fullscreen = function(a) {
         if ("undefined" === typeof a || a !== C) this.min && (this.resize().move(), U(this)), C && V() || (this.body[G](), C = !0);
         return this
     };

     function V() {
       /* C => est il en mode full screen ? */
         C = !1;
         if (document.fullscreen || document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement) return document[exitFullscreen](), !0
     }
     e.close = function(a) {
         if (this.j && this.j(a)) return !0;
         this.min && U(this);
         this.unmount();
         this.g.parentNode.removeChild(this.g);
         F === this && (F = null)
     };
     e.move = function(a, b, c) {
         a || 0 === a ? c || (this.x = a ? a = R(a, L - this.left - this.right, this.width) : 0, this.y = b ? b = R(b, M - this.top - this.bottom, this.height) : 0) : (a = this.x, b = this.y);
         w(this.g, "transform", "translate(" + a + "px," + b + "px)");
         this.o && this.o(a, b);
         return this
     };
     e.resize = function(a, b, c) {
         a || 0 === a ? c || (this.width = a ? a = R(a, L - this.left - this.right) : 0, this.height = b ? b = R(b, M - this.top - this.bottom) : 0) : (a = this.width, b = this.height);
         w(this.g, "width", a + "px");
         w(this.g, "height", b + "px");
         this.m && this.m(a, b);
         return this
     };
     e.addClass = function(a) {
         this.g.classList.add(a);
         return this
     };
     e.removeClass = function(a) {
         this.g.classList.remove(a);
         return this
     };
     window.WinBox = O;
 }).call(this);
  // console.log(winbox());
  // return winbox;
  // return 'tets';
};

new ThoriumDialog();

class App extends thorium.components{
  constructor(arg){
    super({
      type:'app',
      prop : arg.prop,
      childrens : arg.childrens,
      proto : arg.proto
    })
  }
}

class Main extends thorium.components{
  constructor(arg){
    super({
      type:'main',
      prop : arg.prop,
      childrens : arg.childrens,
      proto : arg.proto
    })
  }
}

class Nav extends thorium.components{
  constructor(arg){
    super({
      type:'nav',
      prop : arg.prop,
      childrens : arg.childrens,
      proto : arg.proto
    })
  }
}

class Article extends thorium.components{
  constructor(arg){
    super({
      type:'article',
      prop : arg.prop,
      childrens : arg.childrens,
      proto : arg.proto
    })
  }
}

class Section extends thorium.components{
  constructor(arg){
    super({
      type:'section',
      prop : arg.prop,
      childrens : arg.childrens,
      proto : arg.proto
    })
  }
}

class Aside extends thorium.components{
  constructor(arg){
    super({
      type:'aside',
      prop : arg.prop,
      childrens : arg.childrens,
      proto : arg.proto
    })
  }
}

class Text extends thorium.components{
  constructor(arg,position = "left"){

    if(typeof arg == 'object' && 'position' in arg)(function(){
      position = arg.position;
      delete arg.position;
    })()

    // normalisation de la position
    position = (position.split(' ').length == 1 ?
    (function(p1){
      if(p1 == 'top') return 'margin : 0 auto auto auto';
      if(p1 == 'right') return 'margin : auto 0 auto auto';
      if(p1 == 'bottom') return 'margin : auto auto 0 auto';
      if(p1 == 'left') return 'margin : auto auto auto 0';
      if(p1 == 'center') return 'margin : auto auto auto auto';

    })(position)
    :
    (position.split(' ')[0] == 'top' ?
      (function(p2){
        if(p2 == 'left')return 'margin : 0 auto auto 0';
        if(p2 == 'center')return 'margin : 0 auto auto auto';
        if(p2 == 'right')return 'margin : 0 0 auto auto';
      })(position.split(' ')[1])
      :
      (position.split(' ')[0] == 'right' ?
        (function(p2){
          if(p2 == 'top')return 'margin : 0 0 auto 0';
          if(p2 == 'center')return 'margin : auto 0 auto auto';
          if(p2 == 'bottom')return 'margin : auto 0 0 auto';
        })(position.split(' ')[1])
        :
        (position.split(' ')[0] == 'bottom' ?
          (function(p2){
            if(p2 == 'left')return 'margin : auto auto 0 0';
            if(p2 == 'center')return 'margin : auto auto 0 auto';
            if(p2 == 'right')return 'margin : auto 0 0 auto';
          })(position.split(' ')[1])
          :
          (position.split(' ')[0] == 'left' ?
            (function(p2){
              if(p2 == 'top')return 'margin : 0 0 auto 0';
              if(p2 == 'center')return 'margin : auto 0 auto auto';
              if(p2 == 'bottom')return 'margin : auto 0 0 auto';
            })(position.split(' ')[1])
            :
            (position.split(' ')[0] == 'center' ?
              (function(p2){
                if(p2 == 'top')return 'margin : 0 auto auto auto';
                if(p2 == 'right')return 'margin : auto 0 auto auto';
                if(p2 == 'bottom')return 'margin : auto auto 0 auto';
                if(p2 == 'left')return 'margin : auto auto auto 0';
              })(position.split(' ')[1])
              :
              null
            )
          )
        )
      )
    )
   );

    super({
      type:'p',
      prop : (typeof arg == 'object' ? (function(x){
        var obj = {style : position};
        if('text' in x )(function(text){
          obj.text = text;
          delete x.text;
        })(x.text);
        if('id' in x )(function(id){
          obj.id = id;
          delete x.id;
        })(x.id);
        if('class' in x )(function(clas){
          obj.class = clas;
          delete x.class;
        })(x.class);
        // completion des attribus manquants
        for(const key of Object.keys(arg)){
          obj[key] = arg[key];
        }
        return obj;
      })(arg):
        {
          text : arg,
          style : position
        }
      )
    })
  }
}

class Div extends thorium.components{
  constructor(arg){

    var c = {
      type:"div"
    };

    if(arg.prop)c.prop = arg.prop;
    if(arg.childrens)c.childrens = arg.childrens;
    if(arg.proto)c.proto = arg.proto;

    super(c);
  }
}

class Container extends thorium.components{
  constructor(arg){

    var c = {
      type:"container"
    };

    if(arg.prop)c.prop = arg.prop;
    if(arg.childrens)c.childrens = arg.childrens;
    if(arg.proto)c.proto = arg.proto;

    super(c);
  }
}

class Ccontainer extends thorium.components{
  constructor(arg){

    var c = {};

    if(arg.type)c.type = arg.type;
    else c.type = "div";
    if(arg.prop)c.prop = arg.prop;
    if(arg.childrens)c.childrens = arg.childrens;
    if(arg.proto)c.proto = arg.proto;

    super(c);

  }
}

class Form extends thorium.components{
  constructor(arg){
    super({
      type : 'form',
      prop : {},
      childrens : [
        ('body' in arg ? arg.body : new Contaier({prop : {class : 'emptyBodyForm' }}) ),
        new Container({
          prop : {class : 'form-btn-container'},
          childrens : ('buttons' in arg ? (function(){
            const c = [];
            for(const x of arg.buttons){
              c.push(new Button( (function(y){
                var obj = {};
                if('text' in y){
                  obj.text = y.text;
                  delete y.text;
                }
                obj.prop = {};
                for(const key of Object.keys(y)){
                  obj.prop[key] = y.key;
                }
                return obj;
              })(x) ))
            }
            return c;
          })() : [] )
        })
      ],
      proto : {
        onSubmit : function(e){
          console.log(e);
        }
      }
    });
  }
}

class SVGBtn extends thorium.components{
  constructor(svg,position,proto = null){
    super({
      type:'btn',
      prop : {
        style : 'display : grid;'
      },
      childrens : [
        new Text(svg,position)
      ],
      proto : proto
    })
  }
}

class Button extends thorium.components{
  constructor(arg){
    if('text' in arg.prop){
      arg.text = arg.prop.text;
      delete arg.prop.text;
    }
    super({
      type:'button',
      prop : arg.prop,
      childrens : [('text' in arg ? new Text(arg.text,'center') : null)],
      proto : arg.proto
    })
  }
}

class Input extends thorium.components{
  constructor(arg){
    super((function(a){
      var element = { type : 'input' };
      if(a && 'prop' in a)element.prop = a.prop;
      if(a && 'proto' in a)element.proto = a.proto;
      return element;
    })(arg))
  }
}

class Textarea extends thorium.components{
  constructor(arg){
    super({
      type : 'textarea',
      prop : arg.prop,
      proto : arg.proto
    })
  }
}

class H1 extends thorium.components{
  constructor(arg){
    super((function(a){
      if(typeof a == 'string')return {type : 'h1' , prop : {text : arg}}
      if(typeof a == 'object' && !Array.isArray(a)){

        var element = { type : 'h1' , prop : {} };
        if('text' in a){
          element.prop.text = a.text;
          delete a.text;
        }
        if('proto' in a){
          element.proto = a.proto;
          delete a.proto;
        }

        for(const key of Object.keys(a)){
          element.prop[key] = a[key];
        }

        return element;
      }
    })(arg))
  }
}

class H2 extends thorium.components{
  constructor(arg){
    super((function(a){
      if(typeof a == 'string')return {type : 'h2' , prop : {text : arg}}
      if(typeof a == 'object' && !Array.isArray(a)){

        var element = { type : 'h2' , prop : {} };
        if('text' in a){
          element.prop.text = a.text;
          delete a.text;
        }
        if('proto' in a){
          element.proto = a.proto;
          delete a.proto;
        }

        for(const key of Object.keys(a)){
          element.prop[key] = a[key];
        }

        return element;
      }
    })(arg))
  }
}

class H3 extends thorium.components{
  constructor(arg){
    super((function(a){
      if(typeof a == 'string')return {type : 'h3' , prop : {text : arg}}
      if(typeof a == 'object' && !Array.isArray(a)){

        var element = { type : 'h3' , prop : {} };
        if('text' in a){
          element.prop.text = a.text;
          delete a.text;
        }
        if('proto' in a){
          element.proto = a.proto;
          delete a.proto;
        }

        for(const key of Object.keys(a)){
          element.prop[key] = a[key];
        }

        return element;
      }
    })(arg))
  }
}

class H4 extends thorium.components{
  constructor(arg){
    super((function(a){
      if(typeof a == 'string')return {type : 'h4' , prop : {text : arg}}
      if(typeof a == 'object' && !Array.isArray(a)){

        var element = { type : 'h4' , prop : {} };
        if('text' in a){
          element.prop.text = a.text;
          delete a.text;
        }
        if('proto' in a){
          element.proto = a.proto;
          delete a.proto;
        }

        for(const key of Object.keys(a)){
          element.prop[key] = a[key];
        }

        return element;
      }
    })(arg))
  }
}

class H5 extends thorium.components{
  constructor(arg){
    super((function(a){
      if(typeof a == 'string')return {type : 'h5' , prop : {text : arg}}
      if(typeof a == 'object' && !Array.isArray(a)){

        var element = { type : 'h5' , prop : {} };
        if('text' in a){
          element.prop.text = a.text;
          delete a.text;
        }
        if('proto' in a){
          element.proto = a.proto;
          delete a.proto;
        }

        for(const key of Object.keys(a)){
          element.prop[key] = a[key];
        }

        return element;
      }
    })(arg))
  }
}

class H6 extends thorium.components{
  constructor(arg){
    super((function(a){
      if(typeof a == 'string')return {type : 'h6' , prop : {text : arg}}
      if(typeof a == 'object' && !Array.isArray(a)){

        var element = { type : 'h6' , prop : {} };
        if('text' in a){
          element.prop.text = a.text;
          delete a.text;
        }
        if('proto' in a){
          element.proto = a.proto;
          delete a.proto;
        }

        for(const key of Object.keys(a)){
          element.prop[key] = a[key];
        }

        return element;
      }
    })(arg))
  }
}

class MobileApp{
  constructor(arg = null){
    if(typeof arg != "object" && Array.isArray(arg) == false)throw {msg:"arg doit être un object",r:arg};

    /*
    * class widgets de MobileApp
    */
    function widgets(arg){

      this.left =  false;
      this.top =  false;
      this.right =  false;
      this.bottom = false;

      this.add = function(widget = null){
        if(!widget) console.error({msg:"widget ne peut être null"});
        if(this[widget.position]){ // ajout du widget
          if(typeof widget.name == 'string')(widget.name in this[widget.position] ? console.error(`widget ${widget.name} à déjà été ajouter`) : this[widget.position][widget.name] = widget)
          else new widget.name(this);
        }
        else console.error({msg:`widget.position semble faire appel à un widget déclarer à false`});
        return Object.keys(this[widget.position]).length;
      };

      this.remove = function(widget = null){
        if(!widget) console.error({msg:"widget ne peut être null"});
        if(this[widget.position]){ // delete et destruction du widget
          document.querySelectorAll(`widget[name="${widget.name}"]`)[0].remove();
          delete this[widget.position][widget.name];
        }
        else console.error({msg:`widget.position semble faire appel à un widget déclarer à false`});
      };

      this.build = function(widget){ // construction du widget
        (document.querySelectorAll(`widget[name="${widget.name}"]`).length == 0 ?
        new UI(this[widget.position][widget.name].template)
        .buildIn(document.querySelectorAll(`${widget.position}widget`)[0])
        .then(function(){
          document.querySelectorAll(`widget[name="${widget.name}"]`)[0].initialise();
        }) :
        console.error(`Widget ${widget.name} est déjà build`));
      }

      try{
        if(!arg.widgets) throw {msg:`widgets n'est pas présent dans arg`,arg:arg};
        if(arg.widgets.left || arg.widgets.left == true)this.left = (arg.widgets.left == true ? {} : (function(self){
          self.left = {};
          for(var w of arg.widgets.left){
            new w(self);
          }
          return self.left;
        })(this) );
        if(arg.widgets.top || arg.widgets.top == true)this.top = (arg.widgets.left == true ? {} : (function(self){
          self.top = {};
          for(var w of arg.widgets.top){
            new w(self);
          }
          return self.top;
        })(this) );
        if(arg.widgets.right || arg.widgets.right == true)this.right = (arg.widgets.left == true ? {} : (function(self){
          self.right = {};
          for(var w of arg.widgets.right){
            new w(self);
          }
          return self.right;
        })(this) );
        if(arg.widgets.bottom || arg.widgets.bottom == true)this.bottom = (arg.widgets.bottom == true ? {} : (function(self){
          self.bottom = {};
          for(var w of arg.widgets.bottom){
            new w(self);
          }
          return self.bottom;
        })(this) );
      }catch(err){
        console.error(err);
      }

    }

    function mobileHeader(arg){

    }

    function mobileBody(arg){
      return [new arg.body()];
    }

    function mobileMenu(arg){
      if(arg.menu)return new arg.menu();
    }

    this.header = new mobileHeader(arg);
    this.widgets = new widgets(arg);
    this.body = new mobileBody(arg);
    this.menu = new mobileMenu(arg);

    /*
    * Construction du GUI de l'app modile sur base des parametres
    */
    this.gui = (function(self){

      var x = {
        left : [],
        top : [],
        right : [],
        bottom : []
      }

      for(var key of Object.keys(x)){
        if(typeof self.widgets[key] == "object")x[key] = Array.from({length : Object.keys(self.widgets[key]).length} , (x,i) => self.widgets[key][Object.keys(self.widgets[key])[i]].template[0] );
      }

      var x = [{
        type:"app",
        prop : {
          id : "app"
        },
        childrens:[
          {
            type:'appContainer',
            childrens:[
              {
                type:'leftWidget',
                prop:{
                  class:'widgetContainer'
                },
                childrens:x.left
              },
              {
                type:'topWidget',
                prop:{
                  class:'widgetContainer'
                },
                childrens:x.top
              },
              {
                type:'rightWidget',
                prop:{
                  class:'widgetContainer'
                },
                childrens:x.right
              },
              {
                type:'bottomWidget',
                prop:{
                  class:'widgetContainer'
                },
                childrens:x.bottom
              },
              {
                type:'main',
                childrens : self.body,
                proto : {
                  onMouseOver : function(e){
                    // console.log(thorium.controls);
                  }
                }
              }
            ]
          },
          self.menu.ui
        ]
      }];

      return new UI(x);
    })(this)

    // if(arg) for(var key of Object.keys(arg)){
    //   if(!this[key])console.error({msg:`key : ${key} ne fais pas partie des mots clefs attendus`,expected:`[ ${Object.keys(this).join(" , ")} ]`});
    //   else this[key] = arg[key];
    // };

    thorium.mobileApp = this;

  }
}

MobileApp.prototype.buildIn = function (target) {
  return this.gui.buildIn(target);
};

// Widget //

class Widget{
  constructor(template,position,ref){
    this.template = template;
    this.position = position;
    this.root = ref;
    this.name = this.__proto__.constructor.name;
    this.id = this.root.add(this);
    this.template[0].prop.id = `${position[0].toLowerCase()}Widget-${this.id}`;
    this.template[0].prop.name = this.name;
  }
}

class leftWidget extends Widget{
  constructor(template,ref){
    super([
      {
        type:'widget',
        prop : {
          id : 'lWidget-1'
        },
        childrens:[
          {
            type:'container',
            childrens:[
              template
            ]
          }
        ]
      }
    ],"left",ref);
  }
}

class topWidget extends Widget{
  constructor(template,ref){
    super([
      {
        type:'widget',
        prop : {
          id : 'tWidget-1'
        },
        childrens:[
          {
            type:'container',
            childrens:[
              template
            ]
          }
        ]
      }
    ],"top",ref);
  }
}

class rightWidget extends Widget{
  constructor(template,ref){
    super([
      {
        type:'widget',
        prop : {
          id : 'rWidget-1'
        },
        childrens:[
          {
            type:'container',
            childrens:[
              template
            ]
          }
        ]
      }
    ],"right",ref);
  }
}

class bottomWidget extends Widget{
  constructor(template,ref){
    super([
      {
        type:'widget',
        prop : {
          id : 'bWidget-1'
        },
        childrens:[
          {
            type:'container',
            childrens:[
              template
            ]
          }
        ]
      }
    ],"bottom",ref);
  }
}

// MobileMenu //

class MobileMenu{

  constructor(arg = null){

    if(arg){
      var x = {
        buttons : [],
      }

      try{
        // this.buttons = arg.buttons;
        this.buttons = (!arg.buttons || !Array.isArray(arg.buttons) ? {} : (function(buttonList){
          const x = [];
          const y = {};
          for(const i of Array.from({length : buttonList.length} , (x,i) => i)){
            const button = new (buttonList[i])();
            y[button.ui[0].prop.name] = button.ui;
          }
          return y;
        })(arg.buttons))
      }catch(err){
        // console.log(err);
      }

      this.ui = (new UI([{
        type:'mobileMenu',
        childrens : [{
          type:'container',
          childrens : Object.values(this.buttons)
        }],
        proto : {
          onResize : function(){
            console.log(this);
          }
        }
      }])).ui;
    }

  }

  icon = function(arg){

    const self = this

    function SVGicon(arg){
      this.ui = (new UI([{
        type:'icon',
        prop : {
          class : 'mobileMenu-icon',
          name : self.__proto__.constructor.name,
          text : arg.svg,
        },
        proto : (function(arg){

          const proto = {
            onClick : function(e){
              var self = this;
              self.turnActive();
              setTimeout(function(){
                self.turnActive();
              },400)
            }
          }

          if(arg.proto) for(const key of Object.keys(arg.proto)){
            if(!proto[key])proto[key] = arg.proto[key];
            else console.error({msg:`Il semblerait que ${key} existe déjà en tant que valeur/fonction prototype`});
          }

          return proto;
        })(arg)
      }])).ui
    }

    if(arg.svg)return new SVGicon(arg);
    if(arg.img)return new IMGicon(arg);
  }

}

MobileMenu.prototype.push = function (svgIcon) {
  this.add(svgIcon);
  this.rebuild();
};

MobileMenu.prototype.pop = function(svgIcon){
  this.remove(iconName);
  this.rebuild();
}

MobileMenu.prototype.add = function (svgIcon) {
  console.log(svgIcon.name);
  this.buttons[svgIcon.name] = (new svgIcon()).ui;
  this.updateUI();
};

MobileMenu.prototype.remove = function (svgIcon) {
  delete this.buttons[svgIcon.name];
  this.updateUI();
};

MobileMenu.prototype.removeAll = function () {
  this.buttons = {};
  this.updateUI();
};

MobileMenu.prototype.rebuild = function () {
  document.querySelectorAll('mobilemenu')[0].children[0].innerHTML = '';
  this.ui[0].childrens.ui[0].childrens.buildIn(document.querySelectorAll('mobilemenu')[0].children[0])
  .then(function(){
    document.querySelectorAll('mobilemenu')[0].initialise();
  })
};

MobileMenu.prototype.updateUI = function () {
  this.ui[0].childrens.ui[0].childrens = new UI(Object.values(this.buttons));
};

// MobileHeader //

class MobileHeader{

}

// A COPIER //

class monHeader extends MobileHeader{

}
