---
title: Roulette
args:
    IDE:
        TEST: skip
hide:
    - navigation
    - toc

---
# Introduction

La roulette est un jeu de hasard populaire dans les casinos. Une roue numérotée de 0 à 36 tourne, et une bille est lancée. Le joueur mise sur un nombre, une  couleur (rouge/noir), ou d’autres types de paris.

La mise remportée diffère en fonction des combinaisons. 

???+ info "L'animation ci-dessous montre les cotes possibles en fonction des paris placés:"
    <div id="roulette-guide"></div>

???+ tip "Voici un exemple de roulette :" 
    <div id="roulette-game" style="min-height: 700px;"></div>


Dans cette activité, vous allez programmer une simulation simplifiée d’une roulette où :

- L’utilisateur mise une somme sur un numéro entre 0 et 36.
- La roulette tourne et génère un nombre aléatoire entre 0 et 36.
- Si le numéro correspond, l’utilisateur gagne 35 fois sa mise, sinon il perd.

On affichera le résultat de la partie et le solde du joueur à la fin du programme.

!!! info "Travail à faire"

    1. Complétez le code ci-dessous en remplissant les parties manquantes (TODO).
    2. Testez le programme en effectuant plusieurs parties.
    3. (Pour les plus avancés) : Vous pouvez faire en sorte de demander si l'utilisateur souhaite miser sur plusieurs nombres et vous calculerez les cotes appropriées (cf animation plus haut)

!!! warning "Lors de l’exécution du code"
    Une fois le code complété, vous pouvez le copier sur VsCode ou Thonny afin que programme soit plus fluide dans les interactions avec l'utilisateur.
{{ IDE('python/exo') }}


