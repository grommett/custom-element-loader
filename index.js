/**
 * @typedef {Object} CustomElementSettings Settings object
 * @property {string} templatePath Path to the template
 * @property {string} cssPath Path to CSS
 * @property {string} tag The tag used to represent this element
 * @property {HTMLElement} definition The class definition for this element
 */

/**
 * Creates a Custom Element
 * @param {CustomElementSettings} settings
 * @returns {void}
 */
export function loadCustomElement(settings) {
  const { templatePath } = settings;
  return fetch(templatePath)
    .then(response => response.text())
    .then(handleTemplateLoaded(settings))
    .catch(handleTemplateError);
}

/**
 * Takes in the element settings and returns a function to handles the template files load response
 * @param {CustomElementSettings} settings
 * @returns {() => void}
 */
function handleTemplateLoaded(settings) {
  return async text => {
    const { cssPath, tag, definition } = settings;
    if (cssPath) {
      await addElementCSS(cssPath);
    }
    addElementTemplate(settings, text);
    customElements.define(tag, definition);
  };
}

/**
 * @param {Error} error
 * @returns {void}
 */
function handleTemplateError(error) {
  // eslint-disable-next-line no-console
  console.error(`Error loading template: ${error}`);
  return error;
}

/**
 * Adds the contents of the file to a <template> element in the document
 * @param {CustomElementSettings} elementSettings
 * @param {string} text
 * @return {void}
 */
function addElementTemplate(elementSettings, text) {
  const { tag } = elementSettings;
  const tpl = create('template');
  tpl.id = tag;
  tpl.innerHTML = text;
  document.body.append(tpl);
}

/**
 * Adds the style tag for the element
 * @param {string} cssPath
 * @returns {void}
 */
function addElementCSS(cssPath) {
  const style = create('link');
  style.setAttribute('rel', 'stylesheet');
  style.setAttribute('href', cssPath);
  document.head.append(style);
  return new Promise(resolve => {
    style.onload = resolve;
    // Resolve so we can continue loading the template
    style.onerror = error => {
      // eslint-disable-next-line no-console
      console.error('Error loading css ', error);
      resolve();
    };
  });
}

/**
 * Utility for creating an element
 * @param {string} tag
 * @returns {void}
 */
function create(tag) {
  const el = document.createElement(tag);
  return el;
}
