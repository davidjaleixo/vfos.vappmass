var request = require('request');
var config = require('../config.json');

module.exports = function(method, path, payload, callback){
    let options = {
        url: config.storage.url + '/databases/' + config.storage.dataBaseName + path,
        method: method,
        headers: {
            "Content-Type": config.storage.contentType,
            "Accept": config.storage.accept,
            "Authorization": config.storage.auth
        },
        body: JSON.stringify(payload)
    }
    console.log("options:",options);
    request(options, callback);
}