'use strict';

module.exports = {
  /**
   * Convert HTML markup to a DOM element tree
   * @param {string} html
   * @returns {HTMLElement}
   */
  markup2Element: function (html) {
    var div = document.createElement('div');
    div.innerHTML = html;
    return div.firstElementChild;
  }
};
