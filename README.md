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

## TODO

Currently only a semblance of Parker is implemented. Add others:

* Actual Parker
* Spark
* Badgerfish
* _etc._

[Conventions](http://wiki.open311.org/JSON_and_XML_Conversion)

## License

Copyright © 2013 Christopher Brown. [MIT Licensed](LICENSE).
