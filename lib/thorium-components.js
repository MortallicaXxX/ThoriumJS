class boutton extends thorium.components{

  constructor(text){
    super({
      type:'div',
      prop:{id:'boutton',text:text},
    });
    this.__proto__.name = "boutton";
  }

}

class boutton_groupe extends thorium.components{

  constructor(arg = []){

    try{
      if(!Array.isArray(arg))throw {err:1,msg:"L'argument ne semble pas être un array"};
      var groupe = {
        type:'div',
        prop:{class:'boutton_groupe'},
        childrens : []
      }

      for(var e of arg){
        groupe.childrens.push(new boutton(e))
      }

      super(groupe);
      this.__proto__.name = "boutton_groupe";
      this.style;
    }catch(err){
      console.error(err);
    }

  }

}
