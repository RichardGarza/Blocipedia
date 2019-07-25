const userQueries = require('../db/queries/queries.users');
const passport = require('passport');

module.exports = {

  signUp(req, res, next){
    res.render("users/sign_up");
  },

  signIn(req, res, next){
    res.render('users/sign_in')
  },  

  sign_out(req, res, next){
    userQueries.signOut(req, res, next);  
  },

  sign_in(req, res, next){
    userQueries.signIn(req, res, next);
  },

  upgrade(req,res,next){
    userQueries.upgrade(req, res, next);
  },

  downgrade(req,res,next){
    userQueries.downgrade(req, res, next);
  },

  create(req, res, next){

      // Make newUser object from request body.
    newUser = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role 
    };

      // Call createUser with newUser object.
    userQueries.createUser(newUser, (err, user) => {

        // If there's an error, display it and redirect to sign up.
      if(err){
        req.flash("error", err);
        res.redirect("/users/sign_up");
      } else {        
        passport.authenticate("local" )(req, res, () => {

          req.flash("notice", `You've successfully signed up as ${req.user.username}, and you're signed in!`);
          res.redirect("/");
        });
      }
    });
  }
};