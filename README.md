# Custom Element Loader
## Why
I like to keep all the pieces of my [custom elements](https://developer.mozilla.org/en-US/docs/Web/API/Window/customElements) in one folder and have each of its pieces (js, html & css) in seperate files. This is nice for organization and code completion.

This library allows for that type of organization and handles all the loading and error handling. It's really a simple wrapper around `fetch` and some `document.createElement`.

## Usage
The `loadCustomElement` function accepts a `CustomElementSettings` option with the properties:
```
 {
  templatePath: string - Path to the html file
  cssPath?: string - Path to css file
  tag: string - The tag used to represent this element i.e 'my-element'
  definition: class - The class definition for this element
 }
```

Below is an example of how to use it. Have a look in the `examples` folder for more details.
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
    templatePath: 'my-element.html',
    cssPath: 'my-element.css',
  });
}
```
## How
The loader loads in sequence so that each dependency for your custom element is ready and loaded before the next load.

Here's order:
1. Load the `css` associated with your custom element before it is defined so that there is no [flash of unstyled content](https://en.wikipedia.org/wiki/Flash_of_unstyled_content).
1. Loads the HTML associated with the custom element and places it in a [`<template id="{custom-element-tag}">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template)
1. Calls `customElements.define` to instantiate your custom element with all its parts loaded and ready. This allows you to load the `<template>` content as soon as `connectedCallback` is called.
