/**
 *  vocqy.js
 * 	Copyright 2011, Vocatus AG (http://www.vocatus.de)
 * 	Licensed under the BSD license (http://www.opensource.org/licenses/bsd-license.php)
 *
 *	@file sql.js
 *	@fileOverview vocQuery Sql functionality
 *	@version 0.1
 */
/**
 *	@class Sql functionality
 *	@this {Sql}
 */

var mssql = require('./node-sqlserver/sql.js')
 
//load sql config 
var conf = require('../conf.sql.js').conf;

 
var sql ={};
sql.execute = function (options, callback) {
	var sqlStr = (typeof options === 'string') ? options : options.sql;
	var query; 
	if(callback) {
		query = mssql.query(conf.connectionString, sqlStr, callback);
	} else {
		query = mssql.query(conf.connectionString, sqlStr);
	}
	query.on('error', function (err) { console.log("We had an error:\n " + err); });
}


exports.execute = sql.execute;
exports.exec = sql.execute;

//export node-sqlserver function
exports.query = mssql.query;
exports.queryRaw = mssql.queryRaw;
 