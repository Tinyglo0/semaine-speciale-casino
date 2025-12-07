---
title: Estimation de pi
args:
    IDE:
        TEST: skip
hide:
    - navigation
    - toc
---

# 🎲 Simulation de Lancers de Dés 
L'objectif de cet exercice est de compléter la fonction `simulation_lancers` dans le code Python ci-dessous. Cette fonction doit simuler le lancement d'un dé avec un nombre de faces spécifié, répété un certain nombre de fois.

Le programme actuel prend en entrée deux paramètres de l'utilisateur :

- Le nombre de lancers (nb_dé) que vous souhaitez effectuer.
- Le nombre de faces (faces) que possède le dé (par exemple, 6 pour un dé standard, 20 pour un dé de JDR, etc.).



!!! note "Travail à faire"

    Implémenter la logique manquante dans la fonction simulation_lancers(nb_dé, faces) :

    1. **Initialisation** : Vous devez initialiser une liste vide nommée lancers au début de la fonction. Cette liste stockera le résultat de chaque lancer.

    2. **Simulation des Lancers** : Vous devez créer une boucle qui s'exécutera autant de fois que le nombre de lancers demandé (nb_dé).

    3. **Résultat Aléatoire** : À chaque itération de la boucle, vous devez utiliser la bibliothèque standard random pour générer un nombre entier aléatoire entre 1 et le nombre de faces (faces), inclusivement.

    4. **Enregistrement** : Vous devez ajouter ce nombre aléatoire généré à la liste lancers.

    La fonction doit ensuite retourner la liste lancers contenant tous les résultats des simulations.

{{ IDE('python/exo') }}
