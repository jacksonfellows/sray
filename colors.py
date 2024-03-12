from matplotlib import colormaps
from matplotlib.colors import rgb2hex

import cmocean

# Use cmocean.cm.phase.

def calc_deg_colors(cmap, max_deg):
    colors = [cmap(deg/max_deg) for deg in range(max_deg)]
    colors_rgb = [f"\"{rgb2hex(c)}\"" for c in colors]
    print("[" + ", ".join(colors_rgb) + "]")
