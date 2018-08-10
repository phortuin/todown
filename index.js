require('dotenv-safe').config()
require('module-alias/register')
require('moment-timezone').tz.setDefault('Europe/Amsterdam')

const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const mongoSanitize = require('express-mongo-sanitize');
const Promise = require('bluebird');

mongoose.Promise = require('bluebird');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(mongoSanitize()); // Sanitize strings to prevent MongoDB Operator Injection
app.use(require('@lib/parse-method')) // Parses _method parameters to req.method

app.get('/', (req, res) => res.redirect('/today'))
app.use('/today', require('@routes/today'))
app.use('/tomorrow', require('@routes/tomorrow'))
app.use('/pages', require('@routes/pages'))
app.use('/tasks', require('@routes/tasks'))
app.use('/review', require('@routes/review'))
app.use('/action', require('@routes/action'))
app.use('/sections', require('@routes/sections'))

app.use(express.static('static/'));

// Error
app.use((err, req, res, next) => {
	if (app.get('env') === 'development') {
		console.error(err);
	}
	res.status(err.status || 500).send(err.message || 'Internal Server Error');
});

// Not found
app.use((req, res, next) => res.status(404).send('404'));

// $RUN
mongoose.connect(`${process.env.MONGO_URI}`, { useNewUrlParser: true })
	.then(() => {
		const port = process.env.PORT || 3006
		app.listen(port, () => {
			if (app.get('env') === 'development') {
				console.log('Development server available on http://localhost:' + port);
			}
		});
	})
	.catch(err => {
		console.error(err);
		process.exit(1);
	});
