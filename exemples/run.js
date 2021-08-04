// components

class premierWidget extends leftWidget{
  constructor(app){
    super(new Text('premierWidget'),app)
  }
}

class deuxiemeWidget extends rightWidget{
  constructor(app){
    super(new Text('deuxiemeWidget'),app)
  }
}

class test_topWidget extends topWidget{
  constructor(app){
    super(new Text('test_topWidget'),app)
  }
}

class premierWidget2 extends bottomWidget{
  constructor(app){
    super(new inscriptionPage(),app)
  }
}

class premierWidget3 extends bottomWidget{
  constructor(app){
    super(new Container({
      childrens : [
        new Text('hello')
      ],
      proto : {
        onInitialise : function(){
          console.log('onInitialise');
        }
      }
    }),app)
  }
}

class Menu extends MobileMenu{
  constructor(){
    super({
      buttons : [
        inscriptionIcon
      ]
    })
  }
}

// class inscriptionMenu extends MobileMenu{
//   constructor(){
//     super({
//       buttons : [
//         inscriptionIcon
//       ]
//     })
//   }
// }

class walletIcon extends (new MobileMenu()).icon{
  constructor(){
    super({
      svg : `<svg viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M25.1591 22.0909H20.8636C18.1568 22.0909 15.9546 19.8887 15.9546 17.182C15.9546 14.4752 18.1568 12.273 20.8636 12.273H25.1591C25.4983 12.273 25.7727 11.9985 25.7727 11.6593V9.81844C25.7727 8.53167 24.7746 7.48518 23.5136 7.38371L19.9894 1.22827C19.6628 0.658974 19.1354 0.252082 18.5044 0.0831235C17.8764 -0.0846842 17.2196 0.00344791 16.6575 0.330607L4.57638 7.36392H2.45456C1.10086 7.36392 0 8.4647 0 9.81844V24.5455C0 25.8992 1.1008 27 2.45456 27H23.3182C24.6719 27 25.7727 25.8992 25.7727 24.5455V22.7046C25.7727 22.3654 25.4983 22.0909 25.1591 22.0909ZM20.7504 5.02853L22.0875 7.36392H16.739L20.7504 5.02853ZM7.01558 7.36392L17.2753 1.39124C17.5528 1.22884 17.8769 1.1857 18.1868 1.26842C18.5002 1.35229 18.7615 1.55485 18.9239 1.83829L18.9251 1.84053L9.43815 7.36392H7.01558Z" fill="#E6E6E6"/> <path d="M25.1592 13.5002H20.8637C18.8334 13.5002 17.1819 15.1517 17.1819 17.182C17.1819 19.2123 18.8334 20.8638 20.8637 20.8638H25.1592C26.1743 20.8638 27.0001 20.038 27.0001 19.0229V15.3411C27.0001 14.326 26.1743 13.5002 25.1592 13.5002ZM20.8637 18.4092C20.1872 18.4092 19.6364 17.8585 19.6364 17.182C19.6364 16.5055 20.1872 15.9548 20.8637 15.9548C21.5402 15.9548 22.0909 16.5055 22.0909 17.182C22.091 17.8585 21.5403 18.4092 20.8637 18.4092Z" fill="#E6E6E6"/> </svg>`,
      proto : {
        widget1 : null,
        onInitialise : function(e){

        },
        onMouseDown : function(e){

        }
      }
    });
  }
}

