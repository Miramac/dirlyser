directory-size-analyser
=======================

Node script to analyze directories or create new directories from templates. 

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