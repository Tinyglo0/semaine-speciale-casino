
from pathlib import Path
from pyodide_mkdocs_theme.pyodide_macros import PyodideMacrosPlugin


# --- HACK ---
# (Allow rendering macros in REMs files)
from pyodide_mkdocs_theme.pyodide_macros.parsing import add_indent
from pyodide_mkdocs_theme.pyodide_macros.macros.ide_ide import Ide


rems_renderer = None

def hack_rem_inclusion(self:Ide, rem_kind:str):
    global rems_renderer
    if not rems_renderer:
        rems_renderer = renderer(self.env)

    content  = getattr(self, rem_kind)
    location = f"{ self.env.page.file.src_uri }:{ rem_kind }"
    rendered = rems_renderer(content, location, self.env.page.file.src_uri, skip_indent=True)
    return rendered

Ide._rem_inclusion = hack_rem_inclusion   # pylint: disable=protected-access

# --- HACK ---





MD_INCLUDE_PATH = []

def renderer(env:PyodideMacrosPlugin):

    def _render_inner_macros(content, disk_location='<unknown>', src:Path=None, *, extra="", skip_indent=False):
        """
        Render macros recursively.
        - Works at any depth (computation cost, though...).
        - When different files are used (@src), raises an error if circular references are found.

        @disk_location: informational/debugging purpose.
        @src:   Allow to spot infinite/circular files/macros rendering.
        @extra: Additional indent to use for the rendered content.
        @skip_indent: The REM hack rendering must not handle indentation, because the Ide itself
        will apply it.
        """

        need_indents = not skip_indent and env.is_macro_with_indent()

        if need_indents:
            indentations = env._parser.parse(content, disk_location)
            env._indents_store += [*reversed(indentations)]

        template = env.env.from_string(content)
        if src is not None:
            MD_INCLUDE_PATH.append(src)
        try:
            rendered = template.render(**env.variables)
        finally:
            if src is not None:
                MD_INCLUDE_PATH.pop()

        indent = need_indents and env.get_macro_indent()
        if indent:
            rendered = add_indent(rendered, indent)
        return rendered

    return _render_inner_macros




def md_include(env:PyodideMacrosPlugin):

    _render_inner_macros = renderer(env)

    def md_include(src:str, extra='', **__):
        """
        Équivalent à `---8<--- "src"`, mais avec un rendu automatic (récursif) des macros.

        @src:   Fichier md à inclure (relatif au cwd)
        @extra: Deprecated in PMT, but not here, because the included file doesn't hold the
                indentation info otherwise. This is because I _FAKE_ the macro call, while
                in PMT, the markdown actually contains it when needed.
        """
        path     = Path(src)
        disk_loc = str( env.docs_dir_cwd_rel / path )
        content  = Path(path).read_text(encoding='utf-8')
        rendered = _render_inner_macros(content, disk_loc, src, extra=extra)
        return rendered

    return md_include