class analyseIcon extends (new MobileMenu()).icon{
  constructor(){
    super({
      svg : `<svg viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg"> <g opacity="0.66"> <path d="M0 13.5H2.7C2.7 12.0339 2.98485 10.6164 3.54645 9.2853C4.0878 7.9974 4.86675 6.84315 5.85495 5.85495C6.8472 4.8627 8.0028 4.0851 9.28665 3.54645C11.9002 2.44485 14.931 2.43 17.5622 3.4911C17.6243 5.30685 19.0944 6.75 20.925 6.75C22.7961 6.75 24.3 5.2461 24.3 3.375C24.3 1.5039 22.7961 0 20.925 0C19.9949 0 19.1538 0.3726 18.545 0.97875C15.2631 -0.3348 11.4939 -0.31455 8.2377 1.0584C6.63255 1.7334 5.1867 2.7054 3.9447 3.94605C2.70675 5.18265 1.73475 6.62715 1.0557 8.2377C0.3564 9.9009 0 11.6721 0 13.5ZM23.4535 17.7147C22.9122 18.9999 22.1346 20.1555 21.1451 21.1451C20.1555 22.1346 18.9999 22.9122 17.7134 23.4535C15.0998 24.5551 12.069 24.57 9.43785 23.5089C9.37575 21.6931 7.9056 20.25 6.075 20.25C4.2039 20.25 2.7 21.7539 2.7 23.625C2.7 25.4961 4.2039 27 6.075 27C7.00515 27 7.8462 26.6274 8.45505 26.0212C10.0561 26.6652 11.7504 27 13.5 27C15.3279 27 17.0978 26.6436 18.761 25.9429C20.3702 25.2639 21.816 24.2919 23.0539 23.0539C24.2919 21.816 25.2639 20.3715 25.9429 18.7623C26.6436 17.0977 27 15.3279 27 13.5H24.3C24.3 14.9648 24.0152 16.3822 23.4535 17.7147Z" fill="#E6E6E6"/> <path d="M13.5001 7.37378C10.1224 7.37378 7.37378 10.1224 7.37378 13.5001C7.37378 16.8778 10.1224 19.6264 13.5001 19.6264C16.8778 19.6264 19.6264 16.8778 19.6264 13.5001C19.6264 10.1224 16.8778 7.37378 13.5001 7.37378ZM13.5001 16.9264C11.6114 16.9264 10.0738 15.3887 10.0738 13.5001C10.0738 11.6114 11.6114 10.0738 13.5001 10.0738C15.3887 10.0738 16.9264 11.6114 16.9264 13.5001C16.9264 15.3887 15.3887 16.9264 13.5001 16.9264Z" fill="#E6E6E6"/> </g> </svg>`,
      proto : {
        widget1 : null,
        onInitialise : function(e){
          this.widget1.set(document.getElementById('tWidget-1'));
        },
        onMouseDown : function(e){
          this.widget1.get().turnActive();
        }
      }
    });
  }
}

class parisIcon extends (new MobileMenu()).icon{
  constructor(){
    super({
      svg : `<svg viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M5.56232 14.2924H0C0.176286 17.3327 1.36475 20.1892 3.40437 22.4749L7.32961 18.5497C6.3588 17.3657 5.72143 15.8983 5.56232 14.2924Z" fill="#E6E6E6"/> <path d="M5.56232 12.7076C5.72143 11.1016 6.35875 9.63435 7.32961 8.45027L3.40437 4.52502C1.36475 6.81077 0.176286 9.66732 0 12.7076H5.56232Z" fill="#E6E6E6"/> <path d="M21.4377 14.2924C21.2786 15.8983 20.6413 17.3656 19.6704 18.5497L23.5957 22.4749C25.6353 20.1892 26.8237 17.3326 27 14.2924H21.4377Z" fill="#E6E6E6"/> <path d="M13.5 7.10791C9.97539 7.10791 7.10791 9.97539 7.10791 13.5C7.10791 17.0247 9.97539 19.8922 13.5 19.8922C17.0247 19.8922 19.8922 17.0247 19.8922 13.5C19.8922 9.97539 17.0247 7.10791 13.5 7.10791ZM14.3106 16.9265V17.0844C14.3106 17.5439 13.945 17.8847 13.5182 17.8847C13.0806 17.8847 12.7258 17.5299 12.7258 17.0923V17.0161C12.3604 16.9521 12.0268 16.8155 11.6056 16.5398C11.2301 16.294 11.142 15.7936 11.3765 15.4351C11.6161 15.0688 12.1071 14.9662 12.4734 15.2058C12.8597 15.4585 12.9835 15.4783 13.513 15.4745C14.0227 15.4712 14.2258 15.071 14.2655 14.8351C14.313 14.5523 14.1918 14.3251 13.8684 14.2106C13.2653 13.9972 12.555 13.7263 12.0579 13.3365C10.9684 12.4823 11.2977 10.5257 12.7259 10.0067V9.89985C12.7259 9.44035 13.0915 9.09951 13.5183 9.09951C13.9559 9.09951 14.3107 9.4543 14.3107 9.89192V9.95875C14.7148 10.0763 15.0263 10.2743 15.2039 10.4381C15.1981 10.4444 15.1976 10.442 15.2028 10.4467C15.5227 10.7427 15.5436 11.2417 15.2489 11.5634C14.9538 11.8854 14.454 11.9078 14.1313 11.6139C13.9268 11.4625 13.6152 11.3971 13.287 11.4966C13.0995 11.5531 12.9979 11.7539 12.9967 11.9338C12.9977 12.0164 13.0214 12.0702 13.036 12.0816C13.3349 12.3161 13.8915 12.5302 14.3966 12.7087C16.4727 13.4426 16.2425 16.2283 14.3106 16.9265Z" fill="#E6E6E6"/> <path d="M19.6704 8.45027C20.6412 9.63435 21.2786 11.1016 21.4377 12.7076H27C26.8237 9.66732 25.6353 6.81077 23.5957 4.52502L19.6704 8.45027Z" fill="#E6E6E6"/> <path d="M14.2925 0V5.56232C15.8984 5.72144 17.3657 6.35875 18.5498 7.32962L22.475 3.40437C20.1894 1.36475 17.3328 0.176286 14.2925 0V0Z" fill="#E6E6E6"/> <path d="M18.5498 19.6704C17.3657 20.6412 15.8984 21.2786 14.2925 21.4377V27C17.3328 26.8237 20.1894 25.6353 22.475 23.5957L18.5498 19.6704Z" fill="#E6E6E6"/> <path d="M12.7076 21.4377C11.1016 21.2786 9.63435 20.6413 8.45027 19.6704L4.52502 23.5957C6.81077 25.6353 9.66731 26.8237 12.7076 27V21.4377Z" fill="#E6E6E6"/> <path d="M8.45027 7.32962C9.63435 6.3588 11.1016 5.72144 12.7076 5.56232V0C9.66731 0.176286 6.81077 1.36475 4.52502 3.40437L8.45027 7.32962Z" fill="#E6E6E6"/> </svg>`,
      proto : {
        widget1 : null,
        onInitialise : function(e){

        },
        onMouseDown : function(e){

        }
      }
    });
  }
}

