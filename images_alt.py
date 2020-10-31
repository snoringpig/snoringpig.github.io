import os
import contextlib
import math
import PIL
from math import ceil

N_COL = 4
output = "output"
output_txt = output + ".txt"

with contextlib.suppress(FileNotFoundError):
	os.remove(output_txt)

list = sorted(os.listdir(os.getcwd() + "/assets/img/original/"))
n_files = len(list)
print(n_files)

n_images_col_max = ceil(n_files/4)
stops = [i * n_images_col_max for i in range(N_COL)]
stops.append(n_files)

f = open(output_txt, "a")
f.write("cols:" + '\n')
for i in range(N_COL):
	f.write("- id: col_" + str(i) + '\n')
	f.write("  images:" + '\n')
	for j in range(stops[i], stops[i+1]):
		f.write("  - name: " + list[j] + '\n')
		print("  - name: " + list[j])
f.close()