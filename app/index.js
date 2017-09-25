const express = require("express");
const app = express();

const swift = require("./lib/swift.js");

app.set('view engine', 'pug');

var region = process.env.K5REGION || "";
var contract = process.env.K5CONTRACT || "";
var projectid = process.env.K5PROJECTID || "";
var user = process.env.K5USER || "";
var pwd = process.env.K5PASSWORD || "";
var proxy = process.env.HTTP_PROXY || "";

app.get('/', function(req, res) {
  var list = [];
  swift.authenticate(
      region, 
      contract, 
      projectid, 
      user, 
      pwd, 
      proxy,
      function(error, response, body){
        var responsedata = {error, response, body};
        list.push(responsedata);
        var token = response.headers['x-subject-token'];
        swift.getcontainers(
            token, 
            region, 
            projectid,
            proxy, 
            function(error, response, body){
              responsedata = {error, response, body};
              list.push(responsedata);
              swift.createcontainer(
                token, 
                region, 
                projectid, 
                "test",
                proxy, 
                function(error, response, body){
                  responsedata = {error, response, body};
                  list.push(responsedata);
                  swift.deletecontainer(
                    token, 
                    region, 
                    projectid, 
                    "test",
                    proxy, 
                    function(error, response, body){
                      responsedata = {error, response, body};
                      list.push(responsedata);
                      res.render('main', {
                        title: 'K5 Object Storage',
                        message: 'Welcome to Fujitsu K5 Object Storage Service!!',
                        responses: list
                      });
                    });
                  });
              });
  });
});

app.listen(process.env.PORT || 3000, function () {
  console.log('App listening on port '+ (process.env.PORT !== undefined ? process.env.PORT : 3000) +'');
});