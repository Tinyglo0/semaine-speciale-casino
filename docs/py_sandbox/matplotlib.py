# --- PYODIDE:code --- #
# Un import de matplotlib en tout premier est indispensable, pour que la classe
# PyodidePlot devienne disponible dans l'environnement:
import matplotlib.pyplot as plt
PyodidePlot("matplot_fig").target()     # Cible la figure dans laquelle tracer dans la page

# Préparer les données et tracer la figure.
xs = [ -5 + n*.25 for n in range(41) ]
ys = [ x**3 for x in xs ]

plt.plot(xs, ys, 'r-')
plt.grid()
plt.axhline()
plt.axvline()
plt.title("La fonction cube")
plt.show()