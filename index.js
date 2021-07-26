const express = require('express');
const path = require('path');

var app = express();

const port = process.env.PORT || 5000;

app.use('/docs', express.static(path.resolve(__dirname, 'docs')));

app.get('/*', (req, res) => {
	res.sendFile(path.resolve(__dirname, 'docs', 'index.html'));
});

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});