var express = require('express');
var cors = require('cors');

var app = express();
app.use(cors());

app.use('/api', express.static(__dirname + '/api'));

var port = 3001;
console.log('listening on port ' + port + '...');
app.listen(3001);
