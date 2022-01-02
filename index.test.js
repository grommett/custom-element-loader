/* eslint-disable no-console */
import tap from 'tap';
import { parseHTML } from 'linkedom';
import { loadCustomElement } from './index.js';

const htmlTemplateContent = '<p>Hi</p>';
const orgConsoleError = console.error;

tap.beforeEach(() => {
  const { document, customElements, HTMLElement } = parseHTML(`
  <!doctype html>
  <html lang="en">
    <head>
    </head>
    <body>
      <my-element></my-element>
    </body>
  </html>
`);
  global.HTMLElement = HTMLElement;
  global.document = document;
  global.customElements = customElements;
  global.fetch = () => {
    return Promise.resolve({
      text() {
        return htmlTemplateContent;
      },
    });
  };

  function consoleError() {
    consoleError.called = true;
  }
  console.error = consoleError;
  console.error.called = false;
});

tap.afterEach(() => {
  console.error = orgConsoleError;
});

tap.test(`it adds the template element for the element and the link element for its css`, t => {
  t.plan(2);
  const tagName = 'my-element';
  class TestClass extends HTMLElement {}

  // this function returns a promise, but we can't await as the promise doesn't resolve until the <link> onload event fires
  // so we use setImmediates :(
  loadCustomElement({
    definition: TestClass,
    tag: tagName,
    templatePath: 'file-to-templ.html',
    cssPath: 'path-to-css.css',
  });

  // wait to make sure <link> is written to DOM since loading the html template is async and we have no
  setImmediate(() => {
    const linkEL = document.querySelector('link');
    t.ok(linkEL);
    linkEL.onload();
  });

  setImmediate(() => {
    const template = document.querySelector(`#${tagName}`);
    t.ok(template);
  });
});

tap.test(`it logs an error when css load fails but continues to render`, t => {
  t.plan(3);
  const tagName = 'my-element';
  class TestClass extends HTMLElement {}

  // this function returns a promise, but we can't await as the promise doesn't resolve until the <link> onerror event fires
  // so we use setImmediates :(
  loadCustomElement({
    definition: TestClass,
    tag: tagName,
    templatePath: 'file-to-templ.html',
    cssPath: 'path-to-css.css',
  });

  // wait to make sure <link> is written to DOM since loading the html template is async
  setImmediate(() => {
    const linkEL = document.querySelector('link');
    t.ok(linkEL);
    linkEL.onerror();
  });

  setImmediate(() => {
    const template = document.querySelector(`#${tagName}`);
    t.ok(template);
    t.equal(console.error.called, true);
  });
});

tap.test(`logs to console.error & does not render when loading fails`, async t => {
  t.plan(4);
  const error = new Error('from test');
  global.fetch = () => {
    return Promise.reject(error);
  };
  const tagName = 'my-element';
  class TestClass extends HTMLElement {}

  const result = await loadCustomElement({
    definition: TestClass,
    tag: tagName,
    templatePath: 'file-to-templ.html',
  });

  const linkEL = document.querySelector('link');
  const template = document.querySelector(`#${tagName}`);
  t.equal(result, error);
  t.equal(console.error.called, true);
  t.notOk(linkEL);
  t.notOk(template);
});
