function procesar_compra(indice: number) {
    let falta: number;
    
    //  Recuperamos los datos de las listas usando el índice
    nom = lista_noms[indice]
    taxa = lista_preus[indice]
    es_animal = lista_es_animal[indice]
    quantitat = game.askForNumber("Quantitat de " + nom + "?", 2)
    //  Validaciones
    if (quantitat <= 0) {
        music.buzzer.play()
        game.showLongText("Error: Cantidad positiva.", DialogLayout.Bottom)
        return
    }
    
    if (es_animal && quantitat % 1 != 0) {
        music.buzzer.play()
        game.showLongText("Error: Animales enteros.", DialogLayout.Bottom)
        return
    }
    
    cost_total = quantitat * taxa
    cost_arrodonit = Math.round(cost_total * 100) / 100
    if (info.score() >= cost_arrodonit) {
        info.changeScoreBy(cost_arrodonit * -1)
        music.magicWand.play()
        effects.confetti.startScreenEffect(1000)
        game.showLongText("" + "TRACTE FET!\nPagat: " + ("" + ("" + cost_arrodonit)) + "kg llenya.", DialogLayout.Bottom)
    } else {
        music.powerDown.play()
        falta = Math.round((cost_arrodonit - info.score()) * 100) / 100
        game.showLongText("" + `
                NO TENS LLENYA!
                Falten
                ` + ("" + ("" + falta)) + "kg.", DialogLayout.Bottom)
    }
    
}

function obrir_botiga() {
    let text_menu: string;
    let index: number;
    let precio: number;
    let opcio: number;
    
    music.jumpUp.play()
    en_botiga = true
    while (en_botiga) {
        text_menu = "PREUS:\n"
        index = 0
        for (let item of lista_noms) {
            precio = lista_preus[index]
            text_menu = "" + text_menu + "" + ("" + (index + 1)) + ". " + item + " (" + ("" + ("" + precio)) + ")\n"
            index += 1
        }
        text_menu = "" + text_menu + "6. SORTIR"
        game.showLongText(text_menu, DialogLayout.Full)
        opcio = game.askForNumber("Opcio:", 1)
        if (opcio == 6) {
            en_botiga = false
        } else if (opcio >= 1 && opcio <= 5) {
            procesar_compra(opcio - 1)
        }
        
    }
}

//  --- 6. CONTROLES ---
controller.A.onEvent(ControllerButtonEvent.Pressed, function on_a_pressed() {
    if (nena.overlapsWith(mercader)) {
        obrir_botiga()
    }
    
})
controller.B.onEvent(ControllerButtonEvent.Pressed, function on_b_pressed() {
    
    for (let arbre of sprites.allOfKind(KIND_ARBRE)) {
        if (nena.overlapsWith(arbre)) {
            arbre.destroy(effects.fountain, 500)
            music.knock.play()
            scene.cameraShake(2, 200)
            info.changeScoreBy(5)
            nena.say("+5kg", 500)
            talo_algun = true
            break
        }
        
    }
})
//  --- 5. FUNCIONES ---
function crear_arbol_random() {
    let c: number;
    let f: number;
    let location: tiles.Location;
    let pos_x: number;
    let pos_y: number;
    
    //  Genera árboles evitando la casa del mercader.
    //  Usamos global para asegurar que Python sabe a qué nos referimos
    arbol = sprites.create(img_arbol, KIND_ARBRE)
    for (let index2 = 0; index2 < 10; index2++) {
        c = randint(0, 29)
        f = randint(0, 29)
        //  ZONA PROHIBIDA: Casa y alrededores
        if (c < 15 && f < 12) {
            continue
        }
        
        location = tiles.getTileLocation(c, f)
        if (!tiles.tileAtLocationIsWall(location)) {
            pos_x = c * 16
            pos_y = f * 16
            if (Math.abs(nena.x - pos_x) > 20) {
                tiles.placeOnTile(arbol, location)
                colocado = true
                break
            }
            
        }
        
    }
    if (!colocado) {
        arbol.destroy()
    }
    
}

