var http = require('http');

var config = require('./config.json');

var express = require('express');

var app = express();

var possibleValues = config.possibleValues;

delete config.possibleValues;	// avoid sending unused data to UI


require('ludwig-ui')(app, __dirname, config);

app.use('/api', require('ludwig-api')({
	possibleValues: possibleValues,
	simulate: function(test, done) {
		http.get(test.scenario, function(res) {
			var result = '';

			res.on('data', function(chunk) {
				result += chunk;
			});
			res.on('end', function() {
				done(null, JSON.parse(result).values);
			});
			res.on('error', done);
		});
	},

	onCreate: function(test, done) {
		done();	// nothing to do at the moment
	}
}));


var port = process.env.PORT || 9000;

// Start server
app.listen(port, function () {
	console.log('Express server listening on port', port, 'in mode', app.get('env'));
});

module.exports = app;