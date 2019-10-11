var storage = require('./storageRequester');

module.exports = {
    getByProject: function (ProjectId, cb) {
        storage('GET', "/tables/compositions/rows?filter=idprojects=" + "'" + ProjectId + "'", {}, function (error, response, body) {
            if (!error) {
                if (response.statusCode == 200) {
                    json = JSON.parse(response.body);
                    cb(false, json.list_of_rows);
                } else {
                    json = JSON.parse(response.body);
                    cb(false, json.message);
                }
            } else {
                cb(true, "Relational Storage Component not responding");
            }
        })
    },
    create: function(name, tholdmax, tholdmin, project, cb){
        storage('POST', "/tables/compositions/rows", [{name: name, tholdmax: parseInt(tholdmax), tholdmin: parseInt(tholdmin), idprojects: project}], function(error, response, body){
            if(!error){
                cb(false, {message: "Composition is created"})
            }else{
                cb(true, "Relational Storage Component not responding");
            }
        })
    },
    delete: function(compositionId, cb){
        storage('DELETE', "/tables/compositions/rows?filter=idcompositions=" + compositionId, {}, function(error, response, body){
            if(!error){
                cb(false, {message: "Composition is deleted"})
            }else{
                cb(true, "Relational Storage Component not responding");
            }
        })
    }
}