let colocado = false
let arbol : Sprite = null
let talo_algun = false
let en_botiga = false
let cost_arrodonit = 0
let cost_total = 0
let quantitat = 0
let es_animal = false
let taxa = 0
let nom = ""
let lista_es_animal : boolean[] = []
let lista_preus : number[] = []
let lista_noms : string[] = []
let mercader : Sprite = null
let nena : Sprite = null
let img_arbol : Image = null
let KIND_ARBRE = SpriteKind.create()
let KIND_MERCADER = SpriteKind.create()
//  --- 2. IMÁGENES ---
let img_nena = img`
    . . . . . f f 4 4 f f . . . . .
    . . . . f 5 4 5 5 4 5 f . . . .
    . . . f e 4 5 5 5 5 4 e f . . .
    . . f b 3 e 4 4 4 4 e 3 b f . .
    . . f 3 3 3 3 3 3 3 3 3 3 f . .
    . f 3 3 e b 3 e e 3 b e 3 3 f .
    . f 3 3 f f e e e e f f 3 3 f .
    . f b b f b f e e f b f b b f .
    . f b b e 1 f 4 4 f 1 e b b f .
    f f b b f 4 4 4 4 4 4 f b b f f
    f b b f f f e e e e f f f b b f
    . f e e f b d d d d b f e e f .
    . . e 4 c d d d d d d c 4 e . .
    . . e f b d b d b d b b f e . .
    . . . f f 1 d 1 d 1 d f f . . .
    . . . . . f f b b f f . . . . .
    `
let img_mercader = img`
    . . . . f f f f f . . . . . . .
    . . . f e e e e e f . . . . . .
    . . f d d d d e e e f . . . . .
    . c d f d d f d e e f f . . . .
    . c d f d d f d e e d d f . . .
    c d e e d d d d e e b d c . . .
    c d d d d c d d e e b d c . f f
    c c c c c d d d e e f c . f e f
    . f d d d d d e e f f . . f e f
    . . f f f f f e e e e f . f e f
    . . . . f e e e e e e e f f e f
    . . . f e f f e f e e e e f f .
    . . . f e f f e f e e e e f . .
    . . . f d b f d b f f e f . . .
    . . . f d d c d d b b d f . . .
    . . . . f f f f f f f f f . . .
    `
img_arbol = img`
    .............6666...............
    ..........666667766.6666........
    .........677777777767776........
    ......66667775577757777666......
    .....677666675557557776777666...
    .....6776777775555577777766776..
    ...66666777777775777777766666...
    .6666776777775575555777776776...
    6666777677775577557555777767766.
    .6667767777777775577777777767666
    .c6766777677777775777777677766..
    cc77666667777777777777777666666c
    cc76666677777777777777777766776c
    c6666776777777777777766677666776
    66667766667776777767767766766666
    ccc76677677776677766767776776ccc
    cc7766776777677677676667767766cc
    .666c676667677766667766666666cc.
    .ccc66676666776666677677666cccc.
    ...ccc77c6767666676676677666ccc.
    ...cc676c7766676676676666c666cc.
    ....c6cc676c6677677c66c666ccc...
    ....ccccc6c66667667cc6ccc6ccc...
    ......ccccc66c66c66cccccccc.....
    .......cc.cc6c6ccc6cccc.cc......
    ...........cccccccccc...........
    .............feeeeee............
    ............feeeeeefe...........
    .........eeeeefeeeffee..........
    ............ffffeef..ee.........
    ...............fee..............
    ................e...............
    `
//  --- 3. CREACIÓN DE SPRITES ---.
scene.setBackgroundColor(7)
tiles.setCurrentTilemap(tilemap`
    level1
    `)
//  Creamos la Nena
nena = sprites.create(img_nena, SpriteKind.Player)
controller.moveSprite(nena, 100, 100)
scene.cameraFollowSprite(nena)
info.setScore(0)
//  La colocamos en el mapa
tiles.placeOnTile(nena, tiles.getTileLocation(10, 10))
//  Creamos el Mercader
mercader = sprites.create(img_mercader, KIND_MERCADER)
//  Lo colocamos en el mapa 
tiles.placeOnTile(mercader, tiles.getTileLocation(8, 6))
//  --- 4. DATOS ---
//  Listas paralelas para evitar errores de Clases en Bloques
lista_noms = ["Gallina", "Patates (kg)", "Cabra", "Ous (unitat)", "Cavall"]
lista_preus = [6, 1.33, 5, 0.25, 12]
lista_es_animal = [true, false, true, true, true]
//  Generación inicial
for (let index22 = 0; index22 < 30; index22++) {
    crear_arbol_random()
}
//  --- 7. BUCLE---
game.onUpdateInterval(2000, function on_update_interval() {
    if (sprites.allOfKind(KIND_ARBRE).length < 30) {
        crear_arbol_random()
    }
    
})
