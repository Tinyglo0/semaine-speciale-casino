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

import random

# ╔══════════╗
# ║ Fonction ║
# ╚══════════╝

def jouer_roulette(solde):
    print("Bienvenue au casino ! Votre solde actuel est de",solde," CHF.")
    continuer_jouer = "oui"

    #Tant que le joueur a de l'argent sur son compte et qu'il décide de jouer
    while (solde > 0 and continuer_jouer == "oui"):

        # Demande au joueur de miser
        mise = int(input("Entrez votre mise : "))
        while mise <= 0 or mise > solde:
            print("Mise invalide !")
            mise = int(input("Entrez votre mise : "))
        
       # Choix du numéro par le joueur
        numero_joueur = int(input("Choisissez un numéro entre 0 et 36 : "))
        while numero_joueur < 0 or numero_joueur > 36:
            print("Numéro invalide !")
            numero_joueur = int(input("Choisissez un numéro entre 0 et 36 : "))

        # Lancement de la roulette
        numero_gagnant = random.randint(0, 36)
        print("La roulette tourne... et le numéro gagnant est ",numero_gagnant," !")

        # Vérification du résultat
        if numero_joueur == numero_gagnant:
            # ... TODO : Calculer les gains (35 fois la mise) et mettre à jour le solde
            print("Félicitations ! Vous avez gagné !")
            # TODO : Afficher le nouveau solde
        else:
            # TODO : Retirer la mise du solde
            print("Dommage, vous avez perdu.")

        # TODO : Afficher le nouveau solde
        if(solde > 0 ):
            ... # TODO : Demander si le joueur souhaite continuer à jouer
        return solde

# ╔════════════════════╗
# ║ Début du programme ║
# ╚════════════════════╝

solde_joueur = 100  # Solde initial du joueur
solde_joueur = jouer_roulette(solde_joueur)


