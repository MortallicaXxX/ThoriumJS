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
