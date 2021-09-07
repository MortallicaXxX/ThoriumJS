# ThoriumJS
Framework client-side javascrit

Introduction
Thorium se télécharge ou s'utilise en cdn à l'adresse : https://thoriumcdn.herokuapp.com/cdn/thorium.js
jsfiddle sample : https://jsfiddle.net/MortallicaXxX/fxedyhbk/19/

Comment débuter
Thorium utilise des UIelement ( component thorium pouvant contenir un noeud (UI) ) , & UI ( Noeuds thorium contenant les UIelement ).
Il y a plusieurs moyens d'utiliser les component thorium.
Avant d'utiliser les components et de définir les éléments composants l'interface il faut init le projet et dire à thorium que l'on prend la main.
jsfiddle sample ( conf , onReady , simple component ) : https://jsfiddle.net/MortallicaXxX/7vhtw5mp/22/

Les listeners
Thorium met à disposition des handlers et rend les éléments "self-listeners".
Des thoirum handlers peuvent être utiliser , ainsi que des components handlers inhérent à chaque components.

Thorium Handlers :
- keydown
- keyup
- mousemove
- mousedown
- mouseup

Components Handlers :
- onInitialise
- onUpdate
- onClick
- onDblClick
- onMouseEnter
- onMouseLeave
- onMouseMove
- onMouseOut
- onMouseOver
- onMouseUp
- onMouseDown
- onMouseWheel
- onAfterScriptExecute
- onFrameUpdate
- onResize

Sample Thorium Handlers & Thorium Handlers(onInitialise) : https://jsfiddle.net/MortallicaXxX/tdrjgpL6/50/