class profileIcon extends (new MobileMenu()).icon{
  constructor(){
    super({
      svg : `<svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M24.3 0H8.10003C6.60963 0 5.40002 1.2096 5.40002 2.7V18.9C5.40002 20.3904 6.60963 21.6 8.10003 21.6H24.3C25.7905 21.6 27.0001 20.3904 27.0001 18.9V2.7C27.0001 1.2096 25.7905 0 24.3 0ZM16.2 3.375C18.0644 3.375 19.575 4.88565 19.575 6.75C19.575 8.61435 18.0644 10.125 16.2 10.125C14.3357 10.125 12.825 8.61435 12.825 6.75C12.825 4.88565 14.3357 3.375 16.2 3.375ZM22.95 17.55H9.45003V17.2125C9.45003 14.7163 12.4929 12.15 16.2 12.15C19.9071 12.15 22.95 14.7163 22.95 17.2125V17.55Z" fill="#E6E6E6"/> <path d="M2.7 8.1001H0V24.3001C0 25.7892 1.21095 27.0001 2.7 27.0001H18.9V24.3001H2.7V8.1001Z" fill="#E6E6E6"/> </svg>`,
      proto : {
        widget1 : null,
        onInitialise : function(e){

        },
        onMouseDown : function(e){

        }
      }
    });
  }
}

class inscriptionIcon extends (new MobileMenu()).icon{
  constructor(){
    super({
      svg : `<svg id="Layer_1" enable-background="new 0 0 512 512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="m49.5 512c-11.046 0-20-8.954-20-20 0-100.355 81.645-182 182-182h30c20.537 0 40.703 3.4 59.937 10.105 10.43 3.636 15.938 15.04 12.301 25.469-3.636 10.43-15.04 15.938-25.469 12.301-14.991-5.225-30.726-7.875-46.769-7.875h-30c-78.299 0-142 63.701-142 142 0 11.046-8.954 20-20 20zm310-377c0-74.439-60.561-135-135-135s-135 60.561-135 135 60.561 135 135 135 135-60.561 135-135zm-40 0c0 52.383-42.617 95-95 95s-95-42.617-95-95 42.617-95 95-95 95 42.617 95 95zm143 257h-60v-60c0-11.046-8.954-20-20-20s-20 8.954-20 20v60h-60c-11.046 0-20 8.954-20 20s8.954 20 20 20h60v60c0 11.046 8.954 20 20 20s20-8.954 20-20v-60h60c11.046 0 20-8.954 20-20s-8.954-20-20-20z"/></svg>`,
      proto : {
        widget : null,
        onInitialise : function(e){
          this.widget.set(document.querySelectorAll(`widget[name='premierWidget2']`)[0]);
        },
        onMouseDown : function(e){
          this.widget.get().turnActive();
        }
      }
    });
  }
}

