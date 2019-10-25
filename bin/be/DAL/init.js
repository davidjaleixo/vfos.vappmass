var storage = require('./storageRequester');
var syncstorage = require('./syncStorageRequester');
var config = require('../config.json');
var request = require('request');
var myforEach = require("async-foreach").forEach;
var path = require('path');
var recursiveReadSync = require('recursive-readdir-sync');

var HashMap = require('hashmap');

function compareNumbers(a, b) {
    return a - b;
}

function getFileNameWithExtension(filename) {
    for (var i = 0; i < filename.length; i++) {
        if (filename.charAt(i) == '_') {
            return filename.substring(i + 1, filename.length)
        }
    }
}

//returns an object with an array of files in the given path
var readFilesFromFolder = function (inputPath) {
    try {
        files = recursiveReadSync(path.join(__dirname, inputPath));
    } catch (err) {
        if (err.errno === 34) {
            console.log('Path ', inputPath, 'does not exist');
        } else {
            //something unrelated went wrong, rethrow
            throw err;
        }
    }


    // DIRECTORY FILE NAME SORT START
    let map = new HashMap();
    let fileNumber = [];
    // let path = files[0].toString().substring(0, files[0].toString().lastIndexOf("/") + 1);
    for (var i = 0; i < files.length; i++) {

        let fileName = files[i].toString().substring(files[i].toString().lastIndexOf("/") + 1, files[i].toString().length);
        // console.log("fileName:", fileName);
        fileNumber[i] = fileName.split("_")[0];
        // console.log("setting hash k:", fileName.split("_")[0], "-v:", getFileNameWithExtension(fileName));
        map.set(fileName.split("_")[0], getFileNameWithExtension(fileName));
        // if (i == files.length - 1) {
        //     console.log("unordered files: ", fileNumber);
        // }
    }

    var orderedFileNumber = fileNumber.sort(compareNumbers);
    // console.log("ordered files: ", orderedFileNumber);

    for (var i = 0; i < files.length; i++) {
        // console.log("hashmap value: ", map.get(orderedFileNumber[i]));
        files[i] = (map.get(orderedFileNumber[i])).toString().slice(0, -5);
        if (i == files.length - 1) {
            return files;
        }
    }
    // DIRECTORY FILE NAME SORT STOP



    let output = [];
    //loop over resulting files
    //console.log("Found the following files in", inputPath);
    for (var i = 0, len = files.length; i < len; i++) {
        let eachFile = files[i].split('/');
        //console.log(eachFile[eachFile.length - 1]);
        //output.push(require(path.join(__dirname, inputPath , '/' ,eachFile[eachFile.length - 1])))

        //output.push(eachFile[eachFile.length - 1].split('_')[1].slice(0, -5));
        //remove the '0X_' and the '.json' extension
        // output.push(eachFile[eachFile.length - 1].substr(3).slice(0, -5));
        output.push(eachFile[eachFile.length - 1].split('_')[1].slice(0, -5));

        if (i == files.length - 1) {
            //console.log(output);
            return output;
        }
    }

}

