# MDP

MDP is a markdown editor that evaluates any JavaScript code blocks it finds
and adds their results as a comment below them.

**Try it out at [emctague.github.io/mdp](http://emctague.github.io/mdp)!**

For example, this code:

```js
var x = 10
x + 20
```

Would become:

```js
var x = 10
// => undefined
x + 20
// => 30
```
