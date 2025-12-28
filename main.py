def procesar_compra(indice: number):
    global nom, taxa, es_animal, quantitat, cost_total, cost_arrodonit
    # Recuperamos los datos de las listas usando el índice
    nom = lista_noms[indice]
    taxa = lista_preus[indice]
    es_animal = lista_es_animal[indice]
    quantitat = game.ask_for_number("Quantitat de " + nom + "?", 2)
    # Validaciones
    if quantitat <= 0:
        music.buzzer.play()
        game.show_long_text("Error: Cantidad positiva.", DialogLayout.BOTTOM)
        return
    if es_animal and quantitat % 1 != 0:
        music.buzzer.play()
        game.show_long_text("Error: Animales enteros.", DialogLayout.BOTTOM)
        return
    cost_total = quantitat * taxa
    cost_arrodonit = Math.round(cost_total * 100) / 100
    if info.score() >= cost_arrodonit:
        info.change_score_by(cost_arrodonit * -1)
        music.magic_wand.play()
        effects.confetti.start_screen_effect(1000)
        game.show_long_text("" + "TRACTE FET!\nPagat: " + ("" + str(cost_arrodonit)) + "kg llenya.",
            DialogLayout.BOTTOM)
    else:
        music.power_down.play()
        falta = Math.round((cost_arrodonit - info.score()) * 100) / 100
        game.show_long_text("" + """
                NO TENS LLENYA!
                Falten
                """ + ("" + str(falta)) + "kg.",
            DialogLayout.BOTTOM)
def obrir_botiga():
    global en_botiga
    music.jump_up.play()
    en_botiga = True
    while en_botiga:
        text_menu = "PREUS:\n"
        index = 0
        for item in lista_noms:
            precio = lista_preus[index]
            text_menu = "" + text_menu + "" + str((index + 1)) + ". " + item + " (" + ("" + str(precio)) + ")\n"
            index += 1
        text_menu = "" + text_menu + "6. SORTIR"
        game.show_long_text(text_menu, DialogLayout.FULL)
        opcio = game.ask_for_number("Opcio:", 1)
        if opcio == 6:
            en_botiga = False
        elif opcio >= 1 and opcio <= 5:
            procesar_compra(opcio - 1)
# --- 6. CONTROLES ---

def on_a_pressed():
    if nena.overlaps_with(mercader):
        obrir_botiga()
controller.A.on_event(ControllerButtonEvent.PRESSED, on_a_pressed)

def on_b_pressed():
    global talo_algun
    for arbre in sprites.all_of_kind(KIND_ARBRE):
        if nena.overlaps_with(arbre):
            arbre.destroy(effects.fountain, 500)
            music.knock.play()
            scene.camera_shake(2, 200)
            info.change_score_by(5)
            nena.say("+5kg", 500)
            talo_algun = True
            break
controller.B.on_event(ControllerButtonEvent.PRESSED, on_b_pressed)

# --- 5. FUNCIONES ---
def crear_arbol_random():
    global arbol, colocado
    # Genera árboles evitando la casa del mercader.
    # Usamos global para asegurar que Python sabe a qué nos referimos
    arbol = sprites.create(img_arbol, KIND_ARBRE)
    for index2 in range(10):
        c = randint(0, 29)
        f = randint(0, 29)
        # ZONA PROHIBIDA: Casa y alrededores
        if c < 15 and f < 12:
            continue
        location = tiles.get_tile_location(c, f)
        if not (tiles.tile_at_location_is_wall(location)):
            pos_x = c * 16
            pos_y = f * 16
            if abs(nena.x - pos_x) > 20:
                tiles.place_on_tile(arbol, location)
                colocado = True
                break
    if not (colocado):
        arbol.destroy()
colocado = False
arbol: Sprite = None
talo_algun = False
en_botiga = False
cost_arrodonit = 0
cost_total = 0
quantitat = 0
es_animal = False
taxa = 0
nom = ""
lista_es_animal: List[bool] = []
lista_preus: List[number] = []
lista_noms: List[str] = []
mercader: Sprite = None
nena: Sprite = None
img_arbol: Image = None
KIND_ARBRE = SpriteKind.create()
KIND_MERCADER = SpriteKind.create()
# --- 2. IMÁGENES ---
img_nena = img("""
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
    """)
img_mercader = img("""
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
    """)
img_arbol = img("""
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
    """)
# --- 3. CREACIÓN DE SPRITES ---.
scene.set_background_color(7)
tiles.set_current_tilemap(tilemap("""
    level1
    """))
# Creamos la Nena
nena = sprites.create(img_nena, SpriteKind.player)
controller.move_sprite(nena, 100, 100)
scene.camera_follow_sprite(nena)
info.set_score(0)
# La colocamos en el mapa
tiles.place_on_tile(nena, tiles.get_tile_location(10, 10))
# Creamos el Mercader
mercader = sprites.create(img_mercader, KIND_MERCADER)
# Lo colocamos en el mapa 
tiles.place_on_tile(mercader, tiles.get_tile_location(8, 6))
# --- 4. DATOS ---
# Listas paralelas para evitar errores de Clases en Bloques
lista_noms = ["Gallina", "Patates (kg)", "Cabra", "Ous (unitat)", "Cavall"]
lista_preus = [6, 1.33, 5, 0.25, 12]
lista_es_animal = [True, False, True, True, True]
# Generación inicial
for index22 in range(30):
    crear_arbol_random()
# --- 7. BUCLE---

def on_update_interval():
    if len(sprites.all_of_kind(KIND_ARBRE)) < 30:
        crear_arbol_random()
game.on_update_interval(2000, on_update_interval)
