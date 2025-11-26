# --------- PYODIDE:code --------- #
import p5, js

sombre = not js.isDark()        # "not" pour assurer la première mise à jour
"""
Permet de savoir quand changer le fond de la figure. Ici, on efface la figure au passage.
(Si cette fonctionnalité ne marche pas, recharger la page)
"""

W,H,D = 200, 200, 50

def setup():
    """ Les choses à faire une seule fois pour préparer l'animation. """
    p5.createCanvas(W,H)


def draw():
    """
    Les choses à faire chaque fois que l'horloge du navigateur avance d'une étape/image.
    """
    global sombre

    if sombre != js.isDark():
        sombre = not sombre
        bg, strike, fill = (50, 0, 255) if sombre else (205, 255, 0)
        p5.background(bg)
        p5.stroke(strike)
        p5.fill(fill)

    x,y = p5.mouseX, p5.mouseY
    if -D <= x < W+D and -D <= y < H+D:
        p5.circle(x, y, D)

# Lance l'animation:
p5.run(setup, draw, target="figure_p5")
