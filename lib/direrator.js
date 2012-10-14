var fs = require('fs')
	, path = require('path')
	, csv = require('csv')
	, wrench = require('wrench')
	, dirlyser = require('../dirlyser')
	, async = require('async')
	, _ = require('underscore')
;


var direrator = {};
direrator.create = create
direrator.edit = edit
module.exports = direrator;

//
//creates new directories from
function create(options, cb) {
	options.force = (options.force) ? options.force : false;
	options.index = (options.index) ? options.index : 0;
	options.preserve = (options.preserve) ? options.preserve : true;
	
	var cvsData = []
	, cbData;
	if(fs.existsSync(options.csv)) {
		csv()
		.from.stream(fs.createReadStream(options.csv))
		.on('record', function(data,index){
			var src = options.src
			, dest = path.join(options.dest, data[options.index]);
			
			if(options.force || !fs.existsSync(dest)) {
				copyDir(src, dest, options)
				cvsData.push(data);
			}
		}).on('end', function(count){
				cb(null, cvsData, count);
		})
		.on('error', function(error){
			console.log(error.message);
		});
	} else if (options.src && options.dest) {
		copyDir(options.src, options.dest, options);
		cb(null, [options]);
	}
}
function copyDir(src, dest, options) {
	wrench.mkdirSyncRecursive(dest);
	wrench.copyDirSyncRecursive(src, dest, options.preserve); 
}
//
//modifires files
//  search and replace, add text
function edit(root, options, cb){
	options.edits = (options.edits) ? options.edits : options;
	async.map(
		options.edits
		, function(item, callback) {
			
			if(item.type === 'add') {
				add(root, item);
			}
			if(item.type === 'addTop') {
				addTop(root, item);
			}
			if(item.type === 'replace') {
				replace(root, item);
			}
			
			callback(null, root)
		}, function(err, files) {
			cb ( err, files );
	}); 
}

//add text on the end on a file
function add(root, options, callback) {
	dirlyser.readDir(root, options, function(err, files) {
		files = _.flatten(files);
		//console.log(files);
		_.each(files, function(file){
			fs.appendFile(file, '\n'+ options.values.join('\n'), function (err) {
				if (err) throw err;
			});
		});
	});
}
//add text on the top on a file
function addTop(root, options, callback) {
	dirlyser.readDir(root, options, function(err, files) {
		files = _.flatten(files);
		//console.log(files);
		_.each(files, function(file){
			fs.readFile(file, 'UTF-8', function (err, data) {
				if (err) throw err;
				fs.writeFile(file, options.values.join('\n') + '\n' + data);
			});
		});
	});
}
//search and replace in files file
function replace(root, options, callback) {
	dirlyser.readDir(root, options, function(err, files) {
		files = _.flatten(files);
		//console.log(files);
		_.each(files, function(file){ 
			fs.readFile(file, 'UTF-8', function (err, data) {
				if (err) throw err;
				var i, value;
				for(i=0; i<options.values.length; i++) {
					value = options.values[i];
					if(value === Object(value)) {
						for (key in value) {
							if(value.hasOwnProperty(key)) {
								data = data.replace(new RegExp('{{'+key+'}}','g'), value[key]);
							}
						}
					}
					//console.log(file,data);
					fs.writeFile(file, data);
				}
			});
		});	
		if(callback) callback(err, files);
	});
}