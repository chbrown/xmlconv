'use strict'; /*jslint es5: true, node: true, indent: 2 */
var libxml = require('libxmljs');

/** Parker ignores all attributes, perceives namespacing literally, and mishandles mixed children.
 *
 * 1. <x>1</x><x>2</x><y>3</y> will lose the value of the first <x>: {x: 2, y: 3}
 * 2. The root tag is dropped, so the output object can be a number, string, object, list, etc.
 * 3. Numbers, booleans, and null should be parsed into native objects.
 *
 * See: http://code.google.com/p/xml2json-xslt/wiki/TransformingRules
 *
 */

function commonTag(elements) {
  // returns true if each element in @elements has the same name() value.
  var first_tag = elements[0].name();
  return elements.every(function(element) {
    return element.name() == first_tag;
  });
}

function convertNodes(nodes) {
  var elements = nodes.filter(function(node) { return node.type() == 'element'; });
  if (elements.length) {
    // if there are any elements, they are recursively converted, and the textual contents are ignored
    if (commonTag(elements)) {
      // if all the children are named the same thing, they become items in an array
      return elements.map(function(node) {
        return convertNodes(node.childNodes());
      });
    }
    else {
      // otherwise, use tag names as the keys. Duplicate values just override.
      var obj = {};
      elements.forEach(function(node) {
        obj[node.name()] = convertNodes(node.childNodes());
      });
      return obj;
    }
  }
  else {
    // otherwise, just cat all the text nodes together.
    return nodes.map(function(node) { return node.text(); }).join('');
  }
}

module.exports = function(xml) {
  var doc = libxml.parseXml(xml);
  var root = doc.root();
  // The root tag's name is ignored.
  return convertNodes(root.childNodes());
};
