const http = require('http');
const fs = require('fs');

const port = process.env.PORT || 5000;

http.createServer(function(req, res){
	res.writeHead(200, {'Content-Type': 'text/html' });
	var html = fs.readFileSync('./docs/index.html');
	res.write(html);
	// res.send("Hello world! This is working");

}).listen(port, function(){
	console.log(`Server running on ${port}`);
});