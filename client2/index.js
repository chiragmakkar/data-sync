var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');
var fs = require('fs');

var server = require('http').createServer(app);
var port = process.env.PORT || 4000;

var parentDir = '/Users/chiragmakkar/Desktop/client2/public';
var serverAddr = 'http://localhost:5000';

var signature = 'sign2';
var timestamp = new Date().getTime();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended:true
}))

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

fs.watch(parentDir, {recursive : true}, function(eventType, filename){
	//console.log('event type is: '+eventType);
	if(filename){
		//console.log('filename provided: '+filename);
		if(eventType == 'change'){
      /*Notice changes, generate a json request and send it to cloud.*/
      fs.readFile(parentDir+'/'+filename, 'utf8', function (err,data) {
        if (err) {
          return console.log(err);
        }
        var changes = {
          "file2":filename,
          "signature2":signature,
          "timestamp2":Date.now(),
          "content2": data
        };
        request(serverAddr+'/'+filename, function(error, response, body) {
          if(body != data) {
            var hiddenFilter = filename.split("");
            console.log();
            if(hiddenFilter[0] != ".") {
              request.post(serverAddr+'/sync',{json: changes},
      		        function (error, response, body) {
      		          if (!error && response.statusCode == 200) {
      		            console.log(body)
      		          }
      		          console.log('Change Synchronised: '+filename)
      				});
            }
          }
        });
			});
	  }
}
});

app.post('/sync',function(req,res){
	var file = {
		"name":req.body.file,
		"content":req.body.content
	};
  fs.writeFile(parentDir+'/'+file.name, file.content, function(err) {
		if(err) {
	     return console.log(err);
		}
		console.log("Change Synchronised: "+file.name);
		});
});

server.listen(port, function(){
	console.log('server listening on port '+port);
});
