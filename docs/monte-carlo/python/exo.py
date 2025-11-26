# --------- PYODIDE:env --------- #
from js import document
_prefixes_possibles = ["turtle", "tt"]
if "restart" in globals():
    restart()
else:
    for pref in _prefixes_possibles:
        if pref in globals():
            p = eval(pref)
            p.restart()
            break

def m_a_j():
    cible = "figure1"
    if "done" in globals():
        done()
        document.getElementById(cible).innerHTML = Screen().html
    else:
        for pref in _prefixes_possibles:
            if pref in globals():
                p = eval(pref)
                p.done()
                document.getElementById(cible).innerHTML = p.Screen().html
                break

# --------- PYODIDE:post_term --------- #
if any(pref in globals() for pref in _prefixes_possibles) and "m_a_j" in globals():
    m_a_j()


# --- PYODIDE:post --- #
if 'post_async' in globals():
    await post_async()

if 'Screen' in globals():
    if Screen().html is None:
        forward(0)
    m_a_j()
elif "turtle" in globals():
    if turtle.Screen().html is None:
        turtle.forward(0)
    m_a_j()

# --- PYODIDE:code --- #
from turtle import *
from random import *
from math import *

speed(0) #--> Change la vitesse du dessin par la plus rapide
#tracer(0) #--> Affiche le dessin fini sans les étapes de création


# ╔═══════════╗
# ║ Fonctions ║
# ╚═══════════╝

def dessiner_carre(x,y,longueur):
# ... A compléter

def dessiner_cercle(x,y,rayon):
# ... A compléter

def dessiner_points(x,y,couleur):
# ... A compléter
   
# ╔════════════════════╗
# ║ Début du programme ║
# ╚════════════════════╝

#Définition des variables
...

#Dessin du carré et du cercle

#Pour chaque points à dessiner
...
    #On définit aléatoirement des coordonées pour les points
   ...

   #calcul de la distance euclidienne
   ...
  
   #On vérifie si le point est dans le cercle et on applique la bonne couleur (en incrémentant total_interieur)
   ...
    
   #Dessin des points
   ...

getscreen().update() 

#Calcul de l'estimation de pi
...
done()
