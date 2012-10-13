
var sql = require('../lib/sql.js')
	, async = require('async')
	, dir = require('../')
	, fs = require('fs');;
 
//load sql config 
var conf = require('../conf.sql.js').conf;

var options = {
		filters: ['\.*'] //['\.pptx$' ,'\.ppt$']
		, unit: 'mb'
	}
	, _dirs = ['./','../', 'c:\\Python27\\']
	;
	
//console.log(require('./dirs.js'));
//Get new runId
sql.execute( "SELECT MAX(Run_ID) AS MaxRun_ID FROM Dirlyzer", function(err, data) {
	var runId = (data[0].MaxRun_ID !== null) ? data[0].MaxRun_ID+1 : 0;
	var dirs = require('./dirs.js').dirs;
	var i;
	for (i=0; i<dirs.length; i++) {
	//	console.log(dirs[i]);
		if(fs.existsSync(dirs[i])) {
			readAndLog(dirs[i],runId, options);
		}
	}
});


function readAndLog(item,runId, options) {
	dir.readSize(item, options, function(err, size) {
		
		//insert result
		var date = new Date();
		date = date.getDate()+'.'+(date.getMonth()+1)+'.'+date.getFullYear()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();					
		var sqlStr = "INSERT INTO dbo.Dirlyzer "
		+ "( Run_ID"
		+ " , Dirlyzer_Path"
		+ " , Dirlyzer_Size"
		+ " , Dirlyzer_SizeUnit"
		+ " , Dirlyzer_Date"
		+ " , Dirlyzer_Filter)"
		+ " VALUES "
		+ " ( " + runId
		+ " , '" + item + "'"
		+ " , " + dir.to(size, options.unit)
		+ " , '" + options.unit + "'"
		+ " , '" + date + "'"
		+ " , '" + options.filters.join(' | ') + "' )";
		
	 	console.log(dir.to(size, options.unit), options.unit,item);
		//sql.execute(sqlStr, function(err, data){if(err) console.log(err)});
	});
}