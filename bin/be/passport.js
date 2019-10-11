/*made by David Aleixo @ KBZ david.aleixo@knowledgebiz.pt*/

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var dal = require('./DAL');

passport.use(new LocalStrategy({
    usernameField: 'username'
  },
  function(username, password, done) {
    console.log("using passport...");
    dal.accounts.getbyUserName(username, function(e, user){
      if(e){
        return done(e);
      }
      if(!user){
        return done(null, false, {message: 'Account not found'})
      }
      if(!dal.accounts.validPassword(user, password)){
        return done(null, false, {message: 'Password is wrong'})
      }
      console.log('passport: this user', user);
      //do not return the hash and salt
      return done(null, {id: user.idaccounts, username: user.username, idroles: user.idroles});
    })
  }
));