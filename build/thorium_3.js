///////////////////////
/////Thorium Setup/////
///////////////////////
(function(){

  function UI(){
    
  }

  function GUI(){

    Object.defineProperty(this.__proto__ , `initialise`, {
      value: function (arg = null) {
        for(var e of this.templates){
          e.initialise(arg);
        }
      },
      writable: false
    })

    Object.defineProperty(this.__proto__ , `update`, {
      value: function (arg = null) {
        for(var e of this.templates){
          e.update(arg);
        }
      },
      writable: false
    })

    Object.defineProperty(this.__proto__ , `buildIn`, {
      value: function (target , template = null) {
        return Promise.resolve(this.ui.buildIn(target , template));
      },
      writable: false
    })

    Object.defineProperty(this.__proto__ , `setNewId`, {
      value: function (e) {
        return this.uids.setNewElementId(e)
      },
      writable: false
    })

    Object.defineProperty(this.__proto__ , `updateTargetElement`, {
      value: function(target){
        this.uids.updateTargetElement(target);
      },
      writable: false
    })

    Object.defineProperty(this.__proto__ , `setUI`, {
      value: function (f) {
        this.uids.destroy();
        f(this)
      },
      writable: false
    })

    Object.defineProperty(this.__proto__ , `addTemplate`, {
      value: function (name = null , uielement = null) {
        try{ // rejet si aucun nom ou uielement définis
          if(!name) throw {err:1,msg:"name n'est pas renseignée",name:name};
          if(!uielement)throw {err:2,msg:"uielement n'est pas renseignée",uielement:uielement};
          if(!this.templates)this.templates = {};
          if(this.templates[name])throw {err:3,msg:"ce nom de template pour ce parent existe déjà , doublon impossible veuillez utiliser 'updateTemplate()' à la place",uielement:uielement,template:templates[name]};
          this.templates[name] = uielement;
        }catch(err){
          console.error(err);
        }
      },
      writable: false
    })

    Object.defineProperty(this.__proto__ , `findElementById`, {
      value: function (id = null , arg = null) {
        try{
          if(!id)throw { err: 1 , msg: 'id ne peut pas être null' , id: id }
          if(arg && arg != 'element' && arg != 'reference')throw { err: 1 , msg: 'si arg renseigné, il doit être un string égal à "element" ou "reference"' , arg: arg }

          if(arg == 'element') return this.uids.findElementById(id);
          else if(arg == 'reference') return this.uids.findReferenceById(id);
          else return this.uids.findById(id);
        }catch(err){
          console.error(err);
        }
      },
      writable: false
    })

    Object.defineProperty(this.__proto__ , `ClassName`, {
      value: 'GUI',
      writable: false
    })

    Object.defineProperty(this.__proto__ , `uids`, {
      // value: new ID_UIelements(),
      writable: false
    })

    if(ui) Object.defineProperty(this , `ui`, {
      value: new UI(ui,this),
      writable: false
    })
    if(root) Object.defineProperty(this , `root`, {
      value: root,
      writable: false
    })

  }

  function thorium(){

    console.log("%c ThoriumJS - Odyssee ", "border: 1px solid red;color: red;");
    console.log("%c site : https://thoriumcdn.herokuapp.com/ ", "color: orange;");
    console.log("%c git : https://github.com/MortallicaXxX/ThoriumJS ", "color: orange;");

    // this.gui = null;
    // this.db = null;
    // this.conf = {
    //   app : null,
    //   parent : document.body
    // };
    // this.buffer = {};
    // this.screen = null;
    // this.controls = null;
    // this.stats = null;
    // this.filters = null;
    // this.caches = null;
    // this.math = null;
    // this.entities = null;
    // this.console = null;
    // this.componentsList = {};

    this.__defineGetter__('app',function(){return this.conf.app})
    this.__defineGetter__('body',function(){return this.conf.parent})

    Object.defineProperty(this.__proto__ , `initialise`, {
      value: async function (arg = null){

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

        this.conf.app.initialise();
        this.entities.initialise();
      },
      writable: false
    })

    Object.defineProperty(this.__proto__ , `update`, {
      value: function(arg = null){
        if(!this.conf.app)this.conf.app = document.getElementById(this.conf.id);
        this.conf.app.update();
      },
      writable: false
    })

    Object.defineProperty(this.__proto__ , `resize`, {
      value: function (arg = null){
        if(!this.conf.app)this.conf.app = document.getElementById(this.conf.id);
        this.conf.app.resize();
      },
      writable: false
    })

    Object.defineProperty(this.__proto__ , `addTemplate`, {
      value: function (name,template) {
        if(this.gui)return this.gui.addTemplate(name,template)
      },
      writable: false
    })

    Object.defineProperty(this.__proto__ , `setUI`, {
      value: function (f) {
        if(this.gui)return this.gui.setUI(f)
      },
      writable: false
    })

    Object.defineProperty(this.__proto__ , `frameUpdate`, {
      value: function () {
        try{
          this.onFrameUpdate(this);
        }catch(err){

        }
        this.entities.update();
      },
      writable: false
    })

    Object.defineProperty(this.__proto__ , `vec2`, {
      value: function(coord = null,y = null){
        try{
          return new this.math.vec2(coord,y);
        }catch(err){

        }
      },
      writable: false
    })

    Object.defineProperty(this.__proto__ , `lerp`, {
      value: function(a = null,b = null,alpha = 0){
        try{
          return this.math.lerp(a,b,alpha);
        }catch(err){
          console.log(err);
        }
      },
      writable: false
    })

    Object.defineProperty(this.__proto__ , `cssStyle`, {
      value: function (element = null , propName = null) {
        try{
          if(!element)throw {err:1,msg:"element ne peut pas être null , pour changer une propriété css veuillez renseigné l'élément cible" , element:element}
          if(!propName)throw {err:2,msg:"arg ne peut pas être null , veuillez indiquer une propriété css pour recevoir la valeur" , propName:propName}
          const styles = window.getComputedStyle(element);
          return styles[propName];
        }
        catch(err){
          console.error(err);
        }
      },
      writable: false
    })

    Object.defineProperty(this.__proto__ , `css`, {
      value: function (arg = null) {
        return Array.from({length : Object.keys(arg).length} , function(x,i){
          return `${Object.keys(arg)[i]}:${Object.values(arg)[i]};`
        }).join('');
      },
      writable: false
    })

    Object.defineProperty(this.__proto__ , `cssToValue`, {
      value: function (cssValue = null) {
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
      },
      writable: false
    })

    Object.defineProperty(this.__proto__ , `addCss`, {
      value: function (linkID = null , cssDef = null) {
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
      },
      writable: false
    })

    // Object.defineProperty(this.__proto__ , `get`, {
    //   value: ,
    //   writable: false
    // })
    //
    // Object.defineProperty(this.__proto__ , `post`, {
    //   value: ,
    //   writable: false
    // })

    Object.defineProperty(this.__proto__ , `components`, {
      value: function(e,root,parent){
        return new UIelement(e,root,parent)
      },
      writable: false
    })

    Object.defineProperty(this.__proto__ , `entity`, {
      value: function(name){
        return thorium.entities.entity(name);
      },
      writable: false
    })

    Object.defineProperty(this.__proto__ , `addEntity`, {
      value: function(entity){
        this.entities.addEntity(entity)
      },
      writable: false
    })

    Object.defineProperty(this.__proto__ , `animation`, {
      value: function(entity,time,arg,option){
        return entity.addAnimation(time,arg,option);
      },
      writable: false
    })

    Object.defineProperty(this.__proto__ , `GUI`, {
      value: function(template){
        this.gui = new GUI(template,this);
        return this.gui;
      },
      writable: false
    })

    Object.defineProperty(this.__proto__ , `log`, {
      value: function(message=null,style=null){
        return this.console.log(message,style);
      },
      writable: false
    })

    const self = this;
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

        self.gui = new GUI([new App({
          prop : {
            id : 'app-thorium' ,
            style : css({
              display: 'grid',
              "font-family": "Inconsolata, Monaco, Consolas, 'Courier New', Courier",
              "min-height": "var(--thorium-default-height)",
              "min-width": "var(--thorium-default-width)",
              position: "absolute",
              top: 0,
              left: 0,
              "user-select": "none",
              "--default-theme-color":"lightseagreen",
              "font-size":"1vw",
            })
          },
          childrens : [
            new Div({
              prop : {
                id : 'background-container',
                style : css({
                  "position": "fixed",
                  "height": "100%",
                  "width": "100%",
                  "top": "0",
                  "left": "0",
                  "z-index": "0",
                  "display": "grid",
                })
              },
              childrens : [
                new Div({
                  prop :{id:'bckg1' , text : th_caches.svg.th_bg1 , style : css({"z-index": 1})},
                }),
                new Div({
                  prop :{id:'bckg2' , text : th_caches.svg.th_bg2 , style : css({"z-index": 2})},
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
                }),
                new Div({
                  prop :{id:'bckg3' , text : th_caches.svg.th_bg3 , style : css({"z-index": 3})},
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
                }),
                new Div({
                  prop :{id:'bckg4' , text : th_caches.svg.th_bg4 , style : css({"z-index": "4","height": "200%","width": "200%"})},
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
                }),
              ],
              proto : {
                updateBackground : self.controls.addEventListener('mousemove',function(e,_self){
                  document.getElementById('background-container').updateMyBackground();
                },this),
                updateMyBackground : function(cursorInfo){
                  for(var e of this.e.children){
                    if("updateBackgroundPosition" in e)e.updateBackgroundPosition();
                  }
                }
              }
            }),
            new Div({
              prop : {
                id : 'app-container',
                style : css({
                  "display": "grid;",
                  "z-index":"1;",
                  "grid-template-rows": "min-content 1fr;",
                })
              },
              childrens : [
                new Div({
                  prop : {
                    id : 'thorium-title',
                    style : css({
                      "height":"fit-content",
                      "width":"fit-content",
                      "margin":"auto",
                      "font-size":"4vw",
                      "font-weight":"bold",
                      "display":"grid",
                      "grid-template-columns":"min-content max-content",
                      "color":"white",
                      "margin-top":"1vw",
                      "grid-row": 1,
                    }),
                    hoverStyle : css({
                      "background":"white",
                      "color":"black",
                    })
                  },
                  childrens : [
                    new Text('Thorium<span>JS</span>','center'),
                    new Div({
                      prop : {
                        id : 'thorium-logo' ,
                        text : th_caches.svg.thoriumColor,
                        style : css({
                          "margin":"auto",
                          "display":"grid",
                          "grid-column":"1",
                          "grid-row":"1",
                          "height":"100%",
                          "width":"4vw",
                          "border-right":"5px solid white",
                        })
                      }
                    })
                  ],
                  proto : {
                    onClick : function(){
                      window.open("https://thoriumcdn.herokuapp.com/");
                    }
                  }
                }),
                new Div({
                  prop : {
                    id : 'thorium-description',
                    style : css({
                      "width":"80%",
                      "min-height":"10vw",
                      "margin":"auto",
                      "background-color":"rgba(32,178,170,0.95)",
                      "margin-bottom":"1vw",
                      "display":"grid",
                      "grid-template-rows":"1fr 3vw",
                      "text-align":"center",
                      "font-weight":"bold",
                      "color":"darkslategray",
                    })
                  },
                  childrens : [
                    new Div({
                      prop : {
                        class : 'descirption',
                        style : css({
                          "width":"80%",
                          "min-height":"10vw",
                          "margin":"auto",
                          "background-color":"rgba(32,178,170,0.95)",
                          "margin-bottom":"1vw",
                          "display":"grid",
                          "grid-template-rows":"1fr 3vw",
                          "text-align":"center",
                          "font-weight":"bold",
                          "color":"darkslategray",
                        })
                      },
                      childrens : [
                        new Text(`ThoriumJS est un framework JS natif 'client side' qui ajoute à un projet HTML l'environnement 'thorium engine'.`,'left'),
                        new Text(`L'engine permet d'utiliser directement des outils, fonctions et utilitaires. En savoir plus ? La documentation est sur le git.`,'left'),
                        new Text(`Première utilisation de thorium ? N'ayez pas peur c'est simple et intuitif , ça va bien se passer. &#128540;`,'left'),
                      ]
                    }),
                    new Div({
                      prop : {
                        id : 'btn-github',
                        style : css({
                          "background-repeat":"no-repeat",
                          "background-position":"center",
                          "background-size":"80%",
                          "height":"2vw",
                          "width":"10vw",
                          "border-radius":"0.5vw",
                          "background-color":"lightgray",
                          "filter":"drop-shadow(2px 2px 1px gray)",
                          "margin":"auto",
                        }),
                        hoverStyle : css({
                          "background-color":"ghostwhite",
                          "filter":"drop-shadow(2px 2px 1px gray)",
                        })
                      },
                      proto:{
                        onclick:function(){
                          window.open("https://github.com/MortallicaXxX/ThoriumJS");
                        }
                      }
                    })
                  ]
                })
              ]
            })
          ]
        })],self);

        addCss("style-app-thorium",[`
          #background-container div {
            grid-column: 1;
            grid-row: 1;
          }

          #bckg1 svg {
            width: var(--thorium-default-width);
          }

          #bckg2 svg {
            width: var(--thorium-default-width);
          }

          #bckg3 svg {
            width: var(--thorium-default-width);
          }

          #bckg4 svg {
            height: 100%;
            width: 100%;
          }

          #thorium-title:hover span{
            color:white;
            color:var(--default-theme-color);
          }

          #thorium-title p {
            margin: 0 1vw;
            grid-column: 2;
            grid-row: 1;
          }

          #thorium-title:hover #thorium-logo{
            background:var(--default-theme-color);
          }

          #thorium-logo svg {
            margin: auto;
            width: 90%;
          }

          #thorium-description p{
            padding-left:1vw;
            padding-right:1vw;
          }

          #btn-github {
            background-image:url(https://phoenixweb.com.au/wp-content/uploads/2016/11/GitHub-wide-logo-1024x219.png);
          }
        `])

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
    // crée une chaine de string repésantant le css d'un élément
    window.css = function(arg = null){return self.css(arg);}
    window.get = async function(url = null){
      return self.get(url);
    }
    window.post = async function(url = null ,arg = null){
      return self.post(url,arg);
    }
    window.Var = function(x,o){return new (new THORUS()).Var(x,o)};

    // self.caches = new ThoriumCaches(self);
    // window.th_caches = self.caches.data;
    // self.screen = new ScreenStat();
    // self.controls = new Controls(self);
    // self.stats = new STATS(self);
    // self.filters = new FILTRES(self);
    // self.entities = new ThoriumEntitites(self);
    // self.caches = new ThoriumCaches(self);
    // self.console = new ThoriumConsole();
    // self.platform = new PLATFORM(self);

  }

  window.thorium = new thorium();

})()
