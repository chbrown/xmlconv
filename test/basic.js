'use strict'; /*jslint node: true, es5: true, indent: 2 */
var fs = require('fs');
var test = require('tap').test;

var xmlconv = require('..');

test('import', function (t) {
  t.ok(xmlconv !== undefined, 'xmlconv should load from the current directory');
  t.end();
});

test('stringify', function (t) {
  var xml = [
    '<?xml version="1.0" ?>',
    '<note>',
    '  <to>Chris</to>',
    '  <from>Other Chris</from>',
    '  <subject>XML</subject>',
    '  <body>I just wish XML was easier to read, you know?</body>',
    '</note>'
  ].join('\n');

  var expected = {
    note: {
      to: "Chris",
      from: "Other Chris",
      subject: "XML",
      body: "I just wish XML was easier to read, you know?"
    }
  };

  var obj = xmlconv(xml, {convention: 'parker'});
  t.similar(obj, expected, 'XML was not converted correctly.');
  t.end();
});
