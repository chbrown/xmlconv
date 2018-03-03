var helpers = require('./');

/** Parker ignores all attributes, perceives namespacing literally, and mishandles mixed children.

1. The root tag is dropped, so the output object can be a number, string, object, list, etc.
2. <x>1</x><x>2</x><y>3</y> will become {x: 2, y: 3}, losing the value of the first <x>.
3. Numbers, booleans, and null should be parsed into native JavaScript objects.

See: http://code.google.com/p/xml2json-xslt/wiki/TransformingRules

*/

function convertNodes(nodes) {
  // flow: return A.S.A.P.
  var elements = nodes.filter(function(node) {
    return node.type() == 'element';
  });

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
      var first_tag = helpers.fullName.apply(elements[0]);
      var elements_share_tag = elements.slice(1).every(function(element) {
        return helpers.fullName.apply(element) == first_tag;
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
      obj[helpers.fullName.apply(node)] = convertNodes(node.childNodes());
    });
    return obj;
  }

  // 3. If there are no elements nodes, just concatenate all the text nodes together.
  var texts = nodes.map(function(node) {
    return node.text();
  });
  return helpers.parseString(texts.join(''));
}

function parker(xml) {
  var root = helpers.parseXML(xml);
  // The root tag's name is ignored.
  return convertNodes(root.childNodes());
}

module.exports = parker;
