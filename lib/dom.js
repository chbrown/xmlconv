'use strict'; /*jslint es5: true, node: true, indent: 2 */
var libxml = require('libxmljs');

/** # Dom convention

The "dom" convention keeps most of the structure of XML.
It sometimes ignores whitespace.

Node.fromElement takes an XML element and returns Object<Node>:

- this.tag: String
- this.attributes: Object<String -> String> | null
- this.children: Array<Node> | null
    + this.children is never an empty array
- this.text: String | null

Namespacing is interpreted literally.

If this.children == this.text == null, this node is a self-closing element.
It is never the case that both this.children and this.text are non-null.

*/

function Node(tag) {
  this.tag = tag;

  this.attributes = {};
  // this.children == null if there are no child nodes with type == 'element'
  this.children = null;
  // this.text == null if there are
  this.text = null;
}
Node.prototype.findOne = function(tag) {
  /** Return the first child with the given tag, or null. */
  if (this.children) {
    for (var child, i = 0; (child = this.children[i]); i++) {
      if (child.tag === tag) {
        return child;
      }
    }
    // return undefined;
  }
  else {
    return null;
  }
};
Node.prototype.find = function(tag) {
  /** Return all children with the given tag if there are any
  children (maybe []), or null if this is a text node. */
  if (this.children) {
    return this.children.filter(function(child) { return child.tag === tag; });
  }
  else {
    return null;
  }
};
Node.fromElement = function(xml_root) {
  var dom_root = new Node(xml_root.name());
  // add attributes
  xml_root.attrs().forEach(function(attr) {
    dom_root.attributes[attr.name()] = attr.value();
  });
  // add children
  var xml_children = xml_root.childNodes();
  var has_elements = xml_children.some(function(xml_child) {
    return xml_child.type() == 'element';
  });
  if (has_elements) {
    dom_root.children = [];
    xml_children.forEach(function(xml_child) {
      // console.log('xml_child type', xml_child.type(), xml_child.text());
      if (xml_child.type() == 'element') {
        var element_node = Node.fromElement(xml_child);
        dom_root.children.push(element_node);
      }
      else { // text node
        // since there are element siblings, we only keep non-empty text
        var text = xml_child.text().trim();
        if (text) {
          var text_node = new Node(xml_child.name());
          text_node.text = xml_child.text();
          dom_root.children.push(text_node);
        }
      }
    });
  }
  // or text
  else {
    // otherwise, just cat all the text nodes together.
    dom_root.text = xml_children.map(function(node) {
      return node.text();
    }).join('').trim();
  }
  return dom_root;
};

module.exports = function(xml, opts) {
  var doc = libxml.parseXml(xml);
  var root = doc.root();
  return Node.fromElement(root);
};
