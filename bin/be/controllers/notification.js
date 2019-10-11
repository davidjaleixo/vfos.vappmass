var dal = require('../DAL');
const config = require('../config.json');
/**email stuff */
var email = require('nodemailer');
var handlebars = require('handlebars');
var fs = require('fs');
/**email stuff */



var readHTMLfile = function (path, callback) {
    fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
        if (err) {
            throw err;
            callback(err);
        }
        else {
            callback(null, html);
        }
    });
}

module.exports = {
    validate: function (req, res) {
        console.log("Validating the notifications")
        console.log("Body", req.body);
        //body: {value, equipment, project, threshold}
        if (req.body.threshold) {
            if (req.body.value > parseInt(req.body.threshold)) {
                console.log("bigger");
                //create notification for each user

                dal.users.getByProject(req.body.project, function (err, projectUsers) {
                    console.log("HEEEEEE");
                    if (!err) {
                        console.log("our users: ", projectUsers);
                        //get the latest slumptest for this project
                        dal.slumps.getLastByProject(req.body.project, function (err2, lastSlumptest) {
                            if (!err2) {
                                console.log("Found ", projectUsers.length, " users to be notified related to slumptest ", lastSlumptest.idslumptests);

                                projectUsers.forEach(function (eachUser) {
                                    dal.notification.create(eachUser.idaccounts, lastSlumptest.idslumptests, lastSlumptest.date, function (err3, answer) {
                                        if (!err3) {
                                            console.log("Notification recorded for user ", eachUser.idaccounts, "-", eachUser.username)
                                        } else {
                                            console.log("Notification not recorded for user ", eachUser.idaccounts, "-", eachUser.username)
                                        }
                                    })
                                });
                            } else {
                                console.log("Validate Notification: ", err2)
                            }
                        })
                    } else {
                        console.log("Validate Notification: ", err)
                    }
                })
            } else {
                //there is no notification needed to be displayed
                console.log("Slumptest value lower then threshold. Discarding...")
            }
        }
    },

    get: function (req, res) {
        dal.notification.getByAccount(req.user.id, function (err, answer) {
            if (!err) {

                res.status(201).json(answer);
            } else {
                res.status(500).end();
            }
        })
    },
    delete: function(req,res){
        if(req.query.id){
            dal.notification.delete(req.body.id, function(err,answer){
                if(!err){
                    res.status(201).json({message: "Notification deleted"})
                }else{
                    res.status(500).end();
                }
            })
        }else{
            res.status(422).json({message: "Missing required fields"})
        }
    },
    update: function (req, res) {
        console.log(req.body);
        if (req.body.hasOwnProperty('read') && req.query.id) {
            if (req.body.read == true) {

                dal.notification.read(req.query.id, function (err, result) {
                    if (!err) {
                        res.status(201).json(result);
                    } else {
                        res.status(500).end();
                    }
                })
            } else {

                dal.notification.unread(req.query.id, function (err, result) {
                    if (!err) {
                        res.status(201).json(result);
                    } else {
                        res.status(500).end();
                    }
                })
            }
        } else {
            res.status(422).end();
        }
    },
    harmonizeRequest: function (req, res, next) {
        //case of result.code = 3 
        //means that the request does not include slumptestid
        if (req.body.result.code == 3) {
            dal.slumps.getByProjectAndCompositionAndSupplier(req.body.idprojects, req.body.idcompositions, req.body.idsuppliers, function (err, slumpresults) {
                if (!err) {
                    console.log("Getting latest idslumptest found", slumpresults[slumpresults.length - 1].idslumptests);
                    req.body.slumptestid = slumpresults[slumpresults.length - 1].idslumptests;
                    console.log("NOTIFICATION BODY", req.body);
                    next();
                } else {
                    console.log(err);
                    res.status(500).end();
                }
            })
        }else{
            next();
        }
    },
    create: function (req, res) {
        console.log("NOTIFICATION BODY", req.body);


        // INPUT STRUCTURE {
        //     REQUIRED result:
        //      one of:
        //         [
        //             { code: 0, message: "Inside thresholds", type: "predicted" },
        //             { code: 1, message: "bigger than the confidence margins configured", type: "predicted" },
        //             { code: 2, message: "outside thresholds", type: "predicted" },
        //             { code: 3, message: "outside thresholds", type: "measured" },
        //             { code: 4, message: "There is no enough data", type: "predicted" },
        //         ],
        //     REQUIRED  prediction: nextValue,
        //     REQUIRED idcompositions: req.body.composition,
        //     REQUIRED idsuppliers: req.body.supplier,
        //     REQUIRED idprojects: req.body.project,
        //     maxmargin: slumpresults[0].tholdmax,
        //     minmargin: slumpresults[0].tholdmin,
        //     
        //     REQUIRED OR CALCULATED slumptestid: slumpresults[slumpresults.length - 1].idslumptests,
        //     deviation: parseFloat(nextValue / arrayAverage(firstinput))
        // }





        if (req.body.result.code != 0 && req.body.result.code != 4) {



            let transporter = email.createTransport({
                service: 'gmail',
                auth: {
                    user: config.email.USEREMAIL,
                    pass: config.email.USERPWD
                }
            })
            readHTMLfile(__dirname + '/../email_tpl.html', function (err, html) {
                if (err) {
                    console.log(err);
                    res.status(500).end();
                } else {

                    let template = handlebars.compile(html);

                    //get project name and account emails
                    dal.projects.getById(req.user.id, req.body.idprojects, function (errProject, thisproject) {
                        if (errProject) {
                            console.log("Unable to retrieve project ", req.body.idprojects, "data")
                            res.status(500).end();
                        } else {
                            //get account emails
                            dal.users.getByProject(req.body.idprojects, function (errEmails, userinproject) {
                                if (errEmails) {
                                    console.log("Unable to retrieve emails from project", thisproject.name);
                                    res.status(500).json({ message: "Internal error - Not able to distribute notifications" })
                                } else {
                                    for (let index = 0; index < userinproject.length; index++) {
                                        console.log("***************** STEP 3");
                                        // listemails.push(userinproject[index].username);
                                        let replacements = {
                                            EMAILTITLE: "Peel test Feedback Notification",
                                            EMAILPREHEADER: "Peel test Feedback Notification",
                                            EMAILBODY: "Dear " + userinproject[index].username + ", You've received this e-mail because one Peel test sample related to the machine " + thisproject.name + " presents a " + req.body.result.type + " value " + req.body.result.message + ". For further information please refer to the application link below.",
                                            EMAILC2AHREF: "http://" + req.hostname + "/appmass/home/notifications",
                                            EMAILC2ANAME: "Check your notifications",
                                            EMAILAPPNAME: "Peel test Feedback"
                                        }
                                        let replacedhtml = template(replacements);
                                        transporter.sendMail({ from: config.email.USEREMAIL, to: userinproject[index].username, subject: 'Notification related to machine ' + thisproject.name, html: replacedhtml }, function (error, info) {
                                            if (!error) {
                                                console.log("Email sent to", info.accepted);
                                            } else {
                                                console.log(error);
                                            }
                                        })

                                        //create notifications
                                        //, slumptestid: slumpresults[slumpresults.length - 1].idslumptests
                                        dal.notification.create(userinproject[index].idaccounts, req.body.slumptestid, new Date().toUTCString(), req.body.result.type, req.body.prediction, function (errNotification, ResultNofitication) {
                                            if (!errNotification) {
                                                console.log("Notification created for user", userinproject[index].username);
                                            } else {
                                                console.log("Notification not created for user", userinproject[index].username);
                                            }
                                        })
                                    }
                                    res.status(201).json({ message: "Notifications where sent" })
                                }
                            })
                        }
                    })
                }
            })
        } else {
            res.status(422).json({ message: "Missing required fields" })
        }
    }
}