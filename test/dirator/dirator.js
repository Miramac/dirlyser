var fs = require('fs')
, path = require('path')
, crypto = require('crypto')
, program = require('commander')
, csv = require('csv')
, wrench = require('wrench')
, _ = require('underscore')
, dirlyser = require('dirlyser').dirlyser
;

var i //, exit = process.stdin.destroy()
, options = { //can be ovrrided by --json
	"project": "xy01"
	, "src": __dirname+"/template/web_download/"
	, "dest": "./temp/"
//	, "csv": "./directories.csv"
	, "force": false
	, "root": "/vol/www/download/htdocs/projects/"
	, "title": "Download"
	, "pwfile": "download.clients."
	, "userDir": "{{user}}"
	, "preserve": true
}

program
  .version('0.0.1')
  .usage('[options] <Projct-Code> <user> <password>')
  .option('-f, --force', 'Force override')
  .option('-c, --csv [file]', 'Input cvs file')
  .option('-j, --json [file]', 'Conf json file')
  .option('-u, --user [name]', 'User name')
  .option('-p, --password [pw]', 'User password')
  .option('-o, --override', 'Deleting all other files and folders')
  .parse(process.argv);

//TODO:if (program.json) options = require('../'+program.json);
if (program.force) options.force = true;
if (program.project) options.project = program.project;
if (program.user) options.user = program.user;
if (typeof program.password === 'string') options.password = program.password;
if (program.csv) options.csv = program.csv;
if (program.override) options.preserve = false;

// use args if csv file is missing
if (!options.csv) {
	if(!program.args.length) {
		program.help();//Exit if missing parameters
	} else{
		if(program.args.length === 1) {
			options.project = program.args[0];
			if(!options.user) {
				options.user = program.args[0];
			}
		} else if(program.args.length === 2) {
			options.project = program.args[0];
			options.user = program.args[1];
		} else if(program.args.length === 3) {
			options.project = program.args[0];
			options.user = program.args[1];
			options.password = program.args[2];
		}
		
		options.dest = path.join(options.dest,options.project, options.user)
		options.userDir = options.user;
		options.pwfile = options.pwfile + options.user;
		
	/* 
		//if password is missing
		program.password('Enter user password: ', '*', function(pass){
		console.log('PW: "%s"', pass);
		process.stdin.destroy();
		}); 
	 */	
		//kill process if pw or user missing
		if(!options.password) program.help();
			
		dirator(options, cb);
	}
	
	
//if a cvs file exists, use it		 
} else if(!fs.existsSync(options.csv)) { 
	console.log("Can't open file '"+options.csv+"'");
} else {
	var cvsData = []
	csv()
	.from.stream(fs.createReadStream(options.csv))
	.on('record', function(data,index){
		//Map csv data to to the option object
		var dirData = {
			dest: path.join(options.dest,options.project, data[0])
			, user: data[1]
			, userDir: data[1]
			, password: data[2]
			, pwfile: options.pwfile + data[1]
		}
		dirator(_.extend({},options, dirData), cd);
	})
	.on('end', function(count){
		console.log(count + ' cvs records processed');
	})
	.on('error', function(error){
		console.log(error.message);
	});
}

//Dummy cb
function cb(err, data) {
	console.log(err, data);
}

/** Main:
 * Deep copy src to the dest 
 * Search and replace in dest
 * Create user htacces pwfile
 * **/
function dirator(options, cb) {
	
	options.force = (options.force) ? options.force : false;
	options.preserve = (options.preserve) ? options.preserve : true;
	options.password = getPwHash(options.password);  
	console.log('Gernerating directories with folling options:\n', options, '\n');
	
	//create directory
	if(options.force || !fs.existsSync(options.dest)) {
		wrench.mkdirSyncRecursive(options.dest);
		wrench.copyDirSyncRecursive(options.src, options.dest, {preserve:options.preserve}); 
	}
	//add auth basic pw file
	fs.exists(path.join(options.dest,options.pwfile), function(exists) {
		fs.appendFile(path.join(options.dest,options.pwfile),  options.user + ':' + options.password);
	});
	
	//Search and replace 
	replace(options.dest , {
		filters: ['index\.php$', '\.htaccess']
		, type: 'replace' 
		, values: [{
			user: options.user
			, root: options.root
			, project: options.project
			, title: options.title
			, userDir: options.userDir
			, pwfile: options.pwfile
		}]
	}, function (err, data) {
		if(cb) cb(err, data);
	});
}

/**
 * search and replace in files file
 * */
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

//create an sha1 hash for auth basic 
function getPwHash(pw) {
	return '{SHA}' + crypto.createHash('sha1').update(pw).digest('base64')
}