import { loadCustomElement } from '../index.js';

class MyElement extends HTMLElement {
  static TAG = 'my-element';

  connectedCallback() {
    // The template has been written to the DOM
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
