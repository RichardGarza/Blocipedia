const User = require('../models').User;
const Wiki = require('../models').Wiki;
const Collaborator = require('../models').Collaborator;
const Authorizer = require("../../policies/application");

module.exports = {

  create(req, callback){

    // First check if user is attempting to add themselves to wiki's collaborators
    if (req.user.username === req.body.collaborator){
      return callback("You must provide a username other than your own.");
    }

    // Then check if user exists
    User.findAll({ where: { username: req.body.collaborator } })
    .then((users)=>{
      if(!users[0]){ return callback("User not found."); }
      
      // Then check if user is already collaborator
      Collaborator.findAll({ where: { userId: users[0].id, wikiId: req.params.wikiId } })
      .then((collaborators)=>{
        if(collaborators.length !== 0){
          return callback('User provided is already a collaborator.');
        }
        
        // Then make new collaborator object
        let newCollaborator = {
          userId: users[0].id,
          wikiId: req.params.wikiId
        };

        // Then create new Collaborator
        return Collaborator.create(newCollaborator)
        .then((collaborator) => {
          callback(null, collaborator);
        })
        .catch((err) => {
          callback(err, null);
        })
      })
      .catch((err)=>{
        callback(err, null);
      })
    })
    .catch((err)=>{
      callback(err, null);
    })
  },

  delete(req, callback){

    const collaboratorId = req.body.collaborator;
    let wikiId = req.params.wikiId;

    const authorized = new Authorizer(req.user, wiki, collaboratorId).destroy();
    
    if(authorized){
      Collaborator.destroy({ where: { userId : collaboratorId, wikiId : wikiId }})
      .then((deletedRecordsCount) => {
        callback(null, deletedRecordsCount);
      })
      .catch((err) => {
        callback(err);
      });
    } else {
      req.flash("notice", "You are not authorized to do that.")
      callback(401);
    }
  }

}