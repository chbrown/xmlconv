'use strict'; /*jslint es5: true, node: true, indent: 2 */
var helpers = require('./');

/** Castle is a lot like Parker, in that it ignores all XML attributes.
There are a few main differences:

  1. The root node is preserved (results will always be objects with one key)
  2. Homogenous children do not collapse out of their tags
  3. Mixed children are coerced into arrays. This means you may not know
     whether to expect a string or an array, but it's easier to check for
     that than to wish you hadn't just dropped the other values.
  4. Text will be trim()'ed.

 */

function convertNodes(nodes) {
  var elements = nodes.filter(function(node) { return node.type() == 'element'; });
  if (elements.length) {
    // if there are any elements, they are recursively converted
    var obj = {};
    elements.forEach(function(node) {
      var tag = helpers.fullName.apply(node);
      var existing = obj[tag];
      var child = convertNodes(node.childNodes());
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
    return nodes.map(function(node) { return node.text(); }).join('').trim();
  }
}

module.exports = function(xml, opts) {
  var root = helpers.parseXML(xml);
  var obj = {};
  obj[helpers.fullName.apply(root)] = convertNodes(root.childNodes());
  return obj;
};
