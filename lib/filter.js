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
