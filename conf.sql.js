var conf = {
	name: 'MAB_Master'
	, defaultDatabase: 'ZI00_Development'
	, defaultSchema: 'dbo'
	, connectionSettings: {
		server: 'db1-muc\\SQL5_MUC'
		, useTrustedConnection: true //if false Username and PW will be used
		, dbUser: ''
		, dbPassword: ''
		, driver: 'SQL Server Native Client 11.0'
		, provider: false
	}
};

//Build the connection string
//Driver
conf.connectionString = 'Driver={'+conf.connectionSettings.driver+'};';
//Provider if needed
conf.connectionString += (conf.connectionSettings.provider) ? 'Provider={'+conf.connectionSettings.provider+'};' : '' ;
//server and db
conf.connectionString += 'Server='+conf.connectionSettings.server+';Database={'+conf.defaultDatabase+'};';
// TrustedConnection?
if(conf.connectionSettings.useTrustedConnection) {
	conf.connectionString += 'Trusted_Connection={yes}'
} else {
	conf.connectionString += 'User Id={'+conf.connectionSettings.dbUser+'};Password={'+conf.connectionSettings.dbPassword+'};';
}


//export config
exports.conf = conf;
