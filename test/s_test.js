var async = require('async')
	, wrench = require('wrench')
	, _ = require('underscore')
	, fs = require('fs')
	, path = require('path')
	, async = require('async')
	, util = require('util')
	;
	

/*
Dir-Filters: ['\\\\lib$'] 
File-Filter: ['\.zip$'] 'alt\.[a-z,A-Z]+$'

//Alle Alt Verzeichnisse (wie  [/\\\d\d_alt$/i] 
*/

find('../', {filters: [/alt$/i, /\.bak$/i]}, function(err, files) {
	files = _.flatten(files);
	if(	err) console.log('ERROR: '+ (err));
		console.log((files));
	console.log("done")	
});

function find( item, options, cb ) {
	var results = [];
	if(typeof options === 'function') {
		cb = options;
		options = {};
	}
	options.filters = ( options.filters ) ? options.filters : false;
	
	fs.lstat( item, function( err, stats ) {

		//read subdir async
		if ( !err && stats.isDirectory() ) {

			if(testFilter( item.toString(), options.filters ) ) {
				results.push( item );
		//		console.log('DIR: '+item);
				cb( err, results );
			}else {
				fs.readdir(item, function(err, items) {
					async.forEach(
					items
					, function( dirItem, callback ) {
						find( path.join( item, dirItem ), options, function( err, file ) {
							//Test filter
							if(testFilter( file.toString(), options.filters ) ) {
								results.push( file );
								//console.log(' FILE: '+file );
							}
							callback(err);
						});
					}, function(err) {
						cb( err, results);
					});  
				}); 
			}
		}else{
			if(err) {
				console.log(err);
				cb(err);
			} else {
				cb( err, item );
			}
		 }
	}); 
}


function testFilter(str, filters) {

	if(filters) {	//console.log(str,filters);
		try {
			for (var i=0; i<filters.length; i++) {
				if (str.match(filters[i])){
					return true;
				}
			}
			return false;
		} catch(e) {	
			console.log('Error in testFilter(): ' + e);
			return false;
		}
	} else {
		return true;
	}
}