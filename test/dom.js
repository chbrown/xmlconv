'use strict'; /*jslint es5: true, node: true, indent: 2 */
var fs = require('fs');
var path = require('path');
var test = require('tap').test;

var xmlconv = require('..');
var helpers = require('./');

test('dom media file', function (t) {
  var xml = fs.readFileSync(path.join(__dirname, 'data', 'media.xml'), 'utf8');
  var dom = xmlconv(xml, {convention: 'dom'});

  t.equal(dom.findOne('book').attributes.id, '1', 'First book should have id = "1"');
  t.equal(dom.find('book').length, 2, 'There should be two books');
  t.equal(dom.findOne('album').findOne('title').text, 'For Real', 'RS album title should be "For Real"');
  t.end();
});
