# xmlconv: XML conversion by convention

    npm install xmlconv

Powered by [libxmljs](https://github.com/polotek/libxmljs).

## Example

```javascript
var xmlconv = require('xmlconv');
var xml = [
  '<?xml version="1.0" ?>',
  '<note>',
  '  <to>Chris</to>',
  '  <from>Other Chris</from>',
  '  <subject>XML</subject>',
  '  <body>I just wish XML was easier to read, you know?</body>',
  '</note>'
].join('\n');

var obj = xmlconv(xml, {convention: 'parker'});
console.log(JSON.stringify(obj, null, '  '));
```

Currently Parker is only partly implemented, along with a similar but tighter convention I'm calling "Castle".

## TODO

* Complete the implementation of Parker
  (currently have failing tests from the [spec](http://code.google.com/p/xml2json-xslt/wiki/TransformingRules))
* Spark
* [Badgerfish](http://dropbox.ashlock.us/open311/json-xml/) and at [sklar's site](http://www.sklar.com/badgerfish/)
* GData
* Abdera
* JsonML
* oData

[Conventions](http://wiki.open311.org/JSON_and_XML_Conversion)

## License

Copyright © 2013 Christopher Brown. [MIT Licensed](LICENSE).
