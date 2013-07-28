'use strict'; /*jslint es5: true, node: true, indent: 2 */
var libxml = require('libxmljs');

// this is parker-ish, not total Parker

function node2json(nodes) {
  var elements = nodes.filter(function(node) { return node.type() == 'element'; });
  if (elements.length) {
    // if there are any elements, they are recursively converted
    var obj = {};
    elements.forEach(function(node) {
      var tag = node.name();
      var existing = obj[tag];
      var child = node2json(node.childNodes());
      if (existing) {
        if (!Array.isArray(existing)) {
          existing = [existing];
        }
        existing.push(child);
      }
      else {
        existing = child;
      }
      obj[tag] = existing;
    });
    return obj;
  }
  else {
    // otherwise, just cat all the text nodes together.
    return nodes.map(function(node) { return node.text(); }).join(' ');
  }
}

module.exports = function(xml, opts) {
  var doc = libxml.parseXml(xml);
  var root = doc.root();
  var obj = {};
  obj[root.name()] = node2json(root.childNodes());
  return obj;
};
