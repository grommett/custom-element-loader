# Custom Element Loader
## Why
The loader allows you to split your [customElement](https://developer.mozilla.org/en-US/docs/Web/API/Window/customElements) into its repsective pieces, and in my opinion, keep them very organized. Additionally, keeping your code in the file type its intended for you get all the code completion you expect without extra plugins for your IDE.

For example:
- JS - Its class defintion
- HTML - Its representation in the DOM
- CSS - Its styles (optional)

## Usage
The `loadCustomElement` function accepts a `CustomElementSettings` option with the properties:
```
 {
  templatePath: string - Path to the html file
  cssPath: string - Path to css file
  tag: string - The tag used to represent this element i.e 'my-element'
  definition: class - The class definition for this element
 }
```

Have a look in the `examples` folder for more details.
```js
import { loadCustomElement } from 'custom-element-loader';

class MyElement extends HTMLElement {
  static TAG = 'my-element';

  connectedCallback() {
    /* The <template> element has been written to the DOM
     * We can select it using the elements tag name we've defined
    */
    const fragment = document.querySelector(`#${MyElement.TAG}`).content.cloneNode(true);
    this.append(fragment);
  }
}

if (!customElements.get(MyElement.TAG)) {
  loadCustomElement({
    tag: MyElement.TAG,
    definition: MyElement,
    templatePath: '/examples/my-element.html',
    cssPath: '/examples/my-element.css',
  });
}
```
## How
The loader works in sequence so that each piece is ready and loaded for the next piece in this order:
1. Loads the `css` associated with your custom element before it is defined so that there is no [flash of unstyled content](https://en.wikipedia.org/wiki/Flash_of_unstyled_content).
1. Loads the HTML associated with the custom element and places it in a [`<template id="{your custom element tag name}">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template)
1. Calls `customElements.define` to instantiate your custom element with all its parts loaded and ready.

## Organization
Since we can seperate our concerns we can (potentially) organize custom elements like:
```
project/
    └── components/
      ├── my-component/
      │   ├── my-component.js
      │   ├── my-component.html
      │   └── my-component.css
      └── other-component/
          ├── other-component.js
          ├── other-component.html
          └── other-component.css
```
