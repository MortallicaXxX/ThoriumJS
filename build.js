const fs = require('fs');
const path = require('path');

const files = [
  'console.js', // module thorium pour modifier la console dev-tools
  'animations.js', // module thorium pour utiliser le gestionaire d'animation
  'caches.js', // module thorium créant le cache
  'filter.js', // module permetant d'utiliser les filtres
  'platform.js', // module thorium qui définis la platerforme utiliser
  'stats.js', // module thorium offrant les stats de la plateforme
  'th.js', // module thorus-core
  'thorium.js', // module thorium-core
  'dialog.js', // module thorium dialog offrant les boites de dialogues thorium
];

function isBuildFolderExist(){

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
}

(async function(){
  await isBuildFolderExist();
  return new Promise(async function(next,err){
    const x = [];
    for await(const i of Array.from({length : files.length} , (x,i) => i)){
      let fileName = files[i] , filePath = path.join(path.join(__dirname,'lib'),fileName);
      console.log(`... ${filePath} ...`);
      fs.readFile(filePath, 'utf8', function (err,data) {
        if (err) return console.error(`\x1b[31m${filePath}\x1b[0m ne semble pas exister ou l'ortographe est mauvais ?`);
        else x.push(data);
        if(i == files.length - 1)next(x.join('\n'));
      });
    }
  })
})()
.then(function(result){
  fs.writeFile(path.join(path.join(__dirname,'build'),'thorium.js'), result, 'utf8',function(){
    console.log(`thorium à bien été compilé`);
  })
})
.catch(function(err){

})
