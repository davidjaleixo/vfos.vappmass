var dal = require('../DAL');



module.exports = {

    create: function (req, res, next) {

        //body: {value, supplier (id), project (id), composition (id), loadid}

        if (req.body.value && req.body.supplier && req.body.project && req.body.composition && req.body.loadid) {

            dal.slumps.create(req.body.value, req.body.supplier, req.body.project, req.user.id, req.body.composition, req.body.loadid, function (err, answer) {
                if (!err) {
                    res.status(201).json(answer);
                } else {
                    res.status(500).end();
                }
            })
        } else {
            res.status(422).json({ message: "Missing required fields" })
        }
    },
    get: function(req,res){
        if(req.query.project){
            dal.slumps.getByProject(req.query.project, function(err,answer){
                if(!err){
                    res.status(201).json(answer);
                }else{
                    res.status(500).end();
                }
            })
        }else{
            res.status(422).json({ message: "Missing required field" })
        }
    },
    delete: function (req, res) {
        if (req.query.id) {
            dal.slumps.delete(req.query.id, function (err, answer) {
                if (!err) {
                    res.status(200).send(answer);
                } else {
                    res.status(500).end();
                }
            })
        } else {
            res.status(422).json({ message: "Missing required field" })
        }
    }
}