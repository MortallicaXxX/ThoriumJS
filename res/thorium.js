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
              console.log(err);
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
          done(value);
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

/*
*@{name}
*@{type}
*@{descriptif}
*/
class th{

  constructor(){
    return this;
  }

  test = 0;

}

new THORIUM_ENGINE();
