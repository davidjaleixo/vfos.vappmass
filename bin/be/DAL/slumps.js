var storage = require('./storageRequester');

module.exports = {

    create: function (slumpValue, suppliersId, projectId, accountsId, compositionsId, loadid, cb) {
        let data = [{
            value: slumpValue,
            date: new Date().toUTCString(),
            idSuppliers: suppliersId,
            idprojects: projectId,
            idAccounts: accountsId,
            idCompositions: compositionsId,
            loadid: loadid
        }];
        storage('POST', "/tables/slumptests/rows", data, function (error, response, body) {
            if (!error) {
                cb(false, { message: "Slumptest is created" })
            } else {
                cb(true, "Relational Storage Component not responding");
            }
        })
    },
    getByProject: function (projectId, cb) {
        storage('GET', "/tables/slump_history/rows?filter=idprojects=" + projectId, {}, function (err, response, body) {
            if (!err) {
                cb(false, JSON.parse(body).list_of_rows)
            } else {
                cb(true, "Relational Storage Component not responding");
            }
        })
    },
    getLastByProject: function (projectId, cb) {
        storage('GET', "/tables/slump_history/rows?filter=idprojects=" + projectId + "&order_by=idslumptests", {}, function (err, response, body) {
            if (!err) {
                cb(false, JSON.parse(body).list_of_rows[0])
            } else {
                cb(true, "Relational Storage Component not responding");
            }
        })
    },
    delete: function (slumptestId, cb) {
        storage('DELETE', "/tables/slumptests/rows?filter=idslumptests=" + slumptestId, {}, function (error, response, body) {
            if (!error) {
                cb(false, { message: "Slumptest is deleted" })
            } else {
                cb(true, "Relational Storage Component not responding");
            }
        })
    },
    getByProjectAndCompositionAndSupplier: function (projectId, compositionId, supplierId, cb) {

        storage('GET', "/tables/slump_history/rows?filter=idprojects=" + projectId + " and idcompositions=" + compositionId + " and idsuppliers=" + supplierId + "&order_by=date", {}, function (err, response, body) {

            if (!err) {
                cb(false, JSON.parse(body).list_of_rows)
            } else {
                cb(true, "Relational Storage Component not responding");
            }
        })
    }
}