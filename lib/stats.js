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
