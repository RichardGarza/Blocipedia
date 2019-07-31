const Wiki = require("../models").Wiki;
const Collaborator = require("../models").Collaborator;
const Authorizer = require("../../policies/application");

module.exports = {

  addWiki(newWiki, callback) {
    return Wiki.create({
      title: newWiki.title,
      body: newWiki.body,
      private: newWiki.private,
      userId: newWiki.userId
    })
      .then(wiki => {
        callback(null, wiki);
      })
      .catch(err => {
        callback(err);
      });
  },
  
  getAllWikis(user, callback) {
    var result = {};
    return Wiki.findAll()
      .then((wikis) => {
        if(!wikis) { 
          callback(404); 
        } else {
          result["wikis"] = wikis;
          if(!user){ 
            callback(null, result);
          } else {
            Collaborator.scope({method: ["collaboratorsForUser", user.id]}).findAll()
            .then((collaborators) => {
              if(collaborators){
                result["collaborators"] = collaborators;
                callback(null, result);
              }
            })
            .catch((err) => { callback(err); })
          }
        }
        
      })
      .catch(err => { callback(err); });
  },

  getWiki(req, callback) {
    var result = {};
    return Wiki.findByPk(req.params.id || req.params.wikiId)
    .then((wiki) => {
      if(!wiki) { callback(404); }
      else {
        result["wiki"] = wiki;
        Collaborator.scope({method: ["collaboratorsForWiki", wiki.id]}).findAll()
        .then((collaborators) => {
          if(collaborators){
            collaborators.forEach((collaborator) => {
              if(collaborator.userId === req.user.id){
                wiki.ownerId = req.user.id
              }
            })
            result["collaborators"] = collaborators;
            callback(null, result);
          }
        })
        .catch((err) => {
          callback(err);
        })
      }
    })
  },

  editWiki(req, callback) {
    
    Wiki.findByPk(req.params.id)
    .then((wiki) => {
      let authorized; 

      Collaborator.findOne({
        where: {
          wikiId: wiki.id,
          userId: req.user.id
        }
      })
      .then((collaborator) => {
        if(collaborator){
            authorized = true;
        } else {
            authorized = new Authorizer(req.user, wiki).edit();
        }
        if(authorized){
          callback(null, wiki)
        } else {
          req.flash("notice", "You are not authorised to do that.");
          callback(404)
        }
      })
    })
  },

  updateWiki(req, updatedWiki, callback) {
    return Wiki.findByPk(req.params.id)
    .then((wiki) => {
      if (!wiki) {
        return callback("Wiki not found");
      }
      let authorized; 
      Collaborator.findOne({
        where: {
          wikiId: wiki.id,
          userId: req.user.id
        }
      })
      .then((collaborator) => {
        if(collaborator){
          authorized = true;
        } else {
          authorized = new Authorizer(req.user, wiki).update();
        }
        if (authorized) {
          wiki.update(updatedWiki, { fields: Object.keys(updatedWiki) })
          .then(() => {
            callback(null, wiki);
          })
          .catch(err => {
            callback(err);
          });
        } else {
          req.flash("notice", "You are not authorized to do that.");
          callback("Forbidden");
        }
      })
    });
  },

  deleteWiki(req, callback) {

    return Wiki.findByPk(req.params.id)

    .then(wiki => {
      const authorized = new Authorizer(req.user, wiki).destroy();

      if (authorized) {
        wiki.destroy().then(res => {
          callback(null, wiki);
        });
      } else {
        req.flash("notice", "You are not authorized to do that.");
        callback(401);
      }
    })
    .catch(err => {
      callback(err);
    });
  }
};