    var dirlyser = require('../')
    , options = {
      filters: ['\.js(on)*$'] //just count .js or .json files 
      , unit: 'kb'
    };
    
    dirlyser.readSize('../', options, function(err, size) {
      console.log(dirlyser.to(size, options.unit), options.unit)
    });