import re
from string import ascii_letters
from itertools import count, product
from typing import Any, Optional, Tuple, Union

from pyodide_mkdocs_theme.pyodide_macros import PyodideMacrosPlugin
from pyodide_mkdocs_theme.pyodide_macros.parsing import add_indent

from .includer import renderer





def _IDE_groups_gen():
    """
    Infinite generator of groups ids/references (global to the whole site instead of a single
    page only for the sake of simplicity...).
    """
    for n in count(1):
        yield from map(''.join, product(ascii_letters, repeat=n))

GROUP_ID_GEN = _IDE_groups_gen()





# REMARQUE concernant le fonctionnement de IDE_versions:
#
#   Cette macro génère en fait le code markdown qu'on taperait à la main pour créer les deux
#   IDEs, puis calcule le rendu du markdown en question et en renvoie le résultat.

def IDE_versions(env:PyodideMacrosPlugin):

    _render_inner_macros = renderer(env)


    def IDE_versions(
        *py_n: Union[str, Tuple[str,str]],
        title1 = "Version vide",
        title2 = "Version à trous",
        preferred:int = 0,
        **kwargs
        # Any of the usual IDE macro arguments, as kwargs,
        # title_N or titleN: str = "",
        # header_N or headerN: str = "",
        # tail_N or tailN: str = "",
        # ide_N or ideN:  Dict[str,Any]  = None,        # specific to one IDE only
    ):
        """
        Crée des IDEs dans des onglets.

        @*py_n: Autant d'arguments que d'IDEs nécessaires. Chacun est:
                * soit str: le chemin vers le fichier python principal
                * soit (str,str): le chemin vers le fichier python et le titre pour l'onglet.

        @title1 & title2: titres par défaut pour les deux premiers onglets (cas le plus courant)
                Ces arguments ont la priorité minimale, si le titre peut être définit de plusieurs
                façons (voir ci-dessous).

        @preferred=0: numéro de l'IDE qui devrait être fait en priorité dans l'exercice.
                Par défaut, le 1er est prioritaire. ATTENTION: "numéro", pas "indice" !
                Utiliser 0 pour ne pas indiquer d'IDE "préféré"

        @**kwargs: Peut comprendre tous les arguments classiques des macros IDEs (MAX, ID, ...).
                Ces arguments s'appliqueront à tous les IDEs.
                Peut également prendre d'autres valeurs pour différencier les réglages des IDEs:

                    - @titleN="" ou @title_N="" : pour définir le titre de l'onglet. Ce type de
                      titre est prioritaire sur sur les valeurs par défaut, mais pas sur les
                      titres définis via @*py_n.

                    - @headerN="" ou @header_N="" : Permet d'ajouter du contenu markdown avant
                      l'IDE, dans l'onglet. Le markdown est indenté automatiquement => à écrire
                      avec un niveau d'indentation nul.

                    - @tailN="" ou @tail_N="" : Permet d'ajouter du contenu markdown après l'IDE,
                      dans l'onglet. Le markdown est indenté automatiquement => à écrire avec un
                      niveau d'indentation nul.

                    - @ideN={} ou @ide_N={} : dictionnaires permettant d'appliquer des
                      arguments/réglages à un IDE spécifiquement, N étant le numéro de l'IDE
                      (ATTENTION: "numéro", pas "indice" !). Ces dictionnaires acceptent :
                        - Les arguments classiques des macros IDE (ID, TEST, MAX, ...)
                        - @title: un titre pour l'onglet. Cet argument est prioritaire sur @titleN
                          et @title_N, déclarés dans kwargs et les valeurs par défaut, @title1 et
                          @title2.
                        - @header="" : Permet d'ajouter du contenu markdown avant l'IDE, dans
                          l'onglet. Le markdown est indenté automatiquement => à écrire avec un
                          niveau d'indentation nul. Cet argument est prioritaire sur @headerN et
                          @header_N, déclarés dans kwargs.
                        - @tail="" : Permet d'ajouter du contenu markdown après  l'IDE, dans
                          l'onglet. Le markdown est indenté automatiquement => à écrire avec un
                          niveau d'indentation nul. Cet argument est prioritaire sur @tailN et
                          @tail_N, déclarés dans kwargs.

        Concernant les titres, si aucun n'est fourni pour des IDEs après les 2 premiers, le titre
        par défaut `f"Version { N }"` est utilisé.
        """
        common = {
            k: v for k,v in kwargs.items()
                 if not re.fullmatch(r'(?:title|ide|header|tail)_?\d+', k)
        }
        markdown = []
        run_group = next(GROUP_ID_GEN)
        for n,ide in enumerate(py_n,1):

            py_name, title = (ide,None) if isinstance(ide,str) else ide
            ide_n: dict = _extract_key_and_cleanup('ide', n, {}, kwargs, {})
            header: str = _extract_key_and_cleanup('header', n, '', kwargs, ide_n)
            tail:   str = _extract_key_and_cleanup('tail', n, '', kwargs, ide_n)
            title = (
                title
                or _extract_key_and_cleanup('title', n, "", kwargs, ide_n)
                or n==1 and title1
                or n==2 and title2
                or f"Version { n }"
            )

            md = _make_IDE_md(common, n==preferred, py_name, title, header, tail, ide_n, run_group)
            markdown.append(md)

        content  = ''.join(markdown)
        rendered = _render_inner_macros(content)
        return rendered

    return IDE_versions







def _make_args(options: Optional[dict], common: dict, run_group):
    """
    Recreate the IDE's macro keyword arguments equivalent to the given dicts (options
    are overriding values from common).
    """
    options = {'RUN_GROUP':run_group, **common, **options}
    args = ''.join( f', {k}={v!r}' for k,v in options.items() if v is not None )
    return args



def _extract_key_and_cleanup(key, n, default:Any, kwargs:dict, ideN:dict):
    """
    Extract the first key/value found, or use the default value.
    Once the needed value has been fund, remove any possible item left in any of the dicts
    (these items would result in invalid macros arguments).
    """
    k_N, kN = f"{ key }_{ n }", f"{ key }{ n }"
    data    = [(ideN, key), (kwargs, k_N), (kwargs, kN)]
    out     = next( (d[k] for d,k in data if k in d), default)
    for d,k in data:
        if k in d:
            d.pop(k)
    return out



def _format_extra_md(md:str):
    """
    Format any header or tail md content.
    """
    if md:
        md = add_indent("\n\n" + md + "\n", '    ')
    return md



def _make_IDE_md(common, is_preferred, py_name, title, header, tail, kwargs_n, run_group):
    """
    Build the markdown code to insert the given IDE in a tabbed content, with the given infos.
    """
    macro_args = _make_args(kwargs_n, common, run_group + '*'*is_preferred)
    header = _format_extra_md(header)
    tail   = _format_extra_md(tail)
    pref   = ' :octicons-goal-24:{ title="Version à privilégier" }' * is_preferred
    md = f"""\n\n=== "{ title }{ pref }"{ header }\n\n    { "{{" }IDE({py_name!r}{ macro_args }){ "}}" }{ tail }\n"""
    return md
