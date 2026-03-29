---
title: Estimation de pi
args:
    IDE:
        TEST: skip
hide:
    - navigation
    - toc

---

# Introduction

Une des méthodes pour estimer la valeur de $\pi$ est d'utiliser la méthode de Monte Carlo.

Il s'agit d'une technique statistique qui utilise des échantillons aléatoires pour résoudre des problèmes mathématiques complexes. Pour estimer la valeur de π, elle repose sur un principe géométrique simple.

# 1. Principe de base
## 1.1. Le cercle et le carré

!!! info "Rappels"

    Prenons un cercle de rayon 1 inscrit dans un carré de rayon 1 dont les côtés mesurent 2 unités.

    Le carré a donc une aire de 2 $\times$ 2 = 4 et le cercle a une aire de
    $\pi \times r^{2}$ = $\pi \times 1^{2} = \pi.$

## 1.2. Échantillonnage Aléatoire :


Nous allons générer des points aléatoires à l'intérieur du carré. Pour chaque point, nous déterminons s'il se trouve à l'intérieur du cercle.

Un point $(x,y)$ est à l'intérieur du cercle si $\sqrt{x^{2} + y^{2}} \leq 1$.

# 2. Calcul de $\pi$
## 2.1. Estimation

Si nous générons $N$ points au total et que $M$ d'entre eux se trouvent à l'intérieur du cercle, alors le rapport des points à l'intérieur du cercle par rapport au total des points nous donne une estimation de l'aire du cercle par rapport à celle du carré :



$$\frac{M}{N} \approx \frac{\text{ Aire du cercle }}{\text{ Aire du carré }} = \frac{\pi}{4}$$



En arrangeant cette formule, on peut estimer $\pi \approx 4 \times \frac{M}{N}$.

!!! note "Le programme ci-dessous reprend la structure décrite ci-dessus."

Votre tâche consiste à compléter le fichier afin de d'afficher
l'estimation de $\pi$ et le dessin correspondant.

Le fichier est composé de deux parties : Les fonctions et le programme
principal.

# 3. Les fonctions

!!! example "Vous devez complétez les trois fonctions suivantes :"
    - **dessiner_carre(x,y,longueur)** : Elle dessine une carre à une
      position ($x,y$) en fonction du rayon du cercle.

    - **dessiner_cercle(x,y,rayon)** : Elle dessine un cercle à une position
      ($x,y$) en prenant en compte son rayon.

    - **dessiner_points(x,y,couleur)**: Elle dessine un un point à une
      position ($x,y$) avec une couleur donnée.

# 4. Le programme principal

???+ info "Voici les différentes étapes du programme que vous devez réalisez:"
    1.  Création et initialisation des variable suivantes:

        - rayon

        - couleur

        - total (il s'agira du nombre de points total : cercle + carré)

        - total_interieur (seulement les points du cercle)
    2.  Création du carré et du cercle à l'aide des fonctions précédemment créées.

    3.  Pour le nombre total de points à dessiner:

        - Choisir $x$ et $y$ de manière aléatoire

        - Calcul de la distance des points pour savoir si on est dans le cercle ou non

        - Choix de la couleur en fonction de la position du points (et incrémentation de la variable total_interieur le cas échéant)

        - Dessin des points

    4.  Calcul de l'estimation de $\pi$ et affichage du résultat dans la console python.

    ??? example "Logigramme du programme"
        ```mermaid
            flowchart TD
            A([Début du programme]) --> B[Initialisation :<br>rayon=180,<br>total=2500, total_interieur=0]
            
            B --> C[Appel : dessiner_carre]
            C --> D[Appel : dessiner_cercle]
            
            D --> E{Boucle : Pour chaque point<br>de 1 à 2500}
            
            E -- Point suivant --> F[Générer des coordonnées aléatoires]
            F["Générer des coordonnées aléatoires<br>pour x et y"] --> G["Calculer la distance euclidienne"]
            G --> H{"Le point est-il dans le cercle ?<br>(distance < rayon)"}
            
            H -- Oui --> I[couleur = Rouge<br>Incrémenter total_interieur de 1]
            H{"Le point est-il dans le cercle ?"} -- Non --> J[couleur = Bleu]
            
            I["couleur = Rouge<br>Incrémenter total_interieur de 1"] --> K[Appel : dessiner_points<br>avec la couleur définie]
            J --> K
            
            K --> E
            
            E -- Boucle terminée --> L[Mettre à jour l'affichage graphique]
            L --> M["Calculer l'estimation de pi"]
            M --> N[Afficher le résultat de l'estimation dans la console]
            N --> O([Fin du programme])

            %% Styles optionnels pour rendre le diagramme plus lisible
            style A fill:#4CAF50,stroke:#388E3C,stroke-width:2px,color:white
            style O fill:#F44336,stroke:#D32F2F,stroke-width:2px,color:white
            style E fill:#FF9800,stroke:#F57C00,stroke-width:2px,color:white
            style H fill:#FF9800,stroke:#F57C00,stroke-width:2px,color:white
        ```

{{ IDE('python/exo') }}

{{ figure(admo_title="Résultat de programme") }}