var getExistingTables = function () {
    let answer = syncstorage('GET', '/tables');
    return JSON.parse(answer.body).list
}
var getExistingViews = function () {
    let answer = syncstorage('GET', '/views');
    return JSON.parse(answer.body).list
}
module.exports = {
    dbExists: function (cb) {
        storage('GET', '/tables', {}, function (err, response, body) {
            if (!err) {
                if (response.statusCode == 404) {
                    cb(false);
                } else {
                    cb(true);
                }
            } else {
                cb(false);
            }
        })
    },
    viewsExistsAndCreates: function (cb) {
        let views = readFilesFromFolder(config.files.db.views);
        let ExistingViews = getExistingViews();
        if (ExistingViews.length > 0) {
            for (var i = 0, len = views.length; i < len; i++) {
                for (var j = 0, lenj = ExistingViews.length; j < lenj; j++) {
                    if (views[i] == ExistingViews[j]) {
                        console.log(views[i], "OK")
                        //next
                        j = lenj - 1;
                    } else {
                        if (j == lenj - 1) {
                            let answer = syncstorage('POST', '/views', require('.' + config.files.db.views + '/' + (i + 1) + '_' + views[i] + '.json'));

                            if (answer.statusCode == 201) {
                                console.log(views[i], "Created");
                            } else {
                                if (answer.statusCode == 409) {
                                    console.log(views[i], "Already exists - Check the name of the JSON file");
                                } else {
                                    console.log(views[i], "Not created. ", JSON.parse(answer.body).message);
                                }
                            }
                        }
                    }
                    if (i == len - 1 && j == lenj - 1) {
                        cb(true);
                    }
                }
            }
        } else {
            //create all views
            for (var i = 0, len = views.length; i < len; i++) {
                let answer = syncstorage('POST', '/views', require('.' + config.files.db.views + '/' + (i + 1) + '_' + views[i] + '.json'));
                if (answer.statusCode == 201) {
                    console.log(views[i], "Created");
                } else {
                    if (answer.statusCode == 409) {
                        console.log(views[i], "Already exists - Check the name of the JSON file");
                    } else {
                        console.log(views[i], "Not created");
                    }
                }

                if (i == len - 1) {
                    cb(true);
                }
            }
        }

    },
    tablesExistsAndCreates: function (cb) {
        //get the list of tables
        let tables = readFilesFromFolder(config.files.db.tables);
        let ExistingTables = getExistingTables();
        if (ExistingTables.length > 0) {
            for (var i = 0, len = tables.length; i < len; i++) {
                for (var j = 0, lenj = ExistingTables.length; j < lenj; j++) {
                    if (tables[i] == ExistingTables[j]) {
                        console.log(tables[i], "OK")
                        //next
                        j = lenj - 1;
                    } else {
                        if (j == lenj - 1) {
                            let answer = syncstorage('POST', '/tables', require('.' + config.files.db.tables + '/' + (i + 1) + '_' + tables[i] + '.json'));
                            if (answer.statusCode == 201) {
                                console.log(tables[i], "Created");
                            } else {
                                if (answer.statusCode == 409) {
                                    console.log(tables[i], "Already exists - Check the name of the JSON file");
                                } else {
                                    console.log(tables[i], "Not created");
                                }
                            }
                        }
                    }
                    if (i == len - 1 && j == lenj - 1) {
                        cb(true);
                    }
                }
            }
        } else {
            for (var i = 0, len = tables.length; i < len; i++) {
                let answer = syncstorage('POST', '/tables', require('.' + config.files.db.tables + '/' + (i + 1) + '_' + tables[i] + '.json'));
                if (answer.statusCode == 201) {
                    console.log(tables[i], "Created");
                } else {
                    if (answer.statusCode == 409) {
                        console.log(tables[i], "Already exists - Check the name of the JSON file");
                    } else {
                        console.log(tables[i], "Not created");
                    }
                }
                if (i == len - 1) {
                    cb(true);
                }
            }
        }

    },
    createDB: function (cb) {
        let Requestoptions = {
            url: config.storage.url + '/databases',
            method: 'POST',
            headers: {
                "Content-Type": config.storage.contentType,
                "Accept": config.storage.accept,
                "Authorization": config.storage.auth
            },
            body: config.storage.dataBaseName
        }
        request(Requestoptions, function (error, response, body) {

            if (!error) {
                console.log("status", response.statusCode)
                if (response.statusCode == 201) {
                    cb(true);
                } else {
                    cb(false);
                }
            } else {
                cb(false);
            }
        })
    },
    checkRoles: function (cb) {
        storage('GET', '/tables/roles/rows', {}, function (err, response, body) {
            if (!err) {
                if (response.statusCode == 200) {
                    console.info("Found ", JSON.parse(body).list_of_rows.length, " roles");
                    if (JSON.parse(body).list_of_rows.length >= 3) {
                        cb(true);
                    } else {
                        cb(false);
                    }
                } else {
                    cb(false);
                }
            } else {
                cb(false);
            }
        })
    },
    createRoles: function (cb) {
        var roles = [{
            accounttype: "contractor",
            description: "Contractor"
        }, {
            accounttype: "admin",
            description: "Administrator"
        }, {
            accounttype: "provider",
            description: "Provider"
        }]
        storage('POST', '/tables/roles/rows', roles, function (err, response, body) {
            if (!err) {
                if (response.statusCode == 201) {
                    cb(true);
                } else {
                    cb(false);
                }
            } else {
                cb(false);
            }
        })
    },
    createTables: function (cb) {


        //TABLES
        let initTables = readFilesFromFolder('/INIT/tables');
        let thisResponse = [];
        myforEach(initTables, function (tableInit, index, arr) {
            let eachres = { created: null, name: tableInit.table_name, index: index }
            let answer = syncstorage('POST', '/tables', tableInit);
            if (answer.statusCode == 201) {
                eachres.created = answer.statusCode;
                console.log("Table", tableInit.table_name, "created");
            } else {
                console.log("Table", tableInit.table_name, "not created");
                eachres.created = answer.statusCode;
            }
            thisResponse.push(eachres);

        }, function (ok, arr) {
            if (!ok) {
                console.log("Something went wrong...")
            }
            console.log("Done with the following creation", thisResponse);
            console.log("Check if roles already exists...");

            storage('GET', '/tables/roles/rows', {}, function (err, response, body) {
                if (!err) {
                    if (response.statusCode == 200) {
                        json = JSON.parse(response.body);
                        if (json.list_of_rows.length >= 3) {
                            console.log("Roles already created. ")
                            cb(true, thisResponse);
                        } else {
                            console.log("Creating predefined roles...")
                            let roles = [{
                                accounttype: "contractor",
                                description: "Contractor"
                            }, {
                                accounttype: "admin",
                                description: "Administrator"
                            }, {
                                accounttype: "provider",
                                description: "Provider"
                            }];
                            storage('POST', '/tables/roles/rows', roles, function (err, response, body) {
                                if (!err) {
                                    if (response.statusCode == 201) {
                                        cb(true, thisResponse);
                                    } else {
                                        cb(false, thisResponse);
                                    }
                                } else {
                                    cb(true, "Relational Storage Enabler not responding");
                                }
                            })
                        }

                    } else {
                        cb(false, thisResponse);
                    }
                } else {
                    cb(false, thisResponse);
                }
            })


        })
    }
}