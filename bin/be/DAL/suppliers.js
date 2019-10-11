var storage = require('./storageRequester');

module.exports = {
    getByProjectId: function (projectid, cb) {
        storage('GET', "/tables/suppliers/rows?filter=idprojects=" + "'" + projectid + "'", {}, function (error, response, body) {
            if (!error) {
                if (response.statusCode == 200) {
                    cb(false, JSON.parse(body).list_of_rows);
                } else {
                    json = JSON.parse(response.body);
                    cb(false, json.message);
                }
            } else {
                cb(true, "Relational Storage Component not responding");
            }
        })
    },
    create: function (name, projectId, cb) {
        console.log("project id : ", projectId);
        storage('POST', "/tables/suppliers/rows", [{ name: name, idprojects: projectId }], function (error, response, body) {
            if (!error) {
                cb(false, {message: "supplier created"});
            } else {
                cb(true, "Relational Storage Component not responding");
            }
        })
    },
    delete: function (id, cb) {
        storage('DELETE', "/tables/suppliers/rows?filter=idsuppliers=" + id, {}, function (error, response, body) {
            if (!error) {
                cb(false, {message: "supplier deleted"});
            } else {
                cb(true, "Relational Storage Component not responding");
            }
        })
    }
}