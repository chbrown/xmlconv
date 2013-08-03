# xmlconv: XML conversion by convention

    npm install xmlconv

Powered by [libxmljs](https://github.com/polotek/libxmljs), see the [libxmljs API documentation](https://github.com/polotek/libxmljs/tree/master/docs/api) for help implementing other conventions.

## Example

Convert a pretty simple document according to the Parker convention:

```javascript
var xmlconv = require('xmlconv');
var xml = [
  '<?xml version="1.0" ?>',
  '<note>',
  '  <to>The W3C</to>',
  '  <from>Chris</from>',
  '  <subject>XML</subject>',
  '  <body>I just wish XML was drier.</body>',
  '</note>'
].join('\n');
var obj = xmlconv(xml, {convention: 'parker'});
console.log(JSON.stringify(obj, null, '  '));
```

This will print the following JSON output:

```json
{
  "to": "The W3C",
  "from": "Chris",
  "subject": "XML",
  "body": "I just wish XML was drier."
}
```

## Supported conventions

| Convention | Email example | Media example |
|:-----------|:--------------|:--------------|
| **XML**    | [email](test/data/email.xml) | [media](test/data/media.xml) |
| parker     | [email](test/data/email.parker) | [media](test/data/media.parker) |
| castle     | [email](test/data/email.castle) | [media](test/data/media.castle) |
| boids      | [email](test/data/email.boids) | [media](test/data/media.boids) |
| dom        | (not pure JSON) | |

## TODO

Implement additional conventions:

* Spark
* [Badgerfish](http://dropbox.ashlock.us/open311/json-xml/) and at [sklar's site](http://www.sklar.com/badgerfish/)
* GData
* Abdera
* JsonML
* oData

[Conventions](http://wiki.open311.org/JSON_and_XML_Conversion)

## Testing

Continuous integration:

[![Travis CI Build Status](https://travis-ci.org/chbrown/xmlconv.png?branch=master)](https://travis-ci.org/chbrown/xmlconv)

Running tests locally:

    npm test

See `node-tap` [documentation](https://github.com/isaacs/node-tap/blob/master/lib/tap-assert.js) for the implications of the various testing verbs (e.g., `equal` vs. `equivalent` vs. `similar`).

## License

Copyright © 2013 Christopher Brown. [MIT Licensed](LICENSE).
