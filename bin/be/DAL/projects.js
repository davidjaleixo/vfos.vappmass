var storage = require('./storageRequester');

module.exports = {
    getByAllocation: function (AccountId, cb) {
        storage('GET', "/tables/allocated_projects/rows?filter=idaccounts=" + "'" + AccountId + "'", {}, function (error, response, body) {
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
    getById: function(AccountId, ProjectId, cb){
        storage('GET', "/tables/allocated_projects/rows?filter=idaccounts=" + "'" + AccountId + "' and idprojects=" + "'" + ProjectId + "'", {}, function (error, response, body) {
            if (!error) {
                if (response.statusCode == 200) {
                    json = JSON.parse(response.body);
                    cb(false, json.list_of_rows[0]);
                } else {
                    json = JSON.parse(response.body);
                    cb(false, json.message);
                }
            } else {
                cb(true, "Relational Storage Component not responding");
            }
        })
    },
    getByName: function(projectName, cb){
        storage('GET', "/tables/projects/rows?filter=name=" + "'" + projectName + "'", {}, function(error, response, body){
            if(!error){
                if(response.statusCode == 200){
                    json = JSON.parse(response.body);
                    cb(false, json.list_of_rows[0]);
                }else{
                    json = JSON.parse(response.body);
                    cb(false, json.message);
                }
            }else{
                cb(true, "Relational Storage Component not responding");
            }
        })
    },
    create: function(name, description, cb){
        storage('POST', "/tables/projects/rows", [{name: name, description: description, status: true}], function(error, response, body){
            if(!error){
                cb(false, {message: "Project is created"})
            }else{
                cb(true, "Relational Storage Component not responding");
            }
        })
    },
    updateName: function(projectId, newName,cb){
        storage('PATCH', "/tables/projects/rows?filter=idprojects=" + projectId, {name: newName}, function(error, response, body){
            if(!error){
                cb(false, {message: "Project is updated"})
            }else{
                cb(true, "Relational Storage Component not responding");
            }
        })
    },
    updateDescription: function(projectId, newDescription,cb){
        storage('PATCH', "/tables/projects/rows?filter=idprojects=" + projectId, {description: newDescription}, function(error, response, body){
            if(!error){
                cb(false, {message: "Project is updated"});
            }else{
                cb(true, "Relational Storage Component not responding");
            }
        })
    },
    updateStatus: function(projectId, newStatus,cb){
        storage('PATCH', "/tables/projects/rows?filter=idprojects=" + projectId, {status: newStatus}, function(error, response, body){
            if(!error){
                cb(false, {message: "Project is updated"})
            }else{
                cb(true, "Relational Storage Component not responding");
            }
        })
    },
    delete: function(projectId, cb){
        storage('DELETE', "/tables/projects/rows?filter=idprojects=" + projectId, {}, function(error, response, body){
            if(!error){
                cb(false, {message: "Project is deleted"})
            }else{
                cb(true, "Relational Storage Component not responding");
            }
        })
    }
}