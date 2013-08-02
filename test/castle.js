'use strict'; /*jslint es5: true, node: true, indent: 2 */
var test = require('tap').test;

var xmlconv = require('..');
var helpers = require('./');

test('castle files', function (t) {
  var files = ['email', 'media'];
  t.plan(files.length);
  files.forEach(function(name) {
    var pair = helpers.readTranslationPair(name, 'castle');
    var converted = xmlconv(pair.xml, {convention: 'castle'});
    var expected = JSON.parse(pair.json);
    t.equivalent(converted, expected, 'XML should be converted with castle convention');
  });
});
