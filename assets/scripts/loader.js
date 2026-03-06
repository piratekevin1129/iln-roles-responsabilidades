var total_audios = 10;
var total_images = 0;
var total_extra = puntos_data[0].length + puntos_data[1].length + puntos_data[2].length;
var total_files = (total_audios + total_images + total_extra)

var files_loaded = 0
function updateLoader(){
    files_loaded++
    var loader_width = Math.round((files_loaded*100)/total_files)

    getE('loader-bar2').style.width = loader_width+'%'
}

var audios_loaded = 0
function checkAudios(l){
    if(l){updateLoader()}
    
    audios_loaded++

    if(audios_loaded==total_audios){
        comenzarJuego()
    }
}

function unsetLoader(){
    getE('loader').className = 'loader-off'
}

function loadTrack(data){
    var url = data.src

    var audio_fx = null
    audio_fx = document.createElement('audio')
    audio_fx.setAttribute('src',url)
    audio_fx.load()
    audio_fx.addEventListener('loadeddata',function(){
        //alert("cargo")
        data.callBack(audio_fx)
    })
    audio_fx.addEventListener('error',function(){
        console.log("error cargando")
        data.callBack(null)
    })
}

function loadImg(data){
    var img = new Image()
    if(data.extra!=null&&data.extra!=undefined){
        img.setAttribute('f',data.extra.f)
    }
    img.onload = function(){
        img.onload = null
        img.onerror = null
        data.callBack(img)
    }
    img.onerror = function(){
        img.onload = null
        img.onerror = null
        data.callBack(null)
        console.log("error loading img: "+img.src)        
    }
    img.src = data.src
}