from matplotlib import colormaps
from matplotlib.colors import rgb2hex

import cmocean

# Use cmocean.cm.phase.

def calc_deg_colors(cmap):
    colors = [cmap(deg/180) for deg in range(180)]
    colors_rgb = [f"\"{rgb2hex(c)}\"" for c in colors]
    print("[" + ", ".join(colors_rgb) + "]")
