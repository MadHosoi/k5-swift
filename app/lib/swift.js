module.exports = {
    
    authenticate: function(region, contract, projectid, user, password, proxy, callback) {

        const identity_url = 'https://identity.' + region + '.cloud.global.fujitsu.com/v3/auth/tokens';

        var request = require("request");
        
        var options = { method: 'POST',
            url: identity_url,
            headers: 
            { 
                'cache-control': 'no-cache',
                'content-type': 'application/json',
                'Accept':'application/json'
            },
            body: {
                "auth":
                {
                    "identity":
                    {
                        "methods":["password"],
                        "password":
                        {
                            "user":
                            {
                                "domain":
                                {
                                    "name": contract 
                                }, 
                                "name": user, 
                                "password": password
                            }
                        }
                    }, 
                    "scope": 
                    { 
                        "project": 
                        {
                            "id": projectid
                        }
                    }
                }
            },
            json: true,
            proxy: proxy
        };
    
        request(options, function (error, response, body) 
            {
                if(error) {
                    console.error(error);
                }
                else{
                    if (process.env.LOG == 'debug')
                        console.log((new Date()).toString() + ": authenticate: " + JSON.stringify(response));
                }
                callback(error, response, body);
            }
        );
    },
    
    getcontainers: function(token, region, projectid, proxy, callback){
        const swift_url = 'https://objectstorage.' + region + '.cloud.global.fujitsu.com/v1/AUTH_' + projectid;
        
        var request = require("request");
                
        var options = { 
            method: 'GET',
            url: swift_url,
            headers: 
            { 
                'cache-control': 'no-cache',
                'content-type': 'application/json',
                'Accept':'application/json',
                'X-Auth-Token': token
            },
            json: true,
            proxy: proxy
        };
            
        request(options, function (error, response, body) 
        {
            if(error) {
                console.error(error);
            }
            else{
                if (process.env.LOG == 'debug')
                    console.log((new Date()).toString() + ": getcontainers: " + JSON.stringify(response));
            }
            callback(error, response, body);
        });
    },

    createcontainer: function(token, region, projectid, container, proxy, callback){
        const swift_url = 'https://objectstorage.' + region + '.cloud.global.fujitsu.com/v1/AUTH_' + projectid;
        
        var request = require("request");
                
        var options = { 
            method: 'PUT',
            url: swift_url + "/" + container,
            headers: 
            { 
                'cache-control': 'no-cache',
                'content-type': 'application/json',
                'Accept':'application/json',
                'X-Auth-Token': token
            },
            json: true,
            proxy: proxy
        };
            
        request(options, function (error, response, body) 
        {
            if(error) {
                console.error(error);
            }
            else{
                if (process.env.LOG == 'debug')
                    console.log((new Date()).toString() + ": createcontainer: " + JSON.stringify(response));
            }
            callback(error, response, body);
        });
    },

    deletecontainer: function(token, region, projectid, container, proxy, callback){
        const swift_url = 'https://objectstorage.' + region + '.cloud.global.fujitsu.com/v1/AUTH_' + projectid;
        
        var request = require("request");
                
        var options = { 
            method: 'DELETE',
            url: swift_url + "/" + container,
            headers: 
            { 
                'cache-control': 'no-cache',
                'content-type': 'application/json',
                'Accept':'application/json',
                'X-Auth-Token': token
            },
            json: true,
            proxy: proxy
        };
            
        request(options, function (error, response, body) 
        {
            if(error) {
                console.error(error);
            }
            else{
                if (process.env.LOG == 'debug')
                    console.log((new Date()).toString() + ": deletecontainer: " + JSON.stringify(response));
            }
            callback(error, response, body);
        });
    },

    getfiles: function(token, region, projectid, container, proxy, callback){
        const swift_url = 'https://objectstorage.' + region + '.cloud.global.fujitsu.com/v1/AUTH_' + projectid;
        
        var request = require("request");
                
        var options = { 
            method: 'GET',
            url: swift_url + '/' + container,
            headers: 
            { 
                'cache-control': 'no-cache',
                'content-type': 'application/json',
                'Accept':'application/json',
                'X-Auth-Token': token
            },
            json: true,
            proxy: proxy
        };
            
        request(options, function (error, response, body) 
        {
            if(error) {
                console.error(error);
            }
            else{
                if (process.env.LOG == 'debug')
                    console.log((new Date()).toString() + ": getfiles: " + JSON.stringify(response));
            }
            callback(error, response, body);
        });
    },

    getfile: function(token, region, projectid, container, file, proxy, callback, stream){
        const swift_url = 'https://objectstorage.' + region + '.cloud.global.fujitsu.com/v1/AUTH_' + projectid;
        
        var request = require("request");
                
        var options = { 
            method: 'GET',
            url: swift_url + '/' + container + '/' + file,
            headers: 
            { 
                'cache-control': 'no-cache',
                //'content-type': 'application/json',
                //'Accept':'application/json',
                'X-Auth-Token': token
            },
            json: true,
            proxy: proxy
        };
            
        request(options, function (error, response, body) 
        {
            if(error) {
                console.error(error);
            }
            else{
                if (process.env.LOG == 'debug')
                    console.log((new Date()).toString() + ": getfile: " + JSON.stringify(response));
            }
            callback(error, response, body);
        }).pipe(stream);
    },

    setfile: function(token, region, projectid, container, file, proxy, callback, stream){
        const swift_url = 'https://objectstorage.' + region + '.cloud.global.fujitsu.com/v1/AUTH_' + projectid;
        
        var request = require("request");
                
        var options = { 
            method: 'PUT',
            url: swift_url + '/' + container + '/' + file,
            headers: 
            { 
                'X-Auth-Token': token,
                'content-type': 'application/octet-stream'
            },
            proxy: proxy
        };
            
        var req = request(options, function (error, response, body) 
        {
            if(error) {
                console.error(error);
            }
            else{
                if (process.env.LOG == 'debug')
                    console.log((new Date()).toString() + ": setfile: " + JSON.stringify(response));
            }
            callback(error, response, body);
        });
        stream.pipe(req);
    },

    deletefile: function(token, region, projectid, container, file, proxy, callback){
        const swift_url = 'https://objectstorage.' + region + '.cloud.global.fujitsu.com/v1/AUTH_' + projectid;
        
        var request = require("request");
                
        var options = { 
            method: 'DELETE',
            url: swift_url + "/" + container + "/" + file,
            headers: 
            { 
                'cache-control': 'no-cache',
                'content-type': 'application/json',
                'Accept':'application/json',
                'X-Auth-Token': token
            },
            json: true,
            proxy: proxy
        };
            
        request(options, function (error, response, body) 
        {
            if(error) {
                console.error(error);
            }
            else{
                if (process.env.LOG == 'debug')
                    console.log((new Date()).toString() + ": deletefile: " + JSON.stringify(response));
            }
            callback(error, response, body);
        });
    },
};