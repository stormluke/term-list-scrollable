term-list-scrollable [![NPM version](https://badge.fury.io/js/term-list-scrollable.svg)](http://badge.fury.io/js/term-list-scrollable)
====================

Renders an interactive list to the terminal that users can navigate using the arrow keys, similar API with [term-list](https://github.com/visionmedia/node-term-list) but scrollable, and support header or footer.

## Installation

```
$ npm install term-list-scrollable
```

## Example

A fully interactive scrollablelist demonstrating removal via backspace, and opening of the websites via the return key.

```js
var ScrollableList = require('term-list-scrollable');
var exec = require('child_process').exec;

var list = new ScrollableList({
  marker: '\033[36m› \033[0m',
  markerLength: 2,
  viewportSize: 5
});
list.header('Bookmarks');
list.add('http://google.com', 'Google');
list.add('http://yahoo.com', 'Yahoo');
list.add('http://cloudup.com', 'Cloudup');
list.add('http://github.com', 'Github');
list.footer('press RETURN to open');
list.start();

setTimeout(function(){
  list.add('http://cuteoverload.com', 'Cute Overload');
  list.draw();
}, 2000);

setTimeout(function(){
  list.add('http://uglyoverload.com', 'Ugly Overload');
  list.draw();
}, 4000);

list.on('keypress', function(key, item){
  switch (key.name) {
    case 'return':
      exec('open ' + item);
      list.stop();
      console.log('opening %s', item);
      break;
    case 'backspace':
      list.remove(list.selected());
      break;
    case 'c':
      if (key.ctrl) {
        list.stop();
        process.exit();
      }
      break;
  }
});

list.on('empty', function(){
  list.stop();
});
```

### API

- [ScrollableList()](#scrollablelist)
- [ScrollableList.add()](#scrollablelistaddidstring-lablestring)
- [ScrollableList.header()](#scrollablelistheaderlable-string)
- [ScrollableList.footer()](#scrollablelistfooterlable-string)
- [ScrollableList.remove()](#scrollablelistremove)
- [ScrollableList.at()](#scrollablelistati-number)
- [ScrollableList.select()](#scrollablelistselectid-string)
- [ScrollableList.selected()](#scrollablelistselected)
- [ScrollableList.draw()](#scrollablelistdraw)
- [ScrollableList.up()](#scrollablelistup)
- [ScrollableList.down()](#scrollablelistdown)
- [ScrollableList.stop()](#scrollableliststop)
- [ScrollableList.start()](#scrollableliststart)
- [ScrollableList.on()](#scrollablelistonevent-string-callback-function)

### ScrollableList()

Initialize a new `ScrollableList` with `opts`:

- `marker` optional marker string defaulting to '› '
- `markerLength` optional marker length, otherwise marker.length is used
- `viewportSize` optional scrollable list size, defualt is 16

### ScrollableList.add(id: String, label: String)

Add item `id` with `label`.

### ScrollableList.header(lable: String)

Set or get header, set header if `label` provided, or return header item. `label` with '' will unset it.

### ScrollableList.footer(lable: String)

Set or get footer, set footer if `label` provided, or return footer item. `label` with '' will unset it.

### ScrollableList.remove(id: String)

Remove item `id`.

### ScrollableList.at(i: Number)

Return item at `i`.

### ScrollableList.select(id: String)

Select item `id`.

### ScrollableList.selected()

Return seleted item.

### ScrollableList.draw()

Re-draw the list.

### ScrollableList.up()

Select the previous item if any.

### ScrollableList.down()

Select the next item if any.

### ScrollableList.stop()

 Reset state and stop the list.

### ScrollableList.start()

Start the list.

### ScrollableList.on(event: String, callback: Function)

Bind event listener

## Thanks

[term-list](https://github.com/visionmedia/node-term-list)

## License

MIT
