function convert(xml, opts) {
  /** Convert a string or stream of XML into a javascript object.
   *  @opts.convention is a string you can set to specify what convention to use.
   */
  var convention_name = opts.convention || 'castle';
  var convention = require('./lib/' + convention_name);
  return convention(xml, opts);
}

function readToEnd(readable_stream, callback) {
  // callback signature: function(err, content)
  var content = '';
  readable_stream.setEncoding('utf8');
  readable_stream.on('data', function(chunk) {
    content += chunk;
  });
  readable_stream.on('error', function(err) {
    callback(err, content);
  });
  readable_stream.on('end', function() {
    callback(null, content);
  });
}
// attach the readToEnd convenience function to the single function this module exports
convert.readToEnd = readToEnd;

module.exports = convert;
