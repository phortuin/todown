const express = require('express');
const renderer = require('./lib/renderer');

const app = express();
const isDevelopment = ('development' === process.env.NODE_ENV);
const port = process.env.PORT || 3000;

app.get('/', (req, res, next) => {
	res.send(renderer.render('views/index.html', { title: 'hoi' }));
});

app.use(express.static('static/'));

// $RUN
app.listen(port, () => {
	if (isDevelopment) {
    	console.log('Development server available on http://localhost:' + port);
	}
});
