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
