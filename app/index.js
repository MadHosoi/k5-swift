const express = require("express");
const app = express();

const swift = require("./swift.js");

app.set('view engine', 'pug');

var region = process.env.K5REGION || "";
var contract = process.env.K5CONTRACT || "";
var projectid = process.env.K5PROJECTID || "";
var user = process.env.K5USER || "";
var pwd = process.env.K5PASSWORD || "";
var proxy = process.env.HTTP_PROXY || "";

app.get('/', function(req, res) {
  swift.authenticate(
      region, 
      contract, 
      projectid, 
      user, 
      pwd, 
      proxy,
      function(error, response, body){
        var token = response.headers['x-subject-token'];
        swift.getcontainers(
            token, 
            region, 
            projectid,
            proxy, 
            function(error1, response1, body1){
                res.render('main', {
                    title: 'K5 Object Storage',
                    message: 'Welcome to Fujitsu K5 Object Storage Service!!',
                    error: JSON.stringify(error1),
                    body: JSON.stringify(body1),
                    response: JSON.stringify(response1)
                  });
            });
  });
});

app.listen(process.env.PORT || 3000, function () {
  console.log('App listening on port '+ (process.env.PORT !== undefined ? process.env.PORT : 3000) +'');
});