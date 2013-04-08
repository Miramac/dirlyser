var fs = require('fs')
	, path = require('path')
	, async = require('async')
	, util = require('util')
;


var dirlyser = {};
dirlyser.readAll = readAll;
dirlyser.readDir = readDir;
dirlyser.readSize = readSize;
dirlyser.to = to;
module.exports = dirlyser;

//reads directory and files recursive
function readAll( item, options, cb ) {
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
						readAll( path.join( item, dirItem ), options, function( err, file ) {
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


//reads directory files recursive
function readDir(item, options, cb) {
	var files = [];
	if(typeof options === 'function') {
		cb = options;
		options = {};
	}
	options.filters = (options.filters) ? options.filters : ['.*'];
	
	fs.lstat(item, function(err, stats) {
		//read subdir async
		if (!err && stats.isDirectory()) {
			fs.readdir(item, function(err, items) {
				async.forEach(
				items
				, function(dirItem, callback) {
					readDir(path.join(item, dirItem), options, function(err, file) {
						//Test filter
						if(testFilter(file.toString(), options.filters) ) {
							files.push(file);
						//console.log(file);
						}
						callback(err);
					});
				}, function(err) {
					cb( err, files);
				});  
			}); 
		}else {
			if(err) {
				console.log(err);
				cb(err);
			} else {
				cb( err, item );
			}
		}   
	}); 
}

//reads directory size recursive
function readSize(item, options, cb) {
	var total = 0;
	if(typeof options === 'function') {
		cb = options;
		options = {};
	}
	options.filters = (options.filters) ? options.filters : ['.*'];
	
	fs.lstat(item, function(err, stats) {
		//read subdir async
		if (!err && stats.isDirectory()) {
			fs.readdir(item, function(err, items) {
				async.forEach(
					items
					, function(dirItem, callback) {
						readSize(path.join(item, dirItem), options, function(err, size) {
							//Test filter
							if(testFilter(dirItem, options.filters) ) {
								total +=  size;
							}
							callback(err);
						});
					}, function(err) {
						cb(err, total);
				});  
			}); 
		}else {
			if(err) {
				console.log(err);
				cb(err, 0 );
			} else {
				cb(err, (stats.size) ? stats.size : 0 );
			}
		}   
	}); 
}

function testFilter(fileName, fileFilters) {
	for (var i=0; i<fileFilters.length; i++) {
		if (fileName.match(fileFilters[i])){
			return true;
		}
	}
	return false;
}

function to(size,toMesure){
	toMesure = (typeof toMesure === 'string') ? toMesure.toLowerCase() :'';
	switch(toMesure){
		case 'b':
				size = Math.round(size*8*10)/10;
			break;
		case 'by':
				size = Math.round(size*10)/10;
			break;
		case 'kb':
				size = Math.round(size/1024*10)/10;
			break;
		case 'mb':
				size = Math.round(size/1024/1024*10)/10;
			break;
		case 'gb':
				size = Math.round(size/1024/1024/1024*10)/10;
			break;
		default:
				size = Math.round(size/1024/1024*10)/10;
			break;
	}
	return size;
}