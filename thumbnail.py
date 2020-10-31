import PIL
import os
import os.path
import math
from PIL import Image, ExifTags

scale = 0.2
f_original = os.getcwd() + "/assets/img/original/"
f_thumbnail = os.getcwd() + "/assets/img/thumbnail/"

for file in os.listdir(f_original):
	f_img = f_original + file
	img = Image.open(f_img)
	img.thumbnail((400,400))
	#img = img.resize((math.ceil(img.size[0] * scale), math.ceil(img.size[1] * scale)), Image.ANTIALIAS)
	img.save(f_thumbnail + file)
	print(f_img + " converted")