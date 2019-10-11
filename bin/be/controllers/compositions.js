var dal = require('../DAL');

module.exports = {
    create: function (req, res) {
        console.log(req.body);
        if(req.body.name && req.body.projectid && req.body.tholdmax && req.body.tholdmin){
            dal.compositions.create(req.body.name,req.body.tholdmax,req.body.tholdmin,req.body.projectid,  function(err,response){
                if(!err){
                    res.status(201).end();
                }else{
                    res.status(500).json(err);
                }
            })
        }else{
            res.status(422).json({message: "Missing required fields"})
        }
    },
    get: function (req, res) {
        if (req.query.project) {
            //get compositions from project
            dal.compositions.getByProject(req.query.project, function (err, answer) {
                if (!err) {
                    res.status(200).send(answer);
                } else {
                    res.status(500).end();
                }
            })
        } else {
            //get all compositions not matter the project 
            //not implemented - TODO or NOTTODO  is the question :)
            res.status(501).end();
        }
    },
    delete: function(req,res){
        if(req.query.id){
            dal.compositions.delete(req.query.id, function(err,response){
                if(!err){
                    res.status(200).end();
                }else{
                    res.status(500).end();
                }
            })
        }else{
            res.status(422).json({message: "Missing required parameter"});
        }
    }
}