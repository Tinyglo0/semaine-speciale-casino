# --- PYODIDE:code --- #
# Un import de matplotlib en tout premier est indispensable, pour que la classe
# PyodidePlot devienne disponible dans l'environnement:
import matplotlib.pyplot as plt
PyodidePlot("plot_fig").target()     # Cible la figure dans laquelle tracer dans la page

# Données : Températures moyennes simulées (30 jours)
jours = list(range(1, 31))
temp_avril = [12, 14, 13, 15, 17, 16, 15, 14, 13, 15, 18, 19, 20, 18, 17, 16, 15, 14, 15, 16, 18, 20, 21, 22, 21, 20, 19, 18, 17, 18]
temp_mai = [18, 19, 20, 22, 21, 20, 19, 21, 23, 24, 25, 24, 23, 22, 24, 25, 26, 27, 25, 24, 23, 22, 21, 23, 25, 26, 27, 28, 26, 25]

# 2. On trace les deux courbes
plt.plot(jours, temp_avril, label="Avril", color="skyblue", linewidth=2, marker='o', markersize=4)
plt.plot(jours, temp_mai, label="Mai", color="orange", linewidth=2, marker='s', markersize=4)

# 3. Personnalisation du graphique
plt.title("Évolution des températures : Avril vs Mai")
plt.xlabel("Jour du mois")
plt.ylabel("Température (°C)")
plt.grid(True)
plt.legend() # Affiche la légende

# 4. Affichage (Pyodide l'envoie dans le canvas)
plt.show()