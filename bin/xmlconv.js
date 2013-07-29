#!/usr/bin/env node
'use strict'; /*jslint es5: true, node: true, indent: 2 */
var fs = require('fs');
var path = require('path');

var xmlconv = require('..');

function main() {
  var optimist = require('optimist')
    .usage('Usage: xmlconv <doc.xml --convention castle')
    .describe({
      convention: 'XML conversion convention to use',
      format: 'indent json output',

      help: 'print this help message',
      verbose: 'print extra output',
      version: 'print version',
    })
    .boolean(['help', 'verbose', 'version'])
    .alias({verbose: 'v', convention: 'c'})
    .default({
      format: true,
      convention: 'castle',
    });

  var argv = optimist.argv;

  if (argv.help) {
    optimist.showHelp();
  }
  else if (argv.version) {
    var package_json_path = path.join(__dirname, '../package.json');
    fs.readFile(package_json_path, 'utf8', function(err, data) {
      var obj = JSON.parse(data);
      console.log(obj.version);
    });
  }
  else {
    // set up destination here, so that testing the curl function is easier.
    xmlconv.readToEnd(process.stdin, function(err, content) {
      if (err) {
        throw err;
      }
      else {
        if (argv.verbose) {
          console.log('Parsing XML: ' + content);
        }
        var obj = xmlconv(content, argv);
        if (argv.format) {
          console.log(JSON.stringify(obj, null, '  '));
        }
        else {
          console.log(JSON.stringify(obj));
        }
      }
    });
  }
}

if (require.main === module) { main(); }
