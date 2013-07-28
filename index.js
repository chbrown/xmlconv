'use strict'; /*jslint es5: true, node: true, indent: 2 */

var convert = module.exports = function(xml, opts) {
  /** Convert a string or stream of XML into a javascript object.
   *    - opts.convention is a string you can set to specify what convention to use.
   *      The default convention is 'parker'.
   */
  var convention_name = opts.convention || 'parker';
  var convention = require('./lib/' + convention_name);
  return convention(xml, opts);
};

var readToEnd = convert.readToEnd = function(readable_stream, callback) {
  // callback signature: function(err, content)
  var content = '';
  readable_stream.setEncoding('utf8');
  readable_stream.on('data', function (chunk) {
    content += chunk;
  });
  readable_stream.on('error', function (err) {
    callback(err, content);
  });
  readable_stream.on('end', function () {
    callback(null, content);
  });
};
