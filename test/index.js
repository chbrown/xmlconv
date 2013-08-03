'use strict'; /*jslint es5: true, node: true, indent: 2 */
var fs = require('fs');
var path = require('path');

/** No tests, just test helpers.
*/

exports.readTranslationPair = function(name, convention) {
  var xml_path = path.join(__dirname, 'data', name + '.xml');
  var json_path = path.join(__dirname, 'data', name + '.' + convention);
  return {
    xml: fs.readFileSync(xml_path, 'utf8'),
    xml_path: xml_path,
    json: fs.readFileSync(json_path, 'utf8'),
    json_path: json_path,
  };
};
