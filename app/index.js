const express = require("express");
const session = require("express-session");

const app = express();

const swift = require("./lib/swift.js");

app.use(session({secret: process.env.K5SECRET}));

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
  swift.getfile(
    sess.token, 
    region, 
    projectid,
    req.params.name,
    req.params.file,
    proxy, 
    function(error, response){
      res.mimetype = 'application/octet-stream';
      res.attachment = req.params.file;
    },
    res
  );
});

app.listen(process.env.PORT || 3000, function () {
  console.log('App listening on port '+ (process.env.PORT !== undefined ? process.env.PORT : 3000) +'');
});