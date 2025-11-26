
from typing import Dict

from pyodide_mkdocs_theme.pyodide_macros import (
    PyodideMacrosPlugin,
    Msg, MsgPlural, TestsToken, Tip,
)
# import codex_hooks_logistic.parcours as parcours
from . import (
    IDE_versions,
    includer,               # has to be imported to trigger executions
)



def define_env(env:PyodideMacrosPlugin):
    """
    Macro hook function (equivalent to on_config plugin hook).
    """

    env.lang.overload({
        "delayed_reveal": Msg("Solution affichée dans {N} essai(s).", format='warning'),
    })

    def build_macros_for(macros_factories_with_env, *extra_args):
        """Register all the functions as macros"""
        for func in macros_factories_with_env:
            macro = func(env, *extra_args)
            env.macro(macro)


    build_macros_for([
        # insertion_remarque.version_ep,            # Obsolète
        IDE_versions.IDE_versions,
    ])

    # env.macro(recherche_macros.insert_recherche_controllers)

    # alien_macros.define_env(env)

    # EXOS, EXOS_IN_PARKOUR = liens_internes.define_env(env)

    # parcours_macros.define_env(env, EXOS, EXOS_IN_PARKOUR)

    # Alternative versions of IDE_versions macro:
    doubled = IDE_versions.IDE_versions(env)

    @env.macro                      # (no functools.wraps, to keep the function name!)
    def IDE_double(*a,**kw):
        return doubled(*a,**kw)

    @env.macro                      # (no functools.wraps, to keep the function name!)
    def double_IDE(*a,**kw):
        return doubled(*a,**kw)
