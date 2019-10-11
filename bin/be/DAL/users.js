var storage = require('./storageRequester');

module.exports = {
    create: function (accid, projectid, cb) {
        let message = [{
            idprojects: projectid,
            idaccounts: accid
        }];
        console.log("creating allocation data ", message);
        storage('POST', '/tables/users/rows', message, function (err, response, body) {
            if (!err) {
                if (response.statusCode == 201) {
                    cb(false, {message: "Allocation created"});
                } else {
                    cb(true, {message: "Allocation error"});
                }
            } else {
                cb(true, "Relational Storage Component not responding");
            }
        })
    },
    getByProject: function(projectid, cb){
        console.log("getByProject");
        storage('GET', '/tables/users_on_projects/rows?filter=idprojects=' + projectid, {}, function (error, response, body) {
            if (!error) {
                cb(false, JSON.parse(body).list_of_rows);
                // if (response.statusCode == 200) {
                //     json = JSON.parse(response.body);
                //     cb(false, json.list_of_rows);
                // } else {
                //     json = JSON.parse(response.body);
                //     cb(false, json.message);
                // }
            } else {
                console.log(error);
                cb(true, "Relational Storage Component not responding");
            }
        })
    },
    getNotInProject: function(projectid, cb){
        storage('GET', '/tables/users_on_projects/rows?filter=idprojects!=' + projectid, {}, function (error, response, body) {
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
    deleteById:function(allocationid,cb){
        storage('DELETE', "/tables/users/rows?filter=idusers=" + allocationid, {}, function(error, response, body){
            if(!error){
                cb(false, {message: "Allocation is deleted"})
            }else{
                cb(true, "Relational Storage Component not responding");
            }
        })
    }

}