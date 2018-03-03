var {test} = require('tap');

var xmlconv = require('..');
var {readTranslationPair} = require('./bin');

var conventions = ['boids', 'castle', 'parker'];
var files = ['email', 'media'];

test('data xml-translation file pairs', function(t) {
  /** The Dom convention does not reduce to pure JSON, so it's not supported here.

  - For each convention,
    - For each support file pair currently implemented,
      - compare the static JSON output to output produced by running the xml
        through xmlconv.
  */
  t.plan(conventions.length);
  conventions.forEach(function(convention) {
    t.test('xml -> ' + convention, function(t) {
      t.plan(files.length);
      files.forEach(function(name) {
        var pair = readTranslationPair(name, convention);
        var converted = xmlconv(pair.xml, {convention: convention});
        var expected = JSON.parse(pair.json);
        t.equivalent(converted, expected, 'XML file pair should be converted according to ' + convention + ' convention');
      });
    });
  });
});
