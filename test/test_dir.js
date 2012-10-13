
fs = require('fs')
, dir = require('../')
, direrator = require('../direrator') 
, util = require('util')
, csv = require('csv')
, path = require('path')
, crypto = require('crypto');
;

var options = {
	filters: ['\.ini$']
	, unit: 'b' //for readSize()
	, src: './tpl/'
	, dest: './temp/'
	, csv: './dir.csv'
	, force: false
	, edits: [{
		filters: ['\.ini$']
		, type: 'replace' //add, addTop
		, values: [{
			col1: 'Hello '
			, col2: 'World '
		}]
	},{
		filters: ['\.txt$']
		, type: 'addTop'
		, values: ['User: {{col1}}}', 'Num: {col2}}']
	}]
};

 direrator.create(options, function (err, data) {
	editByCvs(options)
  });

// direrator.edit(options.dest, options.edits, function (err, data) {
	// console.log(err, data)
// });

	//
	
	function editByCvs(options) {
		csv()
		.from.stream(fs.createReadStream(options.csv))
		.on('record', function(data,index){
			data[2] = crypto.createHash('sha1').update(data[2]).digest('base64')
			
			 var edits =  [{
					filters: ['\.txt$']
					, type: 'add'
					, values: ['User: '+data[1], 'Num: '+data[2]]
				},{
					 filters: ['\.ini$']
					 , type: 'replace' 
					 , values: [{
						 col1: data[1]
						 , col2: data[2]
				}]
			}];
			 
			direrator.edit(path.join(options.dest,data[0]), edits, function (err, data) {
			});
			
		}).on('end', function(count){
			console.log(count + ' records');;
		})
		.on('error', function(error){
			console.log(error.message);
		});
	}
	
/*
dir.readSize(options.dest, options, function(err, size) {
	console.log(dir.to(size, options.unit), options.unit);
});
*/
/* 
dir.readDir(options.dest, options, function(err, dirs) {
	console.log(err);
	console.log(dirs);
});
 */