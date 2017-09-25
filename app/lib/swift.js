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
            callback(error, response, body);
        });
    }
};