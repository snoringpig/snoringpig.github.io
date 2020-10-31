---
layout: page
title: Gallery
permalink: /gallery/
---

<script src="https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js"></script>

<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/fancyapps/fancybox@3.5.7/dist/jquery.fancybox.min.css" />
<script src="https://cdn.jsdelivr.net/gh/fancyapps/fancybox@3.5.7/dist/jquery.fancybox.min.js"></script>

'To live is the rarest thing in the world.
Most people exist, that is all.' --Oscar Wilde.

{% assign thumbnailsurl = "/assets/img/thumbnail/" %}
{% assign imagesurl = "/assets/img/original/" %}
<div class ="row">
{% for col in site.data.images.cols %}
	<div class="col">
	{% for image in col.images %}
		<a href="{{ imagesurl }}{{ image.name }}" data-fancybox="gallery" data-caption="Yolo">
			<img src="{{ thumbnailsurl }}{{ image.name }}" />
	  </a>
	{% endfor %}
	</div>
{% endfor %}
</div>