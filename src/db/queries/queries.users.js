const bcrypt = require("bcryptjs");
const User = require('../models').User;

module.exports = {
 
  createUser(newUser, callback){
    
    if( newUser.password.length < 8 || newUser.password.length > 20 ){
      
      callback( { message: 'Must be a valid password with 8-20 characters' } );

    } else {

      const salt = bcrypt.genSaltSync();
      const hashedPassword = bcrypt.hashSync(newUser.password, salt);

      return User.create({
        email: newUser.email,
        password: hashedPassword,
        username: newUser.username
      })
      .then((user) => {

        const sgMail = require('@sendgrid/mail');
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
          to: user.email,
          from: 'fakeAdminEmail@blocipedia.com',
          subject: `${user.username}, you're signed up!`,
          text: "You've successfully signed up to Blocipedia.",
          html: '<strong> Welcome! </strong>',
        };
        sgMail.send(msg);

        callback(null, user);
      })
      .catch((err) => {
        callback(err);
      });
    }
  }, // End createUser()
}