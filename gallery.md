---
layout: page
title: Gallery
permalink: /gallery/
---
(setq markdown-css-paths '('/assets/main.scss'))

'To live is the rarest thing in the world.
Most people exist, that is all.' --Oscar Wilde.

{% assign imagesurl = "/assets/img/" %}
<div class ="row">
{% for col in site.data.images.cols %}
	<div class="col">
	{% for image in col.images %}
		<a href="{{ imagesurl }}{{ image.name }}">
			<img src="{{ imagesurl }}{{ image.name }}" />
	  </a>
	{% endfor %}
	</div>
{% endfor %}
</div>