// MobileBody //

class index extends thorium.components{
  constructor(){
    super({
      type:"container",
      childrens : [
        new priceContainer(),
        {
          type:'chartContainer',
          childrens:[
            new klineChart()
          ]
        },
        new quickWallet(),
      ]
    })
  }
}

class loadingScreen extends thorium.components{
  constructor(){
    super(new Container({
      prop : {id : "loadingScren"},
      childrens : [
        new Div({
          prop : {id : "loadingScren-container"},
          childrens : [
            new Ccontainer({
              type:'coin',
              childrens : [new Text(thorium.caches.svg["coin"])]
            }),
            new Ccontainer({
              type:'shadow',
              prop : {id:'shadow_beat_1'},
              childrens : [new Text(thorium.caches.svg["coin"])]
            }),
            new Ccontainer({
              type:'shadow',
              prop : {id:'shadow_beat_2'},
              childrens : [new Text(thorium.caches.svg["coin"])]
            }),
            new Ccontainer({
              type:'shadow',
              prop : {id:'shadow_beat_3'},
              childrens : [new Text(thorium.caches.svg["coin"])]
            }),
            new Ccontainer({
              type:'shadow',
              prop : {id:'shadow_beat_4'},
              childrens : [new Text(thorium.caches.svg["coin"])]
            })
          ],
          proto : {
            onInitialise : function(e){
              console.log("initialise");
            }
          }
        })
      ]
    }))
  }
}

class inscriptionPage extends thorium.components{
  constructor(){
    super(new Container({
      prop : {id : 'inscription'},
      childrens : [
        new Text('Inscription','center'),
        new Div({
          prop : { class : 'signInField'},
          childrens : [
            new Text('nom'),
            new Ccontainer({
              type : 'input',
              prop : {
                name : 'nom'
              }
            })
          ]
        }),
        new Div({
          prop : { class : 'signInField'},
          childrens : [
            new Text('Email'),
            new Ccontainer({
              type : 'input',
              prop : {
                name : 'Email'
              }
            })
          ]
        }),
        new Div({
          prop : { class : 'signInField'},
          childrens : [
            new Text('password'),
            new Ccontainer({
              type : 'input',
              prop : {
                name : 'password'
              }
            })
          ]
        }),
        new Div({
          prop : { class : 'signInField'},
          childrens : [
            new Text('passwordx'),
            new Ccontainer({
              type : 'input',
              prop : {
                name : 'passwordx'
              }
            })
          ]
        }),
      ]
    }));
  }
}

// run //

thorium.onReady = async function(self){

  new MobileApp(
    {
      header : monHeader,
      menu : Menu,
      body : loadingScreen,
      widgets:{
        left : [
          premierWidget
        ],
        bottom : [
          premierWidget2
        ],
        right : [
          deuxiemeWidget
        ],
        top : [
          test_topWidget
        ]
      },
    }
  )
  .buildIn(document.body)
  .then(function(){
    self.initialise();
  })

}

addCss("lavender-theme",[
  `
    :root{
      --default-font-family : Inconsolata, Monaco, Consolas, 'Courier New', Courier;
      --default-theme-color-1 : #4C1B4C;
      --default-theme-color-2 : #632E63;
      --default-theme-color-3 : #814081;
      --default-theme-color-4 : #663399;
      --default-theme-color-5 : #9370DB;
      --default-theme-color-6 : #808080;
      --default-theme-color-7 : #D3D3D3;
    }
  `
])

