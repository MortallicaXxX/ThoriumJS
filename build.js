const fs = require('fs');
const path = require('path');
const stringify = require('json-stringify');

class ThoriumBuilder{

  package = require('package')(module);

  constructor(files){
    const self = this;
    self.files = files;
    self.initialise()
    .then(function(){
      self.getParameters().then(function(parameters){
        self.buildType = parameters[0];
        if(parameters[0] == 'snap')self.builder();
        else if(parameters[0] == 'minor')self.builder();
        else if(parameters[0] == 'major')self.builder();
        else console.error(`Vous ne spécifier pas le type d'update 'snap' 'minor' 'major'`);
      })
    })
  }

  get version(){
    return this.package.version.split('.');
  }
  get major(){return parseInt(this.version[0]);}
  get minor(){return parseInt(this.version[1]);}
  get snap(){return parseInt(this.version[2]);}
  get fullVersion(){return `${this.major}.${this.minor}.${this.snap}`}

}

/*
* Update des informations du package.json pour thoriumBuilder
*/
ThoriumBuilder.prototype.updatePackage = function () {
  this.package = require('package')(module);
};

/*
* Récuperation des parametre de la commande
*/
ThoriumBuilder.prototype.getParameters = function () {
  return new Promise(function(next){
    const p = [];
    process.argv.forEach(function (val, index, array) {
      if(!path.isAbsolute(val))p.push(val);
      if(index == array.length-1)next(p);
    });
  })
};

/*
* initialisation de compilation ( verification et préparation de package.json)
*/
ThoriumBuilder.prototype.initialise = function () {
  const self = this;
  return new Promise(function(next){
    if(!self.isVersionised())next(self.initialise_buildVersion());
    else next();
  })
};

/*
* Le package a déjà été initialiser ?
*/
ThoriumBuilder.prototype.isVersionised = function () {
  return (this.package.buildVersion ? true : false);
};

/*
* initialisation du gestionnaire de version
*/
ThoriumBuilder.prototype.initialise_buildVersion = function () {
  this.package.buildVersion = {
    history : [],
  }
};

/*
* Ecriture du package.json
*/
ThoriumBuilder.prototype.writePackage = function () {
  const self = this;
  fs.writeFile(path.join(__dirname,'package.json'), stringify(this.package,null,2), 'utf8',function(){
    console.log(`nouvelle version ${self.fullVersion}`);
  })
};

/*
* verification de l'existance du dossier contenant le resultat du build
  * si n'existe pas création de celui-ci
* return true | false
*/
ThoriumBuilder.prototype.isBuildFolderExist = function () {
  function createBuildFolder(){
    return new Promise(function(next){
      fs.mkdir(path.join(__dirname, 'build'), function(err){
        if(err) next(console.error(`Erreur l'ors de la création du dossier ${path.join(__dirname, 'build')}`));
        else next(true);
      });
    })
  }

  return new Promise(function(next){
    fs.readdir(path.join(__dirname, 'build'), function (err, files) {
        if (err) createBuildFolder().then(function(result){next(result)});
        else next(true);
    });
  })
};

/*
* builder version major
*/
ThoriumBuilder.prototype.builder = function () {
  const buildType = this.buildType;
  const snap = this.snap;
  const minor = this.minor;
  const major = this.major;

  function getUTCDate(date){
      return `${date.getUTCDate()}/${date.getUTCMonth()}/${date.getUTCFullYear()} ${date.getUTCHours()}:${date.getUTCMinutes()}:${date.getUTCSeconds()}.${date.getUTCMilliseconds()}`;
  }

  if(buildType == 'snap')this.package.version = `${major}.${minor}.${snap + 1}`;
  if(buildType == 'minor')this.package.version = `${major}.${minor + 1}.0`;
  if(buildType == 'major')this.package.version = `${major + 1}.0.0`;

  this.package.buildVersion.history.push(`${buildType} - ${major}.${minor}.${snap} to ${this.package.version} at ${getUTCDate(new Date(Date.now()))}`)

  this.compilateur();
};

ThoriumBuilder.prototype.compilateur = async function () {
  const self = this;
  await self.isBuildFolderExist();
  new Promise(async function(next,err){

    function readFile(filePath,i){
      console.log(`... lecture ... ${filePath} ...`);
      return new Promise(function(next){
        fs.readFile(filePath, 'utf8', async function (err,data) {
          if (err) next(console.error(`\x1b[31m${filePath}\x1b[0m ne semble pas exister ou l'ortographe est mauvais ?`));
          else next({i:i,data:data});
        });
      })
    }


    const x = [];
    for await(const i of Array.from({length : self.files.length} , (x,i) => i)){
      const fileName = self.files[i] , filePath = path.join(path.join(__dirname,'dist'),fileName);
      await readFile(filePath,i)
      .then(function(result){
        console.log(`... compilation ... ${fileName} ...`);
        x.push(result.data);
        if(result.i == self.files.length - 1)next(x.join('\n'));
      })
    }
  })
  .then(function(result){
    fs.writeFile(path.join(path.join(__dirname,'build'),`thorium_v${self.fullVersion}.js`), result, 'utf8',function(){
      console.log(`resultat de compilation ${path.join(path.join(__dirname,'build'),`thorium_v${self.fullVersion}.js`)}`);
    })
  })
  .then(function(){
    self.writePackage();
  })
};

new ThoriumBuilder([
  'console.js', // module thorium pour modifier la console dev-tools
  'animations.js', // module thorium pour utiliser le gestionaire d'animation
  'caches.js', // module thorium créant le cache
  'filter.js', // module permetant d'utiliser les filtres
  'platform.js', // module thorium qui définis la platerforme utiliser
  'stats.js', // module thorium offrant les stats de la plateforme
  'th.js', // module thorus-core
  'thorium.js', // module thorium-core
  'dialog.js', // module thorium dialog offrant les boites de dialogues thorium
  'components.js', // module thorium contenant les components basiques de thorium
]);
