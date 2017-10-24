const express = require("express");
const session = require("express-session");

const app = express();

var busboy = require('connect-busboy');

app.use(busboy()); 

const swift = require("./lib/swift.js");

app.use(session({secret: process.env.K5SECRET}));

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'pug');

var region = process.env.K5REGION || "";
var contract = process.env.K5CONTRACT || "";
var projectid = process.env.K5PROJECTID || "";
var user = process.env.K5USER || "";
var pwd = process.env.K5PASSWORD || "";
var proxy = process.env.HTTP_PROXY || "";

var sess;

app.get('/', function(req, res){
  sess=req.session;
  if (sess.token === undefined){
    res.redirect('/authenticate');
  }
  else{
    swift.getcontainers(
      sess.token, 
      region, 
      projectid,
      proxy, 
      function(error, response, body){
        //var responsedata = {error, response, body};
        res.render('main', {
          title: 'K5 Object Storage',
          message: 'Welcome to Fujitsu K5 Object Storage Service!!',
          containers: body
        });         
      });
  }
});

app.get('/authenticate', function(req, res) {
  sess = req.session;

  swift.authenticate(
      region, 
      contract, 
      projectid, 
      user, 
      pwd, 
      proxy,
      function(error, response){
        //var responsedata = {error, response, body};
        if (error){
          res.render('error', {
            title: 'K5 Object Storage Authentication Error',
            message: error
          });
        }
        else{
          if (response && response.headers && response.headers['x-subject-token']){
            sess.token = response.headers['x-subject-token'];
            res.redirect('/');
          }
        }
      }
  );
});

app.get('/container/:name', function(req, res){
  sess = req.session;

  swift.getfiles(
    sess.token, 
    region, 
    projectid,
    req.params.name,
    proxy, 
    function(error, response, body){
      res.render('container', {
        title: 'K5 Object Storage - ' + req.params.name,
        containername: req.params.name,
        message: 'This is the content of the container ' + req.params.name,
        files: body
      });
    });
});

app.get('/container/:name/:file', function(req, res){
  sess = req.session;
  if (req.query.delete !== undefined && req.query.delete === ""){
    swift.deletefile(
      sess.token, 
      region, 
      projectid,
      req.params.name,
      req.params.file,
      proxy, 
      function(error, response){
        res.redirect('/container/' + req.params.name);
      }
    );
  }
  else{
    swift.getfile(
      sess.token, 
      region, 
      projectid,
      req.params.name,
      req.params.file,
      proxy, 
      function(error, response){
        //res.mimetype = response.mimetype;
        //res.mimetype = 'application/octet-stream';
        res.attachment = req.params.file;
        res.end();
      },
      res
    );
  }
});
/*
app.get('/upload/:name', function(req, res){
  res.render('upload', {
    title: 'K5 Object Storage - ' + req.params.name,
    containername: req.params.name,
    message: 'Select the file to upload to the container ' + req.params.name,
  });
});
*/
/*
app.post('/upload/:name', function(req, res){
  sess = req.session;  
  
  req.pipe(req.busboy);
  req.busboy.on('file', function(fieldname, file, filename) {

      console.log("File received: " + filename); 
      
      swift.setfile(
        sess.token, 
        region,
        projectid,
        req.params.name,
        filename,
        proxy,
        function(error, response){
          console.log("File uploaded: " + filename);
          res.render('uploadresult', {
            title: 'K5 Object Storage - ' + req.params.name,
            containername: req.params.name,
            message: 'The file uploaded to the container ' + req.params.name,
          });
        },
        file
      );

  });

  req.busboy.on('finish', function() {
    res.send("That's all folks!");
  });
});
*/
app.listen(process.env.PORT || 3000, function () {
  console.log('App listening on port '+ (process.env.PORT !== undefined ? process.env.PORT : 3000) +'');
});