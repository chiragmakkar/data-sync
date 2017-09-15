var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');
var fs = require('fs');

var server = require('http').createServer(app);
var port = process.env.PORT || 5000;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended:true
}))

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.static('public'));

var parentDir = __dirname+'/public';

// fs.watch(parentDir, {recursive : true}, function(eventType, filename){
// 	//console.log('event type is: '+eventType);
// 	if(filename){
// 		//console.log('filename provided: '+filename);
// 		if(eventType == 'change'){
//       /*Notice changes, generate a json request and send it to cloud.*/
//       fs.readFile(parentDir+'/'+filename, 'utf8', function (err,data) {
//         if (err) {
//           return console.log(err);
//         }
//         var changes = {
//           "edit":true,
//           "file":filename,
//           "content": data
//         };
//         request.post('http://localhost:3000/sync',{json: changes},
//           function (error, response, body) {
//             if (!error && response.statusCode == 200) {
//               console.log(body)
//             }
//             console.log('Change Synchronised: '+filename)
//           });
//       });
// 	  }
// }
// });

app.post('/sync',function(req,res){
	var file1 = {
		"name":req.body.file1,
    "signature":req.body.signature1,
    "timestamp":req.body.timestamp1,
		"content":req.body.content1,
    "sync":req.body.edit1
	};
  var file2 = {
    "name":req.body.file2,
    "signature":req.body.signature2,
    "timestamp":req.body.timestamp2,
    "content":req.body.content2,
    "sync":req.body.edit2
  }
  console.log(file1);
  if((file1.name!=null)&&(file2.name!=null)){
    if(file1.name == file2.name){
      if(file1.timestamp > file2.timestamp){
        request.post('http://localhost:4000/sync',{json: file1},
                  function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                      console.log(body);
                      console.log('request sent to 4000'+file1);
                    }
                    console.log('Change Synchronised: '+file1.name)
                  });
        fs.writeFile(__dirname+'/public/'+file1.name, file1.content, function(err) {
          if(err) {
              return console.log(err);
          }
        //console.log("Change Synchronised: "+file1.name);
  });
      }
      else if(file1.timestamp < file2.timestamp){
        request.post('http://localhost:3000/sync',{json: file2},
                  function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                      console.log(body);
                      console.log('request sent to 3000'+file2);
                    }
                    console.log('Change Synchronised: '+file2.name)
                  });
        fs.writeFile(__dirname+'/public/'+file2.name, file2.content, function(err) {
          if(err) {
              return console.log(err);
          }
          //console.log("Change Synchronised: "+file2.name);
        });
      } 
    }
  }
  if((file1.name!=null) && (file2.name==null)){
    request.post('http://localhost:4000/sync',{json: file1},
                  function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                      console.log(body);
                      console.log('request sent to 4000'+file1);
                    }
                    console.log('Change Synchronised: '+file1.name)
                  });
    fs.writeFile(__dirname+'/public/'+file1.name, file1.content, function(err) {
      if(err) {
          return console.log(err);
      }
      //console.log("Change Synchronised: "+file1.name);
    });
  }
  else if((file2.name!=null) && (file1.name==null)){
    request.post('http://localhost:3000/sync',{json: file2},
                  function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                      console.log(body);
                      console.log('request sent to 3000'+file2);
                    }
                    console.log('Change Synchronised: '+file2.name)
                  });
    fs.writeFile(__dirname+'/public/'+file2.name, file2.content, function(err) {
      if(err) {
          return console.log(err);
      }
    //console.log("Change Synchronised: "+file2.name);
    });
  }
	// fs.writeFile(__dirname+'/public/'+file2.name, file2.content, function(err) {
 //   	if(err) {
 //        return console.log(err);
 //    }
	// 	console.log("Change Synchronised: "+file.name);
	// });
 //  fs.writeFile(__dirname+'/public/'+file.name, file.content, function(err) {
 //    if(err) {
 //        return console.log(err);
 //    }
 //    console.log("Change Synchronised: "+file.name);
 //  });
 //  fs.writeFile(__dirname+'/public/'+file.signature+'-'+file.timestamp+'-'+file.name, file.content, function(err) {
 //  	if(err) {
 //        return console.log(err);
 //    }
	// 	console.log("Change Synchronised: "+file.name);
 //    console.log("Branch Synchronised: "+file.signature+'-'+file.timestamp);
	// });
});

server.listen(port, function(){
	console.log('server listening on port '+port);
});
