'use strict'; /*jslint es5: true, node: true, indent: 2 */
var libxml = require('libxmljs');

/** Parker ignores all attributes, perceives namespacing literally, and mishandles mixed children.
 *
 * 1. The root tag is dropped, so the output object can be a number, string, object, list, etc.
 * 2. <x>1</x><x>2</x><y>3</y> will lose the value of the first <x>: {x: 2, y: 3}
 * 3. Numbers, booleans, and null should be parsed into native JavaScript objects.
 *
 * See: http://code.google.com/p/xml2json-xslt/wiki/TransformingRules
 *
 */

var literals = {
  'TRUE': true,
  'True': true,
  'true': true,
  'FALSE': false,
  'False': false,
  'false': false,
  '': null,
};

function convertString(string) {
  // 1. check whether the string matches a single-valued literal (just booleans and the empty string, for now)
  var literal = literals[string];
  if (literal !== undefined) {
    return literal;
  }

  // 2. check whether the string looks like a number. '' does not look like a number.
  var integer = string.match(/^\d+$/);
  if (integer) {
    return parseInt(string, 10);
  }
  var decimal = string.match(/^\d*\.\d+$/);
  if (decimal) {
    return parseFloat(string);
  }

  // 3. check whether the string acts like a date
  var date = new Date(string);
  if (!isNaN(date)) {
    return date;
  }

  // 4. If it's not a boolean, null, or number, it must be just a string
  return string;
}

function convertNodes(nodes) {
  // flow: return A.S.A.P.
  var elements = nodes.filter(function(node) { return node.type() == 'element'; });

  // debugging / development helper:
  // nodes.forEach(function(node) {
  //   console.error('%s "%s" (%s)',
  //     node.type(),
  //     (node.namespace() ? node.namespace().prefix() + ':' : '') + node.name(),
  //     node.path());
  // });

  if (elements.length > 0) {
    // if there are any elements, any interspersed textual contents are ignored
    // 1. if all the children are named the same thing, they become items in an array,
    //    though (less documented fact about parker): this only applies if there is
    //    more than one child.
    if (elements.length > 1) {
      // this shared-tag test does not consider namespaces, mostly because
      // it's easier not to. TODO: Should it?
      var first_tag = elements[0].name();
      var elements_share_tag = elements.slice(1).every(function(element) {
        return element.name() == first_tag;
      });
      // check if each element in `elements` has the same name() value
      if (elements_share_tag) {
        // return the list of children, recursively converted, dropping the names
        return elements.map(function(node) {
          return convertNodes(node.childNodes());
        });
      }
      // but if there is only one element child or if they have different names,
      // default to the element-names-as-map-keys conversion
    }

    // 2. Otherwise, use tag names as the keys. Duplicate values just override (oops!)
    //    The value you end up with is the last one in the array of elements.
    var obj = {};
    elements.forEach(function(node) {
      var namespace = node.namespace();
      var full_name = namespace ? (namespace.prefix() + ':' + node.name()) : node.name();
      obj[full_name] = convertNodes(node.childNodes());
    });
    return obj;
  }

  // 3. If there are no elements nodes, just concatenate all the text nodes together.
  var texts = nodes.map(function(node) {
    return node.text();
  });
  return convertString(texts.join(''));
}

module.exports = function(xml) {
  var doc = libxml.parseXml(xml);
  var root = doc.root();
  // The root tag's name is ignored.
  return convertNodes(root.childNodes());
};
