var textParent = function () {
    "use strict";
    const text = (function () {
            const textOutput = [],
                child  = function (x) {
                    const aa    = x.childNodes,
                        bb    = aa.length;
                    let c    = 0;
                    if (bb > 0) {
                        do {
                            if (aa[c].nodeType === 3) {
                                textOutput.push(aa[c]);
                            }
                            if (aa[c].nodeType === 1) {
                                child(aa[c]);
                            }
                            c = c + 1;
                        } while (c < bb);
                    }
                };
            child(document.documentElement);
            return textOutput;
        }()),
        parents = [],
        bad = [],
        inline = [],
        badness = function (x) {
            const bads = ["div", "body", "span", "noscript", "i", "b", "u", "font", "center", "small", "big", "blink", "strike", "tt"],
                badLen = bads.length;
            let y = 0;
            do {
                if (x === bads[y]) {
                    return true;
                }
                y = y + 1;
            } while (y < badLen);
            return false;
        },
        button = function () {
            const style=document.getElementById("semanticText-style"),
                div=document.getElementById("textAnalysis");
            div.parentNode.removeChild(div);
            style.parentNode.removeChild(style);
        },
        grab = function dom_event_grab(event) {
            const x = event.srcElement || event.target,
                box = x.parentNode,
                body = box.getElementsByTagName("div")[0],
                max = document.getElementsByTagName("body")[0].clientHeight,
                touch = (event !== null && event.type === "touchstart"),
                mouseEvent = event,
                touchEvent = event,
                mouseX = (touch === true)
                    ? 0
                    : mouseEvent.clientX,
                mouseY = (touch === true)
                    ? 0
                    : mouseEvent.clientY,
                touchX = (touch === true)
                    ? touchEvent.touches[0].clientX
                    : 0,
                touchY = (touch === true)
                    ? touchEvent.touches[0].clientY
                    : 0,
                drop = function dom_event_grab_drop(e) {
                    const headingWidth = box.getElementsByTagName("h1")[0].clientWidth;
                    boxLeft = box.offsetLeft;
                    boxTop = box.offsetTop;
                    if (touch === true) {
                        document.ontouchmove = null;
                        document.ontouchend = null;
                    }
                    else {
                        document.onmousemove = null;
                        document.onmouseup = null;
                    }
                    if (boxTop < 10) {
                        box.style.top = "1em";
                    } else if (boxTop > (max - 40)) {
                        box.style.top = ((max / 10) - 4) + "em";
                    } else {
                        box.style.top = (boxTop / 10) + "em";
                    }
                    if (boxLeft < ((headingWidth * -1) + 40)) {
                        box.style.left = (((headingWidth * -1) + 40) / 10) + "em";
                    }
                    box.style.boxShadow = "0 1em 5em";
                    body.style.opacity = "1";
                    e.preventDefault();
                    return false;
                },
                boxMoveTouch = function dom_event_grab_boxMoveTouch(f) {
                    f.preventDefault();
                    box.style.right = "auto";
                    box.style.left = ((boxLeft + (f.touches[0].clientX - touchX)) / 10) + "em";
                    box.style.top = ((boxTop + (f.touches[0].clientY - touchY)) / 10) + "em";
                    document.ontouchend = drop;
                    return false;
                },
                boxMoveClick = function dom_event_grab_boxMoveClick(f) {
                    f.preventDefault();
                    box.style.right = "auto";
                    box.style.left = ((boxLeft + (f.clientX - mouseX)) / 10) + "em";
                    box.style.top = ((boxTop + (f.clientY - mouseY)) / 10) + "em";
                    document.onmouseup = drop;
                    return false;
                };
            let boxLeft = box.offsetLeft,
                boxTop = box.offsetTop;
            event.preventDefault();
            body.style.opacity = ".5";
            box.style.height = ".1em";
            if (touch === true) {
                document.ontouchmove = boxMoveTouch;
                document.ontouchstart = null;
            } else {
                document.onmousemove = boxMoveClick;
                document.onmousedown = null;
            }
            return false;
        },
        style = document.createElement("style"),
        div = document.createElement("div");
    let a = 0,
        b = text.length,
        output = [],
        parent = {};
    if (b > 0) {
        do {
            parent = text[a].parentNode.nodeName.toLowerCase();
            if ((/^(\s+)$/).test(text[a].textContent) === true || parent === "script" || parent === "style") {
                text.splice(a, 1);
                b = b - 1;
                a = a - 1;
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
            a = a + 1;
        } while (a < b);
        a = 0;
        do {
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
            a = a + 1;
        } while (a < b);
    }
    output.push("#textAnalysis{background:#ddd;box-shadow:0 1em 5em;color:#333;display:block;font-size:10px;position:absolute;left:5em;top:5em;z-index:100000}");
    output.push("#textAnalysis .textAnalysis-body{background:#ddd;border:0.1em solid #000;display:block;height:80em;overflow:scroll;margin:0;padding:2em 2em 0;width:80em}");
    output.push("#textAnalysis ol{}");
    output.push("#textAnalysis li, #textAnalysis p{font-size:1.4em;margin:0 0 1em;padding:0}");
    output.push("#textAnalysis p{font-weight:bold}")
    output.push("#textAnalysis li{list-style-position:inside}");
    output.push("#textAnalysis div{background:#fff;border: 0.1em solid #999;margin:0 0 2em;padding:1em}");
    output.push("#textAnalysis code{background:#fe9}");
    output.push("#textAnalysis em{color:#00c;font-style:italic}");
    output.push("#textAnalysis strong{color:#c00;font-weight:bold}");
    output.push("#textAnalysis h2{border-style:none;color:#070;margin:0 0 1em;position:static}");
    output.push("#textAnalysis h1{background:#333;border-color:#000;border-style:none none solid;border-width:0.05em;color:#eee;cursor:move;display:block;font-size:2em;margin:0;padding:0.5em}");
    output.push("#textAnalysis #textAnalysis-close{border-style:none;margin:0;padding:0}");
    output.push("#textAnalysis #textAnalysis-close button{background:#900;color:#fff;font-size:1.2em;margin:0;padding:0.25em;position:absolute;right:0em;top:0em;width:7em}");
    style.setAttribute("type", "text/css");
    style.setAttribute("id", "semanticText-style");
    style.innerHTML = output.join("");
    document.getElementsByTagName("head")[0].appendChild(style);
    output = [];
    output.push("<h1>Sematic Analysis of Page Text</h1>");
    output.push("<p id='textAnalysis-close'><button>Close</button></p>");
    output.push("<div class='textAnalysis-body'>");
    output.push("<div><h2>Text With Virtually No Description</h2> <p>This first list points to text that is poorly described with little or no hope of salvation. The parent element name is in parenthesis following each listed text item.</p> <p><strong>");
    b = bad.length;
    output.push(b);
    output.push("</strong> instances.</p> <ol>");
    if (b > 0) {
        a = 0;
        do {
            output.push("<li><code>");
            output.push(bad[a][1].textContent.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"));
            output.push("</code> (<em>");
            output.push(bad[a][0]);
            output.push("</em>)</li>");
            a = a + 1;
        } while (a < b);
    }
    output.push("</ol></div>");
    output.push("<div><h2>Text Well Described Inline, But Poorly Structured</h2> <p>This list points out text whose immediate parent is a proper inline element, but whose block level element fails to provide further description. The grandparent element name is in parenthesis following each listed text item.</p> <p><strong>");
    b = inline.length;
    output.push(b);
    output.push("</strong> instances.</p> <ol>");
    if (b > 0) {
        a = 0;
        do {
            output.push("<li><code>");
            output.push(inline[a][1].textContent.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"));
            output.push("</code> (<em>");
            output.push(inline[a][0]);
            output.push("</em>)</li>");
            a = a + 1;
        } while (a < b);
    }
    output.push("</ol></div>");
    output.push("<div><h2>All text in page order.</h2> <p>All text is analyzed in the order in which it resides in the page. If the text is not understandable according to this ordering <strong>then it is not accessible</strong>.</p> <p><strong>");
    b = text.length;
    output.push(b);
    output.push("</strong> instances.</p> <ol>");
    if (b > 0) {
        a = 0;
        do {
            output.push("<li><code>");
            output.push(text[a].textContent.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"));
            output.push("</code></li>");
            a = a + 1;
        } while (a < b);
    }
    output.push("</ol></div></div>");
    div.setAttribute("id", "textAnalysis");
    div.innerHTML = output.join("");
    document.getElementsByTagName("body")[0].appendChild(div);
    document.getElementById("textAnalysis-close").onclick = button;
    document.getElementById("textAnalysis").getElementsByTagName("h1")[0].onmousedown = grab;
};
textParent();
