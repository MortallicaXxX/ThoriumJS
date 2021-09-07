(function(){
  thorium.translate = function(arg){
    return new Promise(function(next){
      fetch("https://libretranslate.de/translate", {
      	method: "POST",
      	body: JSON.stringify({
      		q: arg.text,
      		source: arg.from,
      		target: arg.to
      	}),
      	headers: { "Content-Type": "application/json" }
      })
      .then(async function(response){
        response.json()
        .then(function(json){
          next(json.translatedText)
        })
      })
    })
  }
  this.translate = thorium.translate;
})()
