
var crypto = require('crypto');

var users = [
	'vj06:JK43fZp8eQd'
];

users.forEach(function(user) {
	var data = user.split(':');
	console.log(data[0]+':'+getPwHash(data[1]));
});

function getPwHash(pw) {
	return '{SHA}' + crypto.createHash('sha1').update(pw).digest('base64')
}

