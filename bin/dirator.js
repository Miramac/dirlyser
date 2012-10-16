var fs = require('fs')
, path = require('path')
, crypto = require('crypto')
, program = require('commander')
, csv = require('csv')
, wrench = require('wrench')
, _ = require('underscore')
, dirator = require('../lib/dirator')
//, dirlyser = require('dirlyser').dirlyser
;

var i //, exit = process.stdin.destroy()
, options = { //can be ovrrided by --json
	"project": "xy01"
	, "src": path.join(__dirname, "/../templates/web_download/")
	, "dest": "./temp/"
//	, "csv": "./directories.csv"
	, "force": false
	, "files": [{
		"name": "#pwfile#"
		, "data": "#user#:#password#"
		}]
	//replacements
	, "root": "/vol/www/download/htdocs/projects/"
	, "title": "Download"
	, "pwfile": "download.clients_#userDir#"
	, "userDir": "#user#"
	, "preserve": true
}

program
  .version('0.0.1')
  .usage('[options] <Projct-Code> <user> <password>')
  .option('-f, --force', 'Force override')
  .option('-c, --csv [file]', 'Input cvs file')
  .option('-j, --json [file]', 'Config json file')
  .option('-u, --user [name]', 'User name')
  .option('-p, --password [pw]', 'User password')
  .option('-o, --override', 'Deleting all other files and folders')
  .option('-t, --test', 'Test mode')
  .parse(process.argv);

//TODO:if (program.json) options = require('../'+program.json);
if (program.force) options.force = true;
if (program.project) options.project = program.project;
if (program.user) options.user = program.user;
if (typeof program.password === 'string') options.password = program.password;
if (program.csv) options.csv = program.csv;
if (program.override) options.preserve = false;
if (program.test) options.test = true;


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
		options.pwfile = strReplace(options.pwfile, {"userDir":options.user});
		
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
			, pwfile: strReplace(options.pwfile, {"userDir":data[1]})
		}
		dirator(_.extend({},options, dirData), cb);
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
	if(err) console.log(err)
//	console.log(data);
}

function strReplace(str, obj, mark, options) {
	mark = (mark) ? mark : '#';
	options = (options) ? options : 'g';
	for (var key in obj) {
		if(obj.hasOwnProperty(key)) {
			str = str.replace(new RegExp(mark+key+mark, options), obj[key]);
		}
	}
	return str;
}
