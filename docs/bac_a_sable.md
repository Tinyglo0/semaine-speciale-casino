---
title: Bac à sable
hide:
    - toc
    - navigation
args:
    IDE:
        TEST: skip
---

Des éditeurs dans lesquels faire des essais quelconques...
<br>_Pour tout essai utilisant des figures, il est conseillé de passer en [mode 2 colonnes](https://frederic-zinelli.gitlab.io/pyodide-mkdocs-theme/user_help/#user-editors){: target=_blank }._


=== "Bac à sable"

    {{ IDE('py_sandbox/await_sandbox', MIN_SIZE=10, MERMAID=True) }}

    ??? help "Essais async"
        Il est possible de réaliser des essais avec des fonctions `async` si une fonction `#!py async def post_async(): ...` est définie dans cet IDE. Elle sera automatiquement appelée durant l'étape `post` des exécutions.

=== "`tortue`"

    {{ IDE('py_sandbox/tortue_sandbox') }}

    {{ figure(admo_title="Pour des essais avec des figures (ID: figure1)") }}

    ??? help "Contenu du fichier python"

        {{ py('py_sandbox/tortue_sandbox') }}

=== "`p5`"

    <br>

    Il est possible d'utiliser la seconde figure en bas de la page pour une second animation, si on le souhaite. Utiliser dans ce cas `#!py target="figure1"` et `#!py stop_others=False` pour les arguments de l'appel à `run(...)`.

    <br>

    {{ IDE('py_sandbox/p5_sandbox', MIN_SIZE=35) }}

    {{ figure("figure_p5", admo_title="Passer la souris au-dessus du canevas", inner_text='') }}


=== "`p5.Sketch`"

    <br>

    Il est possible d'utiliser la seconde figure en bas de la page pour une second animation, si on le souhaite. Utiliser dans ce cas `#!py target="figure1"` et `#!py stop_others=False` pour les arguments de l'appel à `run(...)`.

    <br>

    {{ IDE('py_sandbox/p5_sketch_sandbox') }}

    {{ figure("figure_p5_sketch", admo_title="Cliquer sur le canevas...", inner_text='') }}


=== "`mermaid`"

    {{ IDE('py_sandbox/mermaid') }}

    {{ figure("mermaid_fig", inner_text='', admo_kind="", div_class="center") }}


=== "`matplotlib`"

    {{ IDE('py_sandbox/matplotlib') }}

    {{ figure("matplot_fig")}}


<br>

---

??? tip "Essais concernant les figures"

    Cette page permet de faire des essais concernant les fonctionnalités liées à :

    * [`turtle`](https://docs.python.org/3/library/turtle.html){ target=_blank }
    * [`matplotlib`](https://frederic-zinelli.gitlab.io/pyodide-mkdocs-theme/custom/matplotlib/){ target=_blank }
    * [`mermaid`](https://frederic-zinelli.gitlab.io/pyodide-mkdocs-theme/custom/mermaid/){ target=_blank }
    * [`p5`](https://frederic-zinelli.gitlab.io/pyodide-mkdocs-theme/p5_processing/how_to/){ target=_blank }

