
/**
 * Module dependencies.
 */

var List = require('term-list');

/**
 * Initialize a new `List` with `opts`:
 *
 * - `marker` optional marker string defaulting to '› '
 * - `markerLength` optional marker length, otherwise marker.length is used
 * - `viewportSize` optional scrollable list size, defualt is 16
 *
 * @param {Object} opts
 * @return {Object}
 * @api public
 */

function ScrollableList(opts) {
  opts = opts || {};
  this._header = {id: '_header', label: ''};
  this._footer = {id: '_footer', label: ''};
  this.items = [];
  this.top = 0;
  this.shift = 0;
  this.length = opts.viewportSize || 16;
  this.viewport = new List(opts);

  /**
   * Handle keypress.
   */

  var self = this;
  this.viewport.onkeypress = function(ch, key) {
    if (!key) return;
    self.viewport.emit('keypress', key, self.viewport.selected);
    switch (key.name) {
      case 'k':
      case 'up':
        self.up();
        break;
      case 'j':
      case 'down':
        self.down();
        break;
      case 'c':
        key.ctrl && self.viewport.stop();
        break;
    }
  };
}

/**
 * Add item `id` with `label`.
 *
 * @param {String} id
 * @param {String} label
 * @return {Object} this
 * @api public
 */

ScrollableList.prototype.add = function(id, label) {
  if (!this.viewport.selected) this.viewport.select(id);
  this.items.push({ id: id, label: label });
  return this;
};

/**
 * Set or get header
 *
 * @param {String} label
 *
 * set header if `label` provided, or return header item.
 * `label` with '' will unset it.
 *
 * @return {Object} this or header
 * @api public
 */

ScrollableList.prototype.header = function(label) {
  if (label) {
    this._header.label = label;
    return this;
  } else if (label === '') {
    this._header.label = null;
    return this;
  } else {
    return this._header.label;
  }
};

/**
 * Set or get footer
 *
 * @param {String} label
 *
 * set footer if `label` provided, or return footer item.
 * `label` with '' will unset it.
 *
 * @return {Object} this or footer
 * @api public
 */

ScrollableList.prototype.footer = function(label) {
  if (label) {
    this._footer.label = label;
    return this;
  } else if (label === '') {
    this._footer.label = null;
    return this;
  } else {
    return this._footer.label;
  }
};

/**
 * Remove item `id`.
 *
 * @param {String} id
 * @return {Object} this
 * @api public
 */

ScrollableList.prototype.remove = function(id) {
  this.emit('remove', id);
  var i = this.items.map(prop('id')).indexOf(id);
  this.items.splice(i, 1);
  if (!this.items.length) this.emit('empty');
  if (this.shift + 1 == this.length && this.top > 0) {
    this.top--;
  } else if (this.shift > 0) {
    this.shift--;
  }
  this.draw();
  return this;
};

/**
 * Return item at `i`.
 *
 * @param {Number} i
 * @return {Object} item
 * @api public
 */

ScrollableList.prototype.at = function(i) {
  return this.items[i];
};

/**
 * Get item by `id`.
 *
 * @param {String} id
 * @return {Object} item
 * @api public
 */

ScrollableList.prototype.get = function(id) {
  var i = this.items.map(prop('id')).indexOf(id);
  return this.at(i);
};

/**
 * Select item `id`.
 *
 * @param {String} id
 * @return {Object} this
 * @api public
 */

ScrollableList.prototype.select = function(id) {
  this.emit('select', id);
  this.viewport.selected = id;
  var i = this.items.map(prop('id')).indexOf(id);
  if (i >= 0) {
    if (i < this.top) {
      this.top = i;
      this.shift = 0;
    } else if (i > this.top + this.shift && i < this.top + this.length) {
      this.shift = i - this.top;
    } else if (i > this.top + this.length) {
      this.shift = this.length - 1;
      this.top = i - this.length + 1;
    }
  }
  this.draw();
  return this;
};

/**
 * Return selected item.
 *
 * @return {Object} item
 * @api public
 */

ScrollableList.prototype.selected = function() {
  return this.viewport.selected;
};

/**
 * Select the previous item if any.
 *
 * @return {Object} this
 * @api public
 */

ScrollableList.prototype.up = function() {
  if (this.shift > 0) {
    this.shift--;
  } else if (this.top > 0) {
    this.top--;
  }
  this.draw();
  return this;
};

/**
 * Select the next item if any.
 *
 * @return {Object} this
 * @api public
 */

ScrollableList.prototype.down = function() {
  if (this.shift + 1 < this.length && this.shift + 1 < this.items.length) {
    this.shift++;
  } else if (this.top + this.length < this.items.length) {
    this.top++;
  }
  this.draw();
  return this;
};

/**
 * Re-draw the list.
 *
 * @api public
 * @return {Object} this
 */

ScrollableList.prototype.draw = function() {
  var end = this.top + this.length;
  if (end > this.items.length) end = this.items.length;
  this.viewport.items = this.items.slice(this.top, end);
  var item = this.viewport.items[this.shift];
  if (this._header.label) this.viewport.items.unshift(this._header);
  if (this._footer.label) this.viewport.items.push(this._footer);
  if (item) this.viewport.select(item.id);
  return this;
};

/**
 * Start the list.
 *
 * @return {Object} this
 * @api public
 */

ScrollableList.prototype.start = function() {
  this.viewport.start();
  this.draw();
  return this;
};

/**
 * Reset state and stop the list.
 *
 * @return {Boolean} false
 * @api public
 */

ScrollableList.prototype.stop = function() {
  this.viewport.stop();
  return false;
};

/**
 * Bind event listener
 *
 * @param {String} event
 * @param {Function} callback
 * @return {Object} this
 * @api public
 */

ScrollableList.prototype.on = function(event, callback) {
  this.viewport.on(event, callback);
  return this;
};

/**
 * Emit event
 *
 * @param {String} event
 * @return {Object} this
 */

ScrollableList.prototype.emit = function(event) {
  this.viewport.emit(event);
  return this;
};

/**
 * Prop helper.
 */

function prop(name) {
  return function(obj){
    return obj[name];
  };
}

/**
 * Expose `ScrollableList`.
 */

module.exports = ScrollableList;