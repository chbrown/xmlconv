#!/usr/bin/env node
var fs = require('fs');
var path = require('path');

var xmlconv = require('..');

function main() {
  var lib_path = require.resolve('../lib');
  var conventions = fs.readdirSync(path.dirname(lib_path)).filter(function(filename) {
    return filename.match(/\.js$/) && filename != 'index.js';
  }).map(function(filename) {
    return path.basename(filename, '.js');
  });

  var optimist = require('optimist')
  .usage([
    'Usage: xmlconv <doc.xml',
    '',
    'Convert XML into JSON following one of several conventions:',
    '  ' + conventions.join('\n  '),
    '',
    'Powered by libxml2',
  ].join('\n'))
  .describe({
    convention: 'convention to use in transformation',
    oneline: 'compress json output',

    help: 'print this help message',
    verbose: 'print extra output',
    version: 'print version',
  })
  .boolean(['oneline', 'help', 'verbose', 'version'])
  .alias({
    verbose: 'v',
    convention: 'c',
  })
  .default({
    convention: 'castle',
  });

  var argv = optimist.argv;

  if (argv.help) {
    optimist.showHelp();
  }
  else if (argv.version) {
    console.log(require('../package').version);
  }
  else {
    xmlconv.readToEnd(process.stdin, function(err, content) {
      if (err) throw err;

      if (argv.verbose) {
        console.error('Parsing XML: ' + content);
      }
      var obj = xmlconv(content, {convention: argv.convention});
      console.log(JSON.stringify(obj, null, argv.oneline ? null : '  '));
    });
  }
}

if (require.main === module) {
  main();
}
