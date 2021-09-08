require('dotenv').config();
const fs = require('fs');
const path = require('path');
const stringify = require('json-stringify');
const hash = require('hash.js')

const colors = {
  Reset : "\x1b[0m",
  Bright : "\x1b[1m",
  Dim : "\x1b[2m",
  Underscore : "\x1b[4m",
  Blink : "\x1b[5m",
  Reverse : "\x1b[7m",
  Hidden : "\x1b[8m",

  FgBlack : "\x1b[30m",
  FgRed : "\x1b[31m",
  FgGreen : "\x1b[32m",
  FgYellow : "\x1b[33m",
  FgBlue : "\x1b[34m",
  FgMagenta : "\x1b[35m",
  FgCyan : "\x1b[36m",
  FgWhite : "\x1b[37m",

  BgBlack : "\x1b[40m",
  BgRed : "\x1b[41m",
  BgGreen : "\x1b[42m",
  BgYellow : "\x1b[43m",
  BgBlue : "\x1b[44m",
  BgMagenta : "\x1b[45m",
  BgCyan : "\x1b[46m",
  BgWhite : "\x1b[47m",
}

/*
* ========= CDNConnector =========
* Connector pour upload sur le serveur cdn la dernière version de thorium
*/

class CDNConnector{

  FormData = require('form-data');
  axios = require('axios').default;
  axiosLimit = 20000; // en utilisant axios il faut partir du principe que la longueur max de la requete est de 20000 bytes
  uid = Date.now(); // Valeur int représentant l'id du cdn connector ( permet coté serveur de savoir quel est la session )

  constructor(version,parameters){
    const self = this;
    const filePath = `./build/thorium_v${version}.js`;

    self._isUser(parameters)
    .then(function(result){
      if(!result)console.log(`${colors.FgRed}User ou Mot de passe erroné.${colors.FgWhite}`);
      else{
        const fileBuff = fs.readFileSync(filePath);

        const chunks = self._chunk(fileBuff);
        chunks.totalLength = (function(chu){
          var tl = 0;
          chu.lengths = Array.from({length : chu.length} , function(x,i){
            tl += chu[i].length;
            return chu[i].length;
          })
          return tl;
        })(chunks)
        console.log(`Division du fichier de ${colors.FgMagenta}${fileBuff.length} bytes${colors.FgWhite} en ${colors.FgYellow}${chunks.length}${colors.FgWhite} chunks.`);
        self._sender(0,chunks)
        .then(function(){

        })
        .catch(function(err){
          console.log(err);
        })
      }
    })
  }
}

// créer des chunk ne dépassant pas la longueur définie par axios
CDNConnector.prototype._chunk = function (buffData) {
  const self = this;
  // permet de faire un round up
  function roundUp(num, precision) {
    precision = Math.pow(10, precision)
    return Math.ceil(num * precision) / precision
  }

  return (
    buffData.length < self.axiosLimit ?
    Array.from({length : buffData.length} , (x,i) => buffData[i])
    :
    Array.from({length : roundUp(buffData.length / self.axiosLimit , 0)} , function(x,i){
      let min = self.axiosLimit * i;
      let max = (self.axiosLimit * (i + 1));
      return (max > buffData.length ? buffData.slice(min , buffData.length) : buffData.slice(min , max))
    })
  );
};

CDNConnector.prototype._sender = function (current_sess,chunks) {
  const self = this;
  var r;
  return new Promise(function(next,reject){
    self.axios({
      method: 'post',
      url: process.env.CDN_URL+process.env.PATH_UPDATE,
      data: {
        uid_sess : self.uid,
        sess : current_sess,
        max_sess : chunks.length -1,
        buff : chunks[current_sess]
      }
    })
    .then(function(result){
      if(result.data.status == 'Error')r = `${colors.FgRed}${result.data.msg.message}${colors.FgWhite}`;
      if(result.data.status != 'Error')console.log(`...Update du fichier en cours...${colors.FgYellow}${result.data.count}${colors.FgWhite} de ${colors.FgMagenta}${chunks[current_sess].length} bytes, ${(function(){
        var x = 0;
        for(const i of Array.from({length : current_sess + 1} , (x,i) => i)){
          x += chunks.lengths[i];
          if(i == current_sess)return x;
        }
      })()}/${chunks.totalLength} bytes ${colors.FgWhite} envoyé...`);
      if(result.data.status == 'End')(result.data.result == true ? console.log(`${colors.FgGreen}Fichier thorium à jour.${colors.FgWhite}`) : console.log(`${colors.FgRed}Erreur l'ors de l'envois.${colors.FgWhite}`) );
    })
    .catch(async function(err){
      // reject(err.toJSON());
    })
    .then(async function () {
      if(current_sess == chunks.length -1 && !r)next(console.log(`${colors.FgYellow}${current_sess}/${chunks.length -1}${colors.FgWhite} packets on été envoyer.`));
      else if(r)next(console.log(r));
      else next(self._sender(current_sess+1,chunks))
    });
  });
};

