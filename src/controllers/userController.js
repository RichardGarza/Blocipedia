const userQueries = require('../db/queries/queries.users');
const passport = require('passport');

module.exports = {

  sign_up(req, res, next){
    res.render("users/sign_up");
  },

  sign_in(req, res, next){
    res.render("users/sign_in");
  },

  create(req, res, next){
    // Make newUser object from request body.
    newUser = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  };

    // Call createUser with newUser object.
  userQueries.createUser(newUser, (err, user) => {

      // If there's an error, display it and redirect to sign up.
      
    if(err){
      req.flash("error", err);
      res.redirect("/users/sign_up");
    } else {        
      passport.authenticate(
        "local", 
        { successRedirect: '/',  failureRedirect: '/sign_up' }
      )
      ( req, res, () => {
          req.flash("notice", `You've successfully signed up as ${user.username}, and you're signed in!`);
          res.redirect("/");
        }
      );
    }
  });
  }
};