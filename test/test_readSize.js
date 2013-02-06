    var dirlyser = require('../')
	, _ = require('underscore')
    , options = {
      //filters: ['*'] //  just count .js or .json files: ['\.js(on)*$']
       unit: 'gb'
    };
	var dirlist = { 
		dirs: []
		, total:0
		, groups: []
	};
	var file = 'c:/"Program Files"/Vocatus/_DEV_Work';
    dirlyser.readSize(file, options, function(err, size) {
      console.log(dirlyser.to(size, options.unit), options.unit);
	  dirlist.dirs.push( { 
		  name: file
		  , size: dirlyser.to(size, options.unit)
		  , group: file.split('/').slice(0,file.split('/').length -2).join('/')
	  });
	  dirlist.total += dirlyser.to(size, options.unit)
	   console.log(dirlist);
    });
	
	
	