var syncrequest = require('sync-request');
var config = require('../config.json');

module.exports = function(method, path, payload){
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
    return syncrequest(method, options.url, options);
}