CDNConnector.prototype._isUser = function (arg) {
  const self = this;
  return new Promise(function(next,reject){
    self.axios({
      method: 'post',
      url: process.env.CDN_URL+process.env.PATH_Auth,
      data: arg
    })
    .then(async function(result){
      next(result.data);
    })
    .catch(async function(err){
      next(false);
    })
  })
};

/*
* ========= THORIUM BUILDER =========
* Compilateur de thorium
*/

class ThoriumBuilder{

  package = require('package')(module);

  constructor(files){
    const self = this;
    self.files = files;
    self.initialise()
    .then(function(){
      self.getParameters().then(function(parameters){
        self.buildType = parameters[0];
        if(self.buildType == 'snap')self.builder();
        else if(self.buildType == 'minor')self.builder();
        else if(self.buildType == 'major')self.builder();
        else if(self.buildType == 'update')new CDNConnector(self.version.join('.'),{user:parameters[1],mdp:parameters[2]});
        else if(self.buildType == 'caches')self.compilateur();
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
* builder
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

  this.package.buildVersion.history.push(`${buildType} - ${major}.${minor}.${snap} to ${this.package.version} at ${getUTCDate(new Date())}`)

  this.compilateur();
};

/*
* compilateur
*/
ThoriumBuilder.prototype.compilateur = async function () {
  const self = this;

  function readFolder(folderPath,i){
    console.log(`... Folder ... ${folderPath} ...`);
    return new Promise(function(next){
      fs.readdir(folderPath,function(err,data){
        if (err) next(console.error(`\x1b[31m${filePath}\x1b[0m ne semble pas exister ou l'ortographe est mauvais ?`));
        next(data);
      })
    })
  }

  function readFile(filePath,i){
    console.log(`... lecture ... ${filePath} ...`);
    return new Promise(function(next){
      fs.readFile(filePath, 'utf8', async function (err,data) {
        if (err) next(console.error(`\x1b[31m${filePath}\x1b[0m ne semble pas exister ou l'ortographe est mauvais ?`));
        else next({i:i,data:data});
      });
    })
  }

  await self.isBuildFolderExist();
  if(self.buildType == 'snap' || self.buildType == 'minor' || self.buildType == 'major'){
    new Promise(async function(next,err){

      // function readFile(filePath,i){
      //   console.log(`... lecture ... ${filePath} ...`);
      //   return new Promise(function(next){
      //     fs.readFile(filePath, 'utf8', async function (err,data) {
      //       if (err) next(console.error(`\x1b[31m${filePath}\x1b[0m ne semble pas exister ou l'ortographe est mauvais ?`));
      //       else next({i:i,data:data});
      //     });
      //   })
      // }


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
  }
  if(self.buildType == 'caches'){
    new Promise(function(next){
      const caches = {
        svg : {}
      };
      readFolder(path.join(__dirname,'res'))
      .then(function(resFiles){
        for(const i of Array.from({length : resFiles.length},(x,i) => i)){
          const fileName = resFiles[i];
          if(path.extname(fileName).split('.').join(``) == 'svg'){
            readFile(path.join(__dirname,path.join('res',fileName)),i)
            .then(function(fileData){
              caches.svg[fileName.split('.')[0]] = fileData.data;
              if(fileData.i == resFiles.length - 1)next(caches);
            })
          }else{console.error(`\x1b[31m${fileName}\x1b[0m n'est pas un svg`);}
        }
      })
    })
    .then(function(result){
      fs.writeFile(path.join(path.join(__dirname,'build'),`caches.js`), `thorium.caches = ${stringify(result,null,2)}`, 'utf8',function(){
        console.log(`resultat de compilation ${path.join(path.join(__dirname,'build'),`caches.js`)}`);
      })
    })
  }
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
  'mobile.js', // module thorium pour thorium mobile
]);