addCss("style-app",[
  `
  html{
    height:100%;
    width:100%;
    overflow: hidden;
  }

  app {

    --default-color-1 : white;
    --default-color-2 : whitesmoke;
    --default-color-3 : #E6E6E6;
    --default-color-4 : #DDDDDD;
    --default-radius : 2vw;
    --filter-shadow : drop-shadow(0px 4px 5px gray);
    --default-font-size : 10vw;

    font-size : var(--default-font-size);

    position: absolute;
    top: 0;
    left: 0;
    height: var(--thorium-default-height);
    width: var(--thorium-default-width);
    background: var(--default-theme-color-1);
    display: grid;
    overflow: hidden;
    font-family : var(--default-font-family);
  }

  appContainer {
      margin: auto;
      display: grid;
      height: calc(var(--thorium-default-height) * 3);
      width: calc(var(--thorium-default-width) * 3);
      grid-template-columns: minmax(0,1fr) minmax(0,1fr) minmax(0,1fr);
      grid-template-rows: minmax(0,1fr) minmax(0,1fr) minmax(0,1fr);
      transform: translate(calc(var(--thorium-default-width) * -1), calc(var(--thorium-default-height) * -1));
  }

  appContainer > * {
    height: var(--thorium-default-height);
    width: var(--thorium-default-width);
    display:grid;
    z-index:2;
  }

  leftwidget {
      grid-column: 1;
      grid-row: 2;
  }

  leftwidget > *.active {
    transform: translateX(100%);
  }

  topwidget {
      grid-column: 2;
      grid-row: 1;
  }

  topwidget > *.active {
    transform: translateY(100%);
  }

  rightwidget {
      grid-column: 3;
      grid-row: 2;
  }

  rightwidget > *.active {
    transform: translateX(-100%);
  }

  bottomwidget {
    grid-column: 2;
    grid-row: 3;
  }

  bottomwidget > *.active {
    transform: translateY(-100%);
  }

  .widgetContainer > * {
    transition: 0.4s;
    grid-column: 1;
    grid-row: 1;
  }

  .widgetContainer > *.active {
    transition: 0.4s;
  }

  app > appContainer > main {
    grid-column: 2;
    grid-row: 2;
    z-index:1;
  }

  main > container {
    display: grid;
    grid-auto-rows: min-content;
  }

  main > container > * {
    margin : 1vw;
  }

  main > container chartcontainer {
    background: var(--default-color-1);
    border: 1px solid var(--default-color-4);
    border-radius: var(--default-radius);
    filter: var(--filter-shadow);
    width: 90%;
    margin: auto;
  }

  .priceContainer {
    width: 90%;
    background-color: white;
    border: 1px solid red;
    margin-left: auto;
    margin-right: auto;
    font-size: 68px;
    display: grid;
  }

  .priceContainer > p {
    height: fit-content;
    margin: auto;
  }

  mobilemenu {
    --mobile-height: 100px;
    position: absolute;
    height: var(--mobile-height);
    width: var(--thorium-default-width);
    left: 0;
    top: calc( var( --thorium-default-height) * 0.99 - var(--mobile-height) );
    display: inline-flex;
    overflow: hidden;
    z-index: 10;
  }

  mobilemenu > container {
    display: inline-flex;
    margin: auto;
    max-width: calc( var(--thorium-default-width) * 0.9 );
    min-width: 300px;
    background-color: white;
    filter: var(--filter-shadow);
    height: calc( var(--mobile-height) * 0.9);
    border-radius: 2vw;
    gap: 1vw;
  }

  icon.mobileMenu-icon {
    height: calc( var(--mobile-height) * 1.1);
    transform: translateY(calc( var(--mobile-height) * -0.1));
    margin: auto;
    display: grid;
    padding-left: 0.5vw;
    padding-right: 0.5vw;
    fill : var(--default-color-3);
  }

  icon.mobileMenu-icon:before {
      grid-column: 1;
      grid-row: 1;
      height: calc( var(--mobile-height) * 0.9);
      width: calc( var(--mobile-height) * 2);
      content: ' ';
      margin: auto;
      transition: 0.4s;
      border-radius: 2.5vw;
      z-index: 0;
      // background:rgba(100,149,237,0.8);
  }

  icon.mobileMenu-icon.active:before {
    opacity:0;
    transition:0.4s;
  }

  icon.mobileMenu-icon:after {
    grid-column:1;
    grid-row:1;
    height: calc( var(--mobile-height) * 0.6);
    width: calc( var(--mobile-height) * 0.6);
    content:' ';
    margin:auto;
    transition:0.4s;
    border-radius:100%;
    z-index:1;
  }

  icon.mobileMenu-icon.active:after {
    grid-column:1;
    grid-row:1;
    height: calc( var(--mobile-height) * 1.1);
    width: calc( var(--mobile-height) * 1.2);
    content:' ';
    background:rgba(100,149,237,0.8);
  }

  icon.mobileMenu-icon > svg {
    grid-column:1;
    grid-row:1;
    height: calc( var(--mobile-height) * 0.8);
    width: calc( var(--mobile-height) * 0.8);
    margin: auto;
    z-index:2;
  }

  widget > container {
    height: 100%;
    width: 100%;
    display: grid;
  }

  widget#tWidget-1 chartcontainer{
    background: var(--default-color-1);
    border: 1px solid var(--default-color-4);
    border-radius: var(--default-radius);
    filter: var(--filter-shadow);
  }
  `
])

