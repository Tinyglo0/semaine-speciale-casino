# --- PYODIDE:code --- #
import p5

class Drops(p5.Sketch):
    """
    Une classe pour créer des "gouttes" (vertes à l'appui sur le bouton, blanches
    au relâchement) et qui tombent toutes seules à vitesse constante...
    """

    W, H, D = 200, 200, 15
    Y_LIMIT = H + D/2

    def __init__(self, speed=1):
        """
        Initialiser uniquement les données, self.p5 n'étant pas accessible avant que
        la méthode `run` n'ait été appelée.
        """
        self.speed = speed
        self.drops = []

        # Si une seule animation prévue avec ce type d'objet, on peu lancer l'animation
        # depuis la méthode __init__:
        self.run("figure_p5_sketch")  # On pourrait utiliser self.p5 à partir de maintenant.


    @p5.hook
    def setup(self):
        """ Initialise la partie graphique de l'animation """
        self.p5.createCanvas(self.W, self.H)
        self.p5.stroke(0)
        self.p5.strokeWeight(0.5)

    @p5.hook
    def draw(self):
        """
        Dessine une image (appel automatique à chaque "frame" par le JS de la page):
            1. Efface le canevas.
            2. Dessine toutes les gouttes.
            3. Met à jour la position de toutes les gouttes, supprimant celles en dehors
               du canevas.
        """
        self.p5.background(50)
        for x, y, color in self.drops:
            self.p5.fill(color)
            self.p5.circle(x, y, self.D)
        self.drops = [ (x,y+self.speed,c) for x,y,c in self.drops if y < self.Y_LIMIT]

    @p5.hook
    def mousePressed(self, _event):
        """
        Crée une "goutte" verte à l'appui sur le bouton de gauche.
        """
        self._drop_color_if_inside('green')

    @p5.hook('mouseReleased')
    def mouse_something_with_alias(self, _event):
        """
        Crée une "goutte" blanche au relâchement du bouton de gauche.
        (Le nom de la méthode p5 côté JS est renseigné via l'argument du décorateur, ici)
        """
        self._drop_color_if_inside('white')


    def _drop_color_if_inside(self, color):
        """
        Ajoute une goutte avec la couleur données et à la position en cours,
        si dans le canevas, à la liste des gouttes à afficher.
        (Ceci n'est pas une méthode du module p5: pas besoin de décorateur)
        """
        x,y = self.p5.mouseX, self.p5.mouseY
        inside = 0 <= x < self.W and 0 <= y < self.H
        if inside:
            self.drops.append((x, y, color))

Drops()
