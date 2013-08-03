'use strict'; /*jslint es5: true, node: true, indent: 2 */
var libxml = require('libxmljs');

exports.fullName = function() {
  /** Many of the conventions involve taking namespaces literally.
  Here's a helper for that.
  */
  var namespace = this.namespace();
  return namespace === null ? this.name() : (namespace.prefix() + ':' + this.name());
};

var literals = exports.literals = {
  'TRUE': true,
  'True': true,
  'true': true,
  'FALSE': false,
  'False': false,
  'false': false,
  '': null,
};

exports.parseString = function(string) {
  /** Parse a string and return a JavaScript native. Handles the following types:

  1. Booleans and null
  2. Numbers (but not exponential notation)
  3. Dates

  If nothing matches, return the input string.
  */

  // 1. check whether the string matches a single-valued literal (just booleans and the empty string, for now)
  var literal = literals[string];
  if (literal !== undefined) {
    return literal;
  }

  // 2. check whether the string looks like a number.
  //    '' does not look like a number, by the way.
  //   2a. check for just digits
  var integer = string.match(/^\d+$/);
  if (integer) {
    return parseInt(string, 10);
  }
  //   2b. check for just maybe some digits, then a period, then some more digits.
  // TODO: i18n?
  var decimal = string.match(/^(\d*\.\d+|\d+\.\d*)$/);
  if (decimal) {
    return parseFloat(string);
  }

  // 3. check whether the string acts like a date
  var date = new Date(string);
  if (!isNaN(date)) {
    return date;
  }

  // 4. If it's not a boolean, null, or number, it must be just a plain old string
  return string;
};

exports.parseXML = function(xml) {
  /** Parse an XML string with libxmljs and return the root node. */
  var xml_document = libxml.parseXml(xml);
  var xml_root = xml_document.root();
  return xml_root;
};
