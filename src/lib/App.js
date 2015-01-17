'use strict';

var dom = require('./dom');
var fs = require('fs');

module.exports = App;

/**
 * @constructor
 */
function App() {}

/**
 * @property {HTMLElement}
 */
App.prototype.containerEl = null;

/**
 * @property {HTMLElement}
 */
App.prototype.launcherEl = null;

/**
 * @property {HTMLElement}
 */
App.prototype.panelEl = null;

/**
 * @property {HTMLElement}
 */
App.prototype.treeContainerEl = null;

/**
 * @property {HTMLElement}
 */
App.prototype.treeEl = null;

/**
 * @property {HTMLElement}
 */
App.prototype.selectedTreeNodeEl = null;

/**
 * @property {HTMLElement}
 */
App.prototype.highlightEl = null;

/**
 * @property {HTMLElement}
 */
App.prototype.closePanelEl = null;

/**
 * Init App
 * @param {HTMLElement} parentEl Element to attach app to
 */
App.prototype.init = function (parentEl) {
  parentEl.appendChild(this.render());
  this.bindEvents();

};

/**
 * Render App
 */
App.prototype.render = function () {
  var root, css;

  this.containerEl = document.createElement('div');
  root             = this.containerEl.createShadowRoot();
  css              = ['<style>', fs.readFileSync(__dirname + '/../styles/app.css', 'utf8'), '</style>'].join('');

  root.innerHTML = css + tl.app();

  this.launcherEl            = root.querySelector('#dxp-launcher');
  this.panelEl               = root.querySelector('#dxp-panel');
  this.treeContainerEl       = this.panelEl.querySelector('.tree-container');
  this.treeEl                = this.panelEl.querySelector('.tree-view');
  this.highlightEl           = this.panelEl.querySelector('.node-highlight');
  this.closePanelEl          = this.panelEl.querySelector('.close');

  return this.containerEl;
};

/**
 * Bind events
 */
App.prototype.bindEvents = function () {
  this.launcherEl.addEventListener('click', this.onLauncherClick.bind(this));
  this.treeEl.addEventListener('click', this.onTreeClick.bind(this));
  this.closePanelEl.addEventListener('click', this.onCloseClick.bind(this));
};

/**
 * Handle click on launcher button
 * @param {Event} e
 */
App.prototype.onLauncherClick = function (e) {
  e.preventDefault();
  this.openPanel();
};

/**
 * Handle click on close panel button
 * @param {Event} e
 */
App.prototype.onCloseClick = function (e) {
  e.preventDefault();
  this.closePanel();
};

/**
 * Handle click on tree view
 * @param {Event} e
 */
App.prototype.onTreeClick = function (e) {
  if (e.target.classList.contains('selectable')) {
    this.selectTreeNode(e.target);
  }

  if (e.target.parentElement.classList.contains('selectable')) {
    this.selectTreeNode(e.target.parentElement);
  }
};

/**
 * Select tree node
 * @param {HTMLElement} targetEl
 */
App.prototype.selectTreeNode = function (targetEl) {
  // unselect currently selected node
  if (this.selectedTreeNodeEl) {
    this.selectedTreeNodeEl.classList.remove('selected');
  }

  // select this new node
  targetEl.classList.toggle('selected');
  this.selectedTreeNodeEl = targetEl;

  // if this is a folder node, taggle the open state
  if (targetEl.classList.contains('folder')) {
    targetEl.classList.toggle('open');
  }

  // move highlight element to correct position
  this.highlightTreeNode(targetEl.querySelector('.label'));
};

/**
 * Move highlight element to correct position
 * @param {HTMLElement} targetEl
 */
App.prototype.highlightTreeNode = function (targetEl) {
  var container = this.treeContainerEl.getClientRects()[0];
  var target    = targetEl.getClientRects()[0];
  var height    = target.bottom - target.top;
  var padding   = height * .4;

  this.highlightEl.classList.add('active');
  this.highlightEl.style.top = (target.top - container.top + padding + 32) + 'px';
  this.highlightEl.style.height = height + 'px';
};

/**
 * Open panel view
 */
App.prototype.openPanel = function () {
  this.launcherEl.classList.remove('active');
  this.panelEl.classList.add('active');
};

/**
 * Close panel view
 */
App.prototype.closePanel = function () {
  this.launcherEl.classList.add('active');
  this.panelEl.classList.remove('active');
};

/**
 * Add tree node
 * @param {HTMLElement} domEl DOM element
 * @param {HTMLElement} parentEl Element to attach new node to
 */
App.prototype.addTreeNode = function (domEl, parentEl) {
  parentEl = parentEl || this.treeEl;

  if (domEl.id === 'dxp-root') {
    return;
  }

  if (domEl.nodeType === 1) {
    this.addFolderNode(domEl, parentEl);
  } else if (domEl.nodeType === 3) {
    this.addFileNode(domEl, parentEl);
  }
};

/**
 * Add folder node
 * @param {HTMLElement} domEl DOM element
 * @param {HTMLElement} parentEl Element to attach new node to
 */
App.prototype.addFolderNode = function (domEl, parentEl) {
  var nodeEl = this.renderFolderNode(domEl);
  var listEl = nodeEl.querySelector('ul');

  parentEl.appendChild(nodeEl);

  Array.prototype.slice.call(domEl.childNodes, 0).forEach(function (el) {
    this.addTreeNode(el, listEl);
  }, this);
};

/**
 * Add file node
 * @param {HTMLElement} node Node
 * @param {HTMLElement} parentEl Element to attach new node to
 */
App.prototype.addFileNode = function (node, parentEl) {
  var nodeEl = this.renderFileNode(node);
  parentEl.appendChild(nodeEl);
}

/**
 * Render a folder node
 * @param {HTMLElement} domEl DOM element represented by this node
 * @returns {HTMLElement}
 */
App.prototype.renderFolderNode = function (domEl) {
  return dom.markup2Element(tl.folder({ label: domEl.tagName }));
};

/**
 * Render a file node
 * @param {Node} node DOM node
 * @returns {HTMLElement}
 */
App.prototype.renderFileNode = function (node) {
  var text = node.wholeText.trim();

  if (text === '') {
    text = '(whitespace)';
  }

  return dom.markup2Element(tl.file({ label: text }));
};
