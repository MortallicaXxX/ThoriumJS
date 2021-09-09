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
Des thorium handlers peuvent être utiliser , ainsi que des components handlers inhérent à chaque components.

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

Sample Thorium Handlers & Components Handlers(onInitialise) : https://jsfiddle.net/MortallicaXxX/tdrjgpL6/50/

Les Components
Thorium met à disposition thorium.components qui permet la création de components utilisable par thorium.
Ils sont des UIelements, mais permettent de créer un élément , son comportement ainsi que ses héritages et de l'appeler quand on veut.
Plusieurs components généraux sont déjà définis pour aider, mais il est tout à fait possible de créer ses propres components.

Components :

 - App
 - Main
 - Nav
 - Article
 - Section
 - Aside
 - Text
 - Div
 - Container
 - Ccontainer
 - Form
 - SVGBtn
 - Button
 - Input
 - Textarea
 - H1
 - H2
 - H3
 - H4
 - H5
 - H6
 - List

jsfiddle sample : https://jsfiddle.net/MortallicaXxX/2e6ymrca/103/
