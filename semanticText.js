(function () {
    var getNodesByType = function (typeValue) {
            "use strict";
            var types     = 0,
                valueTest = (typeof typeValue === "string") ? typeValue.toUpperCase() : "",
                root      = this;
            typeValue = typeValue.toLowerCase();
            if (typeValue === "all") {
                types = 0;
            } else if (typeValue === "element_node") {
                types = 1;
            } else if (typeValue === "attribute_node") {
                types = 2;
            } else if (typeValue === "text_node") {
                types = 3;
            } else if (typeValue === "cdata_section_node") {
                types = 4;
            } else if (typeValue === "entity_reference_node") {
                types = 5;
            } else if (typeValue === "entity_node") {
                types = 6;
            } else if (typeValue === "processing_instruction_node") {
                types = 7;
            } else if (typeValue === "comment_node") {
                types = 8;
            } else if (typeValue === "document_node") {
                types = 9;
            } else if (typeValue === "document_type_node") {
                types = 10;
            } else if (typeValue === "document_fragment_node") {
                types = 11;
            } else if (typeValue === "notation_node") {
                types = 12;
            }
            if (isNaN(valueTest) === false && (valueTest.length === 1 || valueTest === "10" || valueTest === "11" || valueTest === "12")) {
                types = Number(valueTest);
            }
            if (valueTest === "" && (typeValue === 0 || typeValue === 1 || typeValue === 2 || typeValue === 3 || typeValue === 4 || typeValue === 5 || typeValue === 6 || typeValue === 7 || typeValue === 8 || typeValue === 9 || typeValue === 10 || typeValue === 11 || typeValue === 12)) {
                types = typeValue;
            }
            if (root === document) {
                root = document.documentElement;
            }
            return (function () {
                var output = [],
                    child  = function (x) {
                        var atty = [],
                            a    = x.childNodes,
                            b    = a.length,
                            c    = 0,
                            d    = 0,
                            e    = 0;
                        for (c = 0; c < b; c += 1) {
                            if (a[c].nodeType === types || types === 0) {
                                output.push(a[c]);
                            }
                            if (a[c].nodeType === 1) {
                                if (types === 2 || types === 0) {
                                    atty = a[c].attributes;
                                    d    = atty.length;
                                    for (e = 0; e < d; e += 1) {
                                        output.push(atty[e]);
                                    }
                                }
                                child(a[c]);
                            }
                        }
                    };
                child(root);
                return output;
            }());
        },
        el             = [],
        len            = 0,
        a              = 0;
    document.getNodesByType = getNodesByType;
    el                      = document.getNodesByType(1);
    len                     = el.length;
    for (a = 0; a < len; a += 1) {
        el[a].getNodesByType = getNodesByType;
    }
}());
var body = document.getElementsByTagName("body")[0],
    textParent = function () {
        var text = body.getNodesByType(3),
            a = 0,
            b = text.length,
            parent = {},
            parents = [],
            bad = [],
            output = [],
            inline = [],
            output = [],
            badness = function (x) {
                var bads = ["div", "body", "span", "noscript", "i", "b", "u", "font", "center", "small", "big", "blink", "strike", "tt"],
                    badlen = bads.length,
                    y = 0;
                for (y = 0; y < badlen; y += 1) {
                    if (x === bads[y]) {
                        return true;
                    }
                }
                return false;
            },
            style = document.createElement("style"),
            div = document.createElement("div");
        for (a = 0; a < b; a += 1) {
            parent = text[a].parentNode.nodeName.toLowerCase();
            if ((/^(\s+)$/).test(text[a].textContent) === true || parent === "script" || parent === "style") {
                text.splice(a, 1);
                b -= 1;
                a -= 1;
            } else {
                text[a].textContent = text[a].textContent.replace(/^(\s+)/, " ");
                if (parent === "span") {
                    parent = text[a].parentNode.parentNode.nodeName.toLowerCase();
                    if (parent === "span") {
                        parent = text[a].parentNode.parentNode.parentNode.nodeName.toLowerCase();
                    }
                }
                parents.push(parent);
            }
        }
        for (a = 0; a < b; a += 1) {
            if (badness(parents[a]) === true) {
                bad.push([parents[a], text[a]]);
            } else if (parents[a] === "a" || parents[a] === "em" || parents[a] === "strong") {
                parent = text[a].parentNode.parentNode.nodeName.toLowerCase();
                if (parent === "span") {
                    parent = text[a].parentNode.parentNode.nodeName.toLowerCase();
                    if (parent === "span") {
                        parent = text[a].parentNode.parentNode.parentNode.nodeName.toLowerCase();
                    }
                }
                if (badness(parent) === true) {
                    inline.push([parent, text[a]]);
                }
            }
        }
        output.push("#textAnalysis{display:block;position:absolute;background:#fff;height:80em;width:80em;font-size:10px;overflow:scroll;top:5em;left:5em;z-index:100000;padding:1em 2em;border:0.1em solid #333;box-shadow:0 1em 5em}");
        output.push("#textAnalysis ol{}");
        output.push("#textAnalysis li, p{font-size:1.4em;padding:0;margin:0 0 1em}");
        output.push("#textAnalysis p{font-weight:bold}")
        output.push("#textAnalysis li{list-style-position:inside}");
        output.push("#textAnalysis div{border: 0.1em solid #999;padding:1em;margin:0 0 1em;}");
        output.push("#textAnalysis code{background:#fe9}");
        output.push("#textAnalysis em{color:#00c}");
        output.push("#textAnalysis strong{color:#c00}");
        output.push("#textAnalysis h1,h2{color:#070;position:static;float:none;border-style:none}");
        output.push("#textAnalysis h1{font-size:3em}");
        output.push("#textAnalysis #textAnalysis-close{position:absolute;right: 2em; top:1em;background:#900;font-size:1.4em;color:#fff;padding:0.5em;margin:0;width:7em}");
        style.setAttribute("type", "text/css");
        style.innerHTML = output.join("");
        document.getElementsByTagName("head")[0].appendChild(style);
        output = [];
        output.push("<h1>Sematic Analysis of Page Text</h1>");
        output.push("<button id='textAnalysis-close' onclick='this.parentNode.parentNode.removeChild(this.parentNode);'>Close this</button>");
        output.push("<div><h2>Text With Virtually No Description</h2> <p>This first list points to text that is poorly described with little or no hope of salvation.</p> <p><strong>");
        b = bad.length;
        output.push(b);
        output.push("</strong> instances.</p> <ol>");
        for (a = 0; a < b; a += 1) {
            output.push("<li><code>");
            output.push(bad[a][1].textContent.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"));
            output.push("</code> is poorly described by parent <em>");
            output.push(bad[a][0]);
            output.push("</em></li>");
        }
        output.push("</ol></div>");
        output.push("<div><h2>Text Well Described Inline, But Poorly Structured</h2> <p>This list points out text whose immediate parent is a proper inline element, but whose block level element fails to provide further description.</p> <p><strong>");
        b = inline.length;
        output.push(b);
        output.push("</strong> instances.</p> <ol>");
        for (a = 0; a < b; a += 1) {
            output.push("<li><code>");
            output.push(inline[a][1].textContent.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"));
            output.push("</code> is poorly described by parent <em>");
            output.push(inline[a][0]);
            output.push("</em></li>");
        }
        output.push("</ol></div>");
        output.push("<div><h2>All text in page order.</h2> <p>All text is analyzed in the order in which it resides in the page. If the text is not understandable according to this this ordering <strong>then it is not accessible</strong>.</p> <p><strong>");
        b = text.length;
        output.push(b);
        output.push("</strong> instances.</p> <ol>");
        for (a = 0; a < b; a += 1) {
            output.push("<li><code>");
            output.push(text[a].textContent.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"));
            output.push("</code></li>");
        }
        output.push("</ol></div>");
        div.setAttribute("id", "textAnalysis");
        div.innerHTML = output.join("");
        body.appendChild(div);
    };
textParent();
