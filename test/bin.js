'use strict'; /*jslint es5: true, node: true, indent: 2 */
var fs = require('fs');
var path = require('path');
var child_process = require('child_process');
var test = require('tap').test;

var xmlconv = require('..');
var helpers = require('./');

test('import', function (t) {
  t.ok(xmlconv !== undefined, 'xmlconv should load from the current directory');
  t.end();
});

test('cli', function (t) {
  var xmlconv_bin = path.join(__dirname, '..', 'bin', 'xmlconv.js');
  var proc = child_process.spawn(xmlconv_bin, ['--convention', 'castle'], {stdio: 'pipe'});

  var pair = helpers.readTranslationPair('media', 'castle');
  // but we want to stream `pair.xml`, so read it again.
  fs.createReadStream(pair.xml_path).pipe(proc.stdin);

  var stdout = '';
  proc.stdout.on('data', function(chunk) {
    stdout += chunk;
  }).on('end', function() {
    var output = JSON.parse(stdout);
    var expected = JSON.parse(pair.json);
    t.similar(output, expected, 'bin/xmlconv.js output did not match expectations');
    t.end();
  });
});
