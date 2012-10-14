
fs = require('fs')
, dirlyser = require('../').dirlyser
, direrator = require('../').direrator
, util = require('util')
, csv = require('csv')
, path = require('path')
, crypto = require('crypto');
;

var options = {
	filters: ['\.ini$']
	, unit: 'b' //for readSize()
	, src: './tpl/' //for create()
	, dest: './temp/' //for create()
	, csv: './dir.csv' //for create()
	, index: 0  //for create()
	, force: false //for create()
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
		, values: ['User: {{col1}}}', 'Num: {{col2}}']
	}]
};

 direrator.create(options, function (err, data) {
	 direrator.edit(options.dest, options.edits, function (err, data) {
		  console.log(err, data)
		 });
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
dirlyser.readSize(options.dest, options, function(err, size) {
	console.log(dirlyser.to(size, options.unit), options.unit);
});
*/
/* 
dirlyser.readDir(options.dest, options, function(err, dirs) {
	console.log(err);
	console.log(dirs);
});
 */