var sql = require('../lib/sql.js')
	, wrench = require('wrench')
	, dir = require('../')
	, fs = require('fs')
	;
	
//filters: ['\.*'] 
/*
dir.readDir('h:/', {filters: ['\.zip$']}, function(err, files) {
	console.log(files);
console.log("done")	
});
*/

var options = { filters: ['.*alt.*\.zip$'] };

wrench.readdirRecursive('h:', function(error, curFiles) {
	if(curFiles) {
		for(var i=0; i<curFiles.length; i++) {
			if(testFileFilter(curFiles[i].toString(), options.filters)) {
				console.log(curFiles[i]);
			}
		}
	}
});


function testFileFilter(fileName, fileFilters) {
	try {
		for (var i=0; i<fileFilters.length; i++) {
			if (fileName.match(fileFilters[i])){
				return true;
			}
		}
		return false;
	} catch(e) {
		return false;
	}
}