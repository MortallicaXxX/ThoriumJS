class ThoriumComponent{

  componentsList = {};

  constructor(name,value){
    this.componentsList[]
    super(name,value);
    console.log(this);
    this.value = value;
  }

  listAll(){
    for(var e of Object.keys(this.componentsList)){
      console.log(e,this.componentsList[e]);
    }
  }

}
