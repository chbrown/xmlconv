var {test} = require('tap');

var xmlconv = require('..');

function parker(xml) {
  return xmlconv(xml, {convention: 'parker'});
}

test('parker spec', function(t) {
  // these thirteen tests are mostly directly from the semi-official spec at:
  //   http://code.google.com/p/xml2json-xslt/wiki/TransformingRules
  t.equal(
    parker('<root>test</root>'),
    'test',
    'Root element should be dropped');
  t.equivalent(
    parker('<root><name>Xml</name><encoding>ASCII</encoding></root>'),
    {name: 'Xml', encoding: 'ASCII'},
    'Sibling elements with different names become object keys');
  t.equivalent(
    parker('<root><age>12</age><height>1.73</height></root>'),
    {age: 12, height: 1.73},
    'Numbers should be parsed automatically, distinguishing between integers and decimals');
  t.equivalent(
    parker('<root><checked>True</checked><answer>FALSE</answer></root>'),
    {checked: true, answer: false},
    'Boolean literals should be resolved to javascript boolean types');
  t.equal(
    parker('<root>Quote: &quot; New-line:\n</root>'),
    'Quote: \" New-line:\n',
    'Whitespace in childless nodes should be preserved');
  t.equivalent(
    parker('<root><nil/><empty></empty></root>'),
    {nil: null, empty: null},
    'Self-closing and empty elements should evaluate to null');
  t.equivalent(
    parker('<root><item>1</item><item>2</item><item>three</item></root>'),
    [1, 2, 'three'],
    'Siblings with identical names should be collapsed into an array of their values');
  t.equivalent(
    parker('<root version="1.0">testing<!--comment--><element test="true">1</element></root>'),
    {element: 1},
    'Text nodes with element siblings should be dropped and comments should be ignored');
  t.equivalent(
    parker('<root xmlns:ding="http://zanstra.com/ding"><ding:dong>binnen</ding:dong></root>'),
    {'ding:dong': 'binnen'},
    'Namespaces should be interpreted literally');
  t.equivalent(
    parker('<root><while>true</while><wend>false</wend><only-if/></root>'),
    {'while': true, 'wend': false, 'only-if': null},
    'Javascript keywords and invalid variable names should be allowed');
  t.equivalent(
    parker('<root><![CDATA[<script>alert("YES");</script>]]></root>'),
    '<script>alert("YES");<\/script>',
    'CDATA should be interpreted as a literal string');
  t.equivalent(
    parker('<root>2006-12-25</root>'),
    new Date('2006-12-25'), // assumes UTC, btw
    'Dates should be parse automatically');
  t.equivalent(
    parker('<!--testing--><root><test version="1.0">123</test></root>'),
    /*testing*/{test/*@version="1.0"*/: 123}, // I'm not quite sure what the spec is going for here.
    'Comments should be stripped.');

  t.end();
});

test('parker extended spec', function(t) {
  t.equal(parker('<root>12</root>'), 12,
    'Integers should be interpreted as integers');
  t.equal(parker('<root>12</root>'), 12.0,
    'JavaScript maybe should not consider floats and integers equal, but oh well');
  t.equal(parker('<root>12,000</root>'), '12,000',
    'Thousands separators should disqualify integers');
  t.equal(parker('<root>12,000.00</root>'), '12,000.00',
    'Thousands separators should disqualify decimals');

  t.end();
});
