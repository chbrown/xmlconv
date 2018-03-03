var fs = require('fs');
var path = require('path');
var child_process = require('child_process');
var {test} = require('tap');

var xmlconv = require('..');

/** Testing helper used below and in test/data-pairs.js */
function readTranslationPair(name, convention) {
  var xml_path = path.join(__dirname, 'data', name + '.xml');
  var json_path = path.join(__dirname, 'data', name + '.' + convention);
  return {
    xml: fs.readFileSync(xml_path, 'utf8'),
    xml_path: xml_path,
    json: fs.readFileSync(json_path, 'utf8'),
    json_path: json_path,
  };
}
exports.readTranslationPair = readTranslationPair;

test('import', function(t) {
  t.ok(xmlconv !== undefined, 'xmlconv should load from the current directory');
  t.end();
});

test('cli', function(t) {
  var xmlconv_bin = path.join(__dirname, '..', 'bin', 'xmlconv.js');
  var proc = child_process.spawn(xmlconv_bin, ['--convention', 'castle'], {stdio: 'pipe'});

  var pair = readTranslationPair('media', 'castle');
  // but we want to stream `pair.xml`, so read it again.
  fs.createReadStream(pair.xml_path).pipe(proc.stdin);

  var stdout = '';
  proc.stdout.on('data', function(chunk) {
    stdout += chunk;
  }).on('end', function() {
    var output = JSON.parse(stdout);
    var expected = JSON.parse(pair.json);
    t.equivalent(output, expected, 'bin/xmlconv.js output should match expectations');
    t.end();
  });
});
