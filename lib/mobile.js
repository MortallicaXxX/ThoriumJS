class MobileApp{

  widgets = {
    left : {},
    top : {},
    right : {},
    addWidget : function(widgetName = null , widget = null){
      if(!widgetName) console.error({msg:"widgetName ne peut être null"});
      if(!widget) console.error({msg:"widget ne peut être null"});
      this[widget.position][widgetName] = widget;
    },
    removeWidget : function(widgetName = null , widget = null){
      if(!widgetName) console.error({msg:"widgetName ne peut être null"});
      if(!widget) console.error({msg:"widget ne peut être null"});
      delete this[widget.position];
    }
  }

  ui;

  constructor(ui = null){
    if(!ui)ui = new UI([
      {
        type:'thoriumApp',
        childrens:[
          {
            type:'appContainer',
            childrens:[
              {
                type:'leftWidget'
              },
              {
                type:'toptWidget'
              },
              {
                type:'rightWidget'
              },
              {
                type:'main'
              }
            ]
          }
        ]
      },
    ])
    this.ui = ui;
  }
}

class Widget{
  constructor(){

  }
}

class leftWidget extends Widget{
  constructor(){
    
  }
}

class toptWidget extends Widget{
  constructor(){

  }
}

class rightWidget extends Widget{
  constructor(){

  }
}
