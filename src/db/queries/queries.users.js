const bcrypt = require("bcryptjs");
const User = require('../models').User;
const Wiki = require('../models').Wiki;
const salt = bcrypt.genSaltSync();
const passport = require("passport");


module.exports = {
 
  createUser(newUser, callback){

    if( newUser.password.length < 8 || newUser.password.length > 20 ){
      
      callback( { message: 'Must be a valid password with 8-20 characters' } );

    } else {

      const hashedPassword = bcrypt.hashSync(newUser.password, salt);

      return User.create({
        email: newUser.email,
        password: hashedPassword,
        username: newUser.username,
        role: newUser.role
      })
      .then((user) => {

        // const sgMail = require('@sendgrid/mail');
        // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        // const msg = {
        //   to: user.email,
        //   from: 'fakeAdminEmail@blocipedia.com',
        //   subject: `${user.username}, you're signed up!`,
        //   text: "You've successfully signed up to Blocipedia.",
        //   html: '<strong> Welcome! </strong>',
        // };
        // sgMail.send(msg);

        callback(null, user);
      })
      .catch((err) => {
        callback(err);
      });
    }
  }, // End createUser()

  upgrade(req, res, next) {
    User.findOne({ where: { id : req.params.id } } )
    .then((user) => {
      updatedUser = {
        email: user.email,
        password: user.password,
        username: user.username,
        role: 1
      }
      user.update(updatedUser, { fields: Object.keys(updatedUser) })
      .then( () => {
        req.flash("notice", "You've successfully upgraded to a Premium Account!");
        res.redirect("/");
      })
    })
  }, // End upgrade()

  downgrade(req, res, next) {
    User.findOne({ where: { id : req.params.id } } )
    .then((user) => {
      updatedUser = {
        email: user.email,
        password: user.password,
        username: user.username,
        role: 0
      }
      user.update(updatedUser, { fields: Object.keys(updatedUser) })
      .then( (user) => {
        Wiki.findAll({ where: { userId : user.id, private: true }})
        .then((wikis) => {
         if(wikis){
            wikis.forEach((wiki) => { 
              updatedWiki = { title: wiki.title, body: wiki.body, userId: wiki.userId, private: false } 
              wiki.update(updatedWiki, { fields: Object.keys(updatedWiki) });
            });
          }
        })
        .catch((err) => {
          console.log(err);
        })


        req.flash("notice", "You've successfully downgraded to a Standard Account!");
        res.redirect("/");
      })
    })
  }, // End downgrade()


  signIn(req, res, next){

    passport.authenticate("local")(req, res, () => {
      
      if(!req.user){
        req.flash("notice", "Sign in failed. Please try again.");
        res.redirect("/users/sign_in");
      } else {
        req.flash("notice", `You've successfully signed in as ${req.user.username}!`);
        res.redirect("/");
      }
    });
  }, // End signIn()
  
  signOut(req, res, next){
    req.logout();
    req.flash("notice", "You've successfully signed out!");
    res.redirect("/");
  }, // End signOut()
}