var i = 0;
var j = 0;

function getE(idname){
    return document.getElementById(idname)
}

function getRand(minimum,maximum){
    var randomnumber = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
    return randomnumber;
}

var cubo_caras = [
    [-90],
    [0],
    [90],
    [180]
]
var cubo_positions = [90,0,-90,-180]

var scene = 0;
var scene_width = 1920
var scene_height = 1080
var ancho_fondo = 0
var alto_fondo = 0
var left_fondo = 0
var top_fondo = 0

function setFondo(){
    var ancho = window.innerWidth
    var percent = (ancho * 100) / scene_width
    var alto = (scene_height * percent) / 100
    
    while(alto<window.innerHeight){
        ancho++
        percent = (ancho * 100) / scene_width
        alto = (scene_height * percent) / 100
    }

    ancho_fondo = ancho
    alto_fondo = alto

    getE('fondo').style.width = ancho_fondo+'px'
    getE('fondo').style.height = alto_fondo+'px'
    getE('cubo').style.width = parseInt(ancho_fondo)+'px'
    getE('cubo').style.height = parseInt(alto_fondo)+'px'

    left_fondo = (ancho_fondo-window.innerWidth) / 2
    top_fondo = (alto_fondo-window.innerHeight) / 2
    getE('fondo').style.left = (0-left_fondo)+'px'
    getE('fondo').style.top = (0-top_fondo)+'px'

    for(i = 0;i<cubo_caras.length;i++){
        getE('cara'+i).style.transform = 'rotateY('+cubo_caras[i][0]+'deg) translateZ('+parseInt(ancho_fondo/2)+'px)'
    }

    getE('cubo-container').style.transform = 'translateZ(-'+parseInt(ancho_fondo/2)+'px) rotateY('+cubo_positions[scene]+'deg)'
}

var punto_ind = 0;
var puntos_seccion = 0;
function loadPuntos(){
    if(puntos_seccion==puntos_data.length){
        loadedPuntos()
    }else{
        loadPunto()
    }
}

function loadPunto(){
    var src_audio = (puntos_seccion+1)+'/'+puntos_data[puntos_seccion][punto_ind].id
    //console.log(src_audio)
    loadTrack({src: 'assets/audios/'+src_audio+'.mp3', callBack: function(data){
        audios_data[puntos_seccion].push(data)

        //colocar punto
        var punto_div = document.createElement('div')
        punto_div.className = 'punto punto-novisto'
        punto_div.innerHTML = '<div></div>'
        punto_div.setAttribute('onclick','clickPunto(this,'+puntos_seccion+','+punto_ind+')')
        var x = (puntos_data[puntos_seccion][punto_ind].x * 100) / scene_width
        var y = (puntos_data[puntos_seccion][punto_ind].y * 100) / scene_height
        punto_div.style.left = x+'%'
        punto_div.style.top = y+'%'

        getE('puntos'+(puntos_seccion+1)).appendChild(punto_div)

        updateLoader()
        punto_ind++
        if(punto_ind==puntos_data[puntos_seccion].length){
            punto_ind = 0
            puntos_seccion++
        }
        loadPuntos()
    }})
}

function clickPunto(punto,seccion,p){
    getE('tooltip-txt').innerHTML = '<span>'+puntos_data[seccion][p].title+': </span>'+puntos_data[seccion][p].text
    getE('tooltip').className = 'tooltip-on'

    var tooltip_w = getE('tooltip').offsetWidth
    var tooltip_h = getE('tooltip').offsetHeight
    var punto_x = (puntos_data[seccion][p].x * 100) / scene_width
    var punto_y = (puntos_data[seccion][p].y * 100) / scene_height

    var real_x = (punto_x * ancho_fondo) / 100
    var real_y = (punto_y * alto_fondo) / 100

    var posx = real_x-(tooltip_w/2)
    if(posx<left_fondo){
        posx = left_fondo + 5
    }
    if((posx + tooltip_w)>ancho_fondo){
        posx = ancho_fondo - (tooltip_w + 5)
    }
    var posy = real_y - (tooltip_h + 10 + 20)//20 de la mitad del punto
    getE('tooltip-before').className = 'tooltip-before-bot'
    getE('tooltip-after').className = 'tooltip-after-bot'
    if(posy<top_fondo){
        posy = real_y + 40 //40 promedio de ancho del punto
        getE('tooltip-before').className = 'tooltip-before-top'
        getE('tooltip-after').className = 'tooltip-after-top'
    }

    getE('tooltip').style.left = posx+'px'
    getE('tooltip').style.top = posy+'px'

    puntos_data[seccion][p].visto = true
    punto.className = 'punto punto-visto'
    
    if(global_audio!=null){
        global_audio.pause()
        global_audio = null
    }

    global_audio = audios_data[seccion][p]
    global_audio.currentTime = 0
    global_audio.play()
    click_mp3.play()

    //comprobar
    var total_vistos = 0
    for(i = 0;i<puntos_data[seccion].length;i++){
        if(puntos_data[seccion][i].visto){
            total_vistos++
        }
    }

    if(total_vistos==puntos_data[seccion].length){
        global_audio.onended = function(){
            global_audio.onended = null
            nextGame()
        }
    }
}


function overBtn(){
    over_mp3.play()
}

function startGame(){
    getE('instrucciones').className = 'instrucciones-off'
    scene++
    setScene()
}

var animacion_cubo = null;
function setScene(){
    getE('cubo-title').className = 'cubo-title-off'
    getE('cubo-container').style.transform = 'translateZ(-'+parseInt(ancho_fondo/2)+'px) rotateY('+cubo_positions[scene]+'deg)'

    animacion_cubo = setTimeout(function(){
        clearTimeout(animacion_cubo)
        animacion_cubo = null;

        getE('cubo-title').innerHTML = titulos[scene-1]
        getE('cubo-title').className = 'cubo-title-on'
        if(scene==1){
            global_audio = intro1_mp3
        }else if(scene==2){
            global_audio = intro2_mp3
        }else if(scene==3){
            global_audio = intro3_mp3
        }

        if(global_audio!=null){
            global_audio.play()
        }
    },1000)

    modal_mp3.currentTime = 0
    modal_mp3.play()
}


function nextGame(){
    getE('tooltip').className = 'tooltip-off'
    scene++
    if(scene<puntos_data.length){
        alert("terminó")
    }else{
        setScene()
    }
}