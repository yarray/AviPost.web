var express = require('express');

var app = express();
app.use('/api', express.static(__dirname + '/api'));

var port = 3001;
console.log('listening on port ' + port + '...');
app.listen(3001);