addCss('loadingScren-style',[`

  #loadingScren {
    --anim-duration: 4s;
    --anim-repeat: infinite;
    margin: auto;
    display: grid;
    grid-template-columns: minmax(0,1fr);
    grid-template-rows: minmax(0,1fr);
    height: 100%;
    width: 100%;
  }

  #loadingScren-container {
      margin: auto;
      display: grid;
      grid-template-rows: minmax(0,1fr);
      grid-template-columns: minmax(0,1fr);
      height: 100%;
      width: 100%;
      background : #4C1B4C;
  }

  #loadingScren-container > *{
    grid-column : 1;
    grid-row : 1;
    width: 30%;
  }

  coin {
    margin: auto;
    z-index: 10;
    animation : coinbeat var(--anim-duration) var(--anim-repeat) linear;
  }

  shadow {
    margin: auto;
    opacity : 0.5;
    animation : coinshadow var(--anim-duration) var(--anim-repeat) linear;
  }

  #shadow_beat_1{
    animation : shadow_beat_1 var(--anim-duration) var(--anim-repeat) linear;
  }

  #shadow_beat_2{
    animation : shadow_beat_2 var(--anim-duration) var(--anim-repeat) linear;
  }

  #shadow_beat_3{
    animation : shadow_beat_3 var(--anim-duration) var(--anim-repeat) linear;
  }

  #shadow_beat_4{
    animation : shadow_beat_4 var(--anim-duration) var(--anim-repeat) linear;
  }

  @keyframes coinbeat{
    0%{
      width : 30%;
    }
    3%{
      width : 40%;
    }
    6%{
      width : 30%;
    }
    9%{
      width : 40%;
    }
    12%{
      width : 30%;
    }
    50%{
      width : 30%;
    }
    53%{
      width : 40%;
    }
    56%{
      width : 30%;
    }
    59%{
      width : 40%;
    }
    62%{
      width : 30%;
    }
  }

  @keyframes shadow_beat_1{
    3%{
      opacity : 1;
      width : 30%;
    }
    50%{
      opacity : 0;
      width : 80%;
    }
    100%{
      opacity : 0;
      width : 30%;
    }
  }

  @keyframes shadow_beat_2{
    9%{
      opacity : 1;
      width : 30%;
    }
    60%{
      opacity : 0;
      width : 80%;
    }
    100%{
      opacity : 0;
      width : 30%;
    }
  }

  @keyframes shadow_beat_3{
    53%{
      opacity : 1;
      width : 30%;
    }
    90%{
      opacity : 0;
      width : 80%;
    }
    100%{
      opacity : 0;
      width : 30%;
    }
  }

  @keyframes shadow_beat_4{
    59%{
      opacity : 1;
      width : 30%;
    }
    99%{
      opacity : 0;
      width : 80%;
    }
    100%{
      opacity : 0;
      width : 30%;
    }
  }

`])

addCss('inscriptionPage',[
  `
  container#inscription {
    height: 90%;
    transform: translateY(10%);
    margin-top: auto;
    width: 100%;
    background-color: var(--default-theme-color-3);
    border-radius: 14vw;
    color: var(--default-color-2);
    display: grid;
    grid-auto-rows: min-content;
  }

  container#inscription > div.signInField {
    width: 80%;
    margin: auto;
    margin-top: 4vw;
  }

  container#inscription > div.signInField > p {
    text-transform: capitalize;
  }

  #inscription input {
    width: 100%;
    height: var(--default-font-size);
    font-size: var(--default-font-size);
    background: rgba(255,255,255,0.2);
    border-radius: var(--default-radius);
    color: var(--default-color-2);
    outline: none;
    border: none;
    font-family : var(--default-font-family);
  }
  `
])
