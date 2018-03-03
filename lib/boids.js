var helpers = require('./');

/** Boids is a lot like Castle in the way it treats elements. But it is more
  predictable, and retains attribute information.

1. The root node is collapsed, but its name is preserved in document['*']
2. Attributes are stored in a Object<String -> String> mapping, called "$".
  * XML elements that are named '$' will conflict with the way boids represents
    attributes.
3. in between elements is discarded.
4. Namespacing is taken literally.
5. Relative order between siblings of different names (or text nodes) is
   disregarded, though order between siblings of the same name will be
   preserved.

*/

function convertNode(node) {
  /** Convert a single node into a javascript object. */
  var obj = {$: {}};

  // save all attributes to the '$' field
  node.attrs().forEach(function(attr) {
    obj.$[helpers.fullName.apply(attr)] = attr.value();
  });

  var texts = [];
  node.childNodes().forEach(function(node) {
    var type = node.type();
    if (type == 'element') {
      var tag = helpers.fullName.apply(node);
      if (obj[tag] === undefined) {
        obj[tag] = [];
      }
      obj[tag].push(convertNode(node));
    }
    else {
      texts.push(node.text());
    }
  });
  // finally concatenate all the text nodes together and save them as the '_' field
  obj._ = helpers.parseString(texts.join('').trim());

  return obj;
}

function boids(xml, opts) {
  var root = helpers.parseXML(xml);
  var obj = convertNode(root);
  // special root handling:
  obj['*'] = root.name();
  return obj;
}

module.exports = boids;
