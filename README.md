## tincalc

**tincalc** is a tiny calculator implemented in JavaScript.

### Features

* Supporing natural math expressions with parentheses
* Easy-to-use panel
* Attractive and customizable appearance

### Usage

First load `tincalc.js` in the head of your HTML document:

	<script src="/path/to/tincalc.js"></script>

Then in JavaScript invoke the function `createTincalc()` to change an HTML element into an entity of tincalc. Here is an example:

	<script>
		createTincalc(document.getElementById('tincalc'));
	</script>

Besides, you may set a class name of `tincalc` for the elements to be tincalcs. For example:

	<div class="tincalc" id="tincalc1"></div>
	<div class="tincalc" id="tincalc2"></div>
	<div class="tincalc" id="tincalc3"></div>
	<script>
		createTincalc();
	</script>

That will let `tincalc1`, `tincalc2` and `tincalc3` all be tincalcs.

### Styles

In order to make tincalc pleasant to look at, it is highly recommended to configure the style of it using CSS.

There is a default style provided in the repository, and you may use it directly by simply making a link to it in your HTML documents.

You may configure the style yourself, by modifying the default CSS or creating your own CSS. There are a few class names set for the convenience of customizing the style:

* `tincalc` for the whole tincalc block
* `tincalc-field` for the screen field which displays the math expressions and answers in it
* `tincalc-bar` for the bar with warnings or erros claimed in it
* `tincalc-panel` for the operating panel containing the buttons
* `tincalc-btn` for the buttons

If you are still not cleared, you can try to read the CSS provided as the default style configuration and learn from it.

