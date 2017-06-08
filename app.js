// MDP Script - Responsible for managing the editor and rendering in MDP.
// Copyright (C) 2017 Ethan McTague
// Licensed under the MIT license. See LICENSE for details.

// Initialize the editor using CodeMirror.
var elem = document.getElementById("editor");
var editor = CodeMirror(elem, {
  theme: "base16-dark"
});

// Load saved text or set the default.
// (NOTE: This current syntax only works with ES6. Perhaps change it to load
//        from a separate file over XMLHttpRequest?)
editor.setValue(localStorage.edValue || `
# MDP

Welcome to MDP! MDP is a markdown editor with automatic evaluation of JS!

Example:

\`\`\`js
var x = 10
x + 20
\`\`\`

See how it put the results in a comment under each line?
Great, huh?

This is ideal for mathematics work - write out your formulas in JavaScript and
have them appear right in your document!

## Credits

**By** [Ethan McTague](http://tague.me)

**GitHub:** (emctague/mdp)(http://github.com/emctague/mdp)

**Powered By:**

 * [chjj/marked](http://github.com/chjj/marked) — Markdown parsing.
 * [CodeMirror](http://codemirror.com)          — The editor.
`);

// The Element to store the resulting HTML in.
var result = document.getElementById("result");

// This event is called upon a change in editor content.
var change = function() {
  // Split the lines, and update the local storage value.
  var lines = editor.getValue().split('\n');
  localStorage.edValue = editor.getValue();

  // We keep this safe in an inner environment to prevent eval-ed code from
  // interfering with the eval-ed code from the previous change.
  (function () {

    // // MATHEMATICS SHORTHAND FUNCTIONS // //
    // Convert radians to degrees.
    function deg (rad) { return rad * (180 / Math.PI); }
    // Convert degrees to radians.
    function rad (deg) { return deg * (Math.PI / 180); }
    // Find the sine of an angle (degrees).
    function sin (angle) { return Math.sin(rad(angle)); }
    // Find the inverse sine (degrees).
    function asin (sine) { return deg(Math.asin(sine)); }
    // Find the cosine of an angle (degrees).
    function cos (angle) { return Math.cos(rad(angle)); }
    // Find the inverse cosine (degrees).
    function acos (cosine) { return deg(Math.acos(cosine)); }
    // Find the tangent of an angle (degrees).
    function tan (angle) { return Math.tan(rad(angle)); }
    // Find the inverse tangent (degrees).
    function atan (tangent) { return deg(Math.atan(tangent)); }
    // Find the square root (eliminates the need for "Math." prefix.)
    function sqrt (x) { return Math.sqrt(x); }

    // Find each instance of "```js".
    for (var start = lines.indexOf('```js'); start != -1;
         start = lines.indexOf('```js', start + 1)) {
      // Find where it ends.
      var end = lines.indexOf('```', start);
      // Loop each line in between.
      for (var i = start + 1; i < end; i++) {
        // Evaluate the line (inside of a try/catch so we can print errors.)
        var toInsert = eval("try { " + lines[i] + " } catch (e) { e.message }");
        // Add the line as a comment below this one.
        lines.splice(i + 1, 0, "// => " + JSON.stringify(toInsert));
        // Update the indices to account for the new lines.
        i++; end++;
      }
    }
  })();
  // Add the result to the result container.
  result.innerHTML = marked(lines.join('\n'));
};

// Render when the page is loaded.
change();
// Render whenever the editor is changed.
editor.on('change', change);
