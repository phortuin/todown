require('dotenv-safe').config()
require('module-alias/register')
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const mongoSanitize = require('express-mongo-sanitize');
const renderer = require('./lib/renderer');
const Promise = require('bluebird');

const app = express();
const isDevelopment = ('development' === process.env.NODE_ENV);

const Task = require('./app/models/task')

mongoose.Promise = require('bluebird');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(mongoSanitize()); // Sanitize strings to prevent MongoDB Operator Injection
app.use(require('@lib/parse-method')) // Parses _method parameters to req.method

app.use((req, res, next) => {
	renderer.addGlobal('SITE', {
		title: 'Todown',
		description: 'Todownify yo self',
		current_url: req.protocol + '://' + req.get('host') + req.originalUrl,
		host: req.get('host'),
		domain: req.protocol + '://' + req.get('host') + '/',
		path: req.path
	});
	renderer.addGlobal('QS', req.query);
	next();
});

app.get('/', (req, res) => res.redirect('/today'));

app.use('/log', require('./app/routes/log'));
app.use('/maintenance', require('./app/routes/maintenance'));
app.use('/review', require('./app/routes/review'));
app.use('/actionable', require('./app/routes/actionable'));
app.use('/search', require('./app/routes/search'));
app.use('/tasks', require('./app/routes/tasks'));
app.use('/starred', require('./app/routes/starred'));
app.use('/pages', require('./app/routes/pages'));

app.use('/today', require('./app/routes/today'))

app.use(express.static('static/'));

// Error
app.use((err, req, res, next) => {
	if (isDevelopment) {
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
			if (isDevelopment) {
				console.log('Development server available on http://localhost:' + port);
			}
		});
	})
	.catch(err => {
		console.error(err);
		process.exit(1);
	});
