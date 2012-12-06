
var crypto = require('crypto');

var users = [
	'user01:PWXY1234'
];

users.forEach(function(user) {
	var data = user.split(':');
	console.log(data[0]+':'+getPwHash(data[1]));
});

function getPwHash(pw) {
	return '{SHA}' + crypto.createHash('sha1').update(pw).digest('base64')
}

