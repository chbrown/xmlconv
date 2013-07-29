'use strict'; /*jslint es5: true, node: true, indent: 2 */
var fs = require('fs');
var test = require('tap').test;

var xmlconv = require('..');
var helpers = require('./');

test('parker pairs', function (t) {
  var translation_pairs = [
    ['<root>test</root>', "test"],
    ['<root><name>Xml</name><encoding>ASCII</encoding></root>', {"name":"Xml","encoding":"ASCII"}],
    ['<root><age>12</age><height>1.73</height></root>', {"age":12,"height":1.73}],
    ['<root><checked>True</checked><answer>FALSE</answer></root>', {"checked":true,"answer":false}],
    ['<root>Quote: &quot; New-line:\n</root>', 'Quote: \" New-line:\n"'],
    ['<root><nil/><empty></empty></root>', {"nil":null,"empty":null}],
    ['<root><item>1</item><item>2</item><item>three</item></root>', [1,2,"three"]],
    ['<root version="1.0">testing<!--comment--><element test="true">1</element></root>', {element:true}],
    ['<root xmlns:ding="http://zanstra.com/ding"><ding:dong>binnen</ding:dong></root>', {"ding:dong":"binnen"}],
    ['<root><while>true</while><wend>false</wend><only-if/></root>', {"while":true,wend:false,"only-if":null}],
    ['<root><![CDATA[<script>alert("YES");</script>]]></root>', {script:"<script>alert(\"YES\")<\/script>"}],
    ['<root>2006-12-25</root>', new Date(2006, 12-1, 25)],
    ['<!--testing--><root><test version="1.0">123</test></root>', /*testing*/{test/*@version="1.0"*/:123}],
  ];

  translation_pairs.forEach(function(pair) {
    var xml = pair[0];
    var expected = pair[1];

    var converted = xmlconv(xml, {convention: 'parker'});
    t.similar(converted, expected, 'XML was not converted correctly.');
  });

  t.end();
});

test('parker files', function (t) {
  var files = ['email', 'media'];
  t.plan(files.length);
  files.forEach(function(name) {
    var pair = helpers.readTranslationPair(name, 'parker');
    var converted = xmlconv(pair.xml, {convention: 'parker'});
    var expected = JSON.parse(pair.json);
    t.similar(converted, expected, 'XML was not converted under castle convention');
  });
});
