var express = require('express');
var router = express.Router();
var ctl = require('./controllers');

router.route('/test').get(function(req,res){
    res.json({hello:'world'})
})

//API ROUTES

//authentication
router.route('/register').post(ctl.auth.register);
router.route('/login').post(ctl.auth.login);

//projects
router.route('/projects').get(ctl.projects.get);
router.route('/projects').post(ctl.projects.create);
router.route('/projects').patch(ctl.projects.update);
router.route('/projects').delete(ctl.projects.delete);

//suppliers
router.route('/suppliers').get(ctl.suppliers.get);
router.route('/suppliers').post(ctl.suppliers.create);
router.route('/suppliers').delete(ctl.suppliers.delete);

//users
router.route('/users').get(ctl.users.get);
router.route('/users').post(ctl.users.create);
router.route('/users').delete(ctl.users.delete);

//accounts
router.route('/accounts').get(ctl.accounts.get);

//slumps
router.route('/slumptest').post(ctl.slumptests.create, ctl.prediction.predictNext);
router.route('/slumptest').get(ctl.slumptests.get);
router.route('/slumptest').delete(ctl.slumptests.delete);

//notifications
router.route('/notifications').get(ctl.notification.get);
router.route('/notifications').patch(ctl.notification.update);
router.route('/notifications').post(ctl.notification.harmonizeRequest, ctl.notification.create);
router.route('/notifications').delete(ctl.notification.delete);

//compositions
router.route('/compositions').post(ctl.compositions.create);
router.route('/compositions').get(ctl.compositions.get);
router.route('/compositions').delete(ctl.compositions.delete);

//prediction
router.route('/prediction').post(ctl.prediction.predictNext);

module.exports = router;