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
    return new this.th(elementHTML , elementRef , ui);
  }

  th = function(elementHTML , elementRef , ui){
    const self = this;
    self.id = elementRef.id;
    self.root = ui.root;
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
          e.frameUpdate(arg);
        }

        try{
          this.e.onFrameUpdate(arg)
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

}

/*
*@{name}
*@{type}
*@{descriptif}
*/
class THORIUM_ENGINE{

  gui = null;
  // db = new DATASTORAGE();
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
    // self.stats = new STATS(self);
    // self.filters = new FILTRES(self);
    // self.entities = new ThoriumEntitites(self);
    self.caches = new ThoriumCaches(self);
    // self.console = new ThoriumConsole();

  }

  get cachesData(){
    try{
      return this.caches.data;
    }catch(err){
      console.error(err);
    }
  }

}

THORIUM_ENGINE.prototype.initialise = function (arg = null){
  // if(this.thorus){
  //   this.conf = {
  //     id:'UItools',
  //     parent:document.body,
  //   }
  //   thorium.onReady = this.thorus.initialise();
  // }
  if(!this.conf.app)this.conf.app = document.getElementById(this.conf.id);
  // if(this.conf.stats = true)self.stats = new STATS(this);
  // if(this.conf.filters = true)self.filters = new FILTRES(this);

  this.conf.app.initialise();
  this.entities.initialise();
}

THORIUM_ENGINE.prototype.update = function (arg = null){
  if(!this.conf.app)this.conf.app = document.getElementById(this.conf.id);
  this.conf.app.update();
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
