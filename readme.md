semanticText
===

How to run
---

Copy the contents of semanticText.js and paste into a browser console. Run the
code.

What it does
---

Finds all text nodes that are not purely white space and evaluates them against
their parent node's node name. In the case where a parent node is a span the
span's parent node is evaluated. If that node is a span it's parent node is
evaluated.

* A first list provides text content that is poorly described by its HTML parent node.
* A second list provides text content that is well described by an inline element but poorly described there after.
* A third list provides all text content in the order in which it occurs in the DOM so that text can read according to its order in the code.

Dependency
---

This tool uses and includes [getNodesByType](https://github.com/prettydiff/getNodesByType) to walk the DOM

License
---

MIT License
