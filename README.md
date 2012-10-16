directory-size-analyser
=======================

Node script to analyse directorys or create new directoies form a templates. 

## Usage

Read directory size recursive:

    var dirlyser = require('dirlyser')
    , options = {
      filters: ['\.js(on)*$'] //just count .js or .json files 
      , unit: 'kb'
    };
    
    dirlyser.readSize('../', options, function(err, size) {
      console.log(dirlyser.to(size, options.unit), options.unit)
